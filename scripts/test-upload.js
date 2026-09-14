const https = require('https');
const fs = require('fs');
const path = require('path');

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
  console.log('1. Logging in...');
  const loginPayload = JSON.stringify({ email: 'maalalcars.911@gmail.com', password: 'Maalal@x1' });
  const loginRes = await request('https://maalalcars.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
  }, loginPayload);

  console.log('Login status:', loginRes.statusCode);
  const cookie = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  console.log('2. Testing file upload...');
  const testImagePath = 'C:\\Users\\benjk\\Downloads\\Dossier Maalal Cars (1)\\Dossier Maalal Cars\\1- MERCEDES C220\\WhatsApp Image 2026-08-10 at 16.00.56.jpeg';
  const fileBuffer = fs.readFileSync(testImagePath);
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

  const prefix = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photos"; filename="test.jpeg"\r\nContent-Type: image/jpeg\r\n\r\n`);
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
  const fullBody = Buffer.concat([prefix, fileBuffer, suffix]);

  const uploadRes = await request('https://maalalcars.com/api/vehicles/upload-photos', {
    method: 'POST',
    headers: {
      'Cookie': cookie,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length
    }
  }, fullBody);

  console.log('Upload HTTP status:', uploadRes.statusCode);
  console.log('Upload response body:', uploadRes.body);
}

main().catch(console.error);
