import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authService } from '@/services/auth.service'
import { SESSION_CONFIG } from '@/config/constants'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value

    if (token) {
      await authService.logout(token)
      cookieStore.delete(SESSION_CONFIG.cookieName)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: true })
  }
}
