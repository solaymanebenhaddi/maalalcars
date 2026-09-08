import { describe, it, expect } from 'vitest'
import { canTransitionVehicleStatus, calculateStockAgeDays, categorizeStockAging } from '@/domain/vehicle'
import { financialService } from '@/services/financial.service'

describe('Vehicle Domain & Service Logic', () => {
  describe('canTransitionVehicleStatus', () => {
    it('should allow valid transitions', () => {
      expect(canTransitionVehicleStatus('IN_STOCK', 'RESERVED')).toBe(true)
      expect(canTransitionVehicleStatus('IN_STOCK', 'WORKSHOP')).toBe(true)
      expect(canTransitionVehicleStatus('RESERVED', 'SOLD')).toBe(true)
      expect(canTransitionVehicleStatus('WORKSHOP', 'IN_STOCK')).toBe(true)
    })

    it('should disallow invalid transitions', () => {
      expect(canTransitionVehicleStatus('SOLD', 'RESERVED')).toBe(false)
      expect(canTransitionVehicleStatus('SOLD', 'IN_STOCK')).toBe(false)
    })
  })

  describe('Stock Aging', () => {
    it('should correctly calculate days in stock', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      const days = calculateStockAgeDays(tenDaysAgo)
      expect(days).toBe(10)
    })

    it('should categorize age buckets accurately', () => {
      expect(categorizeStockAging(15)).toBe('UNDER_30')
      expect(categorizeStockAging(45)).toBe('BETWEEN_31_60')
      expect(categorizeStockAging(75)).toBe('BETWEEN_61_90')
      expect(categorizeStockAging(120)).toBe('OVER_90')
    })
  })

  describe('Financial Service Vehicle Rollup', () => {
    it('should calculate complete vehicle cost with expenses and commissions', () => {
      const cost = financialService.calculateTotalVehicleCost({
        purchasePrice: 200000,
        purchaseCommission: 5000,
        expensesTotalTTC: 12000,
        saleCommission: 3000,
      })
      expect(cost).toBe(220000)
    })
  })

  describe('Archived Vehicles & Stock Visibility Invariants', () => {
    it('ensures ARCHIVED vehicles cannot transition to WORKSHOP or RESERVED', () => {
      expect(canTransitionVehicleStatus('ARCHIVED', 'WORKSHOP')).toBe(false)
      expect(canTransitionVehicleStatus('ARCHIVED', 'RESERVED')).toBe(false)
      expect(canTransitionVehicleStatus('ARCHIVED', 'SOLD')).toBe(false)
    })

    it('allows restoring ARCHIVED vehicle only back to IN_STOCK', () => {
      expect(canTransitionVehicleStatus('ARCHIVED', 'IN_STOCK')).toBe(true)
    })
  })
})
