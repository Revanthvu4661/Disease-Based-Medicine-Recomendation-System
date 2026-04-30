const mongoose = require('mongoose');
const Record = require('../server/models/Record');
const User = require('../server/models/User');
require('dotenv').config();

const diseases = [
  // Common Diseases
  { name: 'Common Cold', severity: 'mild', symptoms: ['Runny nose', 'Cough', 'Sore throat', 'Headache'], medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' }, { name: 'Cough Syrup', dosage: '10ml', frequency: 'Twice daily', duration: '7 days' }], precautions: ['Rest', 'Drink warm liquids', 'Use a humidifier', 'Avoid cold food'] },
  { name: 'Influenza (Flu)', severity: 'moderate', symptoms: ['High fever', 'Body aches', 'Fatigue', 'Cough', 'Sore throat'], medicines: [{ name: 'Oseltamivir', dosage: '75mg', frequency: 'Twice daily', duration: '5 days' }, { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' }], precautions: ['Bed rest', 'Stay hydrated', 'Avoid contact with others', 'Maintain hygiene'] },
  { name: 'Cough', severity: 'mild', symptoms: ['Persistent cough', 'Chest discomfort', 'Throat irritation'], medicines: [{ name: 'Dextromethorphan', dosage: '15mg', frequency: 'Three times daily', duration: '7 days' }, { name: 'Honey syrup', dosage: '10ml', frequency: 'As needed', duration: '10 days' }], precautions: ['Stay hydrated', 'Avoid smoke', 'Use throat lozenges', 'Elevate head while sleeping'] },
  { name: 'Allergic Rhinitis', severity: 'mild', symptoms: ['Sneezing', 'Nasal congestion', 'Itchy eyes', 'Runny nose'], medicines: [{ name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }, { name: 'Nasal spray', dosage: '2 sprays', frequency: 'Twice daily', duration: '15 days' }], precautions: ['Avoid allergens', 'Keep windows closed', 'Use air purifier', 'Wash bedding regularly'] },
  { name: 'Asthma', severity: 'moderate', symptoms: ['Shortness of breath', 'Chest tightness', 'Wheezing', 'Coughing at night'], medicines: [{ name: 'Albuterol inhaler', dosage: '100mcg', frequency: 'As needed', duration: 'Ongoing' }, { name: 'Fluticasone inhaler', dosage: '110mcg', frequency: 'Twice daily', duration: 'Ongoing' }], precautions: ['Avoid triggers', 'Regular exercise', 'Monitor peak flow', 'Keep rescue inhaler nearby'] },
  { name: 'Gastroenteritis (Food Poisoning)', severity: 'moderate', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal cramps', 'Fever'], medicines: [{ name: 'ORS', dosage: '200-400ml', frequency: 'After each loose stool', duration: '3-5 days' }, { name: 'Ondansetron', dosage: '4mg', frequency: 'Twice daily', duration: '2-3 days' }, { name: 'Loperamide', dosage: '2mg', frequency: 'After each stool', duration: '3 days' }], precautions: ['Stay hydrated', 'Eat bland food', 'Avoid dairy', 'Rest adequately'] },
  { name: 'Migraine', severity: 'moderate', symptoms: ['Severe headache', 'Nausea', 'Sensitivity to light', 'Aura'], medicines: [{ name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: 'Single dose' }, { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours', duration: '3 days' }], precautions: ['Avoid triggers', 'Stay in dark room', 'Rest', 'Regular sleep schedule'] },
  { name: 'Hypertension (High Blood Pressure)', severity: 'moderate', symptoms: ['Headache', 'Dizziness', 'Chest pain', 'Shortness of breath'], medicines: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Reduce salt intake', 'Regular exercise', 'Monitor BP regularly', 'Manage stress', 'Limit alcohol'] },
  { name: 'Diabetes Type 2', severity: 'moderate', symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Slow healing'], medicines: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: 'Ongoing' }, { name: 'Glipizide', dosage: '5mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Monitor blood sugar', 'Regular exercise', 'Healthy diet', 'Weight management', 'Regular check-ups'] },
  { name: 'Obesity', severity: 'moderate', symptoms: ['Excess weight', 'Difficulty in movement', 'Shortness of breath', 'Joint pain'], medicines: [{ name: 'Orlistat', dosage: '120mg', frequency: 'Three times daily', duration: 'Ongoing' }], precautions: ['Regular exercise', 'Balanced diet', 'Reduce calorie intake', 'Behavioral therapy', 'Sleep well'] },
  { name: 'Anxiety Disorder', severity: 'mild', symptoms: ['Excessive worry', 'Panic attacks', 'Restlessness', 'Difficulty concentrating'], medicines: [{ name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Alprazolam', dosage: '0.5mg', frequency: 'As needed', duration: 'Short-term' }], precautions: ['Regular exercise', 'Meditation', 'Therapy', 'Adequate sleep', 'Limit caffeine'] },
  { name: 'Depression', severity: 'moderate', symptoms: ['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep disturbance', 'Worthlessness'], medicines: [{ name: 'Fluoxetine', dosage: '20mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Escitalopram', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Therapy', 'Regular exercise', 'Social support', 'Maintain routine', 'Sleep well'] },
  { name: 'Thyroid Disorder', severity: 'mild', symptoms: ['Weight gain', 'Fatigue', 'Cold sensitivity', 'Hair loss', 'Dry skin'], medicines: [{ name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Regular TSH monitoring', 'Consistent medication', 'Iodine-rich diet', 'Regular check-ups'] },
  { name: 'Arthritis', severity: 'moderate', symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Reduced mobility'], medicines: [{ name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily', duration: 'Ongoing' }, { name: 'Methotrexate', dosage: '10mg', frequency: 'Weekly', duration: 'Ongoing' }], precautions: ['Physical therapy', 'Heat application', 'Rest affected joints', 'Maintain healthy weight'] },
  { name: 'Cholesterol', severity: 'mild', symptoms: ['Usually asymptomatic', 'High cholesterol levels'], medicines: [{ name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Simvastatin', dosage: '20mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Heart-healthy diet', 'Regular exercise', 'Weight management', 'Regular testing', 'Limit alcohol'] },
  { name: 'Kidney Disease', severity: 'severe', symptoms: ['Swelling in legs', 'Fatigue', 'Shortness of breath', 'Nausea', 'High blood pressure'], medicines: [{ name: 'ACE inhibitor', dosage: 'Variable', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Calcium supplement', dosage: '1000mg', frequency: 'Daily', duration: 'Ongoing' }], precautions: ['Low sodium diet', 'Fluid restriction', 'Monitor potassium', 'Regular dialysis if needed', 'Frequent monitoring'] },
  { name: 'Liver Disease', severity: 'severe', symptoms: ['Jaundice', 'Abdominal pain', 'Fatigue', 'Dark urine', 'Pale stool'], medicines: [{ name: 'Silymarin', dosage: '140mg', frequency: 'Three times daily', duration: 'Ongoing' }, { name: 'Ursodeoxycholic acid', dosage: '250mg', frequency: 'Three times daily', duration: 'Ongoing' }], precautions: ['Avoid alcohol', 'Low-fat diet', 'Regular monitoring', 'Vaccinations', 'Avoid hepatotoxic drugs'] },
  { name: 'Anemia', severity: 'moderate', symptoms: ['Fatigue', 'Weakness', 'Shortness of breath', 'Dizziness', 'Pale skin'], medicines: [{ name: 'Iron supplement', dosage: '325mg', frequency: 'Once daily', duration: '3-6 months' }, { name: 'Vitamin B12', dosage: '1000mcg', frequency: 'Monthly injection', duration: 'Ongoing' }], precautions: ['Iron-rich diet', 'Vitamin C intake', 'Regular monitoring', 'Treat underlying cause', 'Rest adequately'] },
  { name: 'Cancer (Various Types)', severity: 'severe', symptoms: ['Unexplained weight loss', 'Persistent fatigue', 'Pain', 'Abnormal bleeding', 'Lumps'], medicines: [{ name: 'Chemotherapy drugs', dosage: 'Variable', frequency: 'As per protocol', duration: 'Variable' }, { name: 'Targeted therapy', dosage: 'Variable', frequency: 'As per protocol', duration: 'Variable' }], precautions: ['Regular screening', 'Oncologist follow-up', 'Manage side effects', 'Nutritional support', 'Mental health support'] },
  { name: 'Heart Disease', severity: 'severe', symptoms: ['Chest pain', 'Shortness of breath', 'Palpitations', 'Fatigue', 'Dizziness'], medicines: [{ name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: 'Ongoing' }], precautions: ['Cardiac rehabilitation', 'Regular monitoring', 'Stress management', 'Heart-healthy diet', 'Regular exercise'] },
  { name: 'Stroke/TIA', severity: 'severe', symptoms: ['Sudden weakness', 'Speech difficulty', 'Vision loss', 'Severe headache', 'Loss of balance'], medicines: [{ name: 'Aspirin', dosage: '300mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Warfarin', dosage: 'Variable', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Manage blood pressure', 'Control diabetes', 'Quit smoking', 'Regular exercise', 'Medication compliance'] },
  { name: 'COPD (Chronic Obstructive Pulmonary Disease)', severity: 'severe', symptoms: ['Shortness of breath', 'Chronic cough', 'Wheezing', 'Chest tightness', 'Fatigue'], medicines: [{ name: 'Albuterol inhaler', dosage: '100mcg', frequency: 'Three times daily', duration: 'Ongoing' }, { name: 'Tiotropium inhaler', dosage: '18mcg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Quit smoking', 'Avoid air pollution', 'Pulmonary rehabilitation', 'Vaccination', 'Oxygen therapy if needed'] },
  { name: 'Pneumonia', severity: 'moderate', symptoms: ['Fever', 'Cough with phlegm', 'Chest pain', 'Shortness of breath', 'Fatigue'], medicines: [{ name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days' }, { name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '5 days' }], precautions: ['Bed rest', 'Stay hydrated', 'Avoid smoking', 'Monitor oxygen levels', 'Regular follow-up'] },
  { name: 'Tuberculosis (TB)', severity: 'severe', symptoms: ['Persistent cough', 'Bloody sputum', 'Night sweats', 'Weight loss', 'Chest pain'], medicines: [{ name: 'Isoniazid', dosage: '300mg', frequency: 'Once daily', duration: '6 months' }, { name: 'Rifampicin', dosage: '600mg', frequency: 'Once daily', duration: '6 months' }, { name: 'Pyrazinamide', dosage: '1500mg', frequency: 'Once daily', duration: '2 months' }], precautions: ['Complete treatment course', 'Infection control', 'Nutritional support', 'Regular monitoring', 'Contact tracing'] },
  { name: 'Urinary Tract Infection (UTI)', severity: 'mild', symptoms: ['Burning during urination', 'Frequent urination', 'Cloudy urine', 'Pelvic pain'], medicines: [{ name: 'Ciprofloxacin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' }, { name: 'Trimethoprim-Sulfamethoxazole', dosage: '800mg', frequency: 'Twice daily', duration: '3 days' }], precautions: ['Stay hydrated', 'Urinate after intercourse', 'Proper hygiene', 'Avoid irritants', 'Cranberry juice'] },
  { name: 'Bacterial Infection', severity: 'moderate', symptoms: ['Fever', 'Inflammation', 'Pus formation', 'Fatigue', 'Malaise'], medicines: [{ name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7-10 days' }, { name: 'Cephalexin', dosage: '500mg', frequency: 'Four times daily', duration: '7-10 days' }], precautions: ['Proper wound care', 'Infection control', 'Complete antibiotic course', 'Rest', 'Monitor temperature'] },
  { name: 'Viral Infection', severity: 'mild', symptoms: ['Fever', 'Fatigue', 'Body aches', 'Sore throat', 'Cough'], medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' }, { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours', duration: '5 days' }], precautions: ['Rest', 'Fluid intake', 'Symptomatic treatment', 'Isolation', 'Hand hygiene'] },
  { name: 'Dengue Fever', severity: 'severe', symptoms: ['High fever', 'Severe headache', 'Joint pain', 'Rash', 'Bleeding'], medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' }], precautions: ['Rest', 'Fluid intake', 'Platelet monitoring', 'Avoid NSAIDs', 'Hospital admission if severe'] },
  { name: 'Malaria', severity: 'severe', symptoms: ['High fever', 'Chills', 'Sweating', 'Headache', 'Muscle pain'], medicines: [{ name: 'Artemether', dosage: '80mg', frequency: 'Once daily IM', duration: '3 days' }, { name: 'Artesunate', dosage: '2.4mg/kg', frequency: 'IV/IM', duration: '3 days' }], precautions: ['Mosquito prevention', 'Antimalarial prophylaxis', 'Complete treatment', 'Blood testing', 'Fever management'] },
  { name: 'COVID-19', severity: 'moderate', symptoms: ['Fever', 'Dry cough', 'Fatigue', 'Loss of taste/smell', 'Shortness of breath'], medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' }, { name: 'Remdesivir', dosage: '200mg IV', frequency: 'Once daily', duration: '5 days' }], precautions: ['Isolation', 'Oxygen therapy if needed', 'Monitor symptoms', 'Vaccination', 'Quarantine contacts'] },
  { name: 'Skin Infection (Dermatitis)', severity: 'mild', symptoms: ['Itching', 'Redness', 'Swelling', 'Rash', 'Burning'], medicines: [{ name: 'Topical steroid cream', dosage: '1%', frequency: 'Twice daily', duration: '7-10 days' }, { name: 'Antihistamine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' }], precautions: ['Keep area clean', 'Moisturize', 'Avoid irritants', 'Wear breathable clothes', 'Anti-itch measures'] },
  { name: 'Psoriasis', severity: 'mild', symptoms: ['Red patches', 'White scales', 'Itching', 'Burning', 'Cracked skin'], medicines: [{ name: 'Topical corticosteroid', dosage: 'Variable', frequency: 'Twice daily', duration: 'Ongoing' }, { name: 'Calcipotriene', dosage: '50mcg/g', frequency: 'Twice daily', duration: 'Ongoing' }], precautions: ['Moisturize regularly', 'Avoid triggers', 'Phototherapy', 'Stress management', 'UV protection'] },
  { name: 'Eczema', severity: 'mild', symptoms: ['Intense itching', 'Dry skin', 'Sensitive skin', 'Redness', 'Cracked skin'], medicines: [{ name: 'Moisturizer', dosage: 'As needed', frequency: 'Multiple times daily', duration: 'Ongoing' }, { name: 'Topical steroid', dosage: 'Variable', frequency: 'Twice daily', duration: '5-7 days' }], precautions: ['Daily moisturizing', 'Avoid irritants', 'Use mild soaps', 'Avoid extreme temperatures', 'Manage stress'] },
  { name: 'Acne', severity: 'mild', symptoms: ['Pimples', 'Blackheads', 'Whiteheads', 'Oily skin', 'Inflammation'], medicines: [{ name: 'Benzoyl peroxide', dosage: '2.5%', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Adapalene', dosage: '0.1%', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Gentle cleansing', 'Avoid picking', 'Sunscreen use', 'Oil-free products', 'Regular skincare'] },
  { name: 'Hair Loss', severity: 'mild', symptoms: ['Excessive shedding', 'Thinning hair', 'Bald patches', 'Scalp sensitivity'], medicines: [{ name: 'Minoxidil', dosage: '5%', frequency: 'Twice daily', duration: 'Ongoing' }, { name: 'Finasteride', dosage: '1mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Regular scalp massage', 'Nutritious diet', 'Stress management', 'Avoid tight hairstyles', 'Hair supplements'] },
  { name: 'Ulcer', severity: 'moderate', symptoms: ['Abdominal pain', 'Burning sensation', 'Nausea', 'Vomiting', 'Dark stools'], medicines: [{ name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '4-8 weeks' }, { name: 'Ranitidine', dosage: '150mg', frequency: 'Twice daily', duration: '4-8 weeks' }], precautions: ['Avoid spicy food', 'No smoking', 'Reduce stress', 'Regular meals', 'Avoid NSAIDs'] },
  { name: 'GERD (Acid Reflux)', severity: 'mild', symptoms: ['Heartburn', 'Chest discomfort', 'Difficulty swallowing', 'Regurgitation', 'Sore throat'], medicines: [{ name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: 'Ongoing' }, { name: 'Antacid', dosage: '750mg', frequency: 'As needed', duration: 'As needed' }], precautions: ['Avoid trigger foods', 'Small frequent meals', 'Elevate head while sleeping', 'Weight management', 'No eating before bed'] },
  { name: 'Inflammatory Bowel Disease', severity: 'moderate', symptoms: ['Chronic diarrhea', 'Abdominal pain', 'Weight loss', 'Rectal bleeding', 'Fatigue'], medicines: [{ name: 'Mesalamine', dosage: '800mg', frequency: 'Three times daily', duration: 'Ongoing' }, { name: 'Azathioprine', dosage: '50mg', frequency: 'Once daily', duration: 'Ongoing' }], precautions: ['Dietary modifications', 'Stress management', 'Regular monitoring', 'Medication compliance', 'Nutritional support'] },
];

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Anjali', 'Vikram', 'Sneha', 'Arjun', 'Divya', 'Rohan', 'Neha', 'Sanjay', 'Pooja', 'Karan', 'Isha', 'Abhishek', 'Shruti'];
const lastNames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Khan', 'Reddy', 'Verma', 'Yadav', 'Iyer', 'Nair', 'Desai'];
const genders = ['Male', 'Female'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAge() {
  return Math.floor(Math.random() * (75 - 18 + 1)) + 18;
}

function getRandomWeight() {
  return Math.floor(Math.random() * (90 - 45 + 1)) + 45;
}

function getRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedRecords() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/MediCare');
    console.log('📊 Seeding 120 medical records...');

    const patients = await User.find({ role: 'patient' }).limit(10);
    if (patients.length === 0) {
      console.log('❌ No patients found. Please create patient accounts first.');
      process.exit(1);
    }

    const records = [];
    for (let i = 0; i < 120; i++) {
      const disease = getRandomElement(diseases);
      const patient = getRandomElement(patients);

      records.push({
        patientId: patient._id,
        patientName: patient.name,
        patientEmail: patient.email,
        disease: disease.name,
        symptoms: disease.symptoms,
        age: getRandomAge(),
        weight: getRandomWeight(),
        gender: getRandomElement(genders),
        medicines: disease.medicines,
        precautions: disease.precautions,
        description: `Patient presents with ${disease.name.toLowerCase()}. Symptoms include ${disease.symptoms.slice(0, 2).join(', ')}.`,
        severity: disease.severity,
        reviewed: Math.random() > 0.6,
        reviewedBy: Math.random() > 0.6 ? null : patient._id,
        reviewedAt: Math.random() > 0.6 ? null : getRandomDate(),
        notes: Math.random() > 0.6 ? null : 'Patient responding well to treatment',
        date: getRandomDate()
      });
    }

    await Record.insertMany(records);
    console.log('✅ Successfully seeded 120 medical records!');
    console.log(`📝 Total diseases covered: ${diseases.length}`);
    console.log(`👥 Records per patient: ~${Math.ceil(120 / patients.length)}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding records:', err.message);
    process.exit(1);
  }
}

seedRecords();
