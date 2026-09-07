/**
 * Domain rules and invariants for Moroccan currency (MAD) financial operations
 */

export const MOROCCAN_TAX_RATE = 20.0 // 20% TVA Standard au Maroc

export interface FinancialCalculationResult {
  totalVehicleCost: number
  netProfit: number
  marginPercent: number
}

/**
 * Calculates complete vehicle cost
 * Total Cost = Purchase Price + Purchase Commission + Sum(Expenses TTC) + Sale Commission
 */
export function calculateVehicleCost(
  purchasePrice: number,
  purchaseCommission: number = 0,
  expensesTTC: number = 0,
  saleCommission: number = 0,
): number {
  const total = (purchasePrice || 0) + (purchaseCommission || 0) + (expensesTTC || 0) + (saleCommission || 0)
  return Math.round(total * 100) / 100
}

/**
 * Calculates net profit and percentage margin
 */
export function calculateProfitAndMargin(
  salePrice: number,
  totalVehicleCost: number,
): { netProfit: number; marginPercent: number } {
  const price = salePrice || 0
  const cost = totalVehicleCost || 0
  const netProfit = Math.round((price - cost) * 100) / 100
  const marginPercent = price > 0 ? Math.round((netProfit / price) * 10000) / 100 : 0
  return { netProfit, marginPercent }
}

/**
 * Computes Moroccan 20% TVA breakdown
 */
export function calculateMoroccanTax(
  amountHT: number,
  taxRate: number = MOROCCAN_TAX_RATE,
): { amountHT: number; taxAmount: number; amountTTC: number } {
  const ht = Math.round((amountHT || 0) * 100) / 100
  const tax = Math.round(((ht * (taxRate || MOROCCAN_TAX_RATE)) / 100) * 100) / 100
  const ttc = Math.round((ht + tax) * 100) / 100
  return { amountHT: ht, taxAmount: tax, amountTTC: ttc }
}

/**
 * Converts TTC amount to HT based on tax rate
 */
export function extractHTFromTTC(
  amountTTC: number,
  taxRate: number = MOROCCAN_TAX_RATE,
): { amountHT: number; taxAmount: number; amountTTC: number } {
  const ttc = Math.round((amountTTC || 0) * 100) / 100
  const rateMultiplier = 1 + (taxRate || MOROCCAN_TAX_RATE) / 100
  const ht = Math.round((ttc / rateMultiplier) * 100) / 100
  const tax = Math.round((ttc - ht) * 100) / 100
  return { amountHT: ht, taxAmount: tax, amountTTC: ttc }
}
