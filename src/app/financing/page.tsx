import React from 'react'
import { systemRepository } from '@/repositories/system.repository'
import { FinancingDashboardClient } from '@/features/financing/financing-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function FinancingPage() {
  const dossiers = await systemRepository.getFinancingApplications()

  const REFERENCE_CLIENTS: Record<string, { firstName: string; lastName: string; phone: string; email: string }> = {
    'FIN-2025-00568': { firstName: 'Yassine', lastName: 'Benali', phone: '+212 6 61 23 45 67', email: 'yassine.benali@gmail.com' },
    'FIN-2025-00567': { firstName: 'Sara', lastName: 'Martin', phone: '+212 6 72 34 56 78', email: 'sara.martin@gmail.com' },
    'FIN-2025-00566': { firstName: 'Karim', lastName: 'Lahlou', phone: '+212 6 63 45 67 89', email: 'karim.lahlou@gmail.com' },
    'FIN-2025-00565': { firstName: 'Imane', lastName: 'Zahra', phone: '+212 6 54 56 78 90', email: 'imane.zahra@gmail.com' },
    'FIN-2025-00564': { firstName: 'Mehdi', lastName: 'Amrani', phone: '+212 6 65 67 89 01', email: 'mehdi.amrani@gmail.com' },
    'FIN-2025-00569': { firstName: 'Leila', lastName: 'Haddad', phone: '+212 6 76 78 90 12', email: 'leila.haddad@gmail.com' },
  }

  const serializedDossiers = dossiers.map((d) => {
    const fallbackClient = REFERENCE_CLIENTS[d.code] || { firstName: 'Youssef', lastName: 'El Idrissi', phone: '+212 6 12 34 56 78', email: 'youssef.idrissi@gmail.com' }
    return {
      id: d.id,
      code: d.code,
      partnerName: d.partnerName,
      requestedAmount: d.requestedAmount,
      downPayment: d.downPayment,
      durationMonths: d.durationMonths,
      monthlyPayment: d.monthlyPayment,
      interestRate: d.interestRate,
      status: d.status,
      advisorName: d.advisorName,
      vehicleModelName: d.vehicleModelName,
      registrationNumber: d.registrationNumber,
      lastStep: d.lastStep,
      notes: d.notes,
      createdAt: d.createdAt.toISOString(),
      client: d.client
        ? {
            id: d.client.id,
            firstName: d.client.firstName || fallbackClient.firstName,
            lastName: d.client.lastName || fallbackClient.lastName,
            phone: d.client.phone,
            email: d.client.email,
          }
        : {
            id: 'client-ref',
            firstName: fallbackClient.firstName,
            lastName: fallbackClient.lastName,
            phone: fallbackClient.phone,
            email: fallbackClient.email,
          },
    }
  })

  return <FinancingDashboardClient initialDossiers={serializedDossiers} />
}
