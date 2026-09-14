const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const baseImagesDir = 'C:\\Users\\benjk\\Downloads\\Dossier Maalal Cars (1)\\Dossier Maalal Cars';
const prodVehicles = JSON.parse(fs.readFileSync('scripts/prod-vehicles.json', 'utf8'));

console.log('--- 1. EXCEL INSPECTION ---');
const wb = XLSX.readFile('BULL-ADD-REAL-DATA.xlsx');
console.log('SheetNames:', wb.SheetNames);
const sheet = wb.Sheets[wb.SheetNames[0]];
const excelRows = XLSX.utils.sheet_to_json(sheet);
console.log('Total Excel rows:', excelRows.length);
if (excelRows.length > 0) {
  console.log('First 5 excel rows:', excelRows.slice(0, 5));
}

console.log('\n--- 2. IMAGE FOLDERS ---');
const imageFolders = fs.readdirSync(baseImagesDir).filter(f => {
  return fs.statSync(path.join(baseImagesDir, f)).isDirectory();
});
console.log('Image folders count:', imageFolders.length);
imageFolders.forEach(f => {
  const imgs = fs.readdirSync(path.join(baseImagesDir, f)).filter(file => /\.(jpe?g|png|webp)$/i.test(file));
  console.log(`- Folder: "${f}" (${imgs.length} images)`);
});

console.log('\n--- 3. PROD VEHICLES SUMMARY ---');
console.log('Total prod vehicles:', prodVehicles.length);
prodVehicles.forEach((v, i) => {
  console.log(`[${i+1}] ID: ${v.id} | Code: ${v.code} | ${v.brand} ${v.model} (${v.year}) | Plate: ${v.matricule || 'N/A'} | VIN: ${v.vin || 'N/A'} | Status: ${v.status} | Photos: ${(v.photos||[]).length}`);
});
