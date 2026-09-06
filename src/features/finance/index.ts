export interface TreasuryCashFlowKPIs {
  availableCash: number
  totalInflow: number
  totalOutflow: number
  netProfit: number
  marginPercent: number
}

export function computeCashRunwayMonths(availableCash: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return 999
  return Math.round((availableCash / monthlyBurn) * 10) / 10
}
