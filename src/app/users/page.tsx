import React from 'react'
import { UsersDashboardClient } from '@/features/users/users-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  return <UsersDashboardClient />
}
