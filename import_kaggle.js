const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const precautionsFile = 'symptom_precaution.csv';
const descriptionFile = 'symptom_Description.csv';
const outputFile = path.join(__dirname, 'server', 'data', 'medicalDataset.json');

// We will build a map of disease names to their data
const diseaseMap = {};

// Helper to format disease names (e.g. "heart_attack" -> "Heart Attack")
function formatName(str) {
  if (!str) return '';
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function processKaggleDataset() {
  console.log("Starting Kaggle Dataset Import...");

  if (!fs.existsSync(precautionsFile) || !fs.existsSync(descriptionFile)) {
    console.error("❌ ERROR: Missing CSV files!");
    console.log("Please download the dataset from Kaggle and place 'symptom_precaution.csv' and 'symptom_Description.csv' in this folder.");
    return;
  }

  // 1. Read Descriptions
  await new Promise((resolve) => {
    fs.createReadStream(descriptionFile)
      .pipe(csv())
      .on('data', (row) => {
        const disease = formatName(row.Disease?.trim());
        if (disease) {
          diseaseMap[disease] = {
            disease: disease,
            keywords: [disease.toLowerCase(), row.Disease?.trim().toLowerCase()],
            description: row.Description?.trim() || "No description available.",
            symptoms: [],
            severity: "moderate",
            precautions: [],
            medicines: [
              {
                name: "Consult Physician",
                type: "Medical Advice",
                adultDose: "As prescribed",
                childDose: "As prescribed",
                frequency: "As prescribed",
                duration: "Follow doctor's instructions"
              }
            ],
            whenToSeeDoctor: "If symptoms persist or worsen.",
            emergencyAlert: false,
            dietAdvice: "Maintain a healthy and balanced diet."
          };
        }
      })
      .on('end', resolve);
  });

  // 2. Read Precautions
  await new Promise((resolve) => {
    fs.createReadStream(precautionsFile)
      .pipe(csv())
      .on('data', (row) => {
        const disease = formatName(row.Disease?.trim());
        if (disease && diseaseMap[disease]) {
          const precs = [row.Precaution_1, row.Precaution_2, row.Precaution_3, row.Precaution_4]
            .map(p => p ? p.trim() : '')
            .filter(p => p !== '');
          
          diseaseMap[disease].precautions = precs;
        }
      })
      .on('end', resolve);
  });

  // 3. Load existing JSON dataset
  let dataset = [];
  if (fs.existsSync(outputFile)) {
    dataset = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  }

  // 4. Merge new diseases into dataset
  let addedCount = 0;
  for (const newDis of Object.values(diseaseMap)) {
    // Check if disease already exists
    if (!dataset.find(x => x.disease.toLowerCase() === newDis.disease.toLowerCase())) {
      dataset.push(newDis);
      addedCount++;
    }
  }

  // 5. Save back to medicalDataset.json
  fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2));
  
  console.log(`✅ Successfully injected ${addedCount} new diseases from Kaggle into your dataset!`);
}

processKaggleDataset();
