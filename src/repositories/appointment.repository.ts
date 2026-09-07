import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const appointmentRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.AppointmentWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { serviceType: { contains: params.search } },
        { client: { firstName: { contains: params.search } } },
        { client: { lastName: { contains: params.search } } },
      ]
    }

    return prisma.appointment.findMany({
      where,
      include: {
        client: true,
        advisor: true,
      },
      orderBy: { startTime: 'asc' },
    })
  },

  async getById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        advisor: true,
      },
    })
  },

  async create(data: Prisma.AppointmentCreateInput) {
    return prisma.appointment.create({
      data,
    })
  },

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return prisma.appointment.update({
      where: { id },
      data,
    })
  },
}
