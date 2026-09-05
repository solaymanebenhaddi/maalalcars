'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Bell,
  MapPin,
  Car,
  User,
  Receipt,
  ChevronDown,
  Menu,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  X,
  Building2,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

interface VehicleSearchResult {
  id: string
  code: string
  brand: string
  model: string
  year: number
  vin: string
  matricule: string | null
  status: string
  targetSalePrice: number
}

interface ContactSearchResult {
  id: string
  code: string
  firstName: string | null
  lastName: string | null
  companyName: string | null
  phone: string
  city: string
  role: string
}

interface InvoiceSearchResult {
  id: string
  code: string
  totalTTC: number
  contact?: { firstName?: string | null; lastName?: string | null }
}

interface SearchResults {
  vehicles: VehicleSearchResult[]
  contacts: ContactSearchResult[]
  sales: Array<{ id: string; code: string; vehicle?: { brand?: string; model?: string } }>
  invoices: InvoiceSearchResult[]
  documents: Array<{ id: string; code: string; title: string }>
}

interface TopbarProps {
  onOpenMobileNav: () => void
  onOpenQuickAction: () => void
  onOpenNotifications: () => void
  unreadNotificationsCount?: number
  userName?: string
  userEmail?: string
  userRole?: string
  parks?: { id: string; name: string; vehicleCount: number }[]
  totalVehicleCount?: number
}

