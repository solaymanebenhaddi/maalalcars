import prisma from '@/lib/db'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { PaymentCreateInput, PaymentUpdateInput } from '@/validation/payment.schema'

import { Prisma } from '@prisma/client'

export const paymentService = {
  async listPayments(params: { type?: string; status?: string; search?: string } = {}) {
    const where: Prisma.PaymentWhereInput = {}
    if (params.type && params.type !== 'Tous') where.type = params.type
    if (params.status && params.status !== 'Tous') where.status = params.status

    return prisma.payment.findMany({
      where,
      include: {
        contact: true,
        sale: { include: { vehicle: true } },
        purchase: { include: { vehicle: true } },
        invoice: true,
      },
      orderBy: { paymentDate: 'desc' },
    })
  },

  async createPayment(input: PaymentCreateInput, userId?: string) {
    const count = await prisma.payment.count()
    const prefix = input.type === 'INFLOW' ? 'ENC' : input.type === 'OUTFLOW' ? 'DEC' : 'PAY'
    const code = input.code || `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const payment = await prisma.payment.create({
      data: {
        code,
        type: input.type,
        amount: input.amount,
        paymentDate: input.paymentDate,
        paymentMethod: input.paymentMethod,
        referenceNumber: input.referenceNumber || null,
        status: input.status,
        dueDate: input.dueDate || null,
        receivedBy: input.receivedBy || null,
        notes: input.notes || null,
        receiptUrl: input.receiptUrl || null,
        ...(input.contactId ? { contact: { connect: { id: input.contactId } } } : {}),
        ...(input.saleId ? { sale: { connect: { id: input.saleId } } } : {}),
        ...(input.purchaseId ? { purchase: { connect: { id: input.purchaseId } } } : {}),
        ...(input.invoiceId ? { invoice: { connect: { id: input.invoiceId } } } : {}),
      },
    })

    // If payment is attached to invoice, update invoice paidAmount and balanceDue
    if (input.invoiceId && input.status === 'PAID') {
      const invoice = await prisma.invoice.findUnique({
        where: { id: input.invoiceId },
        include: { payments: true },
      })
      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => (p.status === 'PAID' ? sum + p.amount : sum), 0) + input.amount
        const balanceDue = Math.max(0, invoice.totalTTC - totalPaid)
        const invoiceStatus = balanceDue === 0 ? 'PAID' : 'PARTIAL'

        await prisma.invoice.update({
          where: { id: input.invoiceId },
          data: {
            paidAmount: totalPaid,
            balanceDue,
            status: invoiceStatus,
          },
        })
      }
    }

    await auditService.log({
      action: 'PAYMENT_RECORDED',
      entityType: 'Payment',
      entityId: payment.id,
      details: `Paiement ${payment.code} (${payment.type}) de ${financialService.formatMAD(payment.amount)}`,
      userId,
    })

    return payment
  },

  async updatePayment(id: string, input: PaymentUpdateInput, userId?: string) {
    const updated = await prisma.payment.update({
      where: { id },
      data: input,
    })

    await auditService.log({
      action: 'PAYMENT_UPDATED',
      entityType: 'Payment',
      entityId: updated.id,
      details: `Mise à jour du paiement ${updated.code}`,
      userId,
    })

    return updated
  },
}
