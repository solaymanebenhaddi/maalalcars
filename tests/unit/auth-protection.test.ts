import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'
import { getActiveUserRole } from '@/lib/auth-roles'

// Mock cookies for getActiveUserRole
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  }),
}))

describe('Security & Authentication Guard Suite', () => {
  it('middleware redirects unauthenticated users from dashboard / to /login', () => {
    const req = new NextRequest('https://maalalcars.com/')
    const res = middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://maalalcars.com/login')
  })

  it('middleware redirects unauthenticated users from protected pages with callbackUrl', () => {
    const req = new NextRequest('https://maalalcars.com/vehicles')
    const res = middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://maalalcars.com/login?callbackUrl=%2Fvehicles')
  })

  it('middleware blocks unauthenticated API requests with 401 Unauthorized', async () => {
    const req = new NextRequest('https://maalalcars.com/api/layout')
    const res = middleware(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toContain('Authentification requise')
  })

  it('middleware allows public assets and /login without session', () => {
    const loginReq = new NextRequest('https://maalalcars.com/login')
    const loginRes = middleware(loginReq)
    expect(loginRes.status).toBe(200)

    const staticReq = new NextRequest('https://maalalcars.com/wheel.png')
    const staticRes = middleware(staticReq)
    expect(staticRes.status).toBe(200)
  })

  it('middleware redirects authenticated users with valid UUID token from /login to dashboard', () => {
    const req = new NextRequest('https://maalalcars.com/login', {
      headers: {
        cookie: 'maalal_session=c4b69324-1c60-4e3e-a894-3158c5382346',
      },
    })
    const res = middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://maalalcars.com/')
  })

  it('middleware rejects malformed/forged session tokens and treats as unauthenticated', () => {
    const req = new NextRequest('https://maalalcars.com/vehicles', {
      headers: {
        cookie: 'maalal_session=forged-or-empty-token',
      },
    })
    const res = middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://maalalcars.com/login?callbackUrl=%2Fvehicles')
  })

  it('getActiveUserRole NEVER falls back to Super Admin when unauthenticated', async () => {
    const active = await getActiveUserRole()

    expect(active.role).toBe('Invité')
    expect(active.isSuperAdmin).toBe(false)
    expect(active.name).toBe('Non connecté')
    expect(active.email).toBe('')
  })
})
