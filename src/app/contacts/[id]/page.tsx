'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Car,
  CreditCard,
  UserPlus,
  Edit2,
} from 'lucide-react'

export default function ContactDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CNT-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/contacts"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux contacts</span>
        </Link>
      </div>

      {/* Main Container matching Reference #18 Screen 15b */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Profile Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#2e2e3a] bg-[#1a1a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/imane-zahri.jpg"
                alt="Imane Zahri"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Imane Zahri
                </h1>
                <span className="text-zinc-400 font-medium text-xs">Client</span>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-semibold">Zahri Auto</p>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 pt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="h-2.5 w-2.5 text-zinc-500" />
                  +33 6 12 34 56 78
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-2.5 w-2.5 text-zinc-500" />
                  imane.zahri@gmail.com
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5 text-zinc-500" />
                  45 Avenue des Champs-Élysées, 75008 Paris
                </span>
              </div>
            </div>
          </div>

          {/* Metric Box */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-[11px] space-y-1 min-w-[200px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Client depuis</span>
              <span className="font-mono text-white">12/03/2022</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total achats</span>
              <span className="font-mono font-bold text-white">86 500 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Véhicules achetés</span>
              <span className="font-mono font-bold text-cyan-400">2</span>
            </div>
          </div>
        </div>

        {/* Tabs matching Reference #18 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Informations</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Véhicules</button>
          <Link
            href={`/contacts/${code}/interactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Interactions
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Notes</button>
        </div>

        {/* 2 Panels: Informations clés + Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Informations clés */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations clés
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Type</span>
                <span className="text-white font-medium">Client</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Statut</span>
                <span className="text-emerald-400 font-bold">Actif</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Segment</span>
                <span className="rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                  VIP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Source</span>
                <span className="text-zinc-200">Recommandation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commercial</span>
                <span className="text-zinc-200 font-semibold">Admin Maalal</span>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Activité récente
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500/10 text-red-400">
                    <Car className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Achat véhicule</div>
                    <div className="text-[10px] text-zinc-400">Toyota Land Cruiser 2023</div>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">Il y a 2 jours</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Paiement reçu</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Acompte 5 000 €</div>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">Il y a 5 jours</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 text-cyan-400">
                    <Car className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Essai véhicule</div>
                    <div className="text-[10px] text-zinc-400">BMW X5</div>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">Il y a 8 jours</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                    <UserPlus className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Contact créé</div>
                    <div className="text-[10px] text-zinc-400">Via Site Web</div>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">Il y a 2 ans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Modifier le contact</span>
          </button>
        </div>
      </div>
    </div>
  )
}
