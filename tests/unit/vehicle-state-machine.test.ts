import { describe, it, expect } from 'vitest'
import { canTransitionVehicleStatus } from '@/domain/vehicle'

describe('Vehicle State Machine Domain Constraints', () => {
  describe('MVP Permitted Transitions', () => {
    it('allows EN_STOCK -> RESERVE (IN_STOCK -> RESERVED)', () => {
      expect(canTransitionVehicleStatus('IN_STOCK', 'RESERVED')).toBe(true)
    })

    it('allows EN_STOCK -> EN_REPARATION (IN_STOCK -> WORKSHOP)', () => {
      expect(canTransitionVehicleStatus('IN_STOCK', 'WORKSHOP')).toBe(true)
    })

    it('allows EN_STOCK -> VENDU (IN_STOCK -> SOLD)', () => {
      expect(canTransitionVehicleStatus('IN_STOCK', 'SOLD')).toBe(true)
    })

    it('allows RESERVE -> EN_STOCK (RESERVED -> IN_STOCK on cancellation/expiration)', () => {
      expect(canTransitionVehicleStatus('RESERVED', 'IN_STOCK')).toBe(true)
    })

    it('allows RESERVE -> VENDU (RESERVED -> SOLD on conversion to sale)', () => {
      expect(canTransitionVehicleStatus('RESERVED', 'SOLD')).toBe(true)
    })

    it('allows EN_REPARATION -> EN_STOCK (WORKSHOP -> IN_STOCK on completion)', () => {
      expect(canTransitionVehicleStatus('WORKSHOP', 'IN_STOCK')).toBe(true)
    })
  })

  describe('MVP Blocked Transitions (Business Invariants)', () => {
    it('blocks VENDU -> anything (SOLD is terminal)', () => {
      expect(canTransitionVehicleStatus('SOLD', 'IN_STOCK')).toBe(false)
      expect(canTransitionVehicleStatus('SOLD', 'RESERVED')).toBe(false)
      expect(canTransitionVehicleStatus('SOLD', 'WORKSHOP')).toBe(false)
    })

    it('blocks EN_REPARATION -> VENDU (WORKSHOP -> SOLD directly blocked)', () => {
      expect(canTransitionVehicleStatus('WORKSHOP', 'SOLD')).toBe(false)
    })

    it('blocks RESERVE -> EN_REPARATION (RESERVED -> WORKSHOP directly blocked)', () => {
      expect(canTransitionVehicleStatus('RESERVED', 'WORKSHOP')).toBe(false)
    })

    it('blocks EN_REPARATION -> RESERVE (WORKSHOP -> RESERVED directly blocked)', () => {
      expect(canTransitionVehicleStatus('WORKSHOP', 'RESERVED')).toBe(false)
    })
  })
})
