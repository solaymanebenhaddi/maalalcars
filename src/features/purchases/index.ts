export interface PurchaseCalculationState {
  purchasePrice: number
  commission: number
  projectedExpenses: number
}

export function computeEstimatedStockValue(state: PurchaseCalculationState): number {
  return (state.purchasePrice || 0) + (state.commission || 0) + (state.projectedExpenses || 0)
}
