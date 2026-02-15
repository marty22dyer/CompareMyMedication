const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

async function testPercocet() {
  const rxcui = "42844"; // Percocet's RxCUI
  
  console.log('Testing Percocet enrichment...\n');
  console.log(`RxCUI: ${rxcui}\n`);
  
  // Get related drugs
  const relatedUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=BN+IN+SCD+SBD`;
  const relatedResponse = await fetch(relatedUrl);
  const relatedData = await relatedResponse.json();
  
  console.log('Related concepts:');
  if (relatedData.relatedGroup?.conceptGroup) {
    for (const group of relatedData.relatedGroup.conceptGroup) {
      console.log(`\n  Type: ${group.tty}`);
      if (group.conceptProperties) {
        group.conceptProperties.slice(0, 3).forEach(p => {
          console.log(`    - ${p.name}`);
        });
      }
    }
  }
  
  // Try getting ingredients directly
  console.log('\n\nTrying ingredient query:');
  const ingredientUrl = `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=IN`;
  const ingredientResponse = await fetch(ingredientUrl);
  const ingredientData = await ingredientResponse.json();
  
  if (ingredientData.relatedGroup?.conceptGroup) {
    for (const group of ingredientData.relatedGroup.conceptGroup) {
      if (group.tty === 'IN' && group.conceptProperties) {
        console.log('  Ingredients found:');
        group.conceptProperties.forEach(p => {
          console.log(`    - ${p.name}`);
        });
        const genericName = group.conceptProperties.map(p => p.name).join(' / ');
        console.log(`\n  ✅ Generic name: ${genericName}`);
      }
    }
  }
}

testPercocet().catch(console.error);
