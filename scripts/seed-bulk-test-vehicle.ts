import prisma from '../src/lib/db'

async function main() {
  const existing = await prisma.vehicle.findFirst({
    where: { code: 'V-2026-BULK01' },
  })

  if (existing) {
    console.log('Bulk test vehicle already exists:', existing.id)
    return
  }

  const park = await prisma.park.findFirst()
  const currentYear = new Date().getFullYear()

  const vehicle = await prisma.vehicle.create({
    data: {
      code: 'V-2026-BULK01',
      vin: 'WVWZZZCDZMW199999',
      matricule: '88990-A-26',
      brand: 'Volkswagen',
      model: 'Golf 8',
      version: 'R-Line 2.0 TDI DSG7',
      bodyType: 'Berline',
      year: 2023,
      colorExterior: 'Gris Dauphin Métallisé',
      fuelType: 'DIESEL',
      transmission: 'AUTOMATIQUE',
      mileage: 28500,
      doors: 5,
      seats: 5,
      fiscalPower: 8,
      purchasePrice: 280000,
      targetSalePrice: 325000,
      minSalePrice: 315000,
      location: park?.name || 'Parc Principal Casablanca',
      parkId: park?.id || null,
      isBulkImport: true,
      status: 'IN_STOCK',
      statusHistory: {
        create: {
          oldStatus: 'NONE',
          newStatus: 'IN_STOCK',
          reason: 'Import groupé via fichier Excel (.xsl / .xlsx)',
          changedBy: 'Super Admin',
        },
      },
    },
  })

  await prisma.purchase.create({
    data: {
      code: `ACH-${currentYear}-BULK01`,
      vehicleId: vehicle.id,
      purchasePrice: 280000,
      status: 'CONFIRMED',
      paymentMethod: 'VIREMENT',
      notes: "Dossier d'achat initié automatiquement lors de l'import groupé Excel",
      hasCommissioner: null,
    },
  })

  console.log('Successfully created test bulk import vehicle:', vehicle.code)
}

main().finally(() => prisma.$disconnect())
