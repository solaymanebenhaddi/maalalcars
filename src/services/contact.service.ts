import { contactRepository, ContactFilterParams } from '@/repositories/contact.repository'
import { auditService } from './audit.service'
import { ContactCreateInput, ContactUpdateInput } from '@/validation/contact.schema'
import prisma from '@/lib/db'

export const contactService = {
  async listContacts(params: ContactFilterParams = {}) {
    return contactRepository.getAll(params)
  },

  async getContactDetails(id: string) {
    return contactRepository.getById(id)
  },

  async createContact(input: ContactCreateInput, userId?: string) {
    const count = await prisma.contact.count()
    const prefix = input.role === 'BUYER' ? 'CLT' : input.role === 'SELLER' ? 'VEN' : input.role === 'SUPPLIER' ? 'FOUR' : 'CNT'
    const code = input.code || `${prefix}-${String(count + 1).padStart(4, '0')}`

    const contact = await contactRepository.create({
      code,
      type: input.type,
      role: input.role,
      firstName: input.firstName || null,
      lastName: input.lastName || null,
      companyName: input.companyName || null,
      cin: input.cin || null,
      ice: input.ice || null,
      rc: input.rc || null,
      email: input.email || null,
      phone: input.phone,
      phoneSecondary: input.phoneSecondary || null,
      address: input.address || null,
      city: input.city,
      postalCode: input.postalCode || null,
      segment: input.segment,
      rating: input.rating,
      totalVolume: input.totalVolume,
      currentDebt: input.currentDebt,
      status: input.status,
      notes: input.notes || null,
    })

    await auditService.log({
      action: 'CONTACT_CREATED',
      entityType: 'Contact',
      entityId: contact.id,
      details: `Création du contact ${contact.firstName || ''} ${contact.lastName || contact.companyName || ''} (${contact.code})`,
      userId,
    })

    return contact
  },

  async updateContact(id: string, input: ContactUpdateInput, userId?: string) {
    const updated = await contactRepository.update(id, input)

    await auditService.log({
      action: 'CONTACT_UPDATED',
      entityType: 'Contact',
      entityId: updated.id,
      details: `Mise à jour du contact ${updated.code}`,
      userId,
    })

    return updated
  },
}
