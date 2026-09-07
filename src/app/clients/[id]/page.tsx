'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit2,
  Car,
  FileQuestion,
  Building,
  CheckCircle2,
} from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CLT-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/clients"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux clients</span>
        </Link>
      </div>

      {/* Main Container matching Reference #21 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#2e2e3a] bg-[#1a1a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/sarah-martin.jpg"
                alt="Sarah Martin"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Sarah Martin
                </h1>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Client depuis le 12 mars 2024 • ID : CLT-0001245
              </p>
            </div>
          </div>

          {/* 4 Metric Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-2 min-w-[70px]">
              <div className="font-mono font-bold text-white text-xs">45 300 €</div>
              <div className="text-zinc-500 text-[9px]">CA total</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-2 min-w-[70px]">
              <div className="font-mono font-bold text-cyan-400 text-xs">12</div>
              <div className="text-zinc-500 text-[9px]">Achats</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-2 min-w-[70px]">
              <div className="font-mono font-bold text-emerald-400 text-xs">2</div>
              <div className="text-zinc-500 text-[9px]">Véhicules</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-2 min-w-[70px]">
              <div className="font-mono font-bold text-purple-400 text-xs">VIP</div>
              <div className="text-zinc-500 text-[9px]">Segment</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Vue d&apos;ensemble</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Informations</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Véhicules</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Achats</button>
          <Link href={`/clients/${code}/interactions`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Interactions
          </Link>
          <Link href={`/clients/${code}/documents`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Documents
          </Link>
        </div>

        {/* 2 Panels: Informations personnelles + Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Informations personnelles */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations personnelles
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Civilité</span>
                <span className="text-white">Madame</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Prénom</span>
                <span className="text-white">Sarah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Nom</span>
                <span className="text-white">Martin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Email</span>
                <span className="text-zinc-200">s.martin@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Téléphone</span>
                <span className="font-mono text-white">+33 6 23 45 67 89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Téléphone 2</span>
                <span className="text-zinc-500">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date de naissance</span>
                <span className="font-mono text-zinc-300">14/05/1988</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Adresse</span>
                <span className="text-zinc-200 text-right">12 Rue de la République, 69002 Lyon, France</span>
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
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Achat effectué</div>
                    <div className="text-[10px] text-zinc-400">BMW X3 xDrive30e</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">12/05/2025</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 text-cyan-400">
                    <Car className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Demande d&apos;essai</div>
                    <div className="text-[10px] text-zinc-400">Mercedes GLC 300</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">28/04/2025</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10 text-amber-400">
                    <FileQuestion className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Demande d&apos;information</div>
                    <div className="text-[10px] text-zinc-400">Financement LOA</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">15/04/2025</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                    <Building className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Visite en concession</div>
                    <div className="text-[10px] text-zinc-400">Lyon</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">03/04/2025</span>
              </div>

              <div className="border-t border-[#202028] pt-1 text-center">
                <Link href={`/clients/${code}/interactions`} className="text-[10px] text-red-400 hover:text-red-300 font-semibold">
                  Voir tout l&apos;historique
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202028]">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Phone className="h-3.5 w-3.5 text-zinc-400" />
              <span>Appeler</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span>Envoyer un email</span>
            </button>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Modifier</span>
          </button>
        </div>
      </div>
    </div>
  )
}
