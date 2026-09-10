import { describe, it, expect } from 'vitest'
import { parkRepository } from '@/repositories/park.repository'

describe('Parks Multi-Site Management (Casablanca & Fès)', () => {
  it('loads active parks including the 3 designated sites', async () => {
    const parks = await parkRepository.getAll()

    expect(parks.length).toBeGreaterThanOrEqual(3)

    const casablancaPark = parks.find((p) => p.code === 'PRK-CAS-01')
    expect(casablancaPark).toBeDefined()
    expect(casablancaPark?.name).toBe('Park Casablanca Secteur Car')
    expect(casablancaPark?.city).toBe('Casablanca')
    expect(casablancaPark?.address).toBeTruthy()
    expect(casablancaPark?.address.length).toBeGreaterThan(5)

    const fesAtlasPark = parks.find((p) => p.code === 'PRK-FES-01')
    expect(fesAtlasPark).toBeDefined()
    expect(fesAtlasPark?.name).toBe('Park Fes Maalal Cars Atlas')
    expect(fesAtlasPark?.city).toBe('Fès')
    expect(fesAtlasPark?.address).toBeTruthy()
    expect(fesAtlasPark?.address.length).toBeGreaterThan(5)

    const fesEnnargissPark = parks.find((p) => p.code === 'PRK-FES-02')
    expect(fesEnnargissPark).toBeDefined()
    expect(fesEnnargissPark?.name).toBe('Park Fes Maalal Cars Ennargiss')
    expect(fesEnnargissPark?.city).toBe('Fès')
    expect(fesEnnargissPark?.address).toBeTruthy()
    expect(fesEnnargissPark?.address.length).toBeGreaterThan(5)
  })

  it('strictly enforces mandatory address on all active parks', async () => {
    const parks = await parkRepository.getAll()

    for (const park of parks) {
      expect(park.address).toBeDefined()
      expect(typeof park.address).toBe('string')
      expect(park.address.trim().length).toBeGreaterThan(0)
    }
  })

  it('computes occupancy and capacity correctly', async () => {
    const parks = await parkRepository.getAll()

    for (const park of parks) {
      expect(park.capacity).toBeGreaterThan(0)
      expect(park.capacity).toBeLessThanOrEqual(1000)
      expect(park.occupancyRate).toBeGreaterThanOrEqual(0)
      expect(typeof park.occupancyRate).toBe('number')
      expect(park.totalVehicles).toBeGreaterThanOrEqual(0)
    }
  })

  it('strictly limits park capacity to a maximum of 1000 in schema validation', async () => {
    const { parkCapacitySchema, parkCreateSchema } = await import('@/validation/park.schema')

    // Valid capacities
    expect(parkCapacitySchema.safeParse(1).success).toBe(true)
    expect(parkCapacitySchema.safeParse(50).success).toBe(true)
    expect(parkCapacitySchema.safeParse(1000).success).toBe(true)

    // Invalid capacities (> 1000 or < 1)
    const overLimit = parkCapacitySchema.safeParse(1001)
    expect(overLimit.success).toBe(false)
    if (!overLimit.success) {
      expect(overLimit.error.issues[0].message).toContain('1000')
    }

    const underLimit = parkCapacitySchema.safeParse(0)
    expect(underLimit.success).toBe(false)

    // Form schema validation with capacity > 1000
    const invalidForm = parkCreateSchema.safeParse({
      name: 'Test Grand Parc',
      city: 'Casablanca',
      address: 'Route de Nouaceur',
      capacity: 1500,
    })
    expect(invalidForm.success).toBe(false)
    if (!invalidForm.success) {
      expect(invalidForm.error.issues.some((e) => e.message.includes('1000'))).toBe(true)
    }

    // Form schema validation with valid capacity <= 1000
    const validForm = parkCreateSchema.safeParse({
      name: 'Test Grand Parc',
      city: 'Casablanca',
      address: 'Route de Nouaceur',
      capacity: 1000,
    })
    expect(validForm.success).toBe(true)
  })
})

