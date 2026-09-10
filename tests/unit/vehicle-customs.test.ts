import { describe, it, expect } from 'vitest'
import {
  vehicleCreateSchema,
  vehicleUpdateSchema,
  vehicleCustomsStatuses,
  vehicleFilterSchema,
} from '@/validation/vehicle.schema'

describe('Vehicle Customs & Origin Validation (Maroc vs Dédouanée)', () => {
  const basePayload = {
    vin: 'WAUZZZ8K9BA123456',
    brand: 'Audi',
    model: 'A4',
    bodyType: 'Berline',
    year: 2022,
    colorExterior: 'Noir Mythic',
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIQUE',
    mileage: 45000,
  }

  it('contains valid customs status enum values', () => {
    expect(vehicleCustomsStatuses).toContain('MAROC')
    expect(vehicleCustomsStatuses).toContain('DEDOUANEE')
    expect(vehicleCustomsStatuses.length).toBe(2)
  })

  it('defaults to MAROC when customsStatus is not explicitly provided', () => {
    const res = vehicleCreateSchema.safeParse(basePayload)
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.customsStatus).toBe('MAROC')
      expect(res.data.customsYear).toBeUndefined()
    }
  })

  it('validates DEDOUANEE with valid customsYear', () => {
    const res = vehicleCreateSchema.safeParse({
      ...basePayload,
      customsStatus: 'DEDOUANEE',
      customsYear: 2024,
    })
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.customsStatus).toBe('DEDOUANEE')
      expect(res.data.customsYear).toBe(2024)
    }
  })

  it('rejects invalid customsStatus value', () => {
    const res = vehicleCreateSchema.safeParse({
      ...basePayload,
      customsStatus: 'INCONNU_STATUS',
    })
    expect(res.success).toBe(false)
  })

  it('accepts filter query with customsStatus', () => {
    const filterMaroc = vehicleFilterSchema.safeParse({ customsStatus: 'MAROC' })
    expect(filterMaroc.success).toBe(true)

    const filterDedouanee = vehicleFilterSchema.safeParse({ customsStatus: 'DEDOUANEE' })
    expect(filterDedouanee.success).toBe(true)
  })

  it('validates partial vehicle updates including parkId, taxonomy, colors, and customs', () => {
    const updatePayload = {
      brand: 'Mercedes-Benz',
      model: 'Classe C',
      version: '220 d AMG Line',
      colorExterior: 'Gris Sélénite Métallisé',
      colorInterior: 'Cuir Nappa Rouge / Noir',
      parkId: 'PRK-CAS-01',
      customsStatus: 'DEDOUANEE',
      customsYear: 2023,
    }
    const res = vehicleUpdateSchema.safeParse(updatePayload)
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.brand).toBe('Mercedes-Benz')
      expect(res.data.version).toBe('220 d AMG Line')
      expect(res.data.parkId).toBe('PRK-CAS-01')
      expect(res.data.customsStatus).toBe('DEDOUANEE')
      expect(res.data.customsYear).toBe(2023)
    }
  })
})

