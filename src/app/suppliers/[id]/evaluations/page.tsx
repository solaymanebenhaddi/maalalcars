'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Star,
  Plus,
  ShieldCheck,
  FileCheck,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const RATING_TREND = [
  { month: 'Déc.', score: 4.2 },
  { month: 'Janv.', score: 4.3 },
  { month: 'Févr.', score: 4.5 },
  { month: 'Mars', score: 4.4 },
  { month: 'Avr.', score: 4.6 },
  { month: 'Mai', score: 4.6 },
]

const CERTIFICATES = [
  { id: 1, name: 'ISO 9001', subtitle: 'Certificat qualité', expiration: 'Expire le 12/06/2026', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' },
  { id: 2, name: 'IATF 16949', subtitle: 'Certificat automobile', expiration: 'Expire le 05/09/2026', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  { id: 3, name: 'Assurance RC Pro', subtitle: 'Attestation assurance', expiration: 'Expire le 31/12/2025', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
  { id: 4, name: 'REACH Compliance', subtitle: 'Attestation conformité', expiration: 'Expire le 30/11/2025', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
  { id: 5, name: 'RoHS Declaration', subtitle: 'Déclaration RoHS', expiration: 'Expire le 08/07/2026', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  { id: 6, name: 'Politique Qualité', subtitle: 'Document interne', expiration: 'Expire le 15/09/2025', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
]

export default function SupplierEvaluationsPage() {
  const params = useParams()
  const code = (params?.id as string) || 'SUP-001'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/suppliers/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Bosch Automotive</span>
        </Link>
      </div>

      {/* Main Container matching Reference #19 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Évaluation / Conformité / Documents
          </h1>
          <p className="text-xs text-zinc-400">
            Audit de performance, notation continue et conformité documentaire
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Évaluation</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Conformité</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Certificats</button>
        </div>

        {/* Top 3 Evaluation Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Évaluation globale */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between items-center text-center space-y-3">
            <h3 className="text-xs font-bold text-white w-full text-left border-b border-[#202028] pb-2">
              Évaluation globale
            </h3>

            <div className="space-y-1">
              <div className="font-mono text-3xl font-black text-white">
                4,6 <span className="text-sm font-normal text-zinc-400">/ 5</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
              <p className="text-[10px] text-zinc-500">12 évaluations enregistrées</p>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Nouvelle évaluation</span>
            </button>
          </div>

          {/* Détail des critères */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between space-y-2">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Détail des critères
            </h3>

            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Qualité des produits</span>
                  <span className="font-mono font-bold text-white">4,7 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Respect des délais</span>
                  <span className="font-mono font-bold text-white">4,5 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Service client</span>
                  <span className="font-mono font-bold text-white">4,6 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Compétitivité prix</span>
                  <span className="font-mono font-bold text-white">4,4 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Conformité réglementaire</span>
                  <span className="font-mono font-bold text-white">4,7 / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#20202a] rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Évolution des évaluations */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Évolution des évaluations</h3>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="h-2 w-2 rounded-sm bg-red-500" />
                <span className="text-zinc-400">Note moyenne</span>
              </div>
            </div>

            <div className="w-full flex-1 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RATING_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis domain={[3.5, 5]} stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                            <div className="font-bold text-white">{label}</div>
                            <div className="text-amber-400 font-mono">Note : {payload[0]?.value} / 5 ★</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} dot={{ r: 2.5, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Documents & Certificats Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Documents & Certificats</h3>
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Importer un document</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 flex flex-col justify-between space-y-2 hover:border-[#343444] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${cert.color}`}>
                    <FileCheck className="h-3.5 w-3.5" />
                  </div>
                  <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                    <ShieldCheck className="h-2 w-2" />
                    <span>Valide</span>
                  </span>
                </div>

                <div>
                  <div className="font-bold text-white text-xs">{cert.name}</div>
                  <div className="text-[10px] text-zinc-400">{cert.subtitle}</div>
                </div>

                <div className="font-mono text-[9px] text-zinc-500 border-t border-[#202028] pt-1">
                  {cert.expiration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
