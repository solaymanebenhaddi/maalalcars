const https = require('https');

function request(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function main() {
  console.log('Logging in to https://maalalcars.com/api/auth/login...');
  const loginPayload = JSON.stringify({
    email: 'maalalcars.911@gmail.com',
    password: 'Maalal@x1'
  });

  const loginRes = await request('https://maalalcars.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPayload)
    }
  }, loginPayload);

  console.log('Login HTTP status:', loginRes.statusCode);
  if (loginRes.statusCode !== 200) {
    console.error('Login failed:', loginRes.data);
    return;
  }

  const setCookie = loginRes.headers['set-cookie'];
  const cookieHeader = setCookie ? setCookie.map(c => c.split(';')[0]).join('; ') : '';
  console.log('Got cookie:', cookieHeader);

  console.log('\nFetching vehicles from https://maalalcars.com/api/vehicles?limit=200...');
  const vehiclesRes = await request('https://maalalcars.com/api/vehicles?limit=200', {
    headers: {
      'Cookie': cookieHeader
    }
  });

  console.log('Vehicles HTTP status:', vehiclesRes.statusCode);
  const parsed = JSON.parse(vehiclesRes.data);
  const vehicles = parsed.data || parsed.vehicles || parsed;
  console.log(`Found total ${vehicles.length} vehicles:\n`);

  vehicles.forEach((v, idx) => {
    const photoCount = v.photos ? v.photos.length : 0;
    console.log(`${idx + 1}. [${v.id}] ${v.brand} ${v.model} (${v.year}) - Code: ${v.code} - Plate: ${v.matricule || 'N/A'} - Status: ${v.status} - Photos: ${photoCount}`);
  });
}

main().catch(console.error);
