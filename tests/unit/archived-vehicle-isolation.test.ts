import { describe, it, expect } from 'vitest'
import { vehicleRepository } from '@/repositories/vehicle.repository'

describe('Archived Vehicle Strict Stock Isolation', () => {
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
