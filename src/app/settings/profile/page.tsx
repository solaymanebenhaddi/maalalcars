'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

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
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres</span>
        </Link>
      </div>

      {/* Main Container matching Reference #29 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Mon profil — Informations personnelles
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Mon profil • Gérez vos coordonnées, votre langue et vos identifiants
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
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
          <div className="md:col-span-3 space-y-5">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Informations personnelles
              </h3>

              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20 border-2 border-red-500 font-bold text-red-500 text-lg">
                  AM
                </div>
                <div>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
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
                    Nom complet
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin Maalal"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Rôle
                  </label>
                  <select disabled className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] px-3 text-xs text-zinc-400 focus:outline-none">
                    <option>Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@maalalcars.com"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Nom d&apos;utilisateur
                  </label>
                  <input
                    type="text"
                    defaultValue="adminmaalal"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    defaultValue="+212 77 123 45 67"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Langue
                  </label>
                  <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                    <option>Français (Maroc)</option>
                    <option>Arabe (العربية)</option>
                    <option>Anglais (English)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mot de passe section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                <span>Mot de passe</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe..."
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmer..."
                    className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
                  Modifier le mot de passe
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-4 border-t border-[#202028]">
              <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