export function Topbar({
  onOpenMobileNav,
  onOpenQuickAction,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  userName,
  userEmail,
  userRole,
  parks,
  totalVehicleCount,
}: TopbarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isParkMenuOpen, setIsParkMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const parkMenuRef = useRef<HTMLDivElement>(null)

  // Handle Search API
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (res.ok) {
          const data = (await res.json()) as SearchResults
          setSearchResults(data)
        }
      } catch (err) {
        console.error('Search error:', err)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (parkMenuRef.current && !parkMenuRef.current.contains(event.target as Node)) {
        setIsParkMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#222228] bg-[#0c0c0e]/95 px-4 backdrop-blur-md lg:px-8">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileNav}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#26262e] bg-[#141418] text-zinc-300 hover:text-white lg:hidden"
          aria-label="Ouvrir menu navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un véhicule, client, matricule, VIN, facture..."
              className="h-10 w-full rounded-lg border border-[#222228] bg-[#141418] pl-10 pr-9 text-xs text-white placeholder-zinc-400 transition-all focus:border-red-500 focus:bg-[#18181f] focus:outline-none focus:ring-1 focus:ring-red-500/50"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults(null)
                }}
                className="absolute right-3 text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 hidden sm:flex items-center gap-1 rounded border border-[#2a2d3d] bg-[#1a1b24] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 pointer-events-none">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>

          {/* Instant Search Dropdown */}
          {searchResults && (
            <div className="absolute left-0 right-0 top-12 max-h-[480px] overflow-y-auto rounded-xl border border-[#282832] bg-[#121216] p-3 shadow-2xl shadow-black/80 z-50">
              <div className="text-[10px] font-bold text-zinc-400 uppercase px-2 mb-2">
                Résultats pour « {searchQuery} »
              </div>

              {/* Vehicles */}
              {searchResults.vehicles.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-cyan-400">
                    <Car className="h-3.5 w-3.5" />
                    <span>Véhicules ({searchResults.vehicles.length})</span>
                  </div>
                  {searchResults.vehicles.map((v) => (
                    <Link
                      key={v.id}
                      href={`/vehicles/${v.id}`}
                      onClick={() => setSearchResults(null)}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-[#1c1c24] text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {v.brand} {v.model} ({v.year})
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {v.matricule || v.vin} — {v.status}
                        </div>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold">{v.targetSalePrice?.toLocaleString()} DH</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Contacts */}
              {searchResults.contacts.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-emerald-400">
                    <User className="h-3.5 w-3.5" />
                    <span>Contacts & Clients ({searchResults.contacts.length})</span>
                  </div>
                  {searchResults.contacts.map((c) => (
                    <Link
                      key={c.id}
                      href={`/contacts/${c.id}`}
                      onClick={() => setSearchResults(null)}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-[#1c1c24] text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {c.firstName} {c.lastName} {c.companyName}
                        </div>
                        <div className="text-[10px] text-zinc-400">{c.phone} — {c.city} ({c.role})</div>
                      </div>
                      <span className="rounded bg-[#22222a] px-1.5 py-0.5 text-[10px] text-zinc-300">{c.code}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {searchResults.invoices.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-amber-400">
                    <Receipt className="h-3.5 w-3.5" />
                    <span>Factures ({searchResults.invoices.length})</span>
                  </div>
                  {searchResults.invoices.map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/invoices/${inv.id}`}
                      onClick={() => setSearchResults(null)}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-[#1c1c24] text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">{inv.code}</div>
                        <div className="text-[10px] text-zinc-400">{inv.contact?.firstName} {inv.contact?.lastName}</div>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">{inv.totalTTC?.toLocaleString()} DH</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.vehicles.length === 0 &&
                searchResults.contacts.length === 0 &&
                searchResults.invoices.length === 0 && (
                  <div className="py-6 text-center text-xs text-zinc-400">
                    Aucun résultat trouvé pour « {searchQuery} »
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Quick Action, Branch, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Interactive Multi-Park / Showroom Selector */}
        <div ref={parkMenuRef} className="relative hidden xl:block">
          <button
            type="button"
            onClick={() => setIsParkMenuOpen(!isParkMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#222228] bg-[#141418] px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-red-500" />
            <span className="font-semibold text-white">Réseau Multi-Parcs</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {isParkMenuOpen && (
            <div className="absolute right-0 top-11 w-64 rounded-xl border border-[#282834] bg-[#121216] p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Emplacement Actif
              </div>
              <Link
                href="/vehicles"
                onClick={() => setIsParkMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#181820] text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🌐</span>
                  <span>Tous les Parcs (National)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{totalVehicleCount ?? 0} véhicules</span>
              </Link>
              {(parks ?? []).map((park) => (
                <Link
                  key={park.id}
                  href={`/vehicles?park=${encodeURIComponent(park.name)}`}
                  onClick={() => setIsParkMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#181820] text-zinc-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-white">{park.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{park.vehicleCount} voitures</span>
                </Link>
              ))}
              <div className="border-t border-[#202028] pt-1 mt-1">
                <Link
                  href="/parks"
                  onClick={() => setIsParkMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-500/10 font-semibold"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Gérer &amp; Ajouter un Parc</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition-all hover:from-red-500 hover:to-red-600 hover:shadow-red-900/60 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Action rapide</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#222228] bg-[#141418] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
          aria-label="Centre de notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-[#0c0c0e]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Replay Initial Wheel Loader */}
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('maalal_app_initial_loaded')
            window.dispatchEvent(new CustomEvent('replay-maalal-intro'))
          }}
          title="Rejouer l'animation de démarrage (Roue Michelin & MAALAL CAR)"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#222228] bg-[#141418] text-zinc-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 group"
          aria-label="Rejouer l'animation de démarrage"
        >
          <WheelSpinner size="xs" speed="normal" glow={false} className="group-hover:scale-125 transition-transform" />
        </button>

        {/* User Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-[#222228] bg-[#141418] p-1.5 pr-2.5 transition-all hover:border-zinc-700"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/40 bg-gradient-to-tr from-red-600 to-red-500 text-xs font-black text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              {(userName || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <div className="text-xs font-semibold text-white leading-none">{userName || 'Utilisateur'}</div>
              <div className="text-[10px] text-zinc-400 leading-none mt-1">{userRole || ''}</div>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 md:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-[#282832] bg-[#121216] p-2 shadow-2xl z-50">
              <div className="border-b border-[#222228] px-3 py-2">
                <div className="text-xs font-bold text-white">{userName || 'Utilisateur'}</div>
                <div className="text-[11px] text-zinc-400">{userEmail || ''}</div>
                {userRole && (
                  <span className="mt-1 inline-block rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                    {userRole}
                  </span>
                )}
              </div>
              <div className="py-1 space-y-0.5">
                <Link
                  href="/settings/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-[#1c1c24] hover:text-white"
                >
                  <User className="h-4 w-4 text-zinc-400" />
                  <span>Mon Profil</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-[#1c1c24] hover:text-white"
                >
                  <SettingsIcon className="h-4 w-4 text-zinc-400" />
                  <span>Paramètres Système</span>
                </Link>
                <Link
                  href="/users/audit-log"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-[#1c1c24] hover:text-white"
                >
                  <Shield className="h-4 w-4 text-zinc-400" />
                  <span>Journal de Sécurité</span>
                </Link>
              </div>
              <div className="border-t border-[#222228] pt-1 mt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false)
                    router.push('/login')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
