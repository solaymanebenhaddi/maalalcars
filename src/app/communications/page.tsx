'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Phone,
  Mail,
  Smartphone,
  Plus,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react'

interface Conversation {
  id: string
  clientName: string
  channel: 'WhatsApp' | 'Email' | 'SMS' | 'Appel'
  time: string
  subject: string
  lastMessage: string
  unreadCount?: number
  assignedTo: string
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    clientName: 'Yassine Benali',
    channel: 'WhatsApp',
    time: '10:32',
    subject: 'Intérêt Toyota Land Cruiser',
    lastMessage: 'Merci pour votre réponse, je suis intéressé...',
    unreadCount: 2,
    assignedTo: 'Nadia K.',
  },
  {
    id: '2',
    clientName: 'Sarah El Amrani',
    channel: 'Email',
    time: '10:21',
    subject: 'Disponibilité BMW X5',
    lastMessage: 'Bonjour, est-ce que le véhicule est toujours...',
    assignedTo: 'Nadia K.',
  },
  {
    id: '3',
    clientName: 'Omar Tazi',
    channel: 'Appel',
    time: '09:58',
    subject: 'Essai Audi Q7',
    lastMessage: 'Parfait, je serai présent vendredi à 10h.',
    assignedTo: 'Omar Tazi',
  },
  {
    id: '4',
    clientName: 'Imane Kabbaj',
    channel: 'SMS',
    time: '09:41',
    subject: 'Financement Mercedes GLC',
    lastMessage: 'Pouvez-vous me donner une simulation...',
    assignedTo: 'Sarah El Amrani',
  },
  {
    id: '5',
    clientName: 'Mehdi Lahlou',
    channel: 'WhatsApp',
    time: 'Hier',
    subject: 'Reprise ancien véhicule',
    lastMessage: 'J’aimerais des informations sur la reprise...',
    assignedTo: 'Youssef M.',
  },
]

