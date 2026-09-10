import { describe, it, expect } from 'vitest'
import { canTransitionSaleStatus, requiresManagerDiscountApproval } from '@/domain/sale'
import { computeLiveSaleMargin } from '@/features/sales'

describe('Sale Domain & Live Computation Logic', () => {
  describe('canTransitionSaleStatus', () => {
    it('should allow valid sale workflow progression', () => {
      expect(canTransitionSaleStatus('NEW', 'NEGOTIATION')).toBe(true)
      expect(canTransitionSaleStatus('NEGOTIATION', 'CONFIRMED')).toBe(true)
      expect(canTransitionSaleStatus('CONFIRMED', 'DELIVERED')).toBe(true)
      expect(canTransitionSaleStatus('CONFIRMED', 'CANCELLED')).toBe(true)
    })

    it('should disallow reverting delivered sales', () => {
      expect(canTransitionSaleStatus('DELIVERED', 'NEW')).toBe(false)
      expect(canTransitionSaleStatus('DELIVERED', 'CANCELLED')).toBe(false)
    })
  })

  describe('requiresManagerDiscountApproval', () => {
    it('should flag discounts exceeding standard threshold (> 5%)', () => {
      const targetPrice = 300000
      const smallDiscount = 10000 // 3.33% -> False
      const largeDiscount = 25000 // 8.33% -> True

      expect(requiresManagerDiscountApproval(targetPrice, smallDiscount, 5.0)).toBe(false)
      expect(requiresManagerDiscountApproval(targetPrice, largeDiscount, 5.0)).toBe(true)
    })
  })

  describe('computeLiveSaleMargin', () => {
    it('should compute live net profit and margin %', () => {
      const result = computeLiveSaleMargin({
        salePrice: 350000,
        purchasePrice: 280000,
        expenses: 15000,
        commission: 5000,
        discount: 10000,
      })

      // netSale = 340000
      // totalCost = 300000
      // netProfit = 40000
      // marginPercent = (40000 / 340000) * 100 = 11.76%
      expect(result.netSale).toBe(340000)
      expect(result.totalCost).toBe(300000)
      expect(result.netProfit).toBe(40000)
      expect(result.marginPercent).toBe(11.76)
    })
  })

  describe('saleUpdateSchema', () => {
    it('validates partial updates on sale parameters', async () => {
      const { saleUpdateSchema } = await import('@/validation/sale.schema')
      const updateData = {
        salePrice: 360000,
        advanceAmount: 50000,
        paymentMethod: 'VIREMENT',
        notes: 'Livraison prévue à domicile',
        buyerName: 'Rachid Bennani',
      }
      const parsed = saleUpdateSchema.parse(updateData)
      expect(parsed.salePrice).toBe(360000)
      expect(parsed.advanceAmount).toBe(50000)
      expect(parsed.paymentMethod).toBe('VIREMENT')
      expect(parsed.buyerName).toBe('Rachid Bennani')
    })
  })
})

