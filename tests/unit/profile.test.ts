import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: z.string().email('Adresse email invalide').optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
})

describe('Profile Validation & Password Verification', () => {
  it('validates correct profile data', () => {
    const validData = {
      name: 'Mohamed Maalal',
      email: 'mohamed@maalalcars.com',
      phone: '+212 6 11 22 33 44',
    }
    const result = updateProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
    }
    const result = updateProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 6 characters', () => {
    const invalidData = {
      newPassword: '123',
    }
    const result = updateProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('verifies updated password workflow', async () => {
    const originalPassword = 'OldPassword@2026'
    const newPassword = 'NewSecretPassword@99'

    const oldHash = await hashPassword(originalPassword)
    expect(await verifyPassword(originalPassword, oldHash)).toBe(true)
    expect(await verifyPassword('wrongPassword', oldHash)).toBe(false)

    // Password change
    const newHash = await hashPassword(newPassword)
    expect(await verifyPassword(newPassword, newHash)).toBe(true)
    expect(await verifyPassword(originalPassword, newHash)).toBe(false)
  })
})