function CommunicationsInboxContent() {
  const [selectedConv, setSelectedConv] = useState<Conversation>(CONVERSATIONS[0])
  const [channelFilter, setChannelFilter] = useState('Tous')
  const [search, setSearch] = useState('')
  const [replyText, setReplyText] = useState('')

  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      from: 'client',
      time: '10:21',
      text: 'Bonjour, je suis intéressé par le Toyota Land Cruiser 2023 en stock. Pouvez-vous me donner plus d’informations ?',
    },
    {
      id: '2',
      from: 'agent',
      time: '10:23',
      text: 'Bonjour Yassine, merci pour votre message ! Oui nous avons le modèle en stock. Souhaitez-vous plus de détails sur les équipements ou planifier un essai ?',
    },
    {
      id: '3',
      from: 'client',
      time: '10:26',
      text: 'Oui s’il vous plaît, et je suis disponible ce week-end pour un essai.',
    },
    {
      id: '4',
      from: 'agent',
      time: '10:29',
      text: 'Parfait, je vous propose samedi à 11h. Je vous envoie tous les détails juste après.',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setChatMessages([
      ...chatMessages,
      {
        id: String(Date.now()),
        from: 'agent',
        time: 'À l’instant',
        text: replyText.trim(),
      },
    ])
    setReplyText('')
  }

  const filteredConversations = CONVERSATIONS.filter((c) => {
    if (channelFilter !== 'Tous' && c.channel !== channelFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #37 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-red-500" />
            <span>Communications — Boîte de réception multicanale</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Centralisez tous vos échanges clients (WhatsApp, SMS, Email, Appels) en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/communications/campaigns/new"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>+ Campagne SMS / Email</span>
          </Link>

          <Link
            href="/communications/templates"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>Modèles de messages</span>
          </Link>

          <Link
            href="/communications/history"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>Historique par client</span>
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau message</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards + Par canal matching Reference #37 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Messages reçus</span>
          <div className="text-xl font-black font-mono text-white mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,0% ce mois</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Non lus</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">37</div>
          <div className="text-[10px] text-zinc-400 mt-1">27,3% du total</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Temps de réponse moyen</span>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">24 min</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 12% ce mois</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En attente réponse</span>
          <div className="text-xl font-black font-mono text-red-400 mt-1">15</div>
          <div className="text-[10px] text-zinc-400 mt-1">11,7% du total</div>
        </div>

        {/* Par canal */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Par canal</span>
          <div className="grid grid-cols-2 gap-1.5 mt-1 font-mono text-[10px]">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-cyan-400" />
              <span className="text-white font-bold">54</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3 text-amber-400" />
              <span className="text-white font-bold">38</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold text-xs">WA</span>
              <span className="text-white font-bold">22</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-blue-400" />
              <span className="text-white font-bold">14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar matching Reference #37 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-2.5 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-center">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans les conversations, clients..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Tous les canaux</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Appel">Appel</option>
            </select>
          </div>

          <div>
            <select className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
              <option value="Tous">Tous les assignés</option>
              <option value="Nadia">Nadia K.</option>
              <option value="Sarah">Sarah El Amrani</option>
              <option value="Omar">Omar Tazi</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setChannelFilter('Tous')
                setSearch('')
              }}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
            >
              <Filter className="h-3 w-3 text-zinc-400" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Split Layout matching Reference #37 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[480px]">
        {/* Column 1: Conversations List (span-4) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-3 shadow-xl space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5 overflow-y-auto max-h-[430px]">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConv.id === conv.id
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500/50 bg-[#181820]'
                      : 'border-[#202028] bg-[#141418] hover:bg-[#16161c]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{conv.clientName}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[8px] font-bold ${
                          conv.channel === 'WhatsApp'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : conv.channel === 'Email'
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                            : conv.channel === 'SMS'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {conv.channel}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400">{conv.time}</span>
                  </div>

                  <div className="text-[10px] text-zinc-300 font-semibold truncate">{conv.subject}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount && (
                      <span className="h-4 w-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-2 border-t border-[#202028] text-center text-[10px] text-zinc-500">
            Affichage de 1 à {filteredConversations.length} sur 37 conversations
          </div>
        </div>

        {/* Column 2: Active Chat Thread (span-5) */}
        <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-xl flex flex-col justify-between">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-xs">
                {selectedConv.clientName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>{selectedConv.clientName}</span>
                  <span className="text-[9px] text-emerald-400 font-normal">● En ligne</span>
                </div>
                <div className="text-[9px] text-zinc-400 font-mono">
                  Canal : {selectedConv.channel} · Assigné à {selectedConv.assignedTo}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/communications/${selectedConv.id}`}
                className="p-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-zinc-300 hover:text-white"
                title="Fiche client complète"
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
              <button className="px-2.5 py-1 rounded-lg border border-[#282834] bg-[#18181f] text-[10px] font-semibold text-zinc-300 hover:text-white">
                Marquer résolu
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="space-y-2.5 my-3 overflow-y-auto max-h-[290px] pr-1">
            {chatMessages.map((msg) => {
              const isAgent = msg.from === 'agent'
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                      isAgent
                        ? 'bg-red-950/40 border border-red-500/30 text-white'
                        : 'bg-[#18181f] border border-[#282834] text-zinc-200'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="font-mono text-[8px] text-zinc-500 mt-0.5 px-1">{msg.time}</span>
                </div>
              )
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-[#202028]">
            <div className="relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Écrire un message..."
                className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-3 pr-20 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1.5 text-zinc-400">
                <button type="button" className="hover:text-white">
                  <Paperclip className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="hover:text-white">
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="hover:text-white">
                  <Smile className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[9px] text-zinc-500">
                Entrée pour envoyer · Maj + Entrée pour nouvelle ligne
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-red-950/50 transition-colors"
              >
                <Send className="h-3 w-3" />
                <span>Envoyer</span>
              </button>
            </div>
          </form>
        </div>

        {/* Column 3: Activité & Performance (span-3) */}
        <div className="lg:col-span-3 rounded-xl border border-[#222228] bg-[#121216] p-3.5 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Activité &amp; Performance
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-zinc-400">Temps de réponse moyen</span>
              <div className="font-mono font-bold text-sm text-cyan-400 mt-0.5">24 min</div>
              <span className="text-[9px] text-zinc-500">Objectif : &lt; 30 min</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400">Taux de réponse</span>
              <div className="font-mono font-bold text-sm text-emerald-400 mt-0.5">92%</div>
              <span className="text-[9px] text-zinc-500">Objectif : &gt; 90%</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400">Conversations résolues</span>
              <div className="font-mono font-bold text-sm text-white mt-0.5">86</div>
              <span className="text-[9px] text-emerald-400 font-semibold">+ 14,2% ce mois</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400">SLA respectés</span>
              <div className="font-mono font-bold text-sm text-emerald-400 mt-0.5">88%</div>
              <span className="text-[9px] text-zinc-500">Objectif : &gt; 85%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#202028]">
            <Link
              href={`/communications/${selectedConv.id}`}
              className="w-full py-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-center text-zinc-300 hover:text-white block font-semibold text-[11px]"
            >
              Voir détails du contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement de la messagerie...</div>}>
      <CommunicationsInboxContent />
    </Suspense>
  )
}
