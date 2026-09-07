import { cookies } from 'next/headers'
import { getServerSession, SessionUser } from './session'
import { prisma } from './db'

export const SUPER_ADMIN_ROLE_NAME = 'Super Admin'

/**
 * Checks if a given role name matches the Super Admin role.
 * User requirement: ONLY use Super Admin.
 */
export function isSuperAdminRole(roleName?: string | null): boolean {
  if (!roleName) return false
  const norm = roleName.trim().toLowerCase()
  return norm === 'super admin' || norm === 'super_admin' || norm === 'superadmin'
}

export interface ActiveUserRoleInfo {
  id: string
  name: string
  email: string
  role: string
  isSuperAdmin: boolean
}

/**
 * Resolves the currently active user and role, respecting active session
 * and allowing dynamic role switching for testing through the `maalal_active_role` cookie.
 */
export async function getActiveUserRole(): Promise<ActiveUserRoleInfo> {
  // 1. Check actual authenticated session first
  const sessionUser: SessionUser | null = await getServerSession()
  if (!sessionUser) {
    // If not authenticated, strictly return guest with NO privileges
    return {
      id: 'anonymous',
      name: 'Non connecté',
      email: '',
      role: 'Invité',
      isSuperAdmin: false,
    }
  }

  // 2. Only authenticated Super Admins can simulate role views for testing
  if (isSuperAdminRole(sessionUser.role.name)) {
    const cookieStore = await cookies()
    const overrideRole = cookieStore.get('maalal_active_role')?.value

    if (overrideRole === 'vendeur') {
      const vendeurUser = await prisma.user.findFirst({
        where: { role: { name: 'Vendeur' }, isActive: true },
        include: { role: true },
      })

      if (vendeurUser) {
        return {
          id: sessionUser.id,
          name: `${sessionUser.name} (Simulation Vendeur)`,
          email: sessionUser.email,
          role: vendeurUser.role.name,
          isSuperAdmin: false,
        }
      }
    }
  }

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role: sessionUser.role.name,
    isSuperAdmin: isSuperAdminRole(sessionUser.role.name),
  }
}
