const https = require('https');

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

async function main() {
  const loginPayload = JSON.stringify({ email: 'maalalcars.911@gmail.com', password: 'Maalal@x1' });
  const loginRes = await request('https://maalalcars.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
  }, loginPayload);

  const cookie = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  const res = await request('https://maalalcars.com/api/vehicles?limit=150', {
    headers: { 'Cookie': cookie }
  });

  const json = JSON.parse(res.body);
  const list = json.data || json.vehicles || json;
  const withPhotos = list.filter(v => v.photos && v.photos.length > 0);

  console.log(`=============================================`);
  console.log(`📊 LIVE PRODUCTION DATABASE PHOTO AUDIT`);
  console.log(`=============================================`);
  console.log(`Total vehicles in database: ${list.length}`);
  console.log(`Vehicles with photos: ${withPhotos.length} (Seed: 8, New: ${withPhotos.length - 8})\n`);

  withPhotos.forEach((v, idx) => {
    const primary = v.photos.find(p => p.isPrimary) || v.photos[0];
    console.log(`${idx + 1}. [${v.code}] ${v.brand} ${v.model} (${v.year}) - ${v.photos.length} photos`);
    console.log(`   Thumbnail: ${primary ? primary.url : 'None'}`);
  });
}

main().catch(console.error);
