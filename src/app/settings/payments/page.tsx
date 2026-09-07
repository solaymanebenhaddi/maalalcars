'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Building,
  Sliders,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'

interface PaymentMethod {
  id: number
  method: string
  fee: string
  status: 'Activée' | 'Désactivée'
  statusColor: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 1, method: 'Espèces', fee: '0%', status: 'Activée', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 2, method: 'Virement bancaire', fee: '1%', status: 'Activée', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 3, method: 'Paiement par carte (TPE / CMI)', fee: '2.5%', status: 'Activée', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 4, method: 'Chèque bancaire', fee: '1%', status: 'Désactivée', statusColor: 'bg-red-500/15 text-red-400 border-red-500/30' },
  { id: 5, method: 'Paiement mobile (CIH / Attijari)', fee: '1.5%', status: 'Activée', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
]

interface Branch {
  id: number
  name: string
  address: string
  phone: string
  status: 'Active' | 'Inactive'
  statusColor: string
}

const BRANCHES: Branch[] = [
  { id: 1, name: 'Siège principal', address: "123, Route de l'Aéroport, Casablanca", phone: '+212 5 22 12 34 56', status: 'Active', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 2, name: 'Succursale Rabat', address: '45, Av. Hassan II, Rabat', phone: '+212 5 37 98 76 54', status: 'Active', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 3, name: 'Succursale Tanger', address: 'Rte de Tétouan, Tanger', phone: '+212 5 39 50 60 70', status: 'Inactive', statusColor: 'bg-red-500/15 text-red-400 border-red-500/30' },
]

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState('methods')

  const subNav = [
    { id: 'methods', label: 'Méthodes de paiement', icon: CreditCard },
    { id: 'branches', label: 'Succursales', icon: Building },
    { id: 'preferences', label: 'Préférences', icon: Sliders },
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

      {/* Main Container matching Reference #29 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Méthodes de paiement &amp; Succursales
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Méthodes de paiement • Configuration des moyens de règlement et réseau d&apos;agences
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

          {/* Right Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Méthodes de paiement Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#202028] pb-2">
                <h3 className="text-xs font-bold text-white">
                  Méthodes de paiement
                </h3>
                <button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-red-700">
                  <Plus className="h-3 w-3" />
                  <span>Ajouter une méthode</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#202028]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Méthode</th>
                      <th className="py-2.5 px-3 font-mono">Frais</th>
                      <th className="py-2.5 px-3 text-center">Statut</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                    {PAYMENT_METHODS.map((pm) => (
                      <tr key={pm.id} className="hover:bg-[#18181f] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-white">{pm.method}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-300">{pm.fee}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${pm.statusColor}`}>
                            {pm.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Succursales Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#202028] pb-2">
                <h3 className="text-xs font-bold text-white">
                  Succursales
                </h3>
                <button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-red-700">
                  <Plus className="h-3 w-3" />
                  <span>Ajouter une succursale</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#202028]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Nom</th>
                      <th className="py-2.5 px-3">Adresse</th>
                      <th className="py-2.5 px-3 font-mono">Téléphone</th>
                      <th className="py-2.5 px-3 text-center">Statut</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                    {BRANCHES.map((b) => (
                      <tr key={b.id} className="hover:bg-[#18181f] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-white">{b.name}</td>
                        <td className="py-2.5 px-3 text-zinc-300">{b.address}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-400">{b.phone}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${b.statusColor}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Préférences de paiement */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Préférences de paiement
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-[#16161c] border border-[#24242e] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                  />
                  <span className="text-[11px] text-zinc-200">Appliquer automatiquement les frais aux paiements par carte</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                    Devise principale
                  </label>
                  <select className="h-9 w-full sm:w-64 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500">
                    <option>MAD - Dirham Marocain (DH)</option>
                    <option>EUR - Euro (€)</option>
                    <option>USD - Dollar ($)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
