/**
 * Domain state machine and rules for Sales Orders
 */

export type SaleStatus =
  | 'NEW'
  | 'NEGOTIATION'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PREPARATION'
  | 'DELIVERED'
  | 'CANCELLED'

export const VALID_SALE_TRANSITIONS: Record<SaleStatus, SaleStatus[]> = {
  NEW: ['NEGOTIATION', 'CONFIRMED', 'CANCELLED'],
  NEGOTIATION: ['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED'],
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARATION', 'DELIVERED', 'CANCELLED'],
  PREPARATION: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
}

export function canTransitionSaleStatus(current: SaleStatus, next: SaleStatus): boolean {
  if (current === next) return true
  const allowed = VALID_SALE_TRANSITIONS[current] || []
  return allowed.includes(next)
}

export function requiresManagerDiscountApproval(
  targetPrice: number,
  discountAmount: number,
  maxDiscountPercent: number = 5.0,
): boolean {
  if (!targetPrice || targetPrice <= 0 || !discountAmount || discountAmount <= 0) return false
  const percent = (discountAmount / targetPrice) * 100
  return percent > maxDiscountPercent
}
