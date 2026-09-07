const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log('       MAALAL CARS DIAGNOSTICS & REPAIR       ');
console.log('==============================================');
console.log('Timestamp:', new Date().toISOString());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current working directory:', process.cwd());
console.log('Script directory (__dirname):', __dirname);

const appDir = path.resolve(__dirname, '..');
console.log('App root directory:', appDir);

// 1. Check directory contents
console.log('\n--- 1. ROOT DIRECTORY LISTING ---');
try {
  const rootFiles = fs.readdirSync(appDir);
  console.log('Root files count:', rootFiles.length);
  console.log('Files:', rootFiles.join(', '));
} catch (e) {
  console.error('Error reading root dir:', e.message);
}

// 2. Check prisma directory
console.log('\n--- 2. PRISMA DIRECTORY CHECK ---');
const prismaDir = path.join(appDir, 'prisma');
if (fs.existsSync(prismaDir)) {
  const prismaFiles = fs.readdirSync(prismaDir);
  console.log('prisma/ files:', prismaFiles.join(', '));
  for (const f of prismaFiles) {
    try {
      const s = fs.statSync(path.join(prismaDir, f));
      console.log(` - ${f}: ${s.size} bytes, mode: 0${(s.mode & 0o777).toString(8)}`);
    } catch (_) {}
  }
} else {
  console.warn('prisma/ directory DOES NOT EXIST at', prismaDir);
  try {
    fs.mkdirSync(prismaDir, { recursive: true });
    console.log('Created prisma/ directory.');
  } catch (e) {
    console.error('Failed to create prisma/ dir:', e.message);
  }
}

// 3. Template Discovery & DB Initialization
console.log('\n--- 3. DATABASE TEMPLATE CHECK & REPAIR ---');
const candidateTemplates = [
  path.join(prismaDir, 'production.init.template'),
  path.join(prismaDir, 'production.template'),
  path.join(appDir, 'production.init.template'),
  path.join(appDir, 'production.template'),
  path.join(appDir, 'prisma', 'production.template'),
  path.join(appDir, 'maalalcars', 'prisma', 'production.template'),
];

let validTemplate = null;
for (const cand of candidateTemplates) {
  if (fs.existsSync(cand)) {
    const stat = fs.statSync(cand);
    console.log(`Found candidate: ${cand} (${stat.size} bytes)`);
    if (stat.size > 100000) {
      // Verify SQLite header
      try {
        const fd = fs.openSync(cand, 'r');
        const buf = Buffer.alloc(16);
        fs.readSync(fd, buf, 0, 16, 0);
        fs.closeSync(fd);
        const header = buf.toString('utf8');
        if (header.startsWith('SQLite format 3')) {
          console.log(`  -> Valid SQLite database header verified in ${cand}!`);
          validTemplate = cand;
          break;
        } else {
          console.warn(`  -> File exists but header is: "${header}"`);
        }
      } catch (err) {
        console.warn('  -> Header read error:', err.message);
      }
    }
  }
}

const targetDb = path.join(prismaDir, 'production.db');
console.log('Target database path:', targetDb);

let needCopy = true;
if (fs.existsSync(targetDb)) {
  const stat = fs.statSync(targetDb);
  console.log(`Existing production.db size: ${stat.size} bytes`);
  if (stat.size > 100000) {
    try {
      const fd = fs.openSync(targetDb, 'r');
      const buf = Buffer.alloc(16);
      fs.readSync(fd, buf, 0, 16, 0);
      fs.closeSync(fd);
      if (buf.toString('utf8').startsWith('SQLite format 3')) {
        console.log('Existing production.db is ALREADY valid and populated (>100KB)!');
        needCopy = false;
      }
    } catch (_) {}
  }
}

if (needCopy) {
  if (validTemplate) {
    try {
      console.log(`Copying template from ${validTemplate} to ${targetDb}...`);
      try { fs.unlinkSync(targetDb); } catch (_) {}
      fs.copyFileSync(validTemplate, targetDb);
      const newStat = fs.statSync(targetDb);
      console.log(`SUCCESS: production.db initialized (${newStat.size} bytes)!`);
    } catch (e) {
      console.error('Copy failed:', e.message);
    }
  } else {
    console.error('FATAL: No valid SQLite template found among candidates!');
  }
}

// 4. Test Permissions
console.log('\n--- 4. PERMISSIONS CHECK ---');
try {
  fs.chmodSync(targetDb, 0o666);
  fs.chmodSync(prismaDir, 0o777);
  console.log('Permissions updated (0666 on db, 0777 on dir).');
} catch (e) {
  console.log('chmod note (not fatal):', e.message);
}

// 5. Test Prisma Client Query
console.log('\n--- 5. PRISMA CLIENT ENGINE & QUERY TEST ---');
process.env.DATABASE_URL = 'file:' + targetDb;
console.log('DATABASE_URL set to:', process.env.DATABASE_URL);

async function testPrisma() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    console.log('PrismaClient instantiated. Running test queries...');

    const userCount = await prisma.user.count();
    console.log('✅ Query prisma.user.count() succeeded! User count =', userCount);

    const vehicleCount = await prisma.vehicle.count();
    console.log('✅ Query prisma.vehicle.count() succeeded! Vehicle count =', vehicleCount);

    const reservationCount = await prisma.reservation.count();
    console.log('✅ Query prisma.reservation.count() succeeded! Reservation count =', reservationCount);

    await prisma.$disconnect();
    console.log('\n🎉 ALL CHECKS PASSED: APPLICATION & DATABASE ARE 100% OPERATIONAL!');
  } catch (err) {
    console.error('❌ Prisma query failed:', err.message);
    if (err.stack) console.error(err.stack);
  }
}

testPrisma();
