import prisma from '@/lib/db'

export const financeRepository = {
  async getFinancialOverview() {
    const sales = await prisma.sale.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: {
        vehicle: { include: { expenses: true } },
        payments: true,
      },
    })

    const expenses = await prisma.expense.findMany({
      where: { status: 'PAID' },
      include: { category: true },
    })

    const payments = await prisma.payment.findMany({
      where: { status: 'PAID' },
      include: { contact: true, sale: { include: { vehicle: true } } },
      orderBy: { paymentDate: 'desc' },
    })

    const vehiclesInStock = await prisma.vehicle.findMany({
      where: { status: { in: ['IN_STOCK', 'RESERVED'] }, archivedAt: null },
      include: { expenses: true },
    })

    const totalCashIn = payments
      .filter((p) => p.type === 'INFLOW')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalCashOut = payments
      .filter((p) => p.type === 'OUTFLOW' || p.type === 'COMMISSION')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amountTTC, 0)

    const totalSalesVolume = sales.reduce((sum, s) => sum + s.salePrice, 0)

    // Capital immobilisé en stock = somme(prix achat + frais engagés)
    const stockCapital = vehiclesInStock.reduce((sum, v) => {
      const expensesTotal = v.expenses.reduce((acc, e) => acc + e.amountTTC, 0)
      return sum + v.purchasePrice + expensesTotal
    }, 0)

    // Calcul créances à récupérer (Total ventes - Paiements reçus)
    const totalReceivedOnSales = sales.reduce((sum, s) => {
      const paid = s.payments.reduce((pSum, p) => pSum + p.amount, 0)
      return sum + paid
    }, 0)
    const totalReceivable = Math.max(0, totalSalesVolume - totalReceivedOnSales)

    // Calcul du profit net
    let totalVehicleCost = 0
    for (const s of sales) {
      const vehiclePurchasePrice = s.vehicle?.purchasePrice || 0
      const vehicleExpenses = s.vehicle?.expenses?.reduce((acc, e) => acc + e.amountTTC, 0) || 0
      const commissions = s.commissionAmount
      totalVehicleCost += vehiclePurchasePrice + vehicleExpenses + commissions
    }
    const netProfit = totalSalesVolume - totalVehicleCost

    const netMargin = totalSalesVolume > 0 ? (netProfit / totalSalesVolume) * 100 : 0

    return {
      availableCash: totalCashIn - totalCashOut,
      totalCashIn,
      totalCashOut,
      netProfit,
      netMargin,
      stockCapital,
      totalReceivable,
      monthlyExpenses: totalExpenses,
      monthlySalesVolume: totalSalesVolume,
      recentPayments: payments.slice(0, 10),
    }
  },

  async getInvoices() {
    return prisma.invoice.findMany({
      include: {
        contact: true,
        sale: { include: { vehicle: true } },
        lines: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    })
  },

  async getExpenses() {
    return prisma.expense.findMany({
      include: {
        category: true,
        vehicle: true,
      },
      orderBy: { expenseDate: 'desc' },
    })
  },

  async getRegularizations() {
    return prisma.regularization.findMany({
      include: {
        contact: true,
        sale: { include: { vehicle: true } },
        invoice: true,
        handledBy: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}
