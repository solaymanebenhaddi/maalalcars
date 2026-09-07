'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  Download,
  Plus,
  CheckCircle2,
  Send,
  Edit2,
  Clock,
} from 'lucide-react'

export default function ContractHistoryPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CTR-2025-00128'
  const [activeTab, setActiveTab] = useState<'history' | 'attachments'>('history')

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/contracts/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au contrat</span>
        </Link>
      </div>

      {/* Main Container matching Reference #24 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3 space-y-1">
          <h1 className="text-base sm:text-lg font-black text-white">
            Historique / pièces jointes
          </h1>
          <p className="text-xs text-zinc-400">
            Contrats &gt; Historique / pièces jointes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('history')}
            className={`font-semibold pb-1 relative ${
              activeTab === 'history' ? 'font-bold text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Historique</span>
            {activeTab === 'history' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`font-semibold pb-1 relative ${
              activeTab === 'attachments' ? 'font-bold text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Pièces jointes</span>
            {activeTab === 'attachments' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Timeline des événements */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Journal d&apos;audit &amp; événements
            </h3>

            <div className="space-y-3.5 text-[11px] py-1">
              {/* Event 1 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Contrat envoyé à Mamadou Diop pour signature</span>
                    <span className="font-mono text-[10px] text-zinc-500">12/05/2025 09:14</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Par Admin Maalal</div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Contrat signé par Admin Maalal</span>
                    <span className="font-mono text-[10px] text-zinc-500">12/05/2025 09:14</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Par Admin Maalal</div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Edit2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Montant du contrat modifié</span>
                    <span className="font-mono text-[10px] text-zinc-500">10/05/2025 16:42</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Ancien: 45 000,00 € → Nouveau: 48 500,00 € (Par Admin Maalal)</div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Document &quot;Annexe_Tarifs_2025.pdf&quot; ajouté</span>
                    <span className="font-mono text-[10px] text-zinc-500">09/05/2025 11:30</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Par Admin Maalal</div>
                </div>
              </div>

              {/* Event 5 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Statut changé : En négociation → Actif</span>
                    <span className="font-mono text-[10px] text-zinc-500">08/05/2025 14:05</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Par Admin Maalal</div>
                </div>
              </div>

              {/* Event 6 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#16161c] border border-[#22222c]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Contrat créé</span>
                    <span className="font-mono text-[10px] text-zinc-500">05/05/2025 10:22</span>
                  </div>
                  <div className="text-zinc-400 text-[10px]">Par Admin Maalal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Pièces jointes & Informations techniques */}
          <div className="space-y-4">
            {/* Pièces jointes */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#202028] pb-2">
                <h3 className="text-xs font-bold text-white">
                  Pièces jointes (3)
                </h3>

                <button className="flex items-center gap-1 rounded bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-700 transition-colors">
                  <Plus className="h-3 w-3" />
                  <span>Ajouter un fichier</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216] border border-[#22222c]">
                  <div className="flex items-center gap-2 truncate pr-1">
                    <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-white text-[11px] truncate">Contrat_Maintenance_Flotte.pdf</div>
                      <div className="text-[9px] text-zinc-500">PDF • 425 KB • 12/05/2025</div>
                    </div>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-white shrink-0">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216] border border-[#22222c]">
                  <div className="flex items-center gap-2 truncate pr-1">
                    <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-white text-[11px] truncate">Annexe_Tarifs_2025.pdf</div>
                      <div className="text-[9px] text-zinc-500">PDF • 310 KB • 09/05/2025</div>
                    </div>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-white shrink-0">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216] border border-[#22222c]">
                  <div className="flex items-center gap-2 truncate pr-1">
                    <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-white text-[11px] truncate">Conditions_Generales.pdf</div>
                      <div className="text-[9px] text-zinc-500">PDF • 190 KB • 05/05/2025</div>
                    </div>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-white shrink-0">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Informations techniques
              </h3>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Créé le</span>
                  <span className="font-mono text-zinc-200">05/05/2025 10:22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Créé par</span>
                  <span className="text-white">Admin Maalal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Dernière modif.</span>
                  <span className="font-mono text-zinc-200">12/05/2025 09:14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Version</span>
                  <span className="font-bold text-cyan-400">3</span>
                </div>
                <div className="flex justify-between border-t border-[#202028] pt-1">
                  <span className="text-zinc-400">ID contrat</span>
                  <span className="font-mono text-zinc-500 text-[9px] truncate max-w-[120px]">
                    7f1e6b2c-20c4-4b5b
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
