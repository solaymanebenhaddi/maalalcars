import { expenseRepository } from '@/repositories/expense.repository'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { ExpenseCreateInput, ExpenseUpdateInput } from '@/validation/expense.schema'
import prisma from '@/lib/db'

export const expenseService = {
  async listExpenses(params: { categoryId?: string; vehicleId?: string; status?: string; search?: string } = {}) {
    return expenseRepository.getAll(params)
  },

  async getExpenseCategories() {
    return expenseRepository.getCategories()
  },

  async createExpense(input: ExpenseCreateInput, userId?: string) {
    const count = await prisma.expense.count()
    const code = input.code || `DEP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const taxAmount = input.taxAmount || (input.amountHT * input.taxRate) / 100

    const expense = await expenseRepository.create({
      code,
      category: { connect: { id: input.categoryId } },
      ...(input.vehicleId ? { vehicle: { connect: { id: input.vehicleId } } } : {}),
      label: input.label,
      amountHT: input.amountHT,
      taxRate: input.taxRate,
      taxAmount,
      amountTTC: input.amountTTC,
      expenseDate: input.expenseDate,
      supplierName: input.supplierName || null,
      paymentMethod: input.paymentMethod,
      paidBy: input.paidBy || null,
      status: input.status,
      isRecurring: input.isRecurring,
      receiptUrl: input.receiptUrl || null,
      notes: input.notes || null,
    })

    await auditService.log({
      action: 'EXPENSE_RECORDED',
      entityType: 'Expense',
      entityId: expense.id,
      details: `Dépense ${expense.label} de ${financialService.formatMAD(expense.amountTTC)}`,
      userId,
    })

    return expense
  },

  async updateExpense(id: string, input: ExpenseUpdateInput, userId?: string) {
    const updated = await expenseRepository.update(id, input)

    await auditService.log({
      action: 'EXPENSE_UPDATED',
      entityType: 'Expense',
      entityId: updated.id,
      details: `Mise à jour de la dépense ${updated.code}`,
      userId,
    })

    return updated
  },
}
