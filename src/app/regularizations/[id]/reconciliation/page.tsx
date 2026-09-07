import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RegularizationReconciliationPage({ params }: Props) {
  const { id } = await params

  const reg = await prisma.regularization.findFirst({
    where: {
      OR: [{ id }, { code: id }, { code: id.toUpperCase() }],
    },
  }) || { code: 'REG-2025-0050', difference: 2900 }

  const code = reg.code || 'REG-2025-0050'

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Affectation / Rapprochement des montants"
        subtitle="Répartissez et rapprochez les montants sur les postes concernés."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Régularisations', href: '/regularizations' },
          { label: code, href: `/regularizations/${code}` },
          { label: 'Affectation' },
        ]}
        actions={
          <Link
            href={`/regularizations/${code}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour dossier</span>
          </Link>
        }
      />

      {/* Stepper matching Reference #11 Screen 4 */}
      <div className="flex items-center justify-center gap-4 sm:gap-12 py-3 border-b border-[#222228] text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold">
            ✓
          </div>
          <span className="text-zinc-300 font-medium">Informations</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-emerald-500/50" />

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold">
            ✓
          </div>
          <span className="text-zinc-300 font-medium">Montants</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-red-600" />

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 font-bold text-white shadow-lg shadow-red-950/50">
            3
          </div>
          <span className="font-bold text-white">Affectation</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-[#282834]" />

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3e3e4a] bg-[#18181f] text-zinc-400 font-semibold">
            4
          </div>
          <span className="text-zinc-400 font-medium">Validation</span>
        </div>
      </div>

      {/* Main Container matching Reference #11 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-4 w-4 text-red-500" />
            <span>Affecter la régularisation</span>
          </h2>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            Répartissez et rapprochez les montants sur les postes concernés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Box: Montants à affecter */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Montants à affecter
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-[#1f1f28]">
                <span className="text-zinc-400">Montant régularisation :</span>
                <span className="font-mono font-bold text-white">2 900,00 DH</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#1f1f28]">
                <span className="text-zinc-400">Déjà affecté :</span>
                <span className="font-mono font-bold text-white">2 900,00 DH</span>
              </div>

              <div className="flex justify-between py-1.5 bg-[#121216] p-2.5 rounded-lg border border-[#202028]">
                <span className="text-amber-400 font-bold">Reste à affecter :</span>
                <span className="font-mono font-black text-emerald-400">0,00 DH</span>
              </div>
            </div>
          </div>

          {/* Right Table: Affectation des montants */}
          <div className="md:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Affectation des montants
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="pb-2">Poste / Élément</th>
                    <th className="pb-2 text-right">Montant</th>
                    <th className="pb-2 text-center">Type</th>
                    <th className="pb-2 text-right">Écart initial</th>
                    <th className="pb-2 text-right">Écart final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24]">
                  <tr className="hover:bg-[#18181f]">
                    <td className="py-2.5 font-medium text-white">Remise commerciale</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">2 000,00 DH</td>
                    <td className="py-2.5 text-center">
                      <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Déduction
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-400">2 000,00 DH</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">0,00 DH</td>
                  </tr>

                  <tr className="hover:bg-[#18181f]">
                    <td className="py-2.5 font-medium text-white">Frais de préparation</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">600,00 DH</td>
                    <td className="py-2.5 text-center">
                      <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Déduction
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-400">600,00 DH</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">0,00 DH</td>
                  </tr>

                  <tr className="hover:bg-[#18181f]">
                    <td className="py-2.5 font-medium text-white">Accessoires</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">300,00 DH</td>
                    <td className="py-2.5 text-center">
                      <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Addition
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-400">300,00 DH</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">0,00 DH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Card: Rapprochement matching Reference #11 Screen 4 */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Rapprochement
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-lg border border-[#282834] bg-[#121216] p-3">
              <span className="text-[10px] font-medium text-zinc-400 block">Total vente</span>
              <span className="text-sm font-black font-mono text-white">86 500,00 DH</span>
            </div>

            <div className="rounded-lg border border-[#282834] bg-[#121216] p-3">
              <span className="text-[10px] font-medium text-zinc-400 block">Total facturé</span>
              <span className="text-sm font-black font-mono text-white">83 600,00 DH</span>
            </div>

            <div className="rounded-lg border border-[#282834] bg-[#121216] p-3">
              <span className="text-[10px] font-medium text-zinc-400 block">Total régularisations</span>
              <span className="text-sm font-black font-mono text-white">2 900,00 DH</span>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="text-[10px] font-bold text-emerald-400 block flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Écart final</span>
              </span>
              <span className="text-sm font-black font-mono text-emerald-400">0,00 DH</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference #11 Screen 4 */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
          <Link
            href={`/regularizations/${code}`}
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Précédent
          </Link>
          <Link
            href={`/regularizations/${code}/history`}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
          >
            <span>Suivant</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
