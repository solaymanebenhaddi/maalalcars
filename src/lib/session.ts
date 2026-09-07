import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './db'
import { SESSION_CONFIG } from '@/config/constants'

export interface SessionUser {
  id: string
  email: string
  name: string
  isActive: boolean
  role: {
    id: string
    name: string
  }
}

/**
 * Read and validate the current session from the cookie.
 * Returns the user with role, or null if not authenticated.
 */
export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value

  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: { role: true },
      },
    },
  })

  if (!session) return null
  if (session.expiresAt < new Date()) return null
  if (!session.user.isActive) return null

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    isActive: session.user.isActive,
    role: {
      id: session.user.role.id,
      name: session.user.role.name,
    },
  }
}

/**
 * Require an authenticated session with a specific role.
 * Redirects to the target path if the check fails.
 */
export async function requireRole(
  roleName: string,
  redirectTo = '/dashboard',
): Promise<SessionUser> {
  const user = await getServerSession()

  if (!user || user.role.name !== roleName) {
    redirect(redirectTo)
  }

  return user
}
