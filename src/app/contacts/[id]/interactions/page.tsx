import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Phone,
  Mail,
  Building,
  MessageSquare,
  FileText,
  Plus,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

interface InteractionItem {
  id: number
  dateLabel: string
  time: string
  type: string
  title: string
  description: string
  author: string
  icon: React.ElementType
  color: string
}

const INTERACTIONS: InteractionItem[] = [
  {
    id: 1,
    dateLabel: 'Aujourd\'hui',
    time: '10:30',
    type: 'call',
    title: 'Appel téléphonique',
    description: 'Discussion sur nouveau Land Cruiser 2024. Intéressé par une offre commerciale.',
    author: 'Admin Maalal',
    icon: Phone,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 2,
    dateLabel: 'Il y a 2 jours',
    time: '16:45',
    type: 'email',
    title: 'Email envoyé',
    description: 'Envoi de la brochure technique et tarification Land Cruiser 2024.',
    author: 'Sarah Martin',
    icon: Mail,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 3,
    dateLabel: 'Il y a 5 jours',
    time: '11:20',
    type: 'visit',
    title: 'Visite showroom',
    description: 'Visite du showroom de Casablanca et essai dynamique du Land Cruiser 2023.',
    author: 'Sarah Martin',
    icon: Building,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 4,
    dateLabel: 'Il y a 8 jours',
    time: '09:15',
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Demande d\'informations sur la disponibilité en stock et coloris.',
    author: 'Admin Maalal',
    icon: MessageSquare,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 5,
    dateLabel: 'Il y a 15 jours',
    time: '14:50',
    type: 'quote',
    title: 'Devis envoyé',
    description: 'Devis pour Land Cruiser 2023 - 86 500 € / 865 000 DH TTC.',
    author: 'Admin Maalal',
    icon: FileText,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
]

export default async function ContactInteractionsPage({ params }: Props) {
  const { id } = await params
  const code = id || 'CNT-001'

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/contacts/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Imane Zahri</span>
        </Link>
      </div>

      {/* Main Container matching Reference #18 Screen 15c */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-white">
              Imane Zahri
            </h1>
            <span className="text-zinc-400 text-xs">Client</span>
            <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Actif
            </span>
          </div>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les types</option>
            <option>Appel</option>
            <option>Email</option>
            <option>Visite showroom</option>
            <option>WhatsApp</option>
            <option>Devis</option>
          </select>
        </div>

        {/* Timeline */}
        <div className="space-y-4 py-2">
          {INTERACTIONS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-xl border border-[#24242e] bg-[#16161c] p-3.5 hover:border-[#323242] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{item.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">• {item.dateLabel}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">{item.description}</p>
                    <div className="text-[10px] text-zinc-500">Par <strong className="text-zinc-400">{item.author}</strong></div>
                  </div>
                </div>

                <span className="font-mono text-[10px] text-zinc-500 shrink-0">{item.time}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center pt-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter une interaction</span>
          </button>
        </div>
      </div>
    </div>
  )
}
