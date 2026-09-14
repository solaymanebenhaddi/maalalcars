const XLSX = require('xlsx');

const wb = XLSX.readFile('MAALAL CARS DATA.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('--- MAALAL CARS DATA.xlsx ROWS 1-25 ---');
for (let i = 1; i <= Math.min(25, data.length - 1); i++) {
  const row = data[i];
  const marque = row[0] || '';
  const type = row[1] || '';
  const couleur = row[2] || '';
  const modele = row[3] || '';
  const matricule = row[5] || '';
  const annee = row[26] || '';
  const vin = row[27] || '';
  console.log(`Row ${i}: [VIN: ${vin}] ${marque} | ${type} | Modele: ${modele} | Year: ${annee} | Color: ${couleur} | Plate: ${matricule}`);
}
