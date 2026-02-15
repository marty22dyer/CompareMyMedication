import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';
const RATE_LIMIT_DELAY = 100; // ms between requests (no strict limit for RxNorm)
const BATCH_SIZE = 50;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Query RxNorm API for drug information
async function queryRxNorm(drugName) {
  try {
    // Clean drug name - remove dosage info
    const cleanName = drugName
      .replace(/\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`  Querying RxNorm for: ${cleanName}`);

    // Step 1: Get RxCUI (RxNorm Concept Unique Identifier)
    const rxcuiUrl = `${RXNORM_BASE_URL}/rxcui.json?name=${encodeURIComponent(cleanName)}`;
    const rxcuiResponse = await fetch(rxcuiUrl);
    
    if (!rxcuiResponse.ok) {
      console.log(`  ✗ RxNorm API error: ${rxcuiResponse.status}`);
      return null;
    }

    const rxcuiData = await rxcuiResponse.json();
    
    if (!rxcuiData.idGroup?.rxnormId || rxcuiData.idGroup.rxnormId.length === 0) {
      console.log(`  ✗ No RxCUI found`);
      return null;
    }

    const rxcui = rxcuiData.idGroup.rxnormId[0];
    console.log(`  Found RxCUI: ${rxcui}`);

    // Step 2: Get drug properties
    const propsUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/allProperties.json?prop=all`;
    const propsResponse = await fetch(propsUrl);
    
    if (!propsResponse.ok) {
      console.log(`  ✗ Properties API error`);
      return { rxcui };
    }

    const propsData = await propsResponse.json();

    // Step 3: Get related drugs (brand/generic relationships)
    const relatedUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=BN+IN`;
    const relatedResponse = await fetch(relatedUrl);
    
    let brandNames = [];
    let genericName = null;

    if (relatedResponse.ok) {
      const relatedData = await relatedResponse.json();
      
      if (relatedData.relatedGroup?.conceptGroup) {
        for (const group of relatedData.relatedGroup.conceptGroup) {
          if (group.tty === 'BN' && group.conceptProperties) {
            // Brand names
            brandNames = group.conceptProperties.map(p => p.name);
          } else if (group.tty === 'IN' && group.conceptProperties) {
            // Generic/ingredient name
            genericName = group.conceptProperties[0]?.name;
          }
        }
      }
    }

    // Extract useful properties
    const properties = {};
    if (propsData.propConceptGroup?.propConcept) {
      for (const prop of propsData.propConceptGroup.propConcept) {
        properties[prop.propName] = prop.propValue;
      }
    }

    const result = {
      rxcui,
      genericName: genericName || properties.RxNorm_Name,
      brandNames,
      drugClass: properties.RxNorm_Drug_Class,
      tty: properties.TTY, // Term Type (BN=Brand Name, IN=Ingredient, etc.)
      lastUpdated: new Date().toISOString(),
    };

    console.log(`  ✓ Found: ${result.genericName || 'N/A'} | Brands: ${brandNames.join(', ') || 'N/A'}`);
    return result;

  } catch (error) {
    console.error(`  Error querying RxNorm: ${error.message}`);
    return null;
  }
}

// Merge RxNorm data with existing drug data
function mergeDrugData(existingDrug, rxnormData) {
  if (!rxnormData) return existingDrug;

  return {
    ...existingDrug,
    rxcui: rxnormData.rxcui || existingDrug.rxcui,
    generic: rxnormData.genericName || existingDrug.generic,
    brandNames: rxnormData.brandNames || existingDrug.brandNames,
    class: rxnormData.drugClass || existingDrug.class,
    rxnormData: {
      ...rxnormData,
      enrichedAt: new Date().toISOString(),
    },
  };
}

// Main enrichment function
async function enrichDrugs(inputFile, outputFile, startIndex = 0, limit = null) {
  console.log('🚀 Starting RxNorm Enrichment Process\n');
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
    if (drug.rxnormData?.enrichedAt) {
      const lastEnriched = new Date(drug.rxnormData.enrichedAt);
      const daysSince = (Date.now() - lastEnriched.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) {
        console.log(`  ⏭️  Skipping (enriched ${Math.floor(daysSince)} days ago)\n`);
        continue;
      }
    }

    try {
      const rxnormData = await queryRxNorm(drug.name);
      
      if (rxnormData) {
        drugsData[globalIndex] = mergeDrugData(drug, rxnormData);
        enrichedCount++;
        console.log(`  ✅ Enriched successfully\n`);
      } else {
        notFoundCount++;
        console.log(`  ⚠️  No RxNorm data found\n`);
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
  console.log('📊 RXNORM ENRICHMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total processed: ${drugsToProcess.length}`);
  console.log(`✅ Successfully enriched: ${enrichedCount}`);
  console.log(`⚠️  Not found in RxNorm: ${notFoundCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📈 Success rate: ${((enrichedCount / drugsToProcess.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  console.log(`\n✓ Results saved to: ${outputFile}`);
}

// CLI interface
const args = process.argv.slice(2);
const inputFile = args[0] || path.join(__dirname, '../data/comprehensive-drugs.json');
const outputFile = args[1] || path.join(__dirname, '../data/comprehensive-drugs-rxnorm.json');
const startIndex = parseInt(args[2]) || 0;
const limit = args[3] ? parseInt(args[3]) : null;

enrichDrugs(inputFile, outputFile, startIndex, limit)
  .then(() => {
    console.log('\n✅ RxNorm enrichment complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
