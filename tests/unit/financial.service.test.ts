import { describe, it, expect } from 'vitest'
import { financialService } from '@/services/financial.service'

describe('Financial Service — Rules & Precision Calculations', () => {
  describe('formatMAD', () => {
    it('should format numbers with DH and Moroccan thousand separators', () => {
      expect(financialService.formatMAD(285000)).toBe('285 000 DH')
      expect(financialService.formatMAD(410500.5)).toBe('410 500,50 DH')
      expect(financialService.formatMAD(0)).toBe('0 DH')
      expect(financialService.formatMAD(null)).toBe('0 DH')
      expect(financialService.formatMAD(undefined)).toBe('0 DH')
    })
  })

  describe('calculateTotalVehicleCost', () => {
    it('should calculate complete vehicle cost accurately: purchase + purchase commission + expenses + sale commission', () => {
      const cost = financialService.calculateTotalVehicleCost({
        purchasePrice: 340000,
        purchaseCommission: 5000,
        expensesTotalTTC: 6000,
        saleCommission: 4000,
      })
      expect(cost).toBe(355000)
    })
  })

  describe('calculateProfitAndMargin', () => {
    it('should compute net profit and net margin percentage correctly', () => {
      const { netProfit, marginPercent } = financialService.calculateProfitAndMargin({
        salePrice: 410000,
        totalVehicleCost: 355000,
      })
      expect(netProfit).toBe(55000)
      expect(marginPercent).toBe(13.41)
    })

    it('should handle zero sale price safely without division by zero', () => {
      const { netProfit, marginPercent } = financialService.calculateProfitAndMargin({
        salePrice: 0,
        totalVehicleCost: 100000,
      })
      expect(netProfit).toBe(-100000)
      expect(marginPercent).toBe(0)
    })
  })

  describe('calculateOutstandingBalance', () => {
    it('should calculate unpaid balance accurately and not return negative values', () => {
      expect(
        financialService.calculateOutstandingBalance({
          totalAmount: 410000,
          paymentsReceived: 385100,
        })
      ).toBe(24900)

      expect(
        financialService.calculateOutstandingBalance({
          totalAmount: 410000,
          paymentsReceived: 410000,
        })
      ).toBe(0)

      expect(
        financialService.calculateOutstandingBalance({
          totalAmount: 410000,
          paymentsReceived: 450000,
        })
      ).toBe(0)
    })
  })

  describe('calculateInvoiceTotals', () => {
    it('should calculate Moroccan 20% VAT and totals precisely', () => {
      const { subtotalHT, taxAmount, totalTTC } = financialService.calculateInvoiceTotals({
        lines: [
          { unitPriceHT: 10000, quantity: 2, taxRate: 20 },
          { unitPriceHT: 5000, quantity: 1, taxRate: 20 },
        ],
      })
      expect(subtotalHT).toBe(25000)
      expect(taxAmount).toBe(5000)
      expect(totalTTC).toBe(30000)
    })
  })

  describe('getStockAgingBucket', () => {
    it('should categorize stock days into correct aging brackets', () => {
      expect(financialService.getStockAgingBucket(12)).toBe('0-30')
      expect(financialService.getStockAgingBucket(30)).toBe('0-30')
      expect(financialService.getStockAgingBucket(45)).toBe('31-60')
      expect(financialService.getStockAgingBucket(75)).toBe('61-90')
      expect(financialService.getStockAgingBucket(105)).toBe('+90')
    })
  })
})
