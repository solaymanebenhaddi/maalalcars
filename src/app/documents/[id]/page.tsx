'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  ChevronDown,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react'

export default function DocumentDetailPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/documents"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux documents</span>
        </Link>
      </div>

      {/* Main Container matching Reference #17 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 border border-red-500/20 text-red-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Contrat de vente
                </h1>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Valide</span>
                </span>
              </div>
              <p className="font-mono text-[11px] text-zinc-400">
                CONTR-2025-045 • PDF • 245 KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
              <Download className="h-3.5 w-3.5" />
              <span>Télécharger</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Share2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Partager</span>
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <span>Plus d&apos;actions</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="text-zinc-400 hover:text-white font-semibold">Aperçu</button>
          <button className="font-bold text-white relative pb-1">
            <span>Informations</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Activité</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Partage</button>
        </div>

        {/* 4 Details Panels matching Reference #17 Screen 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Informations générales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nom du document</span>
                <span className="font-semibold text-white">Contrat de vente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Type de document</span>
                <span className="text-zinc-200">Contrat de vente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Catégorie</span>
                <span className="text-zinc-200">Ventes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Référence</span>
                <span className="font-mono font-bold text-white">CONTR-2025-045</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-[#202028]">
                <span className="text-zinc-400 block">Description</span>
                <p className="text-zinc-300">Contrat de vente signé entre MAALAL CARS et le client.</p>
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-zinc-400 block">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded bg-[#20202a] border border-[#2c2c3c] px-2 py-0.5 text-[10px] text-zinc-300">contrat</span>
                  <span className="rounded bg-[#20202a] border border-[#2c2c3c] px-2 py-0.5 text-[10px] text-zinc-300">vente</span>
                  <span className="rounded bg-[#20202a] border border-[#2c2c3c] px-2 py-0.5 text-[10px] text-zinc-300">signature</span>
                </div>
              </div>
            </div>
          </div>

          {/* Associé à */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Associé à
            </h3>

            <div className="space-y-3 text-[11px]">
              <div>
                <span className="text-zinc-400 block text-[10px]">Véhicule</span>
                <div className="mt-1 flex items-center gap-3 rounded-lg bg-[#121216] border border-[#24242e] p-2.5">
                  <div className="h-12 w-16 overflow-hidden rounded bg-black shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vehicles/toyota-land-cruiser-2023.jpg"
                      alt="Toyota Land Cruiser 2023"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white">Toyota Land Cruiser 2023</div>
                    <div className="text-[10px] text-zinc-400 font-mono">VR-A 4.0L Essence</div>
                    <Link
                      href="/vehicles/VEH-001"
                      className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 mt-0.5"
                    >
                      <span>Voir le détail du véhicule</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#202028] pt-2">
                <span className="text-zinc-400 block text-[10px]">Client</span>
                <div className="mt-1 font-bold text-white">Hassan Amine</div>
                <div className="font-mono text-[10px] text-zinc-400">+33 6 12 34 56 78</div>
                <div className="text-[10px] text-zinc-400">hassan.amine@email.com</div>
                <Link
                  href="/contacts/CNT-001"
                  className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 mt-0.5"
                >
                  <span>Voir le détail du client</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Dates
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Date du document</span>
                <span className="font-mono font-bold text-white">30/05/2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date d&apos;ajout</span>
                <div className="text-right">
                  <div className="font-mono text-zinc-200">30/05/2025 à 14:32</div>
                  <div className="text-[10px] text-zinc-500">Par Admin Maalal</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date d&apos;expiration</span>
                <span className="font-mono text-zinc-400">-</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Statut</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Valide</span>
                </span>
              </div>
            </div>
          </div>

          {/* Fichier */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Fichier
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nom du fichier</span>
                <span className="font-mono text-white">Contrat de vente.pdf</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Taille</span>
                <span className="font-mono text-zinc-200">245 KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Format</span>
                <span className="font-mono text-zinc-200">PDF</span>
              </div>
              <div className="space-y-1 border-t border-[#202028] pt-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">Hash (SHA-256)</span>
                  <button className="text-red-400 hover:text-red-300 flex items-center gap-1">
                    <Copy className="h-2.5 w-2.5" />
                    <span>Copier</span>
                  </button>
                </div>
                <div className="font-mono text-[9px] text-zinc-500 break-all bg-[#121216] p-1.5 rounded border border-[#22222c]">
                  a3b1c9d5e7f2a1b0d000111b1b1000000d5089fa21cba3456890123456789abc
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
