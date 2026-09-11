/**
 * Domain state machine and rules for Vehicles
 */

export type VehicleStatus = 'IN_STOCK' | 'RESERVED' | 'SOLD' | 'WORKSHOP' | 'TRANSIT' | 'ARCHIVED' | 'ECHANGE'

export const VALID_VEHICLE_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
  IN_STOCK: ['RESERVED', 'SOLD', 'WORKSHOP', 'TRANSIT', 'ARCHIVED', 'ECHANGE'],
  RESERVED: ['IN_STOCK', 'SOLD', 'ARCHIVED'],
  WORKSHOP: ['IN_STOCK', 'ARCHIVED'],
  TRANSIT: ['IN_STOCK', 'WORKSHOP', 'ARCHIVED'],
  SOLD: ['ARCHIVED'],
  ARCHIVED: ['IN_STOCK'],
  ECHANGE: ['ARCHIVED'],
}

export function canTransitionVehicleStatus(current: VehicleStatus, next: VehicleStatus): boolean {
  if (current === next) return true
  const allowed = VALID_VEHICLE_TRANSITIONS[current] || []
  return allowed.includes(next)
}

/**
 * Money conversion helpers: Safe integer minor units (centimes)
 * 1 DH = 100 centimes
 */
export function toMinorUnits(dh: number): number {
  return Math.round((dh || 0) * 100)
}

export function fromMinorUnits(centimes: number): number {
  return (centimes || 0) / 100
}

export type SoulteDirection = 'NONE' | 'COMPANY_TO_SUPPLIER' | 'SUPPLIER_TO_COMPANY'

export interface ExchangeFinancialValidationResult {
  isValid: boolean
  expectedIncomingValue: number
  actualIncomingValue: number
  difference: number
  errorMessage?: string
}

/**
 * Validates the exchange financial equation:
 * incomingVehicleValue = outgoingVehicleValue + amountPaidByCompany - amountReceivedFromSupplier
 */
export function validateExchangeFinancials(params: {
  incomingVehicleValueDH: number
  outgoingVehicleValueDH: number
  direction: SoulteDirection
  soulteAmountDH: number
}): ExchangeFinancialValidationResult {
  const incomingMinor = toMinorUnits(params.incomingVehicleValueDH)
  const outgoingMinor = toMinorUnits(params.outgoingVehicleValueDH)
  const soulteMinor = params.direction === 'NONE' ? 0 : Math.abs(toMinorUnits(params.soulteAmountDH))

  let expectedIncomingMinor = outgoingMinor
  if (params.direction === 'COMPANY_TO_SUPPLIER') {
    expectedIncomingMinor = outgoingMinor + soulteMinor
  } else if (params.direction === 'SUPPLIER_TO_COMPANY') {
    expectedIncomingMinor = outgoingMinor - soulteMinor
  }

  const isValid = incomingMinor === expectedIncomingMinor
  const differenceMinor = incomingMinor - expectedIncomingMinor

  let errorMessage: string | undefined
  if (!isValid) {
    const incomingDH = fromMinorUnits(incomingMinor).toLocaleString('fr-MA')
    const outgoingDH = fromMinorUnits(outgoingMinor).toLocaleString('fr-MA')
    const expectedDH = fromMinorUnits(expectedIncomingMinor).toLocaleString('fr-MA')
    const soulteDH = fromMinorUnits(soulteMinor).toLocaleString('fr-MA')

    if (params.direction === 'COMPANY_TO_SUPPLIER') {
      errorMessage = `Incohérence financière : Nouveau véhicule (${incomingDH} DH) ≠ Véhicule cédé (${outgoingDH} DH) + Soulte versée (${soulteDH} DH). Valeur attendue : ${expectedDH} DH.`
    } else if (params.direction === 'SUPPLIER_TO_COMPANY') {
      errorMessage = `Incohérence financière : Nouveau véhicule (${incomingDH} DH) ≠ Véhicule cédé (${outgoingDH} DH) - Soulte reçue (${soulteDH} DH). Valeur attendue : ${expectedDH} DH.`
    } else {
      errorMessage = `Incohérence financière (Sans soulte) : La valeur du nouveau véhicule (${incomingDH} DH) doit être strictement égale à celle du véhicule cédé (${outgoingDH} DH).`
    }
  }

  return {
    isValid,
    expectedIncomingValue: fromMinorUnits(expectedIncomingMinor),
    actualIncomingValue: fromMinorUnits(incomingMinor),
    difference: fromMinorUnits(differenceMinor),
    errorMessage,
  }
}

export function calculateStockAgeDays(entryDate: Date | string): number {
  const entry = new Date(entryDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - entry)
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function categorizeStockAging(ageDays: number): 'UNDER_30' | 'BETWEEN_31_60' | 'BETWEEN_61_90' | 'OVER_90' {
  if (ageDays <= 30) return 'UNDER_30'
  if (ageDays <= 60) return 'BETWEEN_31_60'
  if (ageDays <= 90) return 'BETWEEN_61_90'
  return 'OVER_90'
}
