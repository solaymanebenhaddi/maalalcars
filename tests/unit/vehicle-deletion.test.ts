import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { vehicleService } from '@/services/vehicle.service'
import prisma from '@/lib/db'

describe('Vehicle Deletion & Soft-Archive Safety', () => {
  let standaloneVehicleId: string
  const bulkVehicleIds: string[] = []

  beforeAll(async () => {
    // 1. Create a standalone test vehicle with no relations
    const v1 = await prisma.vehicle.create({
      data: {
        code: 'TEST-DEL-0001',
        vin: 'TESTDELVIN0000001',
        brand: 'Renault',
        model: 'Clio Test',
        bodyType: 'Citadine',
        year: 2022,
        colorExterior: 'Blanc',
        fuelType: 'ESSENCE',
        transmission: 'MANUELLE',
        mileage: 25000,
        purchasePrice: 90000,
        targetSalePrice: 110000,
        status: 'IN_STOCK',
      },
    })
    standaloneVehicleId = v1.id

    // 2. Create 3 test vehicles for bulk deletion
    for (let i = 2; i <= 4; i++) {
      const v = await prisma.vehicle.create({
        data: {
          code: `TEST-DEL-000${i}`,
          vin: `TESTDELVIN000000${i}`,
          brand: 'Dacia',
          model: `Sandero Test ${i}`,
          bodyType: 'Citadine',
          year: 2021,
          colorExterior: 'Gris',
          fuelType: 'DIESEL',
          transmission: 'MANUELLE',
          mileage: 40000,
          purchasePrice: 85000,
          targetSalePrice: 99000,
          status: 'IN_STOCK',
        },
      })
      bulkVehicleIds.push(v.id)
    }
  })

  afterAll(async () => {
    // Cleanup any lingering test records
    await prisma.vehicle.deleteMany({
      where: {
        code: { startsWith: 'TEST-DEL-' },
      },
    })
  })

  it('permanently deletes a vehicle without commercial or workshop records', async () => {
    const result = await vehicleService.deleteVehicle(standaloneVehicleId)
    expect(result.deleted).toBe(true)
    expect(result.archived).toBe(false)

    // Check it no longer exists in DB
    const found = await prisma.vehicle.findUnique({ where: { id: standaloneVehicleId } })
    expect(found).toBeNull()
  })

  it('bulk deletes multiple vehicles in a single operation', async () => {
    const result = await vehicleService.deleteMultipleVehicles(bulkVehicleIds)
    expect(result.total).toBe(bulkVehicleIds.length)
    expect(result.deletedCount).toBe(bulkVehicleIds.length)
    expect(result.archivedCount).toBe(0)

    // Check none exist in DB
    const remaining = await prisma.vehicle.findMany({
      where: { id: { in: bulkVehicleIds } },
    })
    expect(remaining.length).toBe(0)
  })

  it('safely archives a vehicle that has associated repairs or sales instead of hard deleting it', async () => {
    // Create a vehicle with a repair
    const vWithRepair = await prisma.vehicle.create({
      data: {
        code: 'TEST-DEL-REPAIR',
        vin: 'TESTDELVINREPAIR1',
        brand: 'Peugeot',
        model: '208 Test',
        bodyType: 'Citadine',
        year: 2023,
        colorExterior: 'Noir',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 15000,
        purchasePrice: 130000,
        targetSalePrice: 150000,
        status: 'WORKSHOP',
      },
    })

    // Add a repair record
    await prisma.repair.create({
      data: {
        code: 'REP-TEST-DEL-01',
        vehicleId: vWithRepair.id,
        repairType: 'ENTRETIEN',
        description: 'Vidange de test',
        status: 'EN_COURS',
      },
    })

    // Attempt to delete it
    const result = await vehicleService.deleteVehicle(vWithRepair.id)

    // It should NOT hard delete, but safely archive
    expect(result.deleted).toBe(false)
    expect(result.archived).toBe(true)

    // Verify it is preserved in DB as ARCHIVED
    const archivedVehicle = await prisma.vehicle.findUnique({ where: { id: vWithRepair.id } })
    expect(archivedVehicle).toBeDefined()
    expect(archivedVehicle?.status).toBe('ARCHIVED')
    expect(archivedVehicle?.archivedAt).not.toBeNull()

    // Cleanup
    await prisma.repair.deleteMany({ where: { vehicleId: vWithRepair.id } })
    await prisma.archiveRecord.deleteMany({ where: { entityId: vWithRepair.id } })
    await prisma.vehicle.delete({ where: { id: vWithRepair.id } })
  })
})
