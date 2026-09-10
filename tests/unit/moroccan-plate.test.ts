import { describe, it, expect } from 'vitest'
import {
  parseMatricule,
  normalizeSeriesLetter,
  MOROCCAN_PREFECTURE_CODES,
  MOROCCAN_SERIES_LETTERS,
} from '@/components/ui/moroccan-plate-input'

describe('Moroccan License Plate Helper', () => {
  describe('parseMatricule', () => {
    it('should parse standard Moroccan plate with dividers', () => {
      const parsed = parseMatricule('12345 | A | 6')
      expect(parsed.isWW).toBe(false)
      expect(parsed.part1).toBe('12345')
      expect(parsed.part2).toBe('A')
      expect(parsed.part3).toBe('6')
    })

    it('should parse hyphen-separated format', () => {
      const parsed = parseMatricule('54321-B-14')
      expect(parsed.isWW).toBe(false)
      expect(parsed.part1).toBe('54321')
      expect(parsed.part2).toBe('B')
      expect(parsed.part3).toBe('14')
    })

    it('should parse space-separated format', () => {
      const parsed = parseMatricule('99999 D 26')
      expect(parsed.isWW).toBe(false)
      expect(parsed.part1).toBe('99999')
      expect(parsed.part2).toBe('D')
      expect(parsed.part3).toBe('26')
    })

    it('should parse and normalize Arabic series letters', () => {
      const parsed = parseMatricule('12345 | أ | 6')
      expect(parsed.isWW).toBe(false)
      expect(parsed.part1).toBe('12345')
      expect(parsed.part2).toBe('A')
      expect(parsed.part3).toBe('6')

      const parsedFes = parseMatricule('8888 | ب | 14')
      expect(parsedFes.part1).toBe('8888')
      expect(parsedFes.part2).toBe('B')
      expect(parsedFes.part3).toBe('14')
    })

    it('should parse WW transit plates', () => {
      const parsedWW = parseMatricule('WW-123456')
      expect(parsedWW.isWW).toBe(true)
      expect(parsedWW.part1).toBe('123456')
      expect(parsedWW.part2).toBe('WW')

      const parsedWWSpace = parseMatricule('WW 654321')
      expect(parsedWWSpace.isWW).toBe(true)
      expect(parsedWWSpace.part1).toBe('654321')
    })

    it('should handle empty or null values gracefully', () => {
      const parsedEmpty = parseMatricule('')
      expect(parsedEmpty.isWW).toBe(false)
      expect(parsedEmpty.part1).toBe('')
      expect(parsedEmpty.part3).toBe('')

      const parsedNull = parseMatricule(null)
      expect(parsedNull.part1).toBe('')
      expect(parsedNull.part3).toBe('')
    })
  })

  describe('normalizeSeriesLetter', () => {
    it('should map Arabic letters to Latin series codes', () => {
      expect(normalizeSeriesLetter('أ')).toBe('A')
      expect(normalizeSeriesLetter('ب')).toBe('B')
      expect(normalizeSeriesLetter('د')).toBe('D')
      expect(normalizeSeriesLetter('و')).toBe('W')
      expect(normalizeSeriesLetter('هـ')).toBe('E')
    })

    it('should keep valid Latin series letters uppercase', () => {
      expect(normalizeSeriesLetter('a')).toBe('A')
      expect(normalizeSeriesLetter('b')).toBe('B')
      expect(normalizeSeriesLetter('ww')).toBe('WW')
    })
  })

  describe('Moroccan Prefecture & Series dictionaries', () => {
    it('should identify major Moroccan cities by prefecture code', () => {
      expect(MOROCCAN_PREFECTURE_CODES['6']).toContain('Casablanca')
      expect(MOROCCAN_PREFECTURE_CODES['14']).toContain('Fès')
      expect(MOROCCAN_PREFECTURE_CODES['26']).toContain('Marrakech')
      expect(MOROCCAN_PREFECTURE_CODES['40']).toContain('Tanger')
      expect(MOROCCAN_PREFECTURE_CODES['1']).toBe('Rabat')
      expect(MOROCCAN_PREFECTURE_CODES['33']).toContain('Agadir')
    })

    it('should contain all official series letters', () => {
      const codes = MOROCCAN_SERIES_LETTERS.map((s) => s.code)
      expect(codes).toContain('A')
      expect(codes).toContain('B')
      expect(codes).toContain('D')
      expect(codes).toContain('WW')
    })
  })
})
