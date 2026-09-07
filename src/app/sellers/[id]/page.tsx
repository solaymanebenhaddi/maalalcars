import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Edit2,
  ChevronDown,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SellerDetailPage({ params }: Props) {
  const { id } = await params
  const code = id || 'VEN-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/sellers/list"
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à la liste</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Détail du vendeur
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Modifier</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <span>Actions</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #15 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Top Profile Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#2e2e3a] bg-[#1a1a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/youssef-el-idrissi.jpg"
                alt="Youssef El Idrissi"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Youssef El Idrissi
                </h2>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Vendeur depuis Mars 2022</p>
            </div>
          </div>

          {/* Contact Badges & Total Summary Box */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2">
              <Phone className="h-3.5 w-3.5 text-zinc-400" />
              <div>
                <div className="font-mono text-xs font-bold text-white">+212 6 61 12 34 56</div>
                <div className="text-[10px] text-zinc-500">Téléphone</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <div>
                <div className="text-xs font-bold text-white">y.elidrissi@gmail.com</div>
                <div className="text-[10px] text-zinc-500">Email</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#24242e] bg-[#16161c] px-3 py-2">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <div>
                <div className="text-xs font-bold text-white">Casablanca</div>
                <div className="text-[10px] text-zinc-500">Ville</div>
              </div>
            </div>

            <div className="rounded-lg border border-[#282834] bg-[#181820] px-4 py-2 text-right">
              <div className="text-[10px] text-zinc-400">Volume d&apos;achats total</div>
              <div className="font-mono font-black text-white text-sm">682 500 DH</div>
              <div className="text-[10px] text-zinc-400">32 approvisionnements</div>
            </div>
          </div>
        </div>

        {/* Tabs matching Reference #15 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link
            href={`/sellers/${code}/supplies`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Approvisionnements
          </Link>
          <Link
            href={`/sellers/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Transactions
          </Link>
          <Link
            href={`/sellers/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Paiements
          </Link>
          <Link
            href={`/sellers/${code}/history`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Historique
          </Link>
        </div>

        {/* 3 Detail Panels matching Reference #15 Screen 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Panel 1: Informations générales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Informations générales
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Nom complet</span>
                <span className="font-semibold text-white">Youssef El Idrissi</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">CIN / ID</span>
                <span className="font-mono font-bold text-white">BK123456</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Adresse</span>
                <span className="text-zinc-300">Hay Hassani, Casablanca</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Date de naissance</span>
                <span className="font-mono text-zinc-300">12/04/1985</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Type</span>
                <span className="text-zinc-300">Particulier</span>
              </div>
              <div className="pt-1">
                <span className="text-zinc-400 block mb-1">Notes</span>
                <div className="rounded bg-[#121216] border border-[#202028] p-2 text-zinc-300 text-[10px]">
                  Fournisseur fiable et régulier.
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Statistiques */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Statistiques
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Volume d&apos;achats</span>
                <span className="font-mono font-bold text-white">682 500 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Nb. approvisionnements</span>
                <span className="font-mono font-bold text-white">32</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Valeur moyenne / affaire</span>
                <span className="font-mono font-bold text-white">21 328 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Dernier approvisionnement</span>
                <span className="font-mono text-zinc-300">30/05/2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Taux de paiement à temps</span>
                <span className="font-mono font-bold text-emerald-400">87%</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Solde & Paiements */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Solde &amp; Paiements
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Total payé</span>
                <span className="font-mono font-bold text-white">395 050 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">En attente</span>
                <span className="font-mono font-bold text-red-400">74 800 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">En retard</span>
                <span className="font-mono font-bold text-red-400">32 600 DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202028]">
                <span className="text-zinc-400">Crédit disponible</span>
                <span className="font-mono font-bold text-emerald-400">50 000 DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
