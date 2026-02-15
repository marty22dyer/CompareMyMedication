import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DAILYMED_BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';
const RATE_LIMIT_DELAY = 200; // ms between requests
const BATCH_SIZE = 50;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Query DailyMed API for drug information
async function queryDailyMed(drugName, rxcui) {
  try {
    const cleanName = drugName
      .replace(/\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`  Querying DailyMed for: ${cleanName}`);

    // Search by drug name
    const searchUrl = `${DAILYMED_BASE_URL}/spls.json?drug_name=${encodeURIComponent(cleanName)}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      console.log(`  ✗ DailyMed API error: ${searchResponse.status}`);
      return null;
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      console.log(`  ✗ No DailyMed data found`);
      return null;
    }

    // Get the first result's setid
    const setid = searchData.data[0].setid;
    console.log(`  Found SetID: ${setid}`);

    // Get detailed SPL (Structured Product Label) data
    const splUrl = `${DAILYMED_BASE_URL}/spls/${setid}.json`;
    const splResponse = await fetch(splUrl);
    
    if (!splResponse.ok) {
      console.log(`  ✗ SPL data error`);
      return { setid };
    }

    const splData = await splResponse.json();
    const spl = splData.data;

    // Extract relevant sections
    const result = {
      setid,
      title: spl.title,
      genericName: spl.generic_name,
      brandName: spl.brand_name,
      manufacturer: spl.labeler,
      dosageForm: spl.dosage_form,
      route: spl.route,
      activeIngredients: spl.active_ingredients,
      
      // Label sections
      indications: extractSection(spl, 'indications_and_usage'),
      dosageAndAdministration: extractSection(spl, 'dosage_and_administration'),
      warnings: extractSection(spl, 'warnings_and_cautions'),
      adverseReactions: extractSection(spl, 'adverse_reactions'),
      drugInteractions: extractSection(spl, 'drug_interactions'),
      contraindications: extractSection(spl, 'contraindications'),
      clinicalPharmacology: extractSection(spl, 'clinical_pharmacology'),
      description: extractSection(spl, 'description'),
      howSupplied: extractSection(spl, 'how_supplied'),
      
      // Additional info
      deaSchedule: spl.dea_schedule,
      pregnancyCategory: spl.pregnancy_category,
      
      lastUpdated: new Date().toISOString(),
    };

    console.log(`  ✓ Found: ${result.brandName || result.genericName || 'N/A'}`);
    return result;

  } catch (error) {
    console.error(`  Error querying DailyMed: ${error.message}`);
    return null;
  }
}

// Extract and clean section text
function extractSection(spl, sectionKey) {
  if (!spl[sectionKey]) return null;
  
  const section = spl[sectionKey];
  
  // If it's an array, join with newlines
  if (Array.isArray(section)) {
    return section.map(s => cleanText(s)).filter(Boolean);
  }
  
  // If it's a string, clean and return
  if (typeof section === 'string') {
    const cleaned = cleanText(section);
    return cleaned ? [cleaned] : null;
  }
  
  return null;
}

// Clean HTML tags and excessive whitespace
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Merge DailyMed data with existing drug data
function mergeDrugData(existingDrug, dailymedData) {
  if (!dailymedData) return existingDrug;

  return {
    ...existingDrug,
    generic: dailymedData.genericName || existingDrug.generic,
    brandName: dailymedData.brandName || existingDrug.brandName,
    manufacturer: dailymedData.manufacturer || existingDrug.manufacturer,
    
    // Merge label data
    label: {
      ...(existingDrug.label || {}),
      indications: dailymedData.indications || existingDrug.label?.indications,
      dosage: dailymedData.dosageAndAdministration || existingDrug.label?.dosage,
      warnings: dailymedData.warnings || existingDrug.label?.warnings,
      adverseReactions: dailymedData.adverseReactions || existingDrug.label?.adverseReactions,
      drugInteractions: dailymedData.drugInteractions || existingDrug.label?.drugInteractions,
      contraindications: dailymedData.contraindications || existingDrug.label?.contraindications,
      clinicalPharmacology: dailymedData.clinicalPharmacology,
      description: dailymedData.description,
    },
    
    // Additional data
    dailymedData: {
      setid: dailymedData.setid,
      dosageForm: dailymedData.dosageForm,
      route: dailymedData.route,
      activeIngredients: dailymedData.activeIngredients,
      deaSchedule: dailymedData.deaSchedule,
      pregnancyCategory: dailymedData.pregnancyCategory,
      enrichedAt: new Date().toISOString(),
    },
  };
}

// Main enrichment function
async function enrichDrugs(inputFile, outputFile, startIndex = 0, limit = null) {
  console.log('🚀 Starting DailyMed Enrichment Process\n');
  console.log(`Reading from: ${inputFile}`);
  console.log(`Writing to: ${outputFile}`);
  console.log(`Starting at index: ${startIndex}`);
  if (limit) console.log(`Processing limit: ${limit} drugs`);
  console.log('');

  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`📊 Total drugs in database: ${drugsData.length}\n`);

  const endIndex = limit ? Math.min(startIndex + limit, drugsData.length) : drugsData.length;
  const drugsToProcess = drugsData.slice(startIndex, endIndex);
  
  console.log(`Processing drugs ${startIndex} to ${endIndex - 1} (${drugsToProcess.length} total)\n`);

  let enrichedCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (let i = 0; i < drugsToProcess.length; i++) {
    const drug = drugsToProcess[i];
    const globalIndex = startIndex + i;
    
    console.log(`[${globalIndex + 1}/${drugsData.length}] Processing: ${drug.name}`);

    // Skip if already enriched recently
    if (drug.dailymedData?.enrichedAt) {
      const lastEnriched = new Date(drug.dailymedData.enrichedAt);
      const daysSince = (Date.now() - lastEnriched.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) {
        console.log(`  ⏭️  Skipping (enriched ${Math.floor(daysSince)} days ago)\n`);
        continue;
      }
    }

    try {
      const dailymedData = await queryDailyMed(drug.name, drug.rxcui);
      
      if (dailymedData) {
        drugsData[globalIndex] = mergeDrugData(drug, dailymedData);
        enrichedCount++;
        console.log(`  ✅ Enriched successfully\n`);
      } else {
        notFoundCount++;
        console.log(`  ⚠️  No DailyMed data found\n`);
      }

      await delay(RATE_LIMIT_DELAY);

      if ((i + 1) % BATCH_SIZE === 0) {
        console.log(`💾 Saving progress... (${enrichedCount} enriched so far)`);
        fs.writeFileSync(outputFile, JSON.stringify(drugsData, null, 2));
        console.log(`✓ Progress saved\n`);
      }

    } catch (error) {
      errorCount++;
      console.error(`  ❌ Error: ${error.message}\n`);
    }
  }

  console.log('\n💾 Saving final results...');
  fs.writeFileSync(outputFile, JSON.stringify(drugsData, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 DAILYMED ENRICHMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total processed: ${drugsToProcess.length}`);
  console.log(`✅ Successfully enriched: ${enrichedCount}`);
  console.log(`⚠️  Not found in DailyMed: ${notFoundCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📈 Success rate: ${((enrichedCount / drugsToProcess.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  console.log(`\n✓ Results saved to: ${outputFile}`);
}

// CLI interface
const args = process.argv.slice(2);
const inputFile = args[0] || path.join(__dirname, '../data/comprehensive-drugs.json');
const outputFile = args[1] || path.join(__dirname, '../data/comprehensive-drugs-dailymed.json');
const startIndex = parseInt(args[2]) || 0;
const limit = args[3] ? parseInt(args[3]) : null;

enrichDrugs(inputFile, outputFile, startIndex, limit)
  .then(() => {
    console.log('\n✅ DailyMed enrichment complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
