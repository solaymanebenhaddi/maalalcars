import { describe, it, expect } from 'vitest'
import { repairCreateSchema, repairCompleteSchema, repairTypes } from '@/validation/repair.schema'

describe('Repair Validation & Service Rules', () => {
  describe('repairCreateSchema', () => {
    it('validates a valid repair creation input', () => {
      const input = {
        vehicleId: 'veh-123',
        repairType: 'MECANIQUE',
        garageName: 'Garage Atlas Auto',
        estimatedAmount: 3500,
        description: 'Changement kit embrayage',
      }
      const parsed = repairCreateSchema.parse(input)
      expect(parsed.vehicleId).toBe('veh-123')
      expect(parsed.repairType).toBe('MECANIQUE')
      expect(parsed.estimatedAmount).toBe(3500)
    })

    it('requires vehicleId and repairType', () => {
      expect(() => repairCreateSchema.parse({})).toThrow()
      expect(() => repairCreateSchema.parse({ vehicleId: 'veh-123' })).toThrow()
      expect(() => repairCreateSchema.parse({ repairType: 'MECANIQUE' })).toThrow()
    })
  })

  describe('repairCompleteSchema', () => {
    it('validates completion with final amount and optional paidById', () => {
      const input = {
        finalAmount: 4200,
        paidById: 'user-admin',
        notes: 'Travaux terminés avec succès',
      }
      const parsed = repairCompleteSchema.parse(input)
      expect(parsed.finalAmount).toBe(4200)
      expect(parsed.paidById).toBe('user-admin')
    })

    it('rejects negative final amount', () => {
      expect(() => repairCompleteSchema.parse({ finalAmount: -500 })).toThrow()
    })
  })

  describe('repairTypes', () => {
    it('contains all essential automotive repair categories', () => {
      expect(repairTypes).toContain('MECANIQUE')
      expect(repairTypes).toContain('CARROSSERIE')
      expect(repairTypes).toContain('ELECTRICITE')
      expect(repairTypes).toContain('PNEUMATIQUES')
      expect(repairTypes).toContain('ENTRETIEN')
    })
  })

  describe('repairUpdateSchema', () => {
    it('validates partial updates on repair details and amounts', async () => {
      const { repairUpdateSchema } = await import('@/validation/repair.schema')
      const validUpdate = {
        garageName: 'Garage Hassan Sport',
        estimatedAmount: 5000,
        description: 'Changement plaquettes et disques de frein',
        notes: 'Commande urgente reçue',
      }
      const parsed = repairUpdateSchema.parse(validUpdate)
      expect(parsed.garageName).toBe('Garage Hassan Sport')
      expect(parsed.estimatedAmount).toBe(5000)
      expect(parsed.description).toContain('plaquettes')
    })
  })
})

