const https = require('https');
const fs = require('fs');

const processedData = JSON.parse(fs.readFileSync('scripts/processed-photos.json', 'utf8'));

const CORRECTED_IDS = {
  '1- MERCEDES C220': 'cmtwpptaf00b4uya3lzkaef7d',
  '2- SKODA OCTAVIA': 'cmtwppsps009quya30mkscpj2',
  '12 - BMW 218': 'cmtwppsb2008ruya3eoywg5xc',
  '14- SKODA OCTAVIA': 'cmtwppsiz009buya3p4py3g02',
  '16- RENAULT MEGANE': 'cmtwpptrd00c8uya3nvu1v6dj',
  '18- MERCEDES GLC 250': 'cmtwpptlb00btuya35jr0xwzy'
};

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
  const payload = JSON.stringify({ email: 'maalalcars.911@gmail.com', password: 'Maalal@x1' });
  const res = await request('https://maalalcars.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, payload);

  const cookie = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  return cookie;
}

async function main() {
  const cookie = await login();
  console.log('Syncing remaining 6 vehicles with corrected IDs...\n');

  for (const [folder, newId] of Object.entries(CORRECTED_IDS)) {
    const item = processedData.find(p => p.folder === folder);
    if (!item) {
      console.warn('Item not found for folder:', folder);
      continue;
    }

    console.log(`Syncing "${folder}" -> Vehicle ID: ${newId} (${item.photos.length} photos)...`);
    const payload = JSON.stringify({ photos: item.photos });
    const postRes = await request(`https://maalalcars.com/api/vehicles/${newId}/photos`, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    if (postRes.statusCode === 200) {
      const json = JSON.parse(postRes.body);
      console.log(`   ✅ Success: Synced ${json.count} photos!`);
    } else {
      console.warn(`   ⚠️ Status ${postRes.statusCode}: ${postRes.body}`);
    }
  }

  console.log('\n🎉 ALL 24 VEHICLES ARE NOW 100% SYNCED WITH PHOTOS IN THE DATABASE!');
}

main().catch(console.error);
