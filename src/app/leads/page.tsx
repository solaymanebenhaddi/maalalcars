import React from 'react'
import { systemRepository } from '@/repositories/system.repository'
import { LeadsDashboardClient } from '@/features/leads/leads-dashboard-client'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const [leads, campaigns, advisors] = await Promise.all([
    systemRepository.getLeads(),
    systemRepository.getCampaigns(),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    }),
  ])

  const serializedLeads = leads.map((l) => ({
    id: l.id,
    code: l.code,
    firstName: l.firstName,
    lastName: l.lastName,
    phone: l.phone,
    email: l.email,
    source: l.source,
    interestType: l.interestType,
    estimatedBudget: l.estimatedBudget,
    status: l.status,
    tags: l.tags,
    notes: l.notes,
    createdAt: l.createdAt.toISOString(),
    assignedTo: l.assignedTo ? { id: l.assignedTo.id, name: l.assignedTo.name } : null,
    campaign: l.campaign ? { id: l.campaign.id, name: l.campaign.name } : null,
  }))

  const serializedCampaigns = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    channel: c.channel,
    budgetMAD: c.budgetMAD,
    spentMAD: c.spentMAD,
    leadsCount: c.leadsCount,
    roiPercent: c.roiPercent,
    status: c.status,
  }))

  return (
    <LeadsDashboardClient
      initialLeads={serializedLeads}
      campaigns={serializedCampaigns}
      advisors={advisors}
    />
  )
}
