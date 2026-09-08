/* eslint-disable */
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'diagnostic-log.txt');
try { fs.writeFileSync(logPath, 'STARTING DIAGNOSTICS: ' + new Date().toISOString() + '\n'); } catch (_) {}

function logStep(msg) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (_) {}
  console.log(msg);
}

logStep('==============================================');
logStep('       MAALAL CARS DIAGNOSTICS & REPAIR       ');
logStep('==============================================');
logStep('Node version: ' + process.version);
logStep('Platform: ' + process.platform);
logStep('Current working directory: ' + process.cwd());
logStep('Script directory (__dirname): ' + __dirname);

process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';

const appDir = path.resolve(__dirname, '..');
console.log('App root directory:', appDir);

try {
  const engineDir = path.join(appDir, 'node_modules', '.prisma', 'client');
  if (fs.existsSync(engineDir)) {
    const files = fs.readdirSync(engineDir);
    const existingEngine = files.find(f => f.startsWith('query-engine-') && !f.endsWith('.js'));
    const deb10 = path.join(engineDir, 'query-engine-debian-openssl-1.0.x');
    if (!fs.existsSync(deb10) && existingEngine) {
      try {
        fs.copyFileSync(path.join(engineDir, existingEngine), deb10);
        console.log('Auto-created engine alias:', deb10);
      } catch (_) {}
    }
    fs.readdirSync(engineDir).forEach((f) => {
      if (f.startsWith('query-engine')) {
        try { fs.chmodSync(path.join(engineDir, f), 0o755); } catch (_) {}
      }
    });
  }
} catch (_) {}

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

// 4.b Schema Synchronization
async function syncDatabaseSchema(targetDbPath, templateDbPath, logger = console.log) {
  if (!templateDbPath || !fs.existsSync(templateDbPath) || !targetDbPath || !fs.existsSync(targetDbPath)) {
    return;
  }
  logger('🔄 Vérification et synchronisation du schéma SQLite...');
  const { PrismaClient } = require('@prisma/client');
  const syncPrisma = new PrismaClient({
    datasources: { db: { url: 'file:' + targetDbPath } },
  });

  try {
    const escapedTpl = templateDbPath.replace(/'/g, "''");
    try { await syncPrisma.$executeRawUnsafe('DETACH DATABASE tpl'); } catch (_) {}
    await syncPrisma.$executeRawUnsafe(`ATTACH DATABASE '${escapedTpl}' AS tpl`);

    const tplTables = await syncPrisma.$queryRawUnsafe(
      "SELECT name, sql FROM tpl.sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'"
    );
    const mainTables = await syncPrisma.$queryRawUnsafe(
      "SELECT name FROM main.sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'"
    );
    const mainTableNames = new Set(mainTables.map((t) => t.name));

    for (const tplTable of tplTables) {
      const tableName = tplTable.name;

      if (!mainTableNames.has(tableName)) {
        if (tplTable.sql) {
          await syncPrisma.$executeRawUnsafe(tplTable.sql);
          logger('➕ [SYNC] Table créée : ' + tableName);
        }
        continue;
      }

      const tplCols = await syncPrisma.$queryRawUnsafe(`PRAGMA tpl.table_info("${tableName}")`);
      const mainCols = await syncPrisma.$queryRawUnsafe(`PRAGMA main.table_info("${tableName}")`);
      const mainColNames = new Set(mainCols.map((c) => c.name));

      for (const col of tplCols) {
        if (!mainColNames.has(col.name)) {
          logger(`➕ [SYNC] Colonne manquante : ${tableName}.${col.name} (${col.type})`);
          let defClause = '';
          if (col.dflt_value !== null && col.dflt_value !== undefined) {
            if (col.dflt_value.toUpperCase().includes('CURRENT_TIMESTAMP')) {
              defClause = '';
            } else {
              defClause = ` DEFAULT ${col.dflt_value}`;
            }
          } else if (col.notnull) {
            if (col.type && (col.type.toUpperCase().includes('INT') || col.type.toUpperCase().includes('BOOL'))) {
              defClause = ' DEFAULT 0';
            } else if (col.type && (col.type.toUpperCase().includes('CHAR') || col.type.toUpperCase().includes('TEXT'))) {
              defClause = " DEFAULT ''";
            } else {
              defClause = ' DEFAULT 0';
            }
          }

          const alterSql = `ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.type || 'TEXT'}${defClause}`;
          try {
            await syncPrisma.$executeRawUnsafe(alterSql);
            logger(`✅ [SYNC] Colonne ${tableName}.${col.name} ajoutée`);
          } catch (errAlter) {
            try {
              await syncPrisma.$executeRawUnsafe(`ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.type || 'TEXT'}`);
              logger(`✅ [SYNC] Colonne ${tableName}.${col.name} ajoutée (sans DEFAULT)`);
            } catch (errFallback) {
              logger(`❌ [SYNC] Erreur ajout ${tableName}.${col.name} : ` + errFallback.message);
            }
          }
        }
      }
    }

    try { await syncPrisma.$executeRawUnsafe('DETACH DATABASE tpl'); } catch (_) {}
    logger('✅ [SYNC] Synchronisation SQLite terminée avec succès.');
  } catch (err) {
    logger('⚠️ [SYNC] Note synchronisation : ' + (err && err.message ? err.message : err));
  } finally {
    try { await syncPrisma.$disconnect(); } catch (_) {}
  }
}

// 5. Test Prisma Client Query
console.log('\n--- 5. PRISMA CLIENT ENGINE & QUERY TEST ---');
process.env.DATABASE_URL = 'file:' + targetDb;
console.log('DATABASE_URL set to:', process.env.DATABASE_URL);

async function testPrisma() {
  try {
    if (validTemplate) {
      logStep('Synchronizing schema with template: ' + validTemplate);
      await syncDatabaseSchema(targetDb, validTemplate, logStep);
    }

    logStep('Loading @prisma/client module...');
    const { PrismaClient } = require('@prisma/client');
    logStep('Instantiating PrismaClient...');
    const prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
    logStep('PrismaClient instantiated. Connecting to SQLite...');
    await prisma.$connect();
    logStep('Prisma connected! Querying prisma.user.count()...');

    const userCount = await prisma.user.count();
    logStep('✅ prisma.user.count() = ' + userCount);

    const vehicleCount = await prisma.vehicle.count();
    logStep('✅ prisma.vehicle.count() = ' + vehicleCount);

    const reservationCount = await prisma.reservation.count();
    logStep('✅ prisma.reservation.count() = ' + reservationCount);

    await prisma.$disconnect();
    logStep('\n🎉 ALL CHECKS PASSED: APPLICATION & DATABASE ARE 100% OPERATIONAL!');
  } catch (err) {
    logStep('❌ Prisma error: ' + err.message + '\n' + err.stack);
  }
}

testPrisma();
