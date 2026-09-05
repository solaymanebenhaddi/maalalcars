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
  const cookieStore = await cookies()
  const overrideRole = cookieStore.get('maalal_active_role')?.value

  // If role is explicitly overridden for testing to 'vendeur'
  if (overrideRole === 'vendeur') {
    const vendeurUser = await prisma.user.findFirst({
      where: { role: { name: 'Vendeur' }, isActive: true },
      include: { role: true },
    })

    if (vendeurUser) {
      return {
        id: vendeurUser.id,
        name: vendeurUser.name,
        email: vendeurUser.email,
        role: vendeurUser.role.name,
        isSuperAdmin: isSuperAdminRole(vendeurUser.role.name),
      }
    }
  }

  // Check actual session
  const sessionUser: SessionUser | null = await getServerSession()
  if (sessionUser) {
    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role.name,
      isSuperAdmin: isSuperAdminRole(sessionUser.role.name),
    }
  }

  // Default: Super Admin (Adem Maalal)
  const superAdminUser = await prisma.user.findFirst({
    where: {
      role: { name: { in: ['Super Admin', 'SUPER_ADMIN'] } },
    },
    include: { role: true },
  })

  if (superAdminUser) {
    return {
      id: superAdminUser.id,
      name: superAdminUser.name,
      email: superAdminUser.email,
      role: superAdminUser.role.name,
      isSuperAdmin: isSuperAdminRole(superAdminUser.role.name),
    }
  }

  return {
    id: 'anonymous',
    name: 'Utilisateur',
    email: '',
    role: 'Invité',
    isSuperAdmin: false,
  }
}
