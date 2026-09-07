import { leadRepository } from '@/repositories/lead.repository'
import { contactRepository } from '@/repositories/contact.repository'
import { auditService } from './audit.service'
import { LeadCreateInput, LeadUpdateInput } from '@/validation/lead.schema'
import prisma from '@/lib/db'

export const leadService = {
  async listLeads(params: { status?: string; source?: string; search?: string } = {}) {
    return leadRepository.getAll(params)
  },

  async getPipeline() {
    return leadRepository.getPipelineStages()
  },

  async createLead(input: LeadCreateInput, userId?: string) {
    const count = await prisma.lead.count()
    const code = input.code || `LEAD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const lead = await leadRepository.create({
      code,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email || null,
      phone: input.phone,
      source: input.source,
      interestType: input.interestType,
      estimatedBudget: input.estimatedBudget || null,
      status: input.status,
      tags: input.tags || null,
      notes: input.notes || null,
      ...(input.campaignId ? { campaign: { connect: { id: input.campaignId } } } : {}),
      ...(input.assignedToId ? { assignedTo: { connect: { id: input.assignedToId } } } : {}),
    })

    await auditService.log({
      action: 'LEAD_CREATED',
      entityType: 'Lead',
      entityId: lead.id,
      details: `Création du prospect ${lead.firstName} ${lead.lastName} (${lead.source})`,
      userId,
    })

    return lead
  },

  async updateLead(id: string, input: LeadUpdateInput, userId?: string) {
    const updated = await leadRepository.update(id, input)

    await auditService.log({
      action: 'LEAD_UPDATED',
      entityType: 'Lead',
      entityId: updated.id,
      details: `Mise à jour du prospect ${updated.code}`,
      userId,
    })

    return updated
  },

  async convertLeadToContact(leadId: string, userId?: string) {
    const lead = await leadRepository.getById(leadId)
    if (!lead) throw new Error('Prospect introuvable')

    const count = await prisma.contact.count()
    const contactCode = `CLT-${String(count + 1).padStart(4, '0')}`

    const contact = await contactRepository.create({
      code: contactCode,
      type: 'INDIVIDUAL',
      role: 'BUYER',
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
      email: lead.email || null,
      segment: 'PROSPECT_CHAUD',
      status: 'ACTIVE',
      notes: `Converti depuis le prospect ${lead.code}. Intérêt: ${lead.interestType}`,
    })

    await leadRepository.update(lead.id, {
      status: 'CONVERTED',
      convertedContact: { connect: { id: contact.id } },
    })

    await auditService.log({
      action: 'LEAD_CONVERTED',
      entityType: 'Lead',
      entityId: lead.id,
      details: `Prospect ${lead.code} converti en contact ${contact.code}`,
      userId,
    })

    return { lead, contact }
  },
}
