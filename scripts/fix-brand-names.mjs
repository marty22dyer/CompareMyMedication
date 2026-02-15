import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getGenericName(rxcui) {
  try {
    const ingredientUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=IN`;
    const ingredientResponse = await fetch(ingredientUrl);
    
    if (!ingredientResponse.ok) return null;
    
    const ingredientData = await ingredientResponse.json();
    
    if (ingredientData.relatedGroup?.conceptGroup) {
      for (const group of ingredientData.relatedGroup.conceptGroup) {
        if (group.tty === 'IN' && group.conceptProperties) {
          const ingredients = group.conceptProperties.map(p => p.name);
          return ingredients.join(' / ');
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function fixBrandNames() {
  const inputFile = path.join(__dirname, '../data/common-meds-enriched.json');
  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  
  console.log('🔍 Finding brand-name entries without generic names...\n');
  
  const toFix = drugsData.filter(drug => 
    drug.rxnormTty === 'BN' && (!drug.generic || drug.generic === drug.name)
  );
  
  console.log(`Found ${toFix.length} brand-name entries to fix\n`);
  
  let fixed = 0;
  
  for (const drug of toFix) {
    console.log(`[${fixed + 1}/${toFix.length}] ${drug.name} (RxCUI: ${drug.rxcui})`);
    
    if (drug.rxcui) {
      const genericName = await getGenericName(drug.rxcui);
      
      if (genericName) {
        const index = drugsData.findIndex(d => d.slug === drug.slug);
        if (index !== -1) {
          drugsData[index].generic = genericName;
          console.log(`  ✅ Set generic: ${genericName}\n`);
          fixed++;
        }
      } else {
        console.log(`  ⚠️  No generic found\n`);
      }
      
      await delay(100);
    }
  }
  
  fs.writeFileSync(inputFile, JSON.stringify(drugsData, null, 2));
  
  console.log('='.repeat(60));
  console.log(`✅ Fixed ${fixed}/${toFix.length} brand-name entries`);
  console.log('='.repeat(60));
}

fixBrandNames()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
