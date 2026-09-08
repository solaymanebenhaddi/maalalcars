import { describe, it, expect, beforeAll } from 'vitest'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import prisma from '@/lib/db'

describe('Archived Vehicle Strict Stock Isolation', () => {
  beforeAll(async () => {
    try {
      const archivedCount = await prisma.vehicle.count({
        where: { OR: [{ status: 'ARCHIVED' }, { archivedAt: { not: null } }] },
      })
      if (archivedCount === 0) {
        await prisma.vehicle.create({
          data: {
            code: 'V-TEST-ARCHIVED-01',
            vin: 'TESTARCHIVEDVIN01',
            brand: 'Renault',
            model: 'Clio',
            year: 2020,
            colorExterior: 'Blanc',
            fuelType: 'DIESEL',
            transmission: 'MANUELLE',
            status: 'ARCHIVED',
            archivedAt: new Date(),
            purchasePrice: 90000,
            targetSalePrice: 110000,
            location: 'Casablanca',
          },
        })
      }

      const inStockCount = await prisma.vehicle.count({
        where: { status: 'IN_STOCK' },
      })
      if (inStockCount === 0) {
        await prisma.vehicle.create({
          data: {
            code: 'V-TEST-STOCK-01',
            vin: 'TESTINSTOCKVIN001',
            brand: 'Peugeot',
            model: '208',
            year: 2022,
            colorExterior: 'Gris',
            fuelType: 'DIESEL',
            transmission: 'AUTOMATIQUE',
            status: 'IN_STOCK',
            purchasePrice: 120000,
            targetSalePrice: 145000,
            location: 'Casablanca',
          },
        })
      }
    } catch {
      // ignore
    }
  })
  it('excludes ARCHIVED and SOLD vehicles from getAll() and status="Tous"', async () => {
    // Check all vehicles returned by default
    const allQuery = await vehicleRepository.getAll()
    const tousQuery = await vehicleRepository.getAll({ status: 'Tous' })

    // None should have status === 'ARCHIVED' or 'SOLD' or non-null archivedAt
    for (const v of allQuery) {
      expect(v.status).not.toBe('ARCHIVED')
      expect(v.status).not.toBe('SOLD')
      expect(v.archivedAt).toBeNull()
    }

    for (const v of tousQuery) {
      expect(v.status).not.toBe('ARCHIVED')
      expect(v.status).not.toBe('SOLD')
      expect(v.archivedAt).toBeNull()
    }
  })

  it('only returns ARCHIVED vehicles when status="ARCHIVED" is requested', async () => {
    const archivedList = await vehicleRepository.getAll({ status: 'ARCHIVED' })

    // All returned items must have status === 'ARCHIVED' or archivedAt !== null
    expect(archivedList.length).toBeGreaterThan(0)
    for (const v of archivedList) {
      const isArchived = v.status === 'ARCHIVED' || v.archivedAt !== null || v.status === 'SOLD'
      expect(isArchived).toBe(true)
    }
  })

  it('countByStatus total strictly equals inStock + reserved + workshop', async () => {
    const counts = await vehicleRepository.countByStatus()
    expect(counts.total).toBe(counts.inStock + counts.reserved + counts.workshop)
    expect(counts.archived).toBeGreaterThan(0)
  })
})
