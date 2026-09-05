import React from 'react'
import prisma from '@/lib/db'
import { AppointmentsDashboardClient } from '@/features/appointments/appointments-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
  const dbAppointments = await prisma.appointment.findMany({
    include: {
      client: true,
      advisor: true,
    },
    orderBy: { startTime: 'asc' },
  })

  const appointments = dbAppointments.map((a) => ({
    id: a.id,
    code: a.code || `RDV-${a.id.slice(-4)}`,
    title: a.title,
    serviceType: a.serviceType,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    workshopBay: a.workshopBay || 'N/A',
    reminderMin: a.reminderMin,
    notes: a.notes,
    clientName: a.clientName || (a.client ? `${a.client.firstName} ${a.client.lastName}` : 'Client non renseigné'),
    clientPhone: a.clientPhone || a.client?.phone || '',
    clientEmail: a.clientEmail || a.client?.email,
    vehicleName: a.vehicleName || 'Véhicule non renseigné',
    licensePlate: a.licensePlate || '',
    vin: a.vin || '',
    mileage: a.mileage,
    advisorName: a.advisorName || a.advisor?.name || 'N/A',
    source: a.source || '',
    duration: a.duration || '',
  }))

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
        Aucun rendez-vous enregistré pour le moment.
      </div>
    )
  }

  return <AppointmentsDashboardClient initialAppointments={appointments} />
}
