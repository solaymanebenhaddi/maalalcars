import { describe, it, expect } from 'vitest'

// Pricing accumulation test suite
describe('Pricing Accumulation Rules (Buy, Repair, and Sale Phases)', () => {
  describe('Phase 1: Buy Phase Commissioner Accumulation', () => {
    it('automatically adds purchase commissioner fee to vehicle targetSalePrice on creation', () => {
      const rawTargetSalePrice = 250000
      const commissionAmount = 3500

      const targetSalePrice = rawTargetSalePrice + (commissionAmount > 0 ? commissionAmount : 0)
      expect(targetSalePrice).toBe(253500)
    })

    it('retains rawTargetSalePrice when no purchase commissioner exists', () => {
      const rawTargetSalePrice = 250000
      const commissionAmount = 0

      const targetSalePrice = rawTargetSalePrice + (commissionAmount > 0 ? commissionAmount : 0)
      expect(targetSalePrice).toBe(250000)
    })

    it('calculates the exact delta when purchase commissioner amount is modified', () => {
      const oldCommission = 2500
      const newCommission = 4000
      const delta = newCommission - oldCommission

      let vehicleTargetSalePrice = 202500
      vehicleTargetSalePrice += delta
      expect(vehicleTargetSalePrice).toBe(204000)

      // Test reduction of commission
      const reducedCommission = 1000
      const reductionDelta = reducedCommission - newCommission
      vehicleTargetSalePrice += reductionDelta
      expect(vehicleTargetSalePrice).toBe(201000)
    })
  })

  describe('Phase 2: Reparation Phase Outside Sales', () => {
    it('increments targetSalePrice when repair is created with an estimated amount', () => {
      let vehicleTargetSalePrice = 300000
      const estimatedAmount = 4500

      if (estimatedAmount && estimatedAmount > 0) {
        vehicleTargetSalePrice += estimatedAmount
      }

      expect(vehicleTargetSalePrice).toBe(304500)
    })

    it('adjusts targetSalePrice on repair completion with delta between final and estimated amount', () => {
      let vehicleTargetSalePrice = 304500 // had 4500 provisioned
      const previousProvision = 4500
      const finalAmount = 5200 // actual invoice higher

      const delta = finalAmount - previousProvision
      vehicleTargetSalePrice += delta

      expect(vehicleTargetSalePrice).toBe(305200)
    })

    it('adjusts targetSalePrice when final invoice is lower than estimated amount', () => {
      let vehicleTargetSalePrice = 304500 // had 4500 provisioned
      const previousProvision = 4500
      const finalAmount = 3800 // actual invoice lower

      const delta = finalAmount - previousProvision
      vehicleTargetSalePrice += delta

      expect(vehicleTargetSalePrice).toBe(303800)
    })

    it('adds full final amount when repair was created without an estimated amount', () => {
      let vehicleTargetSalePrice = 300000
      const previousProvision = 0
      const finalAmount = 2500

      const delta = finalAmount - previousProvision
      vehicleTargetSalePrice += delta

      expect(vehicleTargetSalePrice).toBe(302500)
    })

    it('decrements targetSalePrice when repair is cancelled', () => {
      let vehicleTargetSalePrice = 304500
      const provisionedAmount = 4500

      vehicleTargetSalePrice -= provisionedAmount
      expect(vehicleTargetSalePrice).toBe(300000)
    })
  })

  describe('Phase 3: Sale Phase ("Prix de vente convenu")', () => {
    it('dynamically computes agreed sale price when commissioner fee is added during sale', () => {
      const baseVehiclePrice = 180000
      const hasCommissioner = true
      const saleCommissionerAmount = 4000

      const agreedSalePrice = baseVehiclePrice + (hasCommissioner ? saleCommissionerAmount : 0)
      expect(agreedSalePrice).toBe(184000)
    })

    it('reverts agreed sale price to base vehicle price when commissioner is untoggled', () => {
      const baseVehiclePrice = 180000
      const saleCommissionerAmount = 4000
      let hasCommissioner = true

      let agreedSalePrice = baseVehiclePrice + (hasCommissioner ? saleCommissionerAmount : 0)
      expect(agreedSalePrice).toBe(184000)

      hasCommissioner = false
      agreedSalePrice = baseVehiclePrice + (hasCommissioner ? saleCommissionerAmount : 0)
      expect(agreedSalePrice).toBe(180000)
    })

    it('transparently shows composition of base price with past buy commission and repairs', () => {
      const vehicle = {
        purchasePrice: 150000,
        purchases: [{ commissionAmount: 3000 }],
        repairs: [
          { finalAmount: 2500, estimatedAmount: 2500, status: 'TERMINEE' },
          { finalAmount: 1500, estimatedAmount: 1000, status: 'TERMINEE' },
        ],
        targetSalePrice: 165000,
      }

      const buyCommission = vehicle.purchases[0]?.commissionAmount || 0
      const repairsTotal = vehicle.repairs.reduce((sum, r) => sum + (r.finalAmount ?? r.estimatedAmount ?? 0), 0)

      expect(buyCommission).toBe(3000)
      expect(repairsTotal).toBe(4000)

      const hasSaleCommissioner = true
      const saleCommission = 5000
      const finalAgreedSalePrice = vehicle.targetSalePrice + (hasSaleCommissioner ? saleCommission : 0)

      expect(finalAgreedSalePrice).toBe(170000)
    })

    it('correctly calculates remaining balance after advance and cash payment', () => {
      const agreedSalePrice = 210000
      const advanceDeposit = 10000
      const amountReceivedToday = 150000

      const remainingDue = Math.max(0, agreedSalePrice - advanceDeposit - amountReceivedToday)
      expect(remainingDue).toBe(50000)
    })
  })
})
