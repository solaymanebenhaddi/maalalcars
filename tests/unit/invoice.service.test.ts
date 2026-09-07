import { describe, it, expect } from 'vitest'
import { calculateMoroccanTax, extractHTFromTTC } from '@/domain/financial'
import { financialService } from '@/services/financial.service'

describe('Invoice & Moroccan TVA Calculations', () => {
  describe('calculateMoroccanTax (20% TVA)', () => {
    it('should compute exact 20% TVA on HT amount', () => {
      const { amountHT, taxAmount, amountTTC } = calculateMoroccanTax(100000, 20.0)
      expect(amountHT).toBe(100000)
      expect(taxAmount).toBe(20000)
      expect(amountTTC).toBe(120000)
    })

    it('should handle fractional decimal values without drift', () => {
      const { amountHT, taxAmount, amountTTC } = calculateMoroccanTax(1545.5, 20.0)
      expect(amountHT).toBe(1545.5)
      expect(taxAmount).toBe(309.1)
      expect(amountTTC).toBe(1854.6)
    })
  })

  describe('extractHTFromTTC', () => {
    it('should accurately decompose TTC into HT and 20% TVA', () => {
      const { amountHT, taxAmount, amountTTC } = extractHTFromTTC(120000, 20.0)
      expect(amountHT).toBe(100000)
      expect(taxAmount).toBe(20000)
      expect(amountTTC).toBe(120000)
    })
  })

  describe('calculateInvoiceTotals with multi-lines', () => {
    it('should sum multiple line items with corresponding tax rates', () => {
      const result = financialService.calculateInvoiceTotals({
        lines: [
          { description: 'Véhicule Audi A4', unitPriceHT: 250000, quantity: 1, taxRate: 20 },
          { description: 'Frais de dossier & immatriculation', unitPriceHT: 3500, quantity: 1, taxRate: 20 },
          { description: 'Pack Accessoires', unitPriceHT: 1200, quantity: 2, taxRate: 20 },
        ],
      })

      // Subtotal = 250000 + 3500 + 2400 = 255900
      // Tax (20%) = 51180
      // Total TTC = 307080
      expect(result.subtotalHT).toBe(255900)
      expect(result.taxAmount).toBe(51180)
      expect(result.totalTTC).toBe(307080)
    })
  })
})
