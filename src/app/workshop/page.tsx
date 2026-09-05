import React from 'react'
import { operationsRepository } from '@/repositories/operations.repository'
import { WorkshopDashboardClient } from '@/features/workshop/workshop-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function WorkshopPage() {
  const orders = await operationsRepository.getWorkshopOrders()

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    code: o.code,
    serviceType: o.serviceType,
    interventionCategory: o.interventionCategory || 'Entretien',
    priority: o.priority,
    status: o.status,
    scheduledDate: o.scheduledDate.toISOString(),
    dueDate: o.dueDate ? o.dueDate.toISOString() : null,
    partsCostHT: o.partsCostHT,
    laborCostHT: o.laborCostHT,
    totalTTC: o.totalTTC,
    vehicleName: o.vehicleName || (o.vehicle ? `${o.vehicle.brand} ${o.vehicle.model}` : 'N/A'),
    licensePlate: o.licensePlate || (o.vehicle ? o.vehicle.matricule : 'N/A'),
    technicianName: o.technicianName || o.technician?.name || 'N/A',
    workshopBay: o.workshopBay || 'N/A',
    client: o.client
      ? {
          id: o.client.id,
          firstName: o.client.firstName || '',
          lastName: o.client.lastName || '',
          phone: o.client.phone,
        }
      : null,
  }))

  return <WorkshopDashboardClient initialOrders={serializedOrders} />
}
