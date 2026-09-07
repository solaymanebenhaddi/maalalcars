import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const operationsRepository = {
  // Atelier / Ordres de travail
  async getWorkshopOrders() {
    return prisma.workshopOrder.findMany({
      include: {
        vehicle: true,
        client: true,
        technician: true,
      },
      orderBy: { scheduledDate: 'desc' },
    })
  },

  // Agenda / Rendez-vous
  async getAppointments() {
    return prisma.appointment.findMany({
      include: {
        client: true,
        advisor: true,
      },
      orderBy: { startTime: 'asc' },
    })
  },

  // Évaluations / Inspections
  async getInspections() {
    return prisma.vehicleInspection.findMany({
      include: {
        vehicle: true,
        inspector: true,
      },
      orderBy: { inspectionDate: 'desc' },
    })
  },

  // Livraisons
  async getDeliveries() {
    return prisma.delivery.findMany({
      include: {
        sale: {
          include: {
            vehicle: true,
            buyer: true,
            salesperson: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    })
  },

  // Contrats
  async getContracts() {
    return prisma.contract.findMany({
      include: {
        partyContact: true,
      },
      orderBy: { startDate: 'desc' },
    })
  },

  // Documents
  async getDocuments(params: { category?: string; vehicleId?: string } = {}) {
    const where: Prisma.DocumentWhereInput = {}
    if (params.category && params.category !== 'Toutes') where.category = params.category
    if (params.vehicleId) where.vehicleId = params.vehicleId

    return prisma.document.findMany({
      where,
      include: {
        vehicle: true,
        contact: true,
      },
      orderBy: { issueDate: 'desc' },
    })
  },

  // Réservations
  async getReservations() {
    return prisma.reservation.findMany({
      include: {
        vehicle: true,
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Achats
  async getPurchases() {
    return prisma.purchase.findMany({
      include: {
        vehicle: true,
        seller: true,
        supplier: true,
        commissioner: true,
        handledBy: true,
        payments: true,
      },
      orderBy: { purchaseDate: 'desc' },
    })
  },
}
