import prisma from '@/lib/db'

export const reportService = {
  async getExecutiveMonthlyReport() {
    const sales = await prisma.sale.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: {
        vehicle: { include: { expenses: true } },
        payments: true,
        salesperson: true,
      },
    })

    const expenses = await prisma.expense.findMany({
      where: { status: 'PAID' },
      include: { category: true },
    })

    const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amountTTC, 0)

    let totalVehiclesCost = 0
    for (const s of sales) {
      const pPrice = s.vehicle?.purchasePrice || 0
      const vExp = s.vehicle?.expenses?.reduce((acc, e) => acc + e.amountTTC, 0) || 0
      totalVehiclesCost += pPrice + vExp + s.commissionAmount
    }

    const grossMargin = totalRevenue - totalVehiclesCost
    const netProfit = grossMargin - totalExpenses

    // Sales by salesperson
    const salespersonMap = new Map<string, { name: string; count: number; volume: number; commission: number }>()
    for (const s of sales) {
      const name = s.salesperson?.name || 'Non assigné'
      const existing = salespersonMap.get(name) || { name, count: 0, volume: 0, commission: 0 }
      existing.count += 1
      existing.volume += s.salePrice
      existing.commission += s.commissionAmount
      salespersonMap.set(name, existing)
    }

    return {
      totalRevenue,
      totalExpenses,
      grossMargin,
      netProfit,
      salesCount: sales.length,
      averageTicket: sales.length > 0 ? totalRevenue / sales.length : 0,
      salespersons: Array.from(salespersonMap.values()),
    }
  },
}
