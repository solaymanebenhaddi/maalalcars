const https = require('https');
const fs = require('fs');

const processedData = JSON.parse(fs.readFileSync('scripts/processed-photos.json', 'utf8'));

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

async function main() {
  const cookie = await login();
  console.log(`Starting photo sync for ${processedData.length} vehicles on production...\n`);

  let successCount = 0;

  for (let i = 0; i < processedData.length; i++) {
    const v = processedData[i];
    console.log(`[${i + 1}/${processedData.length}] [${v.code}] ${v.folder} -> Vehicle ID: ${v.vehicleId}`);

    const payload = JSON.stringify({ photos: v.photos });
    const postRes = await request(`https://maalalcars.com/api/vehicles/${v.vehicleId}/photos`, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    if (postRes.statusCode === 200) {
      const json = JSON.parse(postRes.body);
      console.log(`   ✅ Synced ${json.count} photos successfully!`);
      successCount++;
    } else {
      console.warn(`   ⚠️ Status ${postRes.statusCode}: ${postRes.body}`);
    }

    // Short pause
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n🎉 SYNC COMPLETE: ${successCount}/${processedData.length} vehicles updated with photos!`);
}

main().catch(console.error);
