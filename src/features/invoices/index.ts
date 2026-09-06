export interface InvoiceLineItemState {
  description: string
  quantity: number
  unitPriceHT: number
  taxRate: number
}

export function computeInvoiceSummary(lines: InvoiceLineItemState[]) {
  let subtotalHT = 0
  let taxAmount = 0

  for (const line of lines) {
    const ht = line.unitPriceHT * line.quantity
    const tax = (ht * line.taxRate) / 100
    subtotalHT += ht
    taxAmount += tax
  }

  return {
    subtotalHT: Math.round(subtotalHT * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalTTC: Math.round((subtotalHT + taxAmount) * 100) / 100,
  }
}
