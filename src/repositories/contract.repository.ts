import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const contractRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.ContractWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { title: { contains: params.search } },
        { type: { contains: params.search } },
        { partyContact: { lastName: { contains: params.search } } },
        { partyContact: { companyName: { contains: params.search } } },
      ]
    }

    return prisma.contract.findMany({
      where,
      include: {
        partyContact: true,
      },
      orderBy: { startDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.contract.findUnique({
      where: { id },
      include: {
        partyContact: true,
      },
    })
  },

  async create(data: Prisma.ContractCreateInput) {
    return prisma.contract.create({
      data,
    })
  },

  async update(id: string, data: Prisma.ContractUpdateInput) {
    return prisma.contract.update({
      where: { id },
      data,
    })
  },
}
