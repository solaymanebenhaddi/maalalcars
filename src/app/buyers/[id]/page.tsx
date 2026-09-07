import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BuyerDetailPage({ params }: Props) {
  const { id } = await params

  // Normalized code for routing
  const code = id || 'CLT-001'
  const name = 'Imane Zahiri'
  const email = 'imane.zahiri@gmail.com'
  const phone = '+212 6 12 34 56 78'
  const city = 'Casablanca, Maroc'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/buyers/list"
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à la liste</span>
          </Link>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <span>Action rapide</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Main Buyer Header Banner matching Reference #14 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e1e28] border border-[#2a2a38] text-base font-black text-white font-mono shadow-md">
              IZ
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                <span>
                  Acheteur depuis mars 2023 •{' '}
                  <strong className="text-emerald-400 font-semibold">Client actif</strong>
                </span>
                <span className="flex items-center gap-1 text-zinc-300 font-mono">
                  <Phone className="h-3 w-3 text-zinc-500" />
                  {phone}
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Mail className="h-3 w-3 text-zinc-500" />
                  {email}
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <MapPin className="h-3 w-3 text-zinc-500" />
                  {city}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Top Header Metrics matching Reference #14 Screen 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Achats totaux</div>
              <div className="font-mono font-black text-white text-xs pt-0.5">1 248 500 DH</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Commandes</div>
              <div className="font-mono font-black text-white text-xs pt-0.5">28</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2 text-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Encours actuel</div>
              <div className="font-mono font-black text-white text-xs pt-0.5">24 900 DH</div>
            </div>

            <div className="rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2 text-center flex flex-col justify-center items-center">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Statut</div>
              <span className="inline-block mt-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Actif
              </span>
            </div>
          </div>
        </div>

        {/* Tabs matching Reference #14 Screen 3 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link
            href={`/buyers/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Transactions
          </Link>
          <Link
            href={`/buyers/${code}/payments`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Paiements
          </Link>
          <Link
            href={`/buyers/${code}/history`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Historique
          </Link>
        </div>

        {/* 3 Main Grid Panels matching Reference #14 Screen 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: Informations générales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Informations générales
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Nom complet</span>
                <span className="font-bold text-white">{name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Téléphone</span>
                <span className="font-mono text-zinc-200">{phone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Email</span>
                <span className="text-zinc-200">{email}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Ville</span>
                <span className="text-zinc-200">Casablanca</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Adresse</span>
                <span className="text-zinc-200 text-right">
                  Résidence Les Roses, Maarif, Casablanca
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Profession</span>
                <span className="text-zinc-200">Entrepreneure</span>
              </div>

              <div className="pt-1">
                <span className="text-zinc-400 block mb-0.5 text-[10px]">Notes</span>
                <div className="rounded bg-[#121216] border border-[#202028] p-2 text-zinc-300 text-[10px]">
                  Cliente fidèle, paiements réguliers.
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Résumé financier */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Résumé financier
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Achats totaux</span>
                <span className="font-mono font-bold text-white">1 248 500 DH</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Nombre de commandes</span>
                <span className="font-mono font-bold text-white">28</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Montant payé</span>
                <span className="font-mono font-bold text-white">1 223 600 DH</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Encours actuel</span>
                <span className="font-mono font-bold text-red-400">24 900 DH</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Délai moyen de paiement</span>
                <span className="font-mono font-bold text-emerald-400">18 jours</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Dernier paiement</span>
                <span className="font-mono text-zinc-300 text-right">
                  25 000 DH le 29/05/2025
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Dernière commande */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3.5 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Dernière commande
            </h3>

            <div className="space-y-3">
              {/* Car photo + Info row matching Reference #14 */}
              <div className="flex items-center gap-3">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#101014] border border-[#202028]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/vehicles/toyota-land-cruiser-2023.jpg"
                    alt="Toyota Land Cruiser 2023"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold text-white text-xs">Toyota Land Cruiser 2023</div>
                  <div className="text-[10px] text-zinc-400">VXR 4.0L Essence</div>
                  <div className="font-mono font-black text-white text-sm pt-1">
                    86 500 DH
                  </div>
                </div>
              </div>

              {/* Order Date & Status */}
              <div className="space-y-1 text-[11px]">
                <div className="font-mono text-[10px] text-zinc-400">
                  30/05/2025 • CMD-2025-028
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Statut : <span className="font-semibold text-emerald-400">Confirmée</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <Link
              href={`/buyers/${code}/transactions`}
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#282834] bg-[#18181f] py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Voir toutes les commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
