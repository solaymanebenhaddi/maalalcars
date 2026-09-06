export interface SaleCalculationState {
  salePrice: number
  purchasePrice: number
  expenses: number
  commission: number
  discount: number
}

export function computeLiveSaleMargin(state: SaleCalculationState) {
  const netSale = state.salePrice - state.discount
  const totalCost = state.purchasePrice + state.expenses + state.commission
  const netProfit = netSale - totalCost
  const marginPercent = netSale > 0 ? (netProfit / netSale) * 100 : 0

  return {
    netSale,
    totalCost,
    netProfit: Math.round(netProfit * 100) / 100,
    marginPercent: Math.round(marginPercent * 100) / 100,
  }
}
