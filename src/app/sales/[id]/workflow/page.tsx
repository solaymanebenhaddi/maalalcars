import React from 'react'
import prisma from '@/lib/db'
import { SaleWorkflowClient } from '@/components/sales/sale-workflow-client'
import { getActiveUserRole } from '@/lib/auth-roles'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SaleWorkflowPage({ params }: Props) {
  const { id } = await params

  // Look up sale by id or code
  const sale = await prisma.sale.findFirst({
    where: {
      OR: [{ id }, { code: id }],
    },
    include: {
      vehicle: {
        include: {
          photos: true,
          repairs: {
            include: { paidBy: true },
            orderBy: { startedAt: 'desc' },
          },
        },
      },
      buyer: true,
      salesperson: true,
      receivedBy: true,
      commissioner: true,
      payments: {
        orderBy: { paymentDate: 'desc' },
      },
    },
  })

  // Load personnel list for repair payer assignment
  const personnelList = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  // Load active user role
  const currentUser = await getActiveUserRole()

  return (
    <SaleWorkflowClient
      initialSale={sale ? JSON.parse(JSON.stringify(sale)) : null}
      fallbackCode={id}
      personnelList={personnelList}
      currentUser={currentUser}
    />
  )
}
