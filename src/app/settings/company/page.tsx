'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Image,
  FileText,
  CreditCard,
  Globe,
  CheckCircle2,
} from 'lucide-react'

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const subNav = [
    { id: 'general', label: 'Informations générales', icon: Building2 },
    { id: 'visual', label: 'Identité visuelle', icon: Image },
    { id: 'docs', label: 'Documents', icon: FileText },
    { id: 'banking', label: 'Coordonnées bancaires', icon: CreditCard },
    { id: 'locale', label: 'Préférences locales', icon: Globe },
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

      {/* Main Container matching Reference #29 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Entreprise — Informations générales
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Entreprise • Coordonnées officielles, statut juridique et identifiants fiscaux
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
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales de l&apos;entreprise
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Nom de l&apos;entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="MAALAL CARS"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Forme juridique <span className="text-red-500">*</span>
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                  <option>SARL</option>
                  <option>SARL AU</option>
                  <option>SA</option>
                  <option>SAS</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Numéro d&apos;immatriculation (RC) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="RC/DAK/2020/B/12345"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Numéro fiscal (ICE / IF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="001234567890"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Secteur d&apos;activité
                </label>
                <select className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                  <option>Vente et location de véhicules</option>
                  <option>Concessionnaire automobile</option>
                  <option>Négoce et importation automobile</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Adresse
                </label>
                <textarea
                  rows={2}
                  defaultValue="123, Route de l'Aéroport, Casablanca / Dakar"
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  defaultValue="+212 5 22 12 34 56"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Email officiel
                </label>
                <input
                  type="email"
                  defaultValue="contact@maalalcars.com"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Site web
                </label>
                <input
                  type="text"
                  defaultValue="www.maalalcars.com"
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
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
