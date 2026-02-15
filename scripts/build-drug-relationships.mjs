import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildRelationships(drugsData) {
  console.log('🔗 Building bidirectional drug relationships...\n');
  
  // Create lookup maps
  const drugsBySlug = new Map();
  const drugsByGeneric = new Map();
  const drugsByClass = new Map();
  const drugsByRxcui = new Map();
  
  // Index all drugs
  drugsData.forEach(drug => {
    drugsBySlug.set(drug.slug, drug);
    
    if (drug.rxcui) {
      drugsByRxcui.set(drug.rxcui, drug);
    }
    
    if (drug.generic) {
      const genericKey = drug.generic.toLowerCase().trim();
      if (!drugsByGeneric.has(genericKey)) {
        drugsByGeneric.set(genericKey, []);
      }
      drugsByGeneric.get(genericKey).push(drug);
    }
    
    if (drug.class) {
      const classKey = drug.class.toLowerCase().trim();
      if (!drugsByClass.has(classKey)) {
        drugsByClass.set(classKey, []);
      }
      drugsByClass.get(classKey).push(drug);
    }
  });
  
  console.log(`📊 Indexed ${drugsData.length} drugs`);
  console.log(`   - ${drugsByGeneric.size} unique generic names`);
  console.log(`   - ${drugsByClass.size} unique drug classes\n`);
  
  let relationshipsAdded = 0;
  
  // Build relationships
  drugsData.forEach((drug, index) => {
    const relationships = {
      brandNames: new Set(drug.brandNames || []),
      genericVersions: new Set(),
      sameClass: new Set(),
      alternatives: new Set(drug.alternatives || []),
    };
    
    // 1. If this is a brand name, link to generic versions
    if (drug.generic && drug.name !== drug.generic) {
      const genericKey = drug.generic.toLowerCase().trim();
      const generics = drugsByGeneric.get(genericKey) || [];
      
      generics.forEach(genericDrug => {
        // If the generic drug's name matches the generic name (not a brand)
        if (genericDrug.name.toLowerCase() === genericKey || 
            genericDrug.rxnormTty === 'IN' || 
            genericDrug.rxnormTty === 'SCD') {
          relationships.genericVersions.add(genericDrug.slug);
        }
      });
      
      // For combination drugs (e.g., "acetaminophen / oxycodone"), link to individual ingredients
      if (genericKey.includes('/') || genericKey.includes(' and ')) {
        const ingredients = genericKey.split(/\s*\/\s*|\s+and\s+/).map(i => i.trim());
        
        ingredients.forEach(ingredient => {
          const ingredientDrug = drugsData.find(d => 
            d.name.toLowerCase() === ingredient && d.rxnormTty === 'IN'
          );
          if (ingredientDrug) {
            relationships.genericVersions.add(ingredientDrug.slug);
            relationships.alternatives.add(ingredientDrug.slug);
          }
        });
      }
    }
    
    // 2. If this is a generic/ingredient, link to all brand names that contain it
    if (drug.rxnormTty === 'IN' || drug.name.toLowerCase() === drug.generic?.toLowerCase()) {
      const genericKey = drug.name.toLowerCase().trim();
      
      // Find all drugs that have this as their generic or contain this ingredient
      drugsData.forEach(otherDrug => {
        if (otherDrug.slug === drug.slug) return;
        
        const otherGeneric = otherDrug.generic?.toLowerCase() || '';
        
        // Check if this drug's generic contains our ingredient
        if (otherGeneric.includes(genericKey) || otherGeneric === genericKey) {
          // If it's a brand name, add it
          if (otherDrug.rxnormTty === 'BN' || otherDrug.name !== otherDrug.generic) {
            relationships.brandNames.add(otherDrug.name);
            relationships.alternatives.add(otherDrug.slug);
          }
        }
        
        // Also check brandNames array from enrichment
        if (otherDrug.brandNames?.some(bn => bn.toLowerCase().includes(genericKey))) {
          relationships.alternatives.add(otherDrug.slug);
        }
      });
    }
    
    // 3. Link drugs in the same class (limit to 10 most relevant)
    if (drug.class) {
      const classKey = drug.class.toLowerCase().trim();
      const sameClassDrugs = drugsByClass.get(classKey) || [];
      
      sameClassDrugs
        .filter(d => d.slug !== drug.slug)
        .slice(0, 10)
        .forEach(d => {
          relationships.sameClass.add(d.slug);
        });
    }
    
    // 4. If drug has brandNames array from enrichment, add those as alternatives
    if (drug.brandNames && Array.isArray(drug.brandNames)) {
      drug.brandNames.forEach(brandName => {
        const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const brandDrug = Array.from(drugsBySlug.values()).find(d => 
          d.name.toLowerCase() === brandName.toLowerCase() ||
          d.slug === brandSlug
        );
        if (brandDrug && brandDrug.slug !== drug.slug) {
          relationships.alternatives.add(brandDrug.slug);
        }
      });
    }
    
    // Update drug with relationships
    const updated = {
      ...drug,
      brandNames: Array.from(relationships.brandNames),
      genericVersions: Array.from(relationships.genericVersions),
      sameClass: Array.from(relationships.sameClass),
      alternatives: Array.from(new Set([
        ...relationships.alternatives,
        ...relationships.genericVersions,
      ])),
    };
    
    // Only count if we added new relationships
    const hadRelationships = (drug.alternatives?.length || 0) + 
                            (drug.brandNames?.length || 0) + 
                            (drug.sameClass?.length || 0);
    const hasRelationships = updated.alternatives.length + 
                            updated.brandNames.length + 
                            updated.sameClass.length;
    
    if (hasRelationships > hadRelationships) {
      relationshipsAdded++;
    }
    
    drugsData[index] = updated;
    
    if ((index + 1) % 500 === 0) {
      console.log(`   Processed ${index + 1}/${drugsData.length} drugs...`);
    }
  });
  
  console.log(`\n✅ Added relationships to ${relationshipsAdded} drugs\n`);
  
  return drugsData;
}

