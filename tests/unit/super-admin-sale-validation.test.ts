import { describe, it, expect } from 'vitest'
import { isSuperAdminRole } from '@/lib/auth-roles'

describe('Super Admin Role Verification & Sale Validation Rules', () => {
  it('strictly validates that ONLY Super Admin role is recognized', () => {
    // Super Admin variants
    expect(isSuperAdminRole('Super Admin')).toBe(true)
    expect(isSuperAdminRole('super admin')).toBe(true)
    expect(isSuperAdminRole('SUPER_ADMIN')).toBe(true)
    expect(isSuperAdminRole('super_admin')).toBe(true)
    expect(isSuperAdminRole('superadmin')).toBe(true)

    // Other roles MUST be rejected per user rule ("only use super admin")
    expect(isSuperAdminRole('Vendeur')).toBe(false)
    expect(isSuperAdminRole('Commercial')).toBe(false)
    expect(isSuperAdminRole('Gestionnaire')).toBe(false)
    expect(isSuperAdminRole('Comptable')).toBe(false)
    expect(isSuperAdminRole('Assistante')).toBe(false)
    expect(isSuperAdminRole('user')).toBe(false)
    expect(isSuperAdminRole('Administrateur')).toBe(false)
    expect(isSuperAdminRole('admin')).toBe(false)
    expect(isSuperAdminRole(null)).toBe(false)
    expect(isSuperAdminRole(undefined)).toBe(false)
    expect(isSuperAdminRole('')).toBe(false)
  })
})
