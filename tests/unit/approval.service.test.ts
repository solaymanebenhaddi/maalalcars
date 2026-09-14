import { describe, it, expect } from 'vitest'
import {
  generateRequestNumber,
  computeFieldDiff,
  detectEntityConflict,
} from '@/domain/approval'
import {
  rejectRequestSchema,
  createApprovalRequestSchema,
} from '@/validation/approval.schema'
import { isSuperAdminRole } from '@/lib/auth-roles'

describe('Approval Domain & Logic Unit Tests', () => {
  describe('Sequence Generation & Formatting', () => {
    it('generates properly padded Moroccan request sequence numbers', () => {
      expect(generateRequestNumber(1, 2026)).toBe('REQ-2026-00001')
      expect(generateRequestNumber(42, 2026)).toBe('REQ-2026-00042')
      expect(generateRequestNumber(1523, 2026)).toBe('REQ-2026-01523')
      expect(generateRequestNumber(99999, 2026)).toBe('REQ-2026-99999')
    })
  })

  describe('Field Diff Computation', () => {
    it('accurately computes modified fields and ignores technical timestamps', () => {
      const before = {
        id: 'veh_123',
        brand: 'BMW',
        model: 'X5',
        targetSalePrice: 450000,
        mileage: 68000,
        colorExterior: 'Noir',
        updatedAt: '2026-09-01T10:00:00Z',
      }

      const after = {
        id: 'veh_123',
        brand: 'BMW',
        model: 'X5',
        targetSalePrice: 465000,
        mileage: 69250,
        colorExterior: 'Noir',
        updatedAt: '2026-09-13T10:00:00Z',
      }

      const diffs = computeFieldDiff(before, after)

      expect(diffs).toHaveLength(2)
      expect(diffs.find((d) => d.key === 'targetSalePrice')).toEqual({
        key: 'targetSalePrice',
        label: 'Prix de vente cible',
        before: 450000,
        after: 465000,
      })
      expect(diffs.find((d) => d.key === 'mileage')).toEqual({
        key: 'mileage',
        label: 'Kilométrage',
        before: 68000,
        after: 69250,
      })
      // Ignored technical keys should not be in diffs
      expect(diffs.find((d) => d.key === 'id')).toBeUndefined()
      expect(diffs.find((d) => d.key === 'updatedAt')).toBeUndefined()
    })
  })

  describe('Conflict Detection', () => {
    it('detects concurrent modifications between initial snapshot and current DB state', () => {
      // User A requested changing targetSalePrice from 450k to 465k
      const beforeSnapshot = {
        targetSalePrice: 450000,
        mileage: 68000,
      }
      const requestedChanges = {
        targetSalePrice: 465000,
      }

      // But Super Admin or someone else in the meantime changed price to 470k
      const currentEntityInDb = {
        targetSalePrice: 470000,
        mileage: 68000,
      }

      const conflictResult = detectEntityConflict({
        beforeSnapshot,
        currentEntity: currentEntityInDb,
        requestedChanges,
      })

      expect(conflictResult.hasConflict).toBe(true)
      expect(conflictResult.conflictFields).toHaveLength(1)
      expect(conflictResult.conflictFields[0]).toEqual({
        field: 'targetSalePrice',
        initialValue: 450000,
        currentValue: 470000,
        requestedValue: 465000,
      })
    })

    it('returns no conflict when current entity matches beforeSnapshot', () => {
      const beforeSnapshot = { targetSalePrice: 450000 }
      const currentEntityInDb = { targetSalePrice: 450000 }
      const requestedChanges = { targetSalePrice: 465000 }

      const conflictResult = detectEntityConflict({
        beforeSnapshot,
        currentEntity: currentEntityInDb,
        requestedChanges,
      })

      expect(conflictResult.hasConflict).toBe(false)
      expect(conflictResult.conflictFields).toHaveLength(0)
    })
  })

  describe('Validation & Authorization Rules', () => {
    it('strictly requires a rejection reason of at least 5 characters', () => {
      // Valid rejection reason
      const valid = rejectRequestSchema.safeParse({
        requestId: 'req_123',
        rejectionReason: "Prix d'achat excessif",
      })
      expect(valid.success).toBe(true)

      // Missing reason
      const empty = rejectRequestSchema.safeParse({
        requestId: 'req_123',
        rejectionReason: '',
      })
      expect(empty.success).toBe(false)

      // Reason too short (< 5 chars)
      const short = rejectRequestSchema.safeParse({
        requestId: 'req_123',
        rejectionReason: 'Non',
      })
      expect(short.success).toBe(false)
    })

    it('validates creation of approval requests with supported action types', () => {
      const valid = createApprovalRequestSchema.safeParse({
        actionType: 'PRICE_CHANGE',
        entityType: 'Vehicle',
        entityId: 'veh_123',
        entityLabel: 'BMW X5 2022',
        requestedData: { targetSalePrice: 465000 },
        reason: 'Négociation client',
      })
      expect(valid.success).toBe(true)

      // Invalid action type
      const invalid = createApprovalRequestSchema.safeParse({
        actionType: 'UNKNOWN_ACTION',
        entityType: 'Vehicle',
        requestedData: {},
      })
      expect(invalid.success).toBe(false)
    })

    it('confirms Super Admin role authorization boundary', () => {
      expect(isSuperAdminRole('Super Admin')).toBe(true)
      expect(isSuperAdminRole('Vendeur')).toBe(false)
      expect(isSuperAdminRole('Gestionnaire')).toBe(false)
      expect(isSuperAdminRole('Comptable')).toBe(false)
    })
  })
})
