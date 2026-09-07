import { invoiceRepository } from '@/repositories/invoice.repository'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { InvoiceCreateInput, InvoiceUpdateInput } from '@/validation/invoice.schema'
import prisma from '@/lib/db'

export const invoiceService = {
  async listInvoices(params: { status?: string; search?: string } = {}) {
    return invoiceRepository.getAll(params)
  },

  async getInvoiceDetails(id: string) {
    return invoiceRepository.getById(id)
  },

  async createInvoice(input: InvoiceCreateInput, userId?: string) {
    const count = await prisma.invoice.count()
    const code = input.code || `FAC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const totals = financialService.calculateInvoiceTotals({
      lines: input.lines,
    })

    const invoice = await invoiceRepository.create({
      code,
      type: input.type,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      contact: { connect: { id: input.contactId } },
      ...(input.saleId ? { sale: { connect: { id: input.saleId } } } : {}),
      subtotalHT: totals.subtotalHT,
      taxRate: input.taxRate,
      taxAmount: totals.taxAmount,
      totalTTC: totals.totalTTC,
      paidAmount: 0,
      balanceDue: totals.totalTTC,
      status: 'SENT',
      paymentMethod: input.paymentMethod,
      notes: input.notes || null,
      terms: input.terms || null,
      lines: {
        create: input.lines.map((line) => {
          const lineHT = line.unitPriceHT * line.quantity
          const lineRate = line.taxRate !== undefined ? line.taxRate : input.taxRate
          const lineTax = (lineHT * lineRate) / 100
          return {
            description: line.description,
            quantity: line.quantity,
            unitPriceHT: line.unitPriceHT,
            taxRate: lineRate,
            totalHT: Math.round(lineHT * 100) / 100,
            totalTTC: Math.round((lineHT + lineTax) * 100) / 100,
          }
        }),
      },
    })

    await auditService.log({
      action: 'INVOICE_CREATED',
      entityType: 'Invoice',
      entityId: invoice.id,
      details: `Facture ${invoice.code} émise pour un total de ${financialService.formatMAD(invoice.totalTTC)}`,
      userId,
    })

    return invoice
  },

  async updateInvoice(id: string, input: InvoiceUpdateInput, userId?: string) {
    const { lines: _lines, ...data } = input
    const updated = await invoiceRepository.update(id, data)

    await auditService.log({
      action: 'INVOICE_UPDATED',
      entityType: 'Invoice',
      entityId: updated.id,
      details: `Mise à jour de la facture ${updated.code}`,
      userId,
    })

    return updated
  },
}