function generateStats(drugsData) {
  console.log('📊 RELATIONSHIP STATISTICS\n');
  console.log('='.repeat(60));
  
  const withBrandNames = drugsData.filter(d => d.brandNames?.length > 0).length;
  const withGenericVersions = drugsData.filter(d => d.genericVersions?.length > 0).length;
  const withSameClass = drugsData.filter(d => d.sameClass?.length > 0).length;
  const withAlternatives = drugsData.filter(d => d.alternatives?.length > 0).length;
  
  console.log(`Drugs with brand names:      ${withBrandNames} (${((withBrandNames/drugsData.length)*100).toFixed(1)}%)`);
  console.log(`Drugs with generic versions: ${withGenericVersions} (${((withGenericVersions/drugsData.length)*100).toFixed(1)}%)`);
  console.log(`Drugs with same-class links: ${withSameClass} (${((withSameClass/drugsData.length)*100).toFixed(1)}%)`);
  console.log(`Drugs with alternatives:     ${withAlternatives} (${((withAlternatives/drugsData.length)*100).toFixed(1)}%)`);
  console.log('='.repeat(60));
  
  // Example relationships
  console.log('\n📋 EXAMPLE RELATIONSHIPS:\n');
  
  const percocet = drugsData.find(d => d.slug === 'percocet');
  if (percocet) {
    console.log('Percocet:');
    console.log(`  Generic: ${percocet.generic}`);
    console.log(`  Generic versions: ${percocet.genericVersions?.slice(0, 3).join(', ') || 'none'}`);
    console.log(`  Alternatives: ${percocet.alternatives?.slice(0, 5).join(', ') || 'none'}`);
  }
  
  const oxycodone = drugsData.find(d => d.name.toLowerCase() === 'oxycodone');
  if (oxycodone) {
    console.log('\nOxycodone:');
    console.log(`  Brand names: ${oxycodone.brandNames?.slice(0, 5).join(', ') || 'none'}`);
    console.log(`  Alternatives: ${oxycodone.alternatives?.slice(0, 5).join(', ') || 'none'}`);
  }
  
  console.log('');
}

async function main() {
  const inputFile = path.join(__dirname, '../data/common-meds-enriched.json');
  const outputFile = inputFile; // Update in place
  
  console.log('🚀 Building Drug Relationships\n');
  console.log(`Input: ${inputFile}\n`);
  
  const drugsData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  const updatedData = buildRelationships(drugsData);
  
  fs.writeFileSync(outputFile, JSON.stringify(updatedData, null, 2));
  
  generateStats(updatedData);
  
  console.log(`\n✅ Relationships saved to: ${outputFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
