import React from 'react'
import prisma from '@/lib/db'
import {
  ExpensesDashboardClient,
  type ExpenseItem,
} from '@/features/expenses/expenses-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const dbExpenses = await prisma.expense.findMany({
    include: {
      category: true,
      vehicle: true,
    },
    orderBy: { expenseDate: 'desc' },
  })

  const expenses: ExpenseItem[] = dbExpenses.map((e) => {
    const d = new Date(e.expenseDate)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const expenseDateFormatted = `${day}/${month}/${year}`

    return {
      id: e.id,
      code: e.code,
      label: e.label,
      categoryName: e.category?.name || 'Non classé',
      categoryColor: '#71717a',
      supplierName: e.supplierName || 'N/A',
      vehicleName: e.vehicleName || (e.vehicle ? `${e.vehicle.brand} ${e.vehicle.model}` : '—'),
      amountTTC: e.amountTTC,
      status: (e.status as ExpenseItem['status']) || 'PENDING',
      expenseDateFormatted,
    }
  })

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
        Aucune dépense enregistrée pour le moment.
      </div>
    )
  }

  return <ExpensesDashboardClient recentExpenses={expenses} />
}
