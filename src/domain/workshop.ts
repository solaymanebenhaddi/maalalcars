/**
 * Domain rules for Workshop and Maintenance orders
 */

export function calculateWorkshopTotals(
  partsCostHT: number = 0,
  laborCostHT: number = 0,
  taxRate: number = 20.0,
): { totalHT: number; taxAmount: number; totalTTC: number } {
  const parts = Math.round((partsCostHT || 0) * 100) / 100
  const labor = Math.round((laborCostHT || 0) * 100) / 100
  const totalHT = Math.round((parts + labor) * 100) / 100
  const taxAmount = Math.round(((totalHT * (taxRate || 20.0)) / 100) * 100) / 100
  const totalTTC = Math.round((totalHT + taxAmount) * 100) / 100

  return { totalHT, taxAmount, totalTTC }
}
