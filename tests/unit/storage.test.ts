import { describe, it, expect } from 'vitest'
import { sanitizeFilename, generateStoragePath } from '@/lib/storage'

describe('Storage Utilities', () => {
  describe('sanitizeFilename', () => {
    it('should remove path traversal sequences', () => {
      expect(sanitizeFilename('../../../etc/passwd')).not.toContain('..')
      expect(sanitizeFilename('..\\..\\windows\\system32')).not.toContain('..')
    })

    it('should handle normal filenames', () => {
      const result = sanitizeFilename('photo.jpg')
      expect(result).toContain('photo')
      expect(result).toContain('.jpg')
    })

    it('should handle filenames with spaces', () => {
      const result = sanitizeFilename('my document.pdf')
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return a UUID fallback for empty filenames', () => {
      const result = sanitizeFilename('')
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      // Implementation falls back to a UUID when nothing usable remains
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })
  })

  describe('generateStoragePath', () => {
    it('should generate a path within the correct category', () => {
      const result = generateStoragePath('vehicles', 'car-photo.jpg')
      expect(result.relativePath).toContain('vehicles')
      expect(result.safeFilename).toContain('.jpg')
    })

    it('should generate unique paths for the same filename', () => {
      const result1 = generateStoragePath('documents', 'contract.pdf')
      const result2 = generateStoragePath('documents', 'contract.pdf')
      expect(result1.relativePath).not.toBe(result2.relativePath)
    })
  })
})
