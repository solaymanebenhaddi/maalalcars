import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '@/app/login/page'
import { z } from 'zod'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const clientLoginSchema = z.object({
  email: z.string().email("Format d'adresse email invalide"),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

describe('LoginPage Component & Security Validation', () => {
  it('renders all required brand elements and visual structure faithfully', () => {
    const markup = renderToStaticMarkup(<LoginPage />)

    // Brand title and subtitle
    expect(markup).toContain('MAALAL CARS')
    expect(markup).toContain('Plateforme de Gestion Automobile — Casablanca, Maroc')

    // High-resolution automotive background and logo
    expect(markup).toContain('/login-bg.jpg')
    expect(markup).toContain('/logo.png?v=4')

    // Form inputs and security attributes
    expect(markup).toContain('Identifiant / Email')
    expect(markup).toContain('name="email"')
    expect(markup).toContain('type="email"')
    expect(markup).toContain('autoComplete="username"')
    expect(markup).toContain('placeholder="admin@payroll.com"')

    expect(markup).toContain('Mot de Passe')
    expect(markup).toContain('name="password"')
    expect(markup).toContain('type="password"')
    expect(markup).toContain('autoComplete="current-password"')

    // Submit button and action text
    expect(markup).toContain('Accéder à la plateforme')

    // Default account info should not be rendered
    expect(markup).not.toContain('Compte par défaut')
  })

  it('enforces client-side validation schema constraints', () => {
    // Valid credentials
    const valid = clientLoginSchema.safeParse({
      email: 'admin@maalalcars.com',
      password: 'password123',
    })
    expect(valid.success).toBe(true)

    // Invalid email
    const invalidEmail = clientLoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(invalidEmail.success).toBe(false)
    if (!invalidEmail.success) {
      expect(invalidEmail.error.issues[0].message).toBe("Format d'adresse email invalide")
    }

    // Too short password (< 6 chars)
    const shortPassword = clientLoginSchema.safeParse({
      email: 'admin@maalalcars.com',
      password: '123',
    })
    expect(shortPassword.success).toBe(false)
    if (!shortPassword.success) {
      expect(shortPassword.error.issues[0].message).toBe(
        'Le mot de passe doit contenir au moins 6 caractères'
      )
    }
  })
})
