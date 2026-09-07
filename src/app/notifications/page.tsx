import React from 'react'
import { NotificationsDashboardClient } from '@/features/notifications/notifications-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  return <NotificationsDashboardClient />
}
