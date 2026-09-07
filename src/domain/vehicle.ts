/**
 * Domain state machine and rules for Vehicles
 */

export type VehicleStatus = 'IN_STOCK' | 'RESERVED' | 'SOLD' | 'WORKSHOP' | 'TRANSIT' | 'ARCHIVED'

export const VALID_VEHICLE_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
  IN_STOCK: ['RESERVED', 'SOLD', 'WORKSHOP', 'TRANSIT', 'ARCHIVED'],
  RESERVED: ['IN_STOCK', 'SOLD', 'ARCHIVED'],
  WORKSHOP: ['IN_STOCK', 'ARCHIVED'],
  TRANSIT: ['IN_STOCK', 'WORKSHOP', 'ARCHIVED'],
  SOLD: ['ARCHIVED'],
  ARCHIVED: ['IN_STOCK'],
}

export function canTransitionVehicleStatus(current: VehicleStatus, next: VehicleStatus): boolean {
  if (current === next) return true
  const allowed = VALID_VEHICLE_TRANSITIONS[current] || []
  return allowed.includes(next)
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
