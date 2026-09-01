import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, generateSessionToken } from '@/lib/auth'

describe('Authentication Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('test-password')
      expect(hash).toBeDefined()
      expect(hash).not.toBe('test-password')
      expect(hash.startsWith('$2')).toBe(true)
    })

    it('should produce different hashes for the same password', async () => {
      const hash1 = await hashPassword('test-password')
      const hash2 = await hashPassword('test-password')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const hash = await hashPassword('correct-password')
      const result = await verifyPassword('correct-password', hash)
      expect(result).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const hash = await hashPassword('correct-password')
      const result = await verifyPassword('wrong-password', hash)
      expect(result).toBe(false)
    })
  })

  describe('generateSessionToken', () => {
    it('should generate a valid UUID token', () => {
      const token = generateSessionToken()
      expect(token).toBeDefined()
      expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique tokens', () => {
      const token1 = generateSessionToken()
      const token2 = generateSessionToken()
      expect(token1).not.toBe(token2)
    })
  })
})
