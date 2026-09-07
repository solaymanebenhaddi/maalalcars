import { describe, it, expect } from 'vitest'
import { reservationCreateSchema, reservationStatuses } from '@/validation/reservation.schema'

describe('Reservation Snapshot & Validation Logic', () => {
  describe('reservationCreateSchema', () => {
    it('allows reservation creation using client snapshot (no CRM contactId)', () => {
      const input = {
        vehicleId: 'veh-001',
        clientName: 'Amine Bennani',
        clientPhone: '0661234567',
        clientCin: 'BE123456',
        clientAddress: 'Maarif, Casablanca',
        depositAmount: 10000,
        paymentMethod: 'ESPECES',
        expiryDate: new Date('2026-09-10'),
      }

      const parsed = reservationCreateSchema.parse(input)
      expect(parsed.vehicleId).toBe('veh-001')
      expect(parsed.clientName).toBe('Amine Bennani')
      expect(parsed.clientPhone).toBe('0661234567')
      expect(parsed.depositAmount).toBe(10000)
      expect(parsed.contactId).toBeUndefined()
    })

    it('allows reservation creation using contactId without snapshot', () => {
      const input = {
        vehicleId: 'veh-001',
        contactId: 'contact-123',
        depositAmount: 5000,
        expiryDate: new Date('2026-09-10'),
      }

      const parsed = reservationCreateSchema.parse(input)
      expect(parsed.contactId).toBe('contact-123')
      expect(parsed.depositAmount).toBe(5000)
    })

    it('throws error when neither contactId nor clientName is provided', () => {
      const input = {
        vehicleId: 'veh-001',
        depositAmount: 5000,
        expiryDate: new Date('2026-09-10'),
      }

      expect(() => reservationCreateSchema.parse(input)).toThrow(
        /Veuillez renseigner au moins un contact existant ou le nom du client/
      )
    })

    it('supports French MVP reservation statuses', () => {
      expect(reservationStatuses).toContain('ACTIVE')
      expect(reservationStatuses).toContain('EXPIREE')
      expect(reservationStatuses).toContain('ANNULEE')
      expect(reservationStatuses).toContain('CONVERTIE_EN_VENTE')
    })
  })
})
