import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authService } from '@/services/auth.service'
import { loginSchema } from '@/validation/auth.schema'
import { SESSION_CONFIG } from '@/config/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.parse(body)

    const result = await authService.login(parsed, {
      get: (name: string) => request.headers.get(name),
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_CONFIG.cookieName, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_CONFIG.maxAge / 1000, // seconds
    })

    return NextResponse.json({
      user: result.user,
      expiresAt: result.expiresAt,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur de connexion'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
