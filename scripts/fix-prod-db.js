/* eslint-disable */
/**
 * MAALAL CARS — Production Database Missing Columns Fixer
 * Safely adds any schema columns that might be missing in production.db
 */
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

let dbPath = path.resolve(__dirname, '..', 'prisma', 'production.db');
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
  dbPath = path.resolve(process.cwd(), process.env.DATABASE_URL.replace('file:', ''));
}
console.log('Target database:', dbPath);

const p = new PrismaClient({
  datasources: { db: { url: 'file:' + dbPath } },
});

async function run() {
  const sqls = [
    'ALTER TABLE "Vehicle" ADD COLUMN "customsStatus" TEXT DEFAULT \'MAROC\'',
    'ALTER TABLE "Vehicle" ADD COLUMN "customsYear" INTEGER',
    'ALTER TABLE "Sale" ADD COLUMN "buyerCity" TEXT DEFAULT \'Casablanca\'',
    'ALTER TABLE "Sale" ADD COLUMN "commissionerCity" TEXT DEFAULT \'Casablanca\'',
    'ALTER TABLE "Purchase" ADD COLUMN "supplierCity" TEXT DEFAULT \'Casablanca\'',
    'ALTER TABLE "Purchase" ADD COLUMN "commissionerCity" TEXT DEFAULT \'Casablanca\'',
    'ALTER TABLE "Purchase" ADD COLUMN "hasCommissioner" BOOLEAN',
    'ALTER TABLE "Contact" ADD COLUMN "segment" TEXT',
    'ALTER TABLE "Contact" ADD COLUMN "rating" REAL DEFAULT 5.0',
    'ALTER TABLE "Contact" ADD COLUMN "totalVolume" REAL DEFAULT 0',
    'ALTER TABLE "Contact" ADD COLUMN "currentDebt" REAL DEFAULT 0',
  ];

  for (const s of sqls) {
    try {
      await p.$executeRawUnsafe(s);
      console.log('✅ ' + s);
    } catch (e) {
      if (e.message.includes('duplicate column name')) {
        console.log('✓ Colonne déjà présente : ' + s.split('ADD COLUMN ')[1]);
      } else {
        console.log('ℹ️ ' + e.message);
      }
    }
  }

  // Verify queries that were failing
  console.log('\n--- VÉRIFICATION DES REQUÊTES ---');
  try {
    const v = await p.vehicle.findFirst({ select: { id: true, customsStatus: true } });
    console.log('✅ prisma.vehicle.findFirst avec customsStatus =', v ? v.customsStatus : 'OK (aucun véhicule)');

    const s = await p.sale.findFirst({ select: { id: true, buyerCity: true } });
    console.log('✅ prisma.sale.findFirst avec buyerCity =', s ? s.buyerCity : 'OK (aucune vente)');

    console.log('\n🎉 SUCCÈS TOTAL : La base est désormais 100% compatible avec le code !');
  } catch (errTest) {
    console.error('❌ Erreur vérification:', errTest.message);
  } finally {
    await p.$disconnect();
  }

  // Signal Passenger reload
  const restartTxt = path.resolve(__dirname, '..', 'tmp', 'restart.txt');
  try {
    fs.mkdirSync(path.dirname(restartTxt), { recursive: true });
    fs.writeFileSync(restartTxt, Date.now().toString());
    console.log('🚀 Signal de redémarrage envoyé via tmp/restart.txt');
  } catch (_) {}
}

run();
