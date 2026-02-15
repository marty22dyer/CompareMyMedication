import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OPENFDA_BASE_URL = 'https://api.fda.gov/drug/label.json';
const RATE_LIMIT_DELAY = 300; // ms between requests (200 req/min = 300ms)
const BATCH_SIZE = 50; // Process in batches
const MAX_RETRIES = 3;

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Query OpenFDA API
async function queryOpenFDA(drugName, retryCount = 0) {
  try {
    // Try multiple search strategies
    const searchStrategies = [
      `openfda.brand_name:"${drugName}"`,
      `openfda.generic_name:"${drugName}"`,
      `openfda.substance_name:"${drugName}"`,
    ];

    for (const searchQuery of searchStrategies) {
      const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchQuery)}&limit=1`;
      
      console.log(`  Querying: ${searchQuery}`);
      const response = await fetch(url);
      
      if (response.status === 404) {
        continue; // Try next strategy
      }
      
      if (!response.ok) {
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          console.log(`  Rate limited, waiting 5s...`);
          await delay(5000);
          return queryOpenFDA(drugName, retryCount + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        console.log(`  ✓ Found data via ${searchQuery}`);
        return data.results[0];
      }
    }

    console.log(`  ✗ No data found`);
    return null;

  } catch (error) {
    console.error(`  Error querying OpenFDA: ${error.message}`);
    return null;
  }
}

// Extract relevant data from FDA response
function extractFDAData(fdaResult) {
  if (!fdaResult) return null;

  const extracted = {
    openfdaData: {},
    label: {},
    lastEnriched: new Date().toISOString(),
  };

  // OpenFDA metadata
  if (fdaResult.openfda) {
    const fda = fdaResult.openfda;
    extracted.openfdaData = {
      product_type: fda.product_type?.[0],
      application_number: fda.application_number?.[0],
      brand_name: fda.brand_name?.[0],
      generic_name: fda.generic_name?.[0],
      manufacturer: fda.manufacturer_name?.[0],
      substance_name: fda.substance_name?.[0],
      route: fda.route?.[0],
      product_ndc: fda.product_ndc?.[0],
      spl_id: fda.spl_id?.[0],
    };

    // DEA Schedule (controlled substance)
    if (fda.dea_schedule_code) {
      extracted.controlledSubstance = true;
      extracted.deaSchedule = fda.dea_schedule_code[0];
    }
  }

  // Label information
  extracted.label = {
    indications: fdaResult.indications_and_usage || [],
    warnings: fdaResult.warnings || fdaResult.boxed_warning || [],
    dosage: fdaResult.dosage_and_administration || [],
    contraindications: fdaResult.contraindications || [],
    adverseReactions: fdaResult.adverse_reactions || [],
    drugInteractions: fdaResult.drug_interactions || [],
    clinicalPharmacology: fdaResult.clinical_pharmacology || [],
    description: fdaResult.description || [],
  };

  // Additional useful fields
  if (fdaResult.pregnancy) {
    extracted.pregnancyInfo = fdaResult.pregnancy;
  }
  
  if (fdaResult.pediatric_use) {
    extracted.pediatricUse = fdaResult.pediatric_use;
  }

  if (fdaResult.geriatric_use) {
    extracted.geriatricUse = fdaResult.geriatric_use;
  }

  return extracted;
}

// Merge enriched data with existing drug data
function mergeDrugData(existingDrug, enrichedData) {
  if (!enrichedData) return existingDrug;

  return {
    ...existingDrug,
    ...enrichedData,
    // Preserve existing data if new data is empty
    generic: enrichedData.openfdaData?.generic_name || existingDrug.generic,
    class: existingDrug.class, // Keep existing class for now
    category: existingDrug.category, // Keep existing category
    // Merge labels intelligently
    label: {
      ...(existingDrug.label || {}),
      ...(enrichedData.label || {}),
    },
  };
}

// Main enrichment function
async function enrichDrugs(inputFile, outputFile, startIndex = 0, limit = null) {
  console.log('🚀 Starting OpenFDA Enrichment Process\n');
  console.log(`Reading from: ${inputFile}`);
  console.log(`Writing to: ${outputFile}`);
  console.log(`Starting at index: ${startIndex}`);
  if (limit) console.log(`Processing limit: ${limit} drugs`);
  console.log('');

  // Read input file
  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`📊 Total drugs in database: ${drugsData.length}\n`);

  // Determine which drugs to process
  const endIndex = limit ? Math.min(startIndex + limit, drugsData.length) : drugsData.length;
  const drugsToProcess = drugsData.slice(startIndex, endIndex);
  
  console.log(`Processing drugs ${startIndex} to ${endIndex - 1} (${drugsToProcess.length} total)\n`);

  let enrichedCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  // Process drugs
  for (let i = 0; i < drugsToProcess.length; i++) {
    const drug = drugsToProcess[i];
    const globalIndex = startIndex + i;
    
    console.log(`[${globalIndex + 1}/${drugsData.length}] Processing: ${drug.name}`);

    // Skip if already enriched recently (within 30 days)
    if (drug.lastEnriched) {
      const lastEnriched = new Date(drug.lastEnriched);
      const daysSince = (Date.now() - lastEnriched.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) {
        console.log(`  ⏭️  Skipping (enriched ${Math.floor(daysSince)} days ago)\n`);
        continue;
      }
    }

    try {
      // Query OpenFDA
      const fdaResult = await queryOpenFDA(drug.name);
      
      if (fdaResult) {
        const enrichedData = extractFDAData(fdaResult);
        drugsData[globalIndex] = mergeDrugData(drug, enrichedData);
        enrichedCount++;
        console.log(`  ✅ Enriched successfully\n`);
      } else {
        notFoundCount++;
        console.log(`  ⚠️  No FDA data found\n`);
      }

      // Rate limiting
      await delay(RATE_LIMIT_DELAY);

      // Save progress every 50 drugs
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

  // Final save
  console.log('\n💾 Saving final results...');
  fs.writeFileSync(outputFile, JSON.stringify(drugsData, null, 2));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ENRICHMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total processed: ${drugsToProcess.length}`);
  console.log(`✅ Successfully enriched: ${enrichedCount}`);
  console.log(`⚠️  Not found in FDA: ${notFoundCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📈 Success rate: ${((enrichedCount / drugsToProcess.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  console.log(`\n✓ Results saved to: ${outputFile}`);
}

// CLI interface
const args = process.argv.slice(2);
const inputFile = args[0] || path.join(__dirname, '../data/comprehensive-drugs.json');
const outputFile = args[1] || path.join(__dirname, '../data/comprehensive-drugs-enriched.json');
const startIndex = parseInt(args[2]) || 0;
const limit = args[3] ? parseInt(args[3]) : null;

// Run enrichment
enrichDrugs(inputFile, outputFile, startIndex, limit)
  .then(() => {
    console.log('\n✅ Enrichment complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
