const fs = require('fs');
const path = require('path');

const vehicles = JSON.parse(fs.readFileSync('scripts/prod-vehicles.json', 'utf8'));
const baseImagesDir = 'C:\\Users\\benjk\\Downloads\\Dossier Maalal Cars (1)\\Dossier Maalal Cars';
const folders = fs.readdirSync(baseImagesDir).filter(f => fs.statSync(path.join(baseImagesDir, f)).isDirectory());

console.log('=== DETAILED MATCHING REPORT ===\n');

folders.forEach(folder => {
  if (folder === 'ads') return;

  const files = fs.readdirSync(path.join(baseImagesDir, folder)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`\n======================================================`);
  console.log(`📁 FOLDER: "${folder}" (${files.length} photos)`);
  console.log(`======================================================`);

  // Normalize folder search terms
  let cleanName = folder.replace(/^\d+[\s-_]*/, '').trim().toLowerCase();
  cleanName = cleanName.replace(/volswagen/g, 'volkswagen')
                       .replace(/hyndai/g, 'hyundai')
                       .replace(/renegede/g, 'renigade')
                       .replace(/tigouan/g, 'tiguan');

  const terms = cleanName.split(/\s+/).filter(t => t.length > 1 && !/^\d+$/.test(t));

  const matched = vehicles.filter(v => {
    const vStr = `${v.brand} ${v.model} ${v.version || ''}`.toLowerCase();
    // Brand must match
    const brandMatches = terms.some(t => v.brand.toLowerCase().includes(t));
    if (!brandMatches) return false;

    // Model keyword must match
    const modelTerms = terms.filter(t => !v.brand.toLowerCase().includes(t));
    if (modelTerms.length > 0) {
      const modelMatches = modelTerms.some(t => vStr.includes(t));
      if (!modelMatches) return false;
    }
    return true;
  });

  if (matched.length === 0) {
    console.log('  ⚠️ NO MATCHING VEHICLES FOUND IN DATABASE.');
  } else {
    matched.forEach((v, idx) => {
      console.log(`  [Option ${idx+1}] Code: ${v.code} | ID: ${v.id}`);
      console.log(`     Vehicle: ${v.brand} ${v.model} ${v.version || ''} (${v.year})`);
      console.log(`     Immat (Plate): ${v.matricule || 'N/A'}`);
      console.log(`     Color: Ext: ${v.colorExterior} | Int: ${v.colorInterior || 'N/A'}`);
      console.log(`     VIN: ${v.vin}`);
      console.log(`     Current Photos: ${(v.photos||[]).length}`);
      if (v.description) {
        console.log(`     Description: ${v.description.substring(0, 100)}...`);
      }
    });
  }
});
