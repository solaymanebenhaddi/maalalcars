import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from './db'
import type { User, Session } from '@prisma/client'

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

// ---------------------------------------------------------------------------
// Password utilities
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ---------------------------------------------------------------------------
// Session token
// ---------------------------------------------------------------------------

export function generateSessionToken(): string {
  return uuidv4()
}

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

export interface RequestHeaders {
  get(name: string): string | null
}

export async function createSession(
  userId: string,
  headers: RequestHeaders,
): Promise<Session> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE)

  const ipAddress = headers.get('x-forwarded-for') ?? headers.get('x-real-ip') ?? null
  const userAgent = headers.get('user-agent') ?? null

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })

  return session
}

export interface SessionValidationResult {
  user: User
  session: Session
}

export async function validateSession(
  token: string,
): Promise<SessionValidationResult | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) return null

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } })
    return null
  }

  if (!session.user.isActive) return null

  return { user: session.user, session }
}

export async function invalidateSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } })
}
