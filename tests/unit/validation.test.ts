import { describe, it, expect } from 'vitest'
import {
  moroccanPhoneSchema,
  cinSchema,
  iceSchema,
  vehicleCreateSchema,
  contactCreateSchema,
} from '@/validation'

describe('Moroccan Validation Schemas', () => {
  describe('moroccanPhoneSchema', () => {
    it('should validate valid Moroccan mobile numbers', () => {
      expect(moroccanPhoneSchema.safeParse('0661234567').success).toBe(true)
      expect(moroccanPhoneSchema.safeParse('+212661234567').success).toBe(true)
      expect(moroccanPhoneSchema.safeParse('0701234567').success).toBe(true)
      expect(moroccanPhoneSchema.safeParse('0522123456').success).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(moroccanPhoneSchema.safeParse('0123456789').success).toBe(false)
      expect(moroccanPhoneSchema.safeParse('12345').success).toBe(false)
    })
  })

  describe('cinSchema', () => {
    it('should validate standard Moroccan CIN numbers', () => {
      expect(cinSchema.safeParse('BE123456').success).toBe(true)
      expect(cinSchema.safeParse('A123456').success).toBe(true)
      expect(cinSchema.safeParse('BK987654').success).toBe(true)
    })

    it('should reject invalid CIN formats', () => {
      expect(cinSchema.safeParse('12345678').success).toBe(false)
      expect(cinSchema.safeParse('ABC123456').success).toBe(false)
    })
  })

  describe('iceSchema', () => {
    it('should validate 15-digit Moroccan ICE numbers', () => {
      expect(iceSchema.safeParse('002345678000045').success).toBe(true)
    })

    it('should reject non-15 digit ICE numbers', () => {
      expect(iceSchema.safeParse('123456').success).toBe(false)
      expect(iceSchema.safeParse('00234567800004599').success).toBe(false)
    })
  })

  describe('vehicleCreateSchema', () => {
    it('should validate standard vehicle payload', () => {
      const payload = {
        vin: 'WAUZZZ8K9BA123456',
        brand: 'Audi',
        model: 'A4',
        bodyType: 'Berline',
        year: 2022,
        colorExterior: 'Noir Mythic',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 45000,
        purchasePrice: 280000,
        targetSalePrice: 320000,
      }
      const res = vehicleCreateSchema.safeParse(payload)
      expect(res.success).toBe(true)
    })

    it('should reject invalid VIN length', () => {
      const payload = {
        vin: 'SHORTVIN',
        brand: 'Audi',
        model: 'A4',
        year: 2022,
        colorExterior: 'Noir',
        fuelType: 'DIESEL',
        transmission: 'AUTOMATIQUE',
        mileage: 1000,
      }
      const res = vehicleCreateSchema.safeParse(payload)
      expect(res.success).toBe(false)
    })
  })

  describe('contactCreateSchema', () => {
    it('should require either lastName/firstName for individual or companyName for company', () => {
      const validIndiv = {
        type: 'INDIVIDUAL',
        role: 'BUYER',
        firstName: 'Karim',
        lastName: 'El Fassi',
        phone: '0661234567',
      }
      expect(contactCreateSchema.safeParse(validIndiv).success).toBe(true)

      const validComp = {
        type: 'COMPANY',
        role: 'CLIENT',
        companyName: 'Atlas Fleet SARL',
        phone: '0522123456',
        ice: '002345678000045',
      }
      expect(contactCreateSchema.safeParse(validComp).success).toBe(true)
    })
  })
})
