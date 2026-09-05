import React from 'react'
import prisma from '@/lib/db'
import {
  InvoicesDashboardClient,
  type InvoiceItem,
} from '@/features/invoices/invoices-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const dbInvoices = await prisma.invoice.findMany({
    include: {
      contact: true,
      sale: {
        include: {
          vehicle: true,
        },
      },
    },
    orderBy: { issueDate: 'desc' },
  })

  const invoices: InvoiceItem[] = dbInvoices.map((inv) => {
    const d = new Date(inv.issueDate)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const issueDateFormatted = `${day}/${month}/${year}`

    const dd = new Date(inv.dueDate)
    const dday = String(dd.getDate()).padStart(2, '0')
    const dmonth = String(dd.getMonth() + 1).padStart(2, '0')
    const dyear = dd.getFullYear()
    const dueDateFormatted = `${dday}/${dmonth}/${dyear}`

    return {
      id: inv.id,
      code: inv.code,
      clientName:
        inv.clientName ||
        inv.contact?.companyName ||
        (inv.contact?.firstName ? `${inv.contact.firstName} ${inv.contact.lastName || ''}`.trim() : 'Client non renseigné'),
      vehicleName:
        inv.vehicleName ||
        (inv.sale?.vehicle ? `${inv.sale.vehicle.brand} ${inv.sale.vehicle.model}` : 'Véhicule non renseigné'),
      issueDateFormatted,
      dueDateFormatted,
      totalTTC: inv.totalTTC,
      status: (inv.status as InvoiceItem['status']) || 'PENDING',
      paymentMethod: inv.paymentMethod || 'Non renseigné',
    }
  })

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
        Aucune facture enregistrée pour le moment.
      </div>
    )
  }

  return <InvoicesDashboardClient invoices={invoices} />
}
