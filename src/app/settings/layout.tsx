import { requireRole } from '@/lib/session'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('Administrateur')
  return <>{children}</>
}
