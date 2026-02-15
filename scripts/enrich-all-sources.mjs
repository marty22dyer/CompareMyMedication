import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';
const DAILYMED_BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';
const OPENFDA_BASE_URL = 'https://api.fda.gov/drug/label.json';
const RATE_LIMIT_DELAY = 300;
const BATCH_SIZE = 25;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// RxNorm query
async function queryRxNorm(drugName) {
  try {
    const cleanName = drugName.replace(/\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '').replace(/\[.*?\]/g, '').trim();
    
    const rxcuiUrl = `${RXNORM_BASE_URL}/rxcui.json?name=${encodeURIComponent(cleanName)}`;
    const rxcuiResponse = await fetch(rxcuiUrl);
    
    if (!rxcuiResponse.ok) return null;
    const rxcuiData = await rxcuiResponse.json();
    
    if (!rxcuiData.idGroup?.rxnormId?.[0]) return null;
    const rxcui = rxcuiData.idGroup.rxnormId[0];

    const relatedUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=BN+IN`;
    const relatedResponse = await fetch(relatedUrl);
    
    let brandNames = [];
    let genericName = null;

    if (relatedResponse.ok) {
      const relatedData = await relatedResponse.json();
      if (relatedData.relatedGroup?.conceptGroup) {
        for (const group of relatedData.relatedGroup.conceptGroup) {
          if (group.tty === 'BN' && group.conceptProperties) {
            brandNames = group.conceptProperties.map(p => p.name);
          } else if (group.tty === 'IN' && group.conceptProperties) {
            genericName = group.conceptProperties[0]?.name;
          }
        }
      }
    }

    return { rxcui, genericName, brandNames };
  } catch (error) {
    return null;
  }
}

// DailyMed query
async function queryDailyMed(drugName) {
  try {
    const cleanName = drugName.replace(/\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '').replace(/\[.*?\]/g, '').trim();
    
    const searchUrl = `${DAILYMED_BASE_URL}/spls.json?drug_name=${encodeURIComponent(cleanName)}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok || !searchResponse.headers.get('content-type')?.includes('application/json')) {
      return null;
    }

    const searchData = await searchResponse.json();
    if (!searchData.data?.[0]?.setid) return null;

    const setid = searchData.data[0].setid;
    const splUrl = `${DAILYMED_BASE_URL}/spls/${setid}.json`;
    const splResponse = await fetch(splUrl);
    
    if (!splResponse.ok) return { setid };

    const splData = await splResponse.json();
    const spl = splData.data;

    return {
      setid,
      genericName: spl.generic_name,
      brandName: spl.brand_name,
      manufacturer: spl.labeler,
      indications: extractSection(spl.indications_and_usage),
      dosage: extractSection(spl.dosage_and_administration),
      warnings: extractSection(spl.warnings_and_cautions),
      adverseReactions: extractSection(spl.adverse_reactions),
      drugInteractions: extractSection(spl.drug_interactions),
      deaSchedule: spl.dea_schedule,
    };
  } catch (error) {
    return null;
  }
}

