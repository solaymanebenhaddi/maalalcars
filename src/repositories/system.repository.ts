import prisma from '@/lib/db'

export const systemRepository = {
  // Leads & Campagnes
  async getLeads() {
    return prisma.lead.findMany({
      include: {
        campaign: true,
        assignedTo: true,
        convertedContact: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getCampaigns() {
    return prisma.marketingCampaign.findMany({
      include: {
        leads: true,
      },
      orderBy: { startDate: 'desc' },
    })
  },

  // Financement
  async getFinancingApplications() {
    return prisma.financingApplication.findMany({
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Garanties
  async getWarranties() {
    return prisma.warranty.findMany({
      include: {
        vehicle: true,
        client: true,
        claims: true,
      },
      orderBy: { startDate: 'desc' },
    })
  },

  // Assurances
  async getInsurances() {
    return prisma.insurancePolicy.findMany({
      include: {
        vehicle: true,
        client: true,
        claims: true,
      },
      orderBy: { startDate: 'desc' },
    })
  },

  // Immatriculations
  async getRegistrationDossiers() {
    return prisma.registrationDossier.findMany({
      include: {
        vehicle: true,
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Tâches
  async getTasks() {
    return prisma.task.findMany({
      include: {
        assignedTo: true,
        approvals: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Communications
  async getCommunications() {
    return prisma.communicationMessage.findMany({
      include: {
        recipient: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Annonces
  async getListings() {
    return prisma.vehicleListing.findMany({
      include: {
        vehicle: {
          include: { photos: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Support / Helpdesk
  async getHelpdeskTickets() {
    return prisma.helpdeskTicket.findMany({
      include: {
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getKnowledgeBase() {
    return prisma.knowledgeBaseArticle.findMany({
      orderBy: { views: 'desc' },
    })
  },

  // Notifications
  async getNotifications() {
    return prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  // Utilisateurs & Rôles
  async getUsers() {
    return prisma.user.findMany({
      where: { archivedAt: null },
      include: {
        role: {
          include: { permissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getRoles() {
    return prisma.role.findMany({
      include: {
        permissions: true,
        users: true,
      },
    })
  },

  // Audit Logs
  async getActivityLogs() {
    return prisma.activityLog.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  },

  // Paramètres
  async getSettings() {
    return prisma.applicationSetting.findMany({
      orderBy: { category: 'asc' },
    })
  },

  // Archives
  async getArchives() {
    return prisma.archiveRecord.findMany({
      orderBy: { archivedAt: 'desc' },
    })
  },

  // Global Search Engine
  async globalSearch(query: string) {
    if (!query || query.trim().length < 2) {
      return { vehicles: [], contacts: [], sales: [], invoices: [], documents: [] }
    }

    const q = query.trim()

    const [vehicles, contacts, sales, invoices, documents] = await Promise.all([
      prisma.vehicle.findMany({
        where: {
          archivedAt: null,
          OR: [
            { brand: { contains: q } },
            { model: { contains: q } },
            { vin: { contains: q } },
            { matricule: { contains: q } },
            { code: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.contact.findMany({
        where: {
          archivedAt: null,
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { companyName: { contains: q } },
            { phone: { contains: q } },
            { code: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.sale.findMany({
        where: {
          OR: [
            { code: { contains: q } },
            { buyer: { firstName: { contains: q } } },
            { buyer: { lastName: { contains: q } } },
          ],
        },
        include: { vehicle: true, buyer: true },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: {
          OR: [
            { code: { contains: q } },
            { contact: { firstName: { contains: q } } },
            { contact: { lastName: { contains: q } } },
          ],
        },
        include: { contact: true },
        take: 5,
      }),
      prisma.document.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { code: { contains: q } },
            { type: { contains: q } },
          ],
        },
        take: 5,
      }),
    ])

    return { vehicles, contacts, sales, invoices, documents }
  },
}
