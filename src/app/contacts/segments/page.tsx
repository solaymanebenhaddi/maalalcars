import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Clock,
  ChevronRight,
  User,
} from 'lucide-react'
import { ContactsSegmentsDonut } from '@/features/contacts/contacts-segments-donut'

export const dynamic = 'force-dynamic'

const UPCOMING_REMINDERS = [
  { id: 1, name: 'Sarah Martin', task: 'Relance devis BMW X5', due: 'Aujourd\'hui 14:00', urgent: true },
  { id: 2, name: 'Youssef El Idrissi', task: 'Relance disponibilité Audi Q7', due: 'Demain 10:00', urgent: false },
  { id: 3, name: 'Anas Ben Amar', task: 'Relance offre spéciale', due: '12/06/2025 09:30', urgent: false },
  { id: 4, name: 'Nadia K.', task: 'Relance conditions fournisseur', due: '13/06/2025 11:00', urgent: false },
]

export default function ContactsSegmentsPage() {
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

      {/* Main Container matching Reference #18 Screen 15d */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Segments / Relances
          </h1>
          <p className="text-xs text-zinc-400">
            Segmentation avancée de votre portefeuille et relances programmées
          </p>
        </div>

        {/* Top Grid: Segments Donut + Relances à venir */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ContactsSegmentsDonut />

          {/* Relances à venir */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[300px]">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Relances à venir</h3>
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            </div>

            <div className="space-y-2 py-1">
              {UPCOMING_REMINDERS.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-[#22222c] bg-[#121216] p-2.5 hover:border-[#2e2e3c] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-400 font-bold text-[10px]">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{r.name}</div>
                      <div className="text-[10px] text-zinc-400">{r.task}</div>
                    </div>
                  </div>

                  <span className={`font-mono text-[10px] font-semibold ${r.urgent ? 'text-red-400' : 'text-zinc-400'}`}>
                    {r.due}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#202028] pt-2 text-right">
              <Link
                href="/contacts"
                className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center justify-end gap-1"
              >
                <span>Voir toutes les relances</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom 2 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Relances en retard */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Relances en retard</span>
              </div>
              <div className="font-mono text-xl font-black text-white">
                5 <span className="text-xs font-normal text-zinc-400">contacts</span>
              </div>
            </div>

            <Link
              href="/contacts"
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              <span>Voir la liste</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* À relancer cette semaine */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Clock className="h-4 w-4" />
                <span>À relancer cette semaine</span>
              </div>
              <div className="font-mono text-xl font-black text-white">
                12 <span className="text-xs font-normal text-zinc-400">contacts</span>
              </div>
            </div>

            <Link
              href="/contacts"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Voir la liste</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
