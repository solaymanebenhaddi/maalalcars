'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { z } from 'zod'

const clientLoginSchema = z.object({
  email: z.string().email("Format d'adresse email invalide"),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  // Handle brute-force lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return

    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutRemaining])

  const isLocked = lockoutRemaining > 0

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      setError(`Trop de tentatives. Veuillez patienter ${lockoutRemaining} seconde${lockoutRemaining > 1 ? 's' : ''}.`)
      return
    }

    const sanitizedEmail = email.trim().toLowerCase()

    // Client-side validation before hitting the server
    const validation = clientLoginSchema.safeParse({
      email: sanitizedEmail,
      password,
    })

    if (!validation.success) {
      const firstIssue = validation.error.issues[0]
      setError(firstIssue?.message || 'Identifiants invalides')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizedEmail, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const nextAttempts = failedAttempts + 1
        setFailedAttempts(nextAttempts)

        if (nextAttempts >= MAX_ATTEMPTS) {
          setLockoutRemaining(LOCKOUT_SECONDS)
          setFailedAttempts(0)
          setError(`Sécurité : trop de tentatives échouées. Compte temporairement verrouillé pour ${LOCKOUT_SECONDS}s.`)
        } else {
          setError(data.error || 'Identifiants invalides')
        }

        setIsLoading(false)
        return
      }

      // Successful login: reset attempts and launch startup sequence
      setFailedAttempts(0)
      sessionStorage.removeItem('maalal_app_initial_loaded')
      window.dispatchEvent(new CustomEvent('replay-maalal-intro'))
      router.push('/')
      router.refresh()
    } catch {
      setError('Erreur de connexion au serveur. Veuillez vérifier votre réseau.')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 overflow-hidden bg-cover bg-center bg-no-repeat selection:bg-red-900 selection:text-white"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      {/* Subtle cinematic ambient vignette */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Floating Center Glassmorphic Card (Faithful to reference mockup) */}
      <div className="relative z-10 w-full max-w-[530px] rounded-[28px] border border-[#ef233c]/60 bg-[#0c0e14]/80 p-8 sm:p-11 backdrop-blur-2xl shadow-[0_0_35px_rgba(239,35,60,0.4),0_0_15px_rgba(239,35,60,0.25),0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <Image
              src="/logo.png?v=4"
              alt="MAALAL CARS"
              width={112}
              height={112}
              unoptimized
              className="h-28 w-28 object-contain drop-shadow-[0_0_24px_rgba(239,35,60,0.55)]"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-[0.16em] text-white uppercase mt-2">
            MAALAL CARS
          </h1>
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal tracking-normal">
            Plateforme de Gestion Automobile — Casablanca, Maroc
          </p>
        </div>

        {/* Security & Error Feedback Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2.5 text-xs text-red-300 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Identifiant / Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-[13px] font-semibold text-zinc-300 mb-2"
            >
              Identifiant / Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-[18px] w-[18px] text-zinc-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@payroll.com"
                required
                autoComplete="username"
                disabled={isLoading || isLocked}
                className="h-[52px] w-full rounded-xl border border-[#2f3b4d] bg-[#18202d]/95 pl-11 pr-4 text-sm sm:text-[15px] text-white placeholder:text-zinc-500 focus:border-red-500 focus:bg-[#1a2232] focus:outline-none focus:ring-2 focus:ring-red-500/25 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Mot de Passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-[13px] font-semibold text-zinc-300 mb-2"
            >
              Mot de Passe
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-[18px] w-[18px] text-zinc-400 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
                disabled={isLoading || isLocked}
                className="h-[52px] w-full rounded-xl border border-[#2f3b4d] bg-[#18202d]/95 pl-11 pr-12 text-sm sm:text-[15px] text-white placeholder:text-zinc-500 focus:border-red-500 focus:bg-[#1a2232] focus:outline-none focus:ring-2 focus:ring-red-500/25 transition-all font-mono tracking-wider disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3.5 p-1 rounded-md text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="group relative flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#ff0d2a] via-[#ef142e] to-[#dc041f] hover:from-[#ff243e] hover:to-[#ea102c] text-sm sm:text-[15px] font-bold text-white shadow-[0_0_28px_rgba(239,20,46,0.65)] hover:shadow-[0_0_36px_rgba(239,20,46,0.85)] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connexion en cours...</span>
              </span>
            ) : (
              <>
                <span>Accéder à la plateforme</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
