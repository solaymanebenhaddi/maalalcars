import { describe, it, expect } from 'vitest'
import { validateMoroccanCIN, validateMoroccanICE, formatMoroccanPhone, computeContactRiskRating } from '@/domain/contact'

describe('Contact Domain & Moroccan Identity Logic', () => {
  describe('validateMoroccanCIN', () => {
    it('should validate valid CIN numbers', () => {
      expect(validateMoroccanCIN('BE123456')).toBe(true)
      expect(validateMoroccanCIN('A123456')).toBe(true)
      expect(validateMoroccanCIN('bk123456')).toBe(true)
    })

    it('should reject invalid CIN', () => {
      expect(validateMoroccanCIN('12345')).toBe(false)
      expect(validateMoroccanCIN(null)).toBe(false)
    })
  })

  describe('validateMoroccanICE', () => {
    it('should validate 15-digit ICE', () => {
      expect(validateMoroccanICE('002345678000045')).toBe(true)
    })

    it('should reject incorrect length ICE', () => {
      expect(validateMoroccanICE('123456789')).toBe(false)
      expect(validateMoroccanICE('')).toBe(false)
    })
  })

  describe('formatMoroccanPhone', () => {
    it('should format national 06/07 numbers to E.164 +212', () => {
      expect(formatMoroccanPhone('0661234567')).toBe('+212661234567')
      expect(formatMoroccanPhone('0522123456')).toBe('+212522123456')
      expect(formatMoroccanPhone('00212661234567')).toBe('+212661234567')
    })
  })

  describe('computeContactRiskRating', () => {
    it('should evaluate credit risk rating based on debt vs volume', () => {
      expect(computeContactRiskRating(0, 500000)).toBe('LOW')
      expect(computeContactRiskRating(150000, 500000)).toBe('MEDIUM')
      expect(computeContactRiskRating(350000, 500000)).toBe('HIGH')
      expect(computeContactRiskRating(50000, 0)).toBe('HIGH')
    })
  })
})
