const fs = require('fs');
const path = require('path');

const vehicles = JSON.parse(fs.readFileSync('scripts/prod-vehicles.json', 'utf8'));
const baseImagesDir = 'C:\\Users\\benjk\\Downloads\\Dossier Maalal Cars (1)\\Dossier Maalal Cars';
const folders = fs.readdirSync(baseImagesDir).filter(f => fs.statSync(path.join(baseImagesDir, f)).isDirectory());

console.log('--- MATCHING ANALYSIS ---');

folders.forEach(folder => {
  if (folder === 'ads') return;

  // Extract folder name parts
  // e.g. "1- MERCEDES C220" -> num: 1, name: MERCEDES C220
  const match = folder.match(/^(\d+)\s*[-_ ]\s*(.+)$/i);
  const num = match ? parseInt(match[1]) : null;
  const name = match ? match[2].trim() : folder.trim();

  // Find candidate vehicles
  const candidates = vehicles.filter(v => {
    const fullV = `${v.brand} ${v.model}`.toLowerCase();
    const folderLower = name.toLowerCase();

    // Check brand/model words
    const words = folderLower.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 1);
    const matchesSome = words.every(w => {
      if (w === 'hyndai') w = 'hyundai';
      if (w === 'volswagen') w = 'volkswagen';
      if (w === 'renegede') w = 'renigade';
      return fullV.includes(w) || (v.brand.toLowerCase().includes(w) || v.model.toLowerCase().includes(w));
    });

    return matchesSome;
  });

  console.log(`\nFolder: "${folder}" (Num: ${num})`);
  if (candidates.length === 0) {
    console.log('  -> No direct name matches found.');
  } else {
    candidates.forEach(c => {
      console.log(`  -> Candidate [${c.id}] Code: ${c.code} | VIN: ${c.vin} | ${c.brand} ${c.model} (${c.year}) | Plate: ${c.matricule} | Color: ${c.colorExterior} | Photos: ${(c.photos||[]).length}`);
    });
  }
});