// OpenFDA query
async function queryOpenFDA(drugName) {
  try {
    const brandName = drugName.match(/\[([^\]]+)\]/)?.[1] || drugName;
    const searchStrategies = [
      `openfda.brand_name:"${brandName}"`,
      `openfda.generic_name:"${brandName}"`,
      `openfda.substance_name:"${brandName}"`,
    ];

    for (const searchQuery of searchStrategies) {
      const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchQuery)}&limit=1`;
      const response = await fetch(url);
      
      if (response.status === 404) continue;
      if (!response.ok) continue;

      const data = await response.json();
      if (data.results?.[0]) {
        const result = data.results[0];
        return {
          manufacturer: result.openfda?.manufacturer_name?.[0],
          purpose: result.purpose?.[0],
          warnings: result.warnings,
          dosageAndAdmin: result.dosage_and_administration,
          adverseReactions: result.adverse_reactions,
          drugInteractions: result.drug_interactions,
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function extractSection(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data.map(s => cleanText(s)).filter(Boolean);
  if (typeof data === 'string') {
    const cleaned = cleanText(data);
    return cleaned ? [cleaned] : null;
  }
  return null;
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// Merge all data sources
function mergeAllData(drug, rxnormData, dailymedData, openfdaData) {
  return {
    ...drug,
    // Use best available data from all sources
    generic: rxnormData?.genericName || dailymedData?.genericName || drug.generic,
    brandNames: rxnormData?.brandNames || (dailymedData?.brandName ? [dailymedData.brandName] : drug.brandNames),
    manufacturer: dailymedData?.manufacturer || openfdaData?.manufacturer || drug.manufacturer,
    
    label: {
      indications: dailymedData?.indications || (openfdaData?.purpose ? [openfdaData.purpose] : drug.label?.indications),
      dosage: dailymedData?.dosage || (openfdaData?.dosageAndAdmin ? [openfdaData.dosageAndAdmin] : drug.label?.dosage),
      warnings: dailymedData?.warnings || openfdaData?.warnings || drug.label?.warnings,
      adverseReactions: dailymedData?.adverseReactions || openfdaData?.adverseReactions || drug.label?.adverseReactions,
      drugInteractions: dailymedData?.drugInteractions || openfdaData?.drugInteractions || drug.label?.drugInteractions,
    },
    
    rxcui: rxnormData?.rxcui || drug.rxcui,
    deaSchedule: dailymedData?.deaSchedule || drug.deaSchedule,
    
    enrichmentSources: {
      rxnorm: !!rxnormData,
      dailymed: !!dailymedData,
      openfda: !!openfdaData,
      lastEnriched: new Date().toISOString(),
    },
  };
}

async function enrichDrugs(inputFile, outputFile, startIndex = 0, limit = null) {
  console.log('🚀 Starting COMPREHENSIVE Enrichment (RxNorm + DailyMed + OpenFDA)\n');
  
  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  const endIndex = limit ? Math.min(startIndex + limit, drugsData.length) : drugsData.length;
  const drugsToProcess = drugsData.slice(startIndex, endIndex);
  
  console.log(`📊 Processing ${drugsToProcess.length} drugs\n`);

  let enrichedCount = 0;

  for (let i = 0; i < drugsToProcess.length; i++) {
    const drug = drugsToProcess[i];
    const globalIndex = startIndex + i;
    
    console.log(`[${globalIndex + 1}/${drugsData.length}] ${drug.name}`);

    try {
      console.log('  → RxNorm...');
      const rxnormData = await queryRxNorm(drug.name);
      await delay(100);
      
      console.log('  → DailyMed...');
      const dailymedData = await queryDailyMed(drug.name);
      await delay(200);
      
      console.log('  → OpenFDA...');
      const openfdaData = await queryOpenFDA(drug.name);
      await delay(300);

      const hasData = rxnormData || dailymedData || openfdaData;
      
      if (hasData) {
        drugsData[globalIndex] = mergeAllData(drug, rxnormData, dailymedData, openfdaData);
        enrichedCount++;
        console.log(`  ✅ Enriched from: ${[
          rxnormData && 'RxNorm',
          dailymedData && 'DailyMed',
          openfdaData && 'OpenFDA'
        ].filter(Boolean).join(', ')}\n`);
      } else {
        console.log(`  ⚠️  No data found\n`);
      }

      if ((i + 1) % BATCH_SIZE === 0) {
        fs.writeFileSync(outputFile, JSON.stringify(drugsData, null, 2));
        console.log(`💾 Progress saved (${enrichedCount} enriched)\n`);
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(drugsData, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Enriched: ${enrichedCount}/${drugsToProcess.length} (${((enrichedCount/drugsToProcess.length)*100).toFixed(1)}%)`);
  console.log('='.repeat(60));
}

const args = process.argv.slice(2);
const inputFile = args[0] || path.join(__dirname, '../data/common-meds.json');
const outputFile = args[1] || path.join(__dirname, '../data/common-meds-enriched.json');
const startIndex = parseInt(args[2]) || 0;
const limit = args[3] ? parseInt(args[3]) : null;

enrichDrugs(inputFile, outputFile, startIndex, limit)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
