import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const leadRepository = {
  async getAll(params: { status?: string; source?: string; search?: string } = {}) {
    const where: Prisma.LeadWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.source && params.source !== 'Toutes') {
      where.source = params.source
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
        { phone: { contains: params.search } },
        { email: { contains: params.search } },
      ]
    }

    return prisma.lead.findMany({
      where,
      include: {
        campaign: true,
        assignedTo: true,
        convertedContact: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        campaign: true,
        assignedTo: true,
        convertedContact: true,
      },
    })
  },

  async getPipelineStages() {
    const leads = await prisma.lead.findMany({
      include: { assignedTo: true },
      orderBy: { createdAt: 'desc' },
    })

    const stages = {
      NEW: leads.filter((l) => l.status === 'NEW'),
      CONTACTED: leads.filter((l) => l.status === 'CONTACTED'),
      QUALIFIED: leads.filter((l) => l.status === 'QUALIFIED'),
      PROPOSAL: leads.filter((l) => l.status === 'PROPOSAL'),
      NEGOTIATION: leads.filter((l) => l.status === 'NEGOTIATION'),
      CONVERTED: leads.filter((l) => l.status === 'CONVERTED'),
      LOST: leads.filter((l) => l.status === 'LOST'),
    }

    return stages
  },

  async create(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({
      data,
    })
  },

  async update(id: string, data: Prisma.LeadUpdateInput) {
    return prisma.lead.update({
      where: { id },
      data,
    })
  },
}
