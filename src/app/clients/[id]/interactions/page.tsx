'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  Building,
  MessageSquare,
  FileQuestion,
  User,
} from 'lucide-react'

interface ClientInteraction {
  id: number
  type: string
  title: string
  description: string
  author: string
  dateTime: string
  icon: React.ElementType
  color: string
}

const CLIENT_INTERACTIONS: ClientInteraction[] = [
  {
    id: 1,
    type: 'call',
    title: 'Appel sortant',
    description: 'Discussion sur le financement LOA et options d\'assurance.',
    author: 'Adrien Maalal',
    dateTime: '12/05/2025 10:30',
    icon: Phone,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 2,
    type: 'email',
    title: 'Email envoyé',
    description: 'Envoi de la brochure BMW X3 et offre personnalisée.',
    author: 'Adrien Maalal',
    dateTime: '10/05/2025 15:42',
    icon: Mail,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 3,
    type: 'visit',
    title: 'Visite en concession',
    description: 'Visite de la concession de Lyon, essai BMW X3.',
    author: 'Marc Dubois',
    dateTime: '03/05/2025 14:20',
    icon: Building,
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  {
    id: 4,
    type: 'sms',
    title: 'SMS envoyé',
    description: 'Rappel pour le rendez-vous d\'essai du 03/05 à 14h.',
    author: 'Système',
    dateTime: '02/05/2025 09:15',
    icon: MessageSquare,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 5,
    type: 'request',
    title: 'Demande d\'information',
    description: 'Intérêt pour un SUV hybride rechargeable.',
    author: 'Sarah Martin',
    dateTime: '01/05/2025 11:08',
    icon: FileQuestion,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
]

export default function ClientInteractionsPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CLT-001'
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/clients/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Sarah Martin</span>
        </Link>
      </div>

      {/* Main Container matching Reference #21 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Historique des interactions
          </h1>
          <p className="text-xs text-zinc-400">
            Contacts &gt; Sarah Martin &gt; Historique des interactions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          {['Toutes', 'Appels', 'Emails', 'SMS', 'Visites', 'Notes', 'Tâches'].map((tab) => {
            const key = tab.toLowerCase()
            const isSelected = activeTab === key || (activeTab === 'all' && tab === 'Toutes')
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === 'Toutes' ? 'all' : key)}
                className={`font-semibold pb-1 relative whitespace-nowrap ${
                  isSelected ? 'font-bold text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                {isSelected && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />}
              </button>
            )
          })}
        </div>

        {/* Timeline List */}
        <div className="space-y-3 py-2">
          {CLIENT_INTERACTIONS.map((item) => {
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
                    <div className="font-bold text-white text-xs">{item.title}</div>
                    <p className="text-[11px] text-zinc-300">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <div className="flex items-center justify-end gap-1 text-[11px] text-zinc-300">
                    <User className="h-3 w-3 text-zinc-500" />
                    <span className="font-medium">{item.author}</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500">{item.dateTime}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
