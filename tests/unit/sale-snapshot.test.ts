import { describe, it, expect } from 'vitest'
import { saleCreateSchema } from '@/validation/sale.schema'

describe('Sale Snapshot & Financial Input Validation', () => {
  describe('saleCreateSchema', () => {
    it('validates sale creation with buyer snapshot (no CRM contactId)', () => {
      const input = {
        vehicleId: 'veh-001',
        buyerName: 'Rachid El Amrani',
        buyerPhone: '0662345678',
        buyerCin: 'AB987654',
        buyerAddress: 'Gauthier, Casablanca',
        salePrice: 285000,
        advanceAmount: 15000,
        amountReceivedAtSale: 100000,
        paymentMethod: 'VIREMENT',
      }

      const parsed = saleCreateSchema.parse(input)
      expect(parsed.vehicleId).toBe('veh-001')
      expect(parsed.buyerName).toBe('Rachid El Amrani')
      expect(parsed.salePrice).toBe(285000)
      expect(parsed.advanceAmount).toBe(15000)
      expect(parsed.amountReceivedAtSale).toBe(100000)
      expect(parsed.buyerContactId).toBeUndefined()
    })

    it('validates sale creation with buyerContactId', () => {
      const input = {
        vehicleId: 'veh-001',
        buyerContactId: 'contact-buyer-1',
        salePrice: 195000,
      }

      const parsed = saleCreateSchema.parse(input)
      expect(parsed.buyerContactId).toBe('contact-buyer-1')
      expect(parsed.salePrice).toBe(195000)
    })

    it('throws error when neither buyerContactId nor buyerName is given', () => {
      const input = {
        vehicleId: 'veh-001',
        salePrice: 195000,
      }

      expect(() => saleCreateSchema.parse(input)).toThrow(
        /Veuillez renseigner au moins un acheteur existant ou le nom de l’acheteur/
      )
    })

    it('rejects zero or negative sale price', () => {
      const input = {
        vehicleId: 'veh-001',
        buyerName: 'Rachid',
        salePrice: 0,
      }

      expect(() => saleCreateSchema.parse(input)).toThrow(
        /Le prix de vente doit être supérieur à 0/
      )
    })
  })
})
