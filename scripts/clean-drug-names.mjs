import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractCleanName(technicalName) {
  // Remove dosage information (e.g., "11.25 MG", "24 HR")
  let clean = technicalName;
  
  // Remove leading time indicators (24 HR, 12 HR, etc.)
  clean = clean.replace(/^\d+\s*HR\s+/i, '');
  
  // Extract brand name from brackets if present
  const brandMatch = clean.match(/\[([^\]]+)\]$/);
  const brandName = brandMatch ? brandMatch[1] : null;
  
  // Remove everything in brackets
  clean = clean.replace(/\s*\[.*?\]\s*$/g, '');
  
  // Remove dosage information (numbers followed by MG, MCG, ML, %, etc.)
  clean = clean.replace(/\s*\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '');
  
  // Remove route/form information (Oral Tablet, Extended Release, etc.)
  clean = clean.replace(/\s+(Oral|Injectable|Topical|Transdermal|Inhalation|Nasal|Ophthalmic|Otic|Rectal|Vaginal)\s+(Tablet|Capsule|Solution|Suspension|Powder|Cream|Ointment|Gel|Patch|Spray|Drops|Suppository|Insert|Film|Lozenge|Granules|Pellets|Kit)/gi, '');
  
  // Remove additional descriptors
  clean = clean.replace(/\s+(Extended Release|Delayed Release|Sustained Release|Controlled Release|Immediate Release|Disintegrating|Chewable|Effervescent)/gi, '');
  
  // Remove "brand of" phrases
  clean = clean.replace(/\s+brand of\s+/gi, ' ');
  
  // Clean up multiple slashes and spaces
  clean = clean.replace(/\s*\/\s*/g, ' / ');
  clean = clean.replace(/\s+/g, ' ');
  clean = clean.trim();
  
  // If we have a brand name and the clean name is just ingredients, prefer the brand name
  if (brandName && clean.includes('/')) {
    return brandName;
  }
  
  // If the clean name is too long or still has dosage info, try to extract just the drug name
  if (clean.length > 50 || /\d/.test(clean)) {
    // Try to get just the first drug name before any slash or number
    const firstDrug = clean.split(/[\/\d]/)[0].trim();
    if (firstDrug.length > 2 && firstDrug.length < 30) {
      return firstDrug;
    }
  }
  
  return clean;
}

function cleanDrugNames(drugsData) {
  console.log('🧹 Cleaning drug names...\n');
  
  let cleaned = 0;
  let unchanged = 0;
  
  drugsData.forEach((drug, index) => {
    const originalName = drug.name;
    const cleanName = extractCleanName(originalName);
    
    // Only update if the name actually changed and is cleaner
    if (cleanName !== originalName && cleanName.length < originalName.length) {
      drugsData[index] = {
        ...drug,
        name: cleanName,
        technicalName: originalName, // Preserve original for reference
      };
      cleaned++;
      
      if (cleaned <= 10) {
        console.log(`✓ ${originalName}`);
        console.log(`  → ${cleanName}\n`);
      }
    } else {
      unchanged++;
    }
    
    if ((index + 1) % 500 === 0) {
      console.log(`  Processed ${index + 1}/${drugsData.length} drugs...`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Cleaned: ${cleaned} drug names`);
  console.log(`⏭️  Unchanged: ${unchanged} drug names`);
  console.log(`📊 Total: ${drugsData.length} drugs`);
  console.log('='.repeat(60));
  
  return drugsData;
}

function showExamples(drugsData) {
  console.log('\n📋 EXAMPLE CLEANED NAMES:\n');
  
  const examples = [
    'phentermine',
    'qsymia',
    'percocet',
    'tylenol',
    'ozempic',
  ];
  
  examples.forEach(searchTerm => {
    const drug = drugsData.find(d => 
      d.slug.includes(searchTerm) || 
      d.name.toLowerCase().includes(searchTerm)
    );
    
    if (drug) {
      console.log(`${drug.name}`);
      if (drug.technicalName && drug.technicalName !== drug.name) {
        console.log(`  (was: ${drug.technicalName})`);
      }
      console.log('');
    }
  });
}

async function main() {
  const inputFile = path.join(__dirname, '../data/common-meds-enriched.json');
  const outputFile = inputFile; // Update in place
  
  console.log('🚀 Cleaning Drug Names\n');
  console.log(`Input: ${inputFile}\n`);
  
  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  const cleanedData = cleanDrugNames(drugsData);
  
  fs.writeFileSync(outputFile, JSON.stringify(cleanedData, null, 2));
  
  showExamples(cleanedData);
  
  console.log(`\n✅ Cleaned names saved to: ${outputFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
