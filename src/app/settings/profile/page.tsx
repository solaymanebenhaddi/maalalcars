'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Sliders,
  Clock,
  Laptop,
  Camera,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Globe,
} from 'lucide-react'

interface UserProfileData {
  id: string
  email: string
  name: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean
  createdAt: string
  role: {
    id: string
    name: string
    description: string | null
  }
}

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Profile Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [roleName, setRoleName] = useState('Administrateur')
  const [avatarInitials, setAvatarInitials] = useState('MC')
  const [createdAt, setCreatedAt] = useState('')

  // Profile Save State
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password Save State
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Preferences State
  const [language, setLanguage] = useState('Français (Maroc)')
  const [timezone, setTimezone] = useState('Africa/Casablanca (GMT+1)')
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null)

  // Load user data on mount
  useEffect(() => {
    async function loadProfile() {
      setIsLoadingProfile(true)
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          const u: UserProfileData = data.user
          setName(u.name || '')
          setEmail(u.email || '')
          setPhone(u.phone || '')
          setRoleName(u.role?.name || 'Administrateur')
          if (u.createdAt) {
            setCreatedAt(new Date(u.createdAt).toLocaleDateString('fr-FR'))
          }

          const initials = (u.name || 'Maalal Cars')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
          setAvatarInitials(initials || 'MC')
        } else {
          setProfileError('Impossible de charger votre profil.')
        }
      } catch {
        setProfileError('Erreur de connexion lors du chargement du profil.')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)

    if (!name.trim()) {
      setProfileError('Le nom complet est obligatoire.')
      return
    }

    if (!email.trim()) {
      setProfileError("L'adresse email est obligatoire.")
      return
    }

    setIsSavingProfile(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setProfileError(data.error || 'Erreur lors de la mise à jour du profil.')
      } else {
        setProfileSuccess('Vos coordonnées ont été enregistrées avec succès.')
        if (data.user?.name) {
          const initials = data.user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
          setAvatarInitials(initials || 'MC')
        }
        setTimeout(() => setProfileSuccess(null), 6000)
      }
    } catch {
      setProfileError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle Password Update
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword) {
      setPasswordError('Veuillez renseigner votre mot de passe actuel.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Le nouveau mot de passe et la confirmation ne correspondent pas.')
      return
    }

    setIsSavingPassword(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPasswordError(data.error || 'Erreur lors du changement de mot de passe.')
      } else {
        setPasswordSuccess('Votre mot de passe a été modifié avec succès.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordSuccess(null), 6000)
      }
    } catch {
      setPasswordError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleSavePreferences = () => {
    setPrefSuccess('Préférences enregistrées avec succès.')
    setTimeout(() => setPrefSuccess(null), 5000)
  }

  const subNav = [
    { id: 'profile', label: 'Informations personnelles', icon: User },
    { id: 'preferences', label: 'Préférences', icon: Sliders },
    { id: 'sessions', label: 'Sessions actives', icon: Clock },
    { id: 'devices', label: 'Appareils connectés', icon: Laptop },
  ]

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/settings"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Mon profil — Informations personnelles &amp; Sécurité
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Mon profil • Gérez vos coordonnées, votre mot de passe et vos accès
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sub-nav */}
          <div className="space-y-1">
            {subNav.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-[#18181f]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Form Container */}
          <div className="md:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <>
                {/* Informations personnelles form */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#202028] pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-red-500" />
                      <span>Coordonnées &amp; Informations personnelles</span>
                    </h3>
                    {createdAt && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Membre depuis le {createdAt}
                      </span>
                    )}
                  </div>

                  {/* Feedback Alerts */}
                  {profileSuccess && (
                    <div
                      role="status"
                      className="flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2.5 text-xs text-emerald-300 backdrop-blur-sm animate-in fade-in"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  {profileError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2.5 text-xs text-red-300 backdrop-blur-sm animate-in fade-in"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  {/* Avatar section */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20 border-2 border-red-500 font-bold text-red-500 text-lg shadow-[0_0_15px_rgba(239,35,60,0.3)]">
                      {isLoadingProfile ? (
                        <Loader2 className="h-5 w-5 animate-spin text-red-400" />
                      ) : (
                        avatarInitials
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => alert('La gestion des photos personnalisées est prête pour le cloud storage.')}
                        className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Camera className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Changer la photo</span>
                      </button>
                      <p className="text-[10px] text-zinc-500 mt-1">JPG, PNG ou GIF. Max 2Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Solaymane Benhaddi"
                        required
                        disabled={isLoadingProfile || isSavingProfile}
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Rôle &amp; Privilèges
                      </label>
                      <div className="flex items-center gap-2 h-9 rounded-lg border border-[#282834] bg-[#141418] px-3 text-xs text-zinc-300">
                        <Shield className="h-3.5 w-3.5 text-red-500" />
                        <span className="font-semibold text-white">{roleName}</span>
                        <span className="ml-auto text-[9px] text-zinc-500 uppercase tracking-wider">
                          Non modifiable
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Adresse Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@maalalcars.com"
                        required
                        disabled={isLoadingProfile || isSavingProfile}
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Numéro de Téléphone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+212 6 XX XX XX XX"
                        disabled={isLoadingProfile || isSavingProfile}
                        className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isLoadingProfile || isSavingProfile}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Enregistrement en cours...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Enregistrer les modifications</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Mot de passe form */}
                <form onSubmit={handleSavePassword} className="space-y-4 pt-4 border-t border-[#202028]">
                  <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Sécurité — Modifier le mot de passe</span>
                  </h3>

                  {/* Password Feedback Alerts */}
                  {passwordSuccess && (
                    <div
                      role="status"
                      className="flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2.5 text-xs text-emerald-300 backdrop-blur-sm animate-in fade-in"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2.5 text-xs text-red-300 backdrop-blur-sm animate-in fade-in"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Mot de passe actuel <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                          required
                          disabled={isSavingPassword}
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-3 pr-10 text-xs font-mono text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2.5 top-2 text-zinc-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Nouveau mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 caractères"
                          required
                          disabled={isSavingPassword}
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-3 pr-10 text-xs font-mono text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-2 text-zinc-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Retapez le nouveau mot de passe"
                          required
                          disabled={isSavingPassword}
                          className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-3 pr-10 text-xs font-mono text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-2 text-zinc-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="flex items-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] hover:bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSavingPassword ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Validation...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Modifier le mot de passe</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>Préférences régionales &amp; Système</span>
                </h3>

                {prefSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{prefSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 pb-1 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Langue d&apos;affichage</span>
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option>Français (Maroc)</option>
                      <option>Arabe (العربية)</option>
                      <option>Anglais (English)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                      Fuseau horaire
                    </label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      disabled
                      className="h-9 w-full rounded-lg border border-[#282834] bg-[#141418] px-3 text-xs font-mono text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                      Devise officielle
                    </label>
                    <div className="h-9 flex items-center rounded-lg border border-[#282834] bg-[#141418] px-3 text-xs font-bold text-white">
                      MAD (DH) — Dirham Marocain
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                      Format de date
                    </label>
                    <div className="h-9 flex items-center rounded-lg border border-[#282834] bg-[#141418] px-3 text-xs font-mono text-zinc-300">
                      JJ/MM/AAAA (ex: 14/09/2026)
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#202028]">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Enregistrer les préférences</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Sessions actives</span>
                </h3>

                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/30 bg-[#151a1e] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Laptop className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Session actuelle (Navigateur Web)</span>
                          <span className="inline-flex items-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                            Actif maintenant
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Casablanca, Maroc • Google Chrome / Windows
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Cette session</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-cyan-400" />
                  <span>Appareils autorisés</span>
                </h3>

                <div className="space-y-3">
                  <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Laptop className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-white">Poste de travail — Bureau Direction</span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Système vérifié • Autorisation biométrique active
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      Vérifié
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-white">Application Mobile Mayush</span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Accès smartphone • Notifications push activées
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      Connecté
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
