import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const expenseRepository = {
  async getAll(params: { categoryId?: string; vehicleId?: string; status?: string; search?: string } = {}) {
    const where: Prisma.ExpenseWhereInput = {}

    if (params.categoryId) where.categoryId = params.categoryId
    if (params.vehicleId) where.vehicleId = params.vehicleId
    if (params.status && params.status !== 'Tous') where.status = params.status

    if (params.search) {
      where.OR = [
        { label: { contains: params.search } },
        { code: { contains: params.search } },
        { supplierName: { contains: params.search } },
      ]
    }

    return prisma.expense.findMany({
      where,
      include: {
        category: true,
        vehicle: true,
      },
      orderBy: { expenseDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        vehicle: true,
      },
    })
  },

  async getCategories() {
    return prisma.expenseCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  },

  async create(data: Prisma.ExpenseCreateInput) {
    return prisma.expense.create({
      data,
    })
  },

  async update(id: string, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({
      where: { id },
      data,
    })
  },
}
