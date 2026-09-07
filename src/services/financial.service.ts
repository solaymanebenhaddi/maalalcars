/**
 * Service de calculs financiers et règles métier monétaires pour MAALAL CARS
 * Devise officielle : Dirham marocain (MAD / DH)
 * Règles : Précision décimale sécurisée, pas de calculs monétaires approximatifs côté client.
 */

export interface VehicleFinancialSummary {
  purchasePrice: number
  purchaseCommission: number
  totalExpenses: number
  salePrice: number
  saleCommission: number
  totalVehicleCost: number
  netProfit: number
  marginPercent: number
  paymentsReceived: number
  outstandingBalance: number
}

export const financialService = {
  /**
   * Formate un montant en Dirhams marocains (ex: 285 000 DH)
   */
  formatMAD(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) return '0 DH'
    const rounded = Math.round(amount * 100) / 100
    const parts = rounded.toFixed(2).split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    if (parts[1] === '00') {
      return `${integerPart} DH`
    }
    return `${integerPart},${parts[1]} DH`
  },

  /**
   * Calcule le coût complet d'un véhicule
   * Coût = Prix Achat + Commission Achat + Somme des Dépenses TTC + Commission Vente
   */
  calculateTotalVehicleCost(params: {
    purchasePrice: number
    purchaseCommission?: number
    expensesTotalTTC?: number
    saleCommission?: number
  }): number {
    const purchase = params.purchasePrice || 0
    const pComm = params.purchaseCommission || 0
    const exp = params.expensesTotalTTC || 0
    const sComm = params.saleCommission || 0
    return Math.round((purchase + pComm + exp + sComm) * 100) / 100
  },

  /**
   * Calcule le bénéfice net et la marge sur une vente
   * Bénéfice Net = Prix Vente - Coût Complet Véhicule
   * Marge % = (Bénéfice Net / Prix Vente) * 100
   */
  calculateProfitAndMargin(params: {
    salePrice: number
    totalVehicleCost: number
  }): { netProfit: number; marginPercent: number } {
    const sale = params.salePrice || 0
    const cost = params.totalVehicleCost || 0
    const netProfit = Math.round((sale - cost) * 100) / 100
    const marginPercent = sale > 0 ? Math.round((netProfit / sale) * 10000) / 100 : 0
    return { netProfit, marginPercent }
  },

  /**
   * Calcule le solde restant à recouvrer sur une vente ou une facture
   * Reste dû = Prix Vente / Facture TTC - Total Paiements Reçus
   */
  calculateOutstandingBalance(params: {
    totalAmount: number
    paymentsReceived: number
  }): number {
    const total = params.totalAmount || 0
    const paid = params.paymentsReceived || 0
    return Math.max(0, Math.round((total - paid) * 100) / 100)
  },

  /**
   * Calcule les totaux d'une facture avec TVA marocaine (généralement 20%)
   */
  calculateInvoiceTotals(params: {
    lines: Array<{ description?: string; unitPriceHT: number; quantity: number; taxRate?: number }>
  }): { subtotalHT: number; taxAmount: number; totalTTC: number } {
    let subtotalHT = 0
    let taxAmount = 0

    for (const line of params.lines) {
      const lineHT = (line.unitPriceHT || 0) * (line.quantity || 1)
      const rate = line.taxRate !== undefined ? line.taxRate : 20.0
      const lineTax = (lineHT * rate) / 100
      subtotalHT += lineHT
      taxAmount += lineTax
    }

    subtotalHT = Math.round(subtotalHT * 100) / 100
    taxAmount = Math.round(taxAmount * 100) / 100
    const totalTTC = Math.round((subtotalHT + taxAmount) * 100) / 100

    return { subtotalHT, taxAmount, totalTTC }
  },

  /**
   * Détermine la tranche d'ancienneté (Aging) du stock en jours
   */
  getStockAgingBucket(days: number): '0-30' | '31-60' | '61-90' | '+90' {
    if (days <= 30) return '0-30'
    if (days <= 60) return '31-60'
    if (days <= 90) return '61-90'
    return '+90'
  },
}
