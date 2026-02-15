# OpenFDA Drug Data Enrichment

This script enriches your drug database with accurate information from the FDA's OpenFDA API.

## What It Does

The script queries the OpenFDA API for each drug in your database and extracts:

- ✅ **Indications & Usage** - What the drug is used for
- ✅ **Warnings & Precautions** - Safety information
- ✅ **Dosage & Administration** - How to take it
- ✅ **Adverse Reactions** - Side effects
- ✅ **Drug Interactions** - What it interacts with
- ✅ **Controlled Substance Status** - DEA schedule (if applicable)
- ✅ **Manufacturer Information** - Who makes it
- ✅ **Generic/Brand Names** - Accurate naming

## Usage

### Test Run (First 10 drugs)
```bash
node scripts/enrich-from-openfda.mjs data/comprehensive-drugs.json data/comprehensive-drugs-enriched.json 0 10
```

### Process First 100 Drugs
```bash
node scripts/enrich-from-openfda.mjs data/comprehensive-drugs.json data/comprehensive-drugs-enriched.json 0 100
```

### Process All Drugs (Will take ~4 hours for 5000 drugs)
```bash
node scripts/enrich-from-openfda.mjs data/comprehensive-drugs.json data/comprehensive-drugs-enriched.json
```

### Resume from Index 500
```bash
node scripts/enrich-from-openfda.mjs data/comprehensive-drugs.json data/comprehensive-drugs-enriched.json 500
```

## Parameters

```
node scripts/enrich-from-openfda.mjs [inputFile] [outputFile] [startIndex] [limit]
```

- **inputFile**: Source JSON file (default: `data/comprehensive-drugs.json`)
- **outputFile**: Destination JSON file (default: `data/comprehensive-drugs-enriched.json`)
- **startIndex**: Start processing at this index (default: 0)
- **limit**: Process only this many drugs (optional)

## Features

### Smart Rate Limiting
- Respects FDA's 240 requests/minute limit
- Automatic retry on rate limit errors
- 300ms delay between requests

### Progress Saving
- Saves progress every 50 drugs
- Safe to interrupt and resume
- Won't re-process recently enriched drugs (within 30 days)

### Multiple Search Strategies
Tries to find drug data using:
1. Brand name search
2. Generic name search
3. Substance name search

### Error Handling
- Retries failed requests up to 3 times
- Continues processing on errors
- Detailed logging of all operations

## Output

The script creates a new JSON file with enriched data. Each drug will have:

```json
{
  "slug": "ozempic",
  "name": "Ozempic",
  "generic": "semaglutide",
  "openfdaData": {
    "manufacturer": "Novo Nordisk",
    "product_type": "HUMAN PRESCRIPTION DRUG",
    "generic_name": "semaglutide",
    "brand_name": "Ozempic"
  },
  "label": {
    "indications": ["Treatment of type 2 diabetes..."],
    "warnings": ["Risk of thyroid C-cell tumors..."],
    "dosage": ["Inject subcutaneously once weekly..."],
    "adverseReactions": ["Nausea", "Vomiting", "Diarrhea"],
    "drugInteractions": ["Insulin", "Sulfonylureas"]
  },
  "controlledSubstance": false,
  "lastEnriched": "2026-02-15T20:30:00.000Z"
}
```

## After Enrichment

Once enriched, replace your original file:

```bash
# Backup original
cp data/comprehensive-drugs.json data/comprehensive-drugs-backup.json

# Use enriched version
cp data/comprehensive-drugs-enriched.json data/comprehensive-drugs.json
```

Or update your code to use the enriched file directly.

## Expected Results

Based on FDA data availability:

- **70-80%** of drugs will have indications
- **60-70%** will have warnings/side effects  
- **50-60%** will have dosing information
- **90%+** will have correct controlled substance status
- **80%+** will have manufacturer info

## Monitoring Progress

The script outputs detailed logs:

```
🚀 Starting OpenFDA Enrichment Process

Reading from: data/comprehensive-drugs.json
Writing to: data/comprehensive-drugs-enriched.json
Starting at index: 0

📊 Total drugs in database: 5000

Processing drugs 0 to 99 (100 total)

[1/5000] Processing: Ozempic
  Querying: openfda.brand_name:"Ozempic"
  ✓ Found data via openfda.brand_name:"Ozempic"
  ✅ Enriched successfully

[2/5000] Processing: Wegovy
  Querying: openfda.brand_name:"Wegovy"
  ✓ Found data via openfda.brand_name:"Wegovy"
  ✅ Enriched successfully

💾 Saving progress... (50 enriched so far)
✓ Progress saved
```

## Troubleshooting

### Rate Limit Errors
If you get rate limited, the script will automatically wait and retry. If it persists, increase `RATE_LIMIT_DELAY` in the script.

### No Data Found
Some drugs may not be in the FDA database (OTC, supplements, etc.). This is normal.

### Script Crashes
The script saves progress every 50 drugs. Just restart from the last saved index.

## Next Steps

After enrichment:

1. **Test the data** - Check a few drug pages to verify accuracy
2. **Update your app** - Point to the enriched data file
3. **Schedule updates** - Run monthly to keep data fresh
4. **Monitor quality** - Track which drugs still need manual curation

## API Documentation

OpenFDA API: https://open.fda.gov/apis/drug/label/
Rate Limits: https://open.fda.gov/apis/authentication/
