const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\benjk\\Downloads\\Dossier Maalal Cars (1)\\Dossier Maalal Cars';

// Master Mapping of Folder -> Vehicle ID & Metadata
const MAPPINGS = [
  {
    folder: '1- MERCEDES C220',
    vehicleId: 'cmtwpptce00b4uya3e970z588',
    expectedVehicle: 'MERCEDES C220 (2015) NOIR - V-2026-0088'
  },
  {
    folder: '2- SKODA OCTAVIA',
    vehicleId: 'cmtwppt9v00b0uya3c91w9vvy',
    expectedVehicle: 'SKODA OCTAVIA (2023) BLANCHE - V-2026-0078'
  },
  {
    folder: '3- HYNDAI TUCSON',
    vehicleId: 'cmtwpprnp0078uya3wphivz4k',
    expectedVehicle: 'HYUNDAI TUCSON (2022) GRIS VERT - V-2026-0060'
  },
  {
    folder: '4- VOLKSWAGEN T-ROC',
    vehicleId: 'cmtwppsvk00a5uya359jfrd2m',
    expectedVehicle: 'VOLKSWAGEN T-ROC EXTREME (2023) GRIS ARGENT - V-2026-0081'
  },
  {
    folder: '5- RENAULT CLIO 5',
    vehicleId: 'cmtwppsxm00aauya3wz4j0ai7',
    expectedVehicle: 'RENAULT CLIO 5 (2024) GRIS SOURIS - V-2026-0082'
  },
  {
    folder: '6- HYUNDAI I10',
    vehicleId: 'cmtwppsez0091uya3kol9qdab',
    expectedVehicle: 'HYUNDAI I10 (2021) NOIR - V-2026-0073'
  },
  {
    folder: '7- KIA PICANTO',
    vehicleId: 'cmtwpprxn007xuya3otgohxsw',
    expectedVehicle: 'KIA PICANTO (2022) BLANCHE - V-2026-0065'
  },
  {
    folder: '8- DACIA DUSTER',
    vehicleId: 'cmtwppr8s0069uya35rizedhc',
    expectedVehicle: 'DACIA DUSTER (2023) GRIS NARDEAU - V-2026-0053'
  },
  {
    folder: '9- RANGE ROVER EVOQUE',
    vehicleId: 'cmtwpptvp00ciuya3due53wnz',
    expectedVehicle: 'RANGE ROVER EVOQUE DYNAMIQUE (2018) BLANCHE - V-2026-0098'
  },
  {
    folder: '10- JEEP CHEROKEE',
    vehicleId: 'cmtwppqqr0050uya3q6zo9i2l',
    expectedVehicle: 'JEEP CHEROKEE LIMITED (2016) BLANCHE - V-2026-0044'
  },
  {
    folder: '11- AUDI Q8',
    vehicleId: 'cmtwppr3g005uuya36e6yi4u8',
    expectedVehicle: 'AUDI Q8 S LINE (2023) NOIR - V-2026-0050'
  },
  {
    folder: '12 - BMW 218',
    vehicleId: 'cmtwppsae008ruya39v4j4lsm',
    expectedVehicle: 'BMW 218 M SPORT (2023) NOIR - V-2026-0071'
  },
  {
    folder: '13- MERCEDES A220',
    vehicleId: 'cmtwppr6x0064uya3jk14xtqk',
    expectedVehicle: 'MERCEDES A220 AMG PLUS (2019) GRIS CHAMPAGNE - V-2026-0052'
  },
  {
    folder: '14- SKODA OCTAVIA',
    vehicleId: 'cmtwpps3a008cuya3h48j6d0g',
    expectedVehicle: 'SKODA OCTAVIA (2019) BLEU GENDARME - V-2026-0068'
  },
  {
    folder: '15- RANGE ROVER - EVOQUE DYNAMIQUE',
    vehicleId: 'cmtwppqa0003ruya3lsvsr088',
    expectedVehicle: 'LAND ROVER EVOQUE R DYNAMIQUE (2023) GRIS NARDEAU - V-2026-0035'
  },
  {
    folder: '16- RENAULT MEGANE',
    vehicleId: 'cmtwpptr100c3uya38m0z64v6',
    expectedVehicle: 'RENAULT MÉGANE COUPE (2018) BLANCHE - V-2026-0096'
  },
  {
    folder: '17- HYUNDAI TUCSON',
    vehicleId: 'cmtwpprl70073uya3nrioxalp',
    expectedVehicle: 'HYUNDAI TUCSON (2023) NOIR - V-2026-0059'
  },
  {
    folder: '18- MERCEDES GLC 250',
    vehicleId: 'cmtwpptng00bpuya325608s4y',
    expectedVehicle: 'MERCEDES GLC 250D (2019) NOIR - V-2026-0093'
  },
  {
    folder: '19- VOLSWAGEN TOUAREG',
    vehicleId: 'cmtwpppcw001juya3pzy072tp',
    expectedVehicle: 'VOLKSWAGEN TOUAREG (2023) GRIS SOURIS - V-2026-0019'
  },
  {
    folder: '20- DACIA DUSTER',
    vehicleId: 'cmtwpprbe006euya3ui56p5ax',
    expectedVehicle: 'DACIA DUSTER (2023) VERT MILITAIRE - V-2026-0054'
  },
  {
    folder: '21- RANGE ROVER - EVOQUE',
    vehicleId: 'cmtwppql3004luya3yumyqdl4',
    expectedVehicle: 'RANGE ROVER EVOQUE R DYNAMIQUE (2023) NOIR - V-2026-0041'
  },
  {
    folder: '22- JEEP RENEGEDE',
    vehicleId: 'cmtwppr54005zuya3qxcn68lz',
    expectedVehicle: 'JEEP RENIGADE (2019) GRIS ARGENT - V-2026-0051'
  },
  {
    folder: 'Dacia Duster 2',
    vehicleId: 'cmtwppsno009luya38mh477fy',
    expectedVehicle: 'DACIA DUSTER (2023) GRIS NARDEAU - V-2026-0077'
  },
  {
    folder: 'Volkswagen TIGOUAN 2023',
    vehicleId: 'cmtwpptch00b9uya3o806lzbh',
    expectedVehicle: 'VOLKSWAGEN TIGUAN (2023) GRIS SOURIS - V-2026-0089'
  }
];

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data).toString('utf8')
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function login() {
  console.log('Authenticating with https://maalalcars.com/api/auth/login...');
  const payload = JSON.stringify({ email: 'maalalcars.911@gmail.com', password: 'Maalal@x1' });
  const res = await request('https://maalalcars.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, payload);

  if (res.statusCode !== 200) {
    throw new Error(`Login failed (${res.statusCode}): ${res.body}`);
  }

  const cookie = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  console.log('✅ Authenticated successfully.');
  return cookie;
}

async function uploadVehiclePhotos(cookie, mapping) {
  const folderPath = path.join(BASE_DIR, mapping.folder);
  if (!fs.existsSync(folderPath)) {
    console.warn(`Folder not found: ${folderPath}`);
    return;
  }

  const allFiles = fs.readdirSync(folderPath)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  // Take up to 10 photos per vehicle
  const filesToUpload = allFiles.slice(0, 10);
  console.log(`\n======================================================`);
  console.log(`🚗 Uploading for: ${mapping.expectedVehicle}`);
  console.log(`📁 Folder: "${mapping.folder}" -> ${filesToUpload.length} photos`);

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const chunks = [];

  // Add vehicleId field
  chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="vehicleId"\r\n\r\n${mapping.vehicleId}\r\n`));

  // Add photos
  for (const filename of filesToUpload) {
    const filePath = path.join(folderPath, filename);
    const fileBuf = fs.readFileSync(filePath);
    const safeName = filename.replace(/[^\w.-]/g, '_');
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photos"; filename="${safeName}"\r\nContent-Type: image/jpeg\r\n\r\n`));
    chunks.push(fileBuf);
    chunks.push(Buffer.from('\r\n'));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const fullBody = Buffer.concat(chunks);

  console.log(`   Sending ${Math.round(fullBody.length / 1024)} KB payload...`);

  const uploadRes = await request('https://maalalcars.com/api/vehicles/upload-photos', {
    method: 'POST',
    headers: {
      'Cookie': cookie,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length
    }
  }, fullBody);

  console.log(`   Response status: ${uploadRes.statusCode}`);
  try {
    const json = JSON.parse(uploadRes.body);
    if (json.success) {
      console.log(`   ✅ Success: ${json.count} photos stored and associated!`);
    } else {
      console.warn(`   ⚠️ Warning:`, json);
    }
  } catch (e) {
    console.error(`   ❌ Parse error: ${uploadRes.body.substring(0, 200)}`);
  }
}

async function main() {
  const cookie = await login();
  console.log(`Starting bulk photo upload for ${MAPPINGS.length} vehicles...`);

  for (let i = 0; i < MAPPINGS.length; i++) {
    const m = MAPPINGS[i];
    console.log(`\n[${i + 1}/${MAPPINGS.length}] Processing...`);
    try {
      await uploadVehiclePhotos(cookie, m);
    } catch (err) {
      console.error(`Error uploading for ${m.folder}:`, err.message);
    }
    // Polite throttle of 1 second between batches
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🎉 ALL VEHICLE PHOTO UPLOADS FINISHED!');
}

main().catch(console.error);
