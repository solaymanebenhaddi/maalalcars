'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Clock,
  Car,
  CheckSquare,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export default function DeliveryChecklistPage() {
  const params = useParams()
  const code = (params?.id as string) || 'LDV-2025-0056'

  const [vehicleItems, setVehicleItems] = useState<ChecklistItem[]>([
    { id: 'v1', label: 'Nettoyage intérieur / extérieur', checked: true },
    { id: 'v2', label: 'Contrôle carrosserie & peinture', checked: true },
    { id: 'v3', label: 'Niveau de carburant (min. 50%)', checked: true },
    { id: 'v4', label: 'Pression des pneus & roue de secours', checked: true },
    { id: 'v5', label: 'Accessoires & kit sécurité', checked: true },
  ])

  const [docItems, setDocItems] = useState<ChecklistItem[]>([
    { id: 'd1', label: 'Carte grise originale / CPI', checked: true },
    { id: 'd2', label: 'Certificat de conformité', checked: true },
    { id: 'd3', label: 'Manuel utilisateur & carnet d’entretien', checked: true },
    { id: 'd4', label: 'Double des clés & télécommandes', checked: true },
  ])

  const [clientItems, setClientItems] = useState<ChecklistItem[]>([
    { id: 'c1', label: 'Explications des fonctionnalités (MBUX, aides...)', checked: true },
    { id: 'c2', label: 'Essai dynamique du véhicule', checked: false },
    { id: 'c3', label: 'Remise officielle des documents signés', checked: false },
    { id: 'c4', label: 'Signature électronique du bon de livraison', checked: false },
  ])

  const toggleItem = (category: 'vehicle' | 'doc' | 'client', id: string) => {
    if (category === 'vehicle') {
      setVehicleItems(vehicleItems.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
    } else if (category === 'doc') {
      setDocItems(docItems.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
    } else {
      setClientItems(clientItems.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
    }
  }

  const allItems = [...vehicleItems, ...docItems, ...clientItems]
  const checkedCount = allItems.filter(i => i.checked).length
  const totalCount = allItems.length
  const pct = Math.round((checkedCount / totalCount) * 100)

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/deliveries"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux livraisons</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/deliveries/${code}/receipt`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>Bon de livraison</span>
          </Link>

          <Link
            href={`/deliveries/${code}/history`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Historique</span>
          </Link>
        </div>
      </div>

      {/* Main Container matching Reference #26 Screen 26B */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Delivery Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                Checklist de remise — Mercedes GLE 53 AMG
              </h1>
              <span className="inline-flex items-center rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                À remettre
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5 font-mono">
              <span className="text-zinc-300">Immatriculation : WW-325-KL</span>
              <span>•</span>
              <span>Client : Sophie Martin</span>
              <span>•</span>
              <span>Date : 20/05/2025 10:30</span>
            </div>
          </div>
        </div>

        {/* Progression Bar */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Progression de la checklist</span>
            <span className="font-mono font-bold text-emerald-400">{checkedCount} / {totalCount} ({pct}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#1e1e24] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Checklist</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Observations</button>
        </div>

        {/* 3 Checklist Columns matching Reference #26 Screen 26B */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section 1: Véhicule */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-cyan-400" />
              <span>Véhicule</span>
            </h3>

            <div className="space-y-2">
              {vehicleItems.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleItem('vehicle', item.id)}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[#121216] border border-[#22222c] cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="mt-0.5 h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                  />
                  <span className={`text-[11px] leading-tight ${item.checked ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Documents */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Documents</span>
            </h3>

            <div className="space-y-2">
              {docItems.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleItem('doc', item.id)}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[#121216] border border-[#22222c] cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="mt-0.5 h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                  />
                  <span className={`text-[11px] leading-tight ${item.checked ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Remise client */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-amber-400" />
              <span>Remise client</span>
            </h3>

            <div className="space-y-2">
              {clientItems.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleItem('client', item.id)}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[#121216] border border-[#22222c] cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="mt-0.5 h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0"
                  />
                  <span className={`text-[11px] leading-tight ${item.checked ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
            Observations
          </label>
          <textarea
            rows={2}
            defaultValue="Aucune observation. Véhicule préparé en parfait état cosmétique et mécanique."
            className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202028]">
          <Link
            href="/deliveries"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Enregistrer le brouillon
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Valider la checklist</span>
          </button>
        </div>
      </div>
    </div>
  )
}
