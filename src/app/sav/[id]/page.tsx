'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  Send,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

interface Message {
  id: string
  author: string
  role: 'client' | 'agent'
  avatarColor: string
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    author: 'Yassine Benali',
    role: 'client',
    avatarColor: 'bg-zinc-700',
    content:
      "Bonjour, j'ai remarqué un bruit métallique lors de l'accélération entre 60 et 80 km/h. Le problème apparaît à chaud et disparaît au ralenti.",
    timestamp: '15/05/2025 10:30',
  },
  {
    id: '2',
    author: 'Sarah El Amrani',
    role: 'agent',
    avatarColor: 'bg-red-600',
    content:
      'Bonjour Monsieur Benali. Merci pour ces précisions. Notre équipe technique a bien pris en charge votre demande et va effectuer un contrôle sur banc.',
    timestamp: '15/05/2025 11:15',
  },
  {
    id: '3',
    author: 'Sarah El Amrani',
    role: 'agent',
    avatarColor: 'bg-red-600',
    content:
      'Bonjour, le diagnostic indique un problème au niveau du galet tendeur de courroie accessoire. Nous préparons la pièce d’origine pour l’intervention.',
    timestamp: '16/05/2025 14:20',
  },
  {
    id: '4',
    author: 'Yassine Benali',
    role: 'client',
    avatarColor: 'bg-zinc-700',
    content: "D'accord, c'est bien noté. Merci pour votre réactivité !",
    timestamp: '16/05/2025 16:30',
  },
]

export default function SavTicketDetailPage() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'SAV-2025-0048'
  const ticketCode = decodeURIComponent(rawId)

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMsg, setNewMsg] = useState('')
  const [status, setStatus] = useState('En cours')
  const [priority, setPriority] = useState('Élevée')
  const [closedToast, setClosedToast] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    setMessages([
      ...messages,
      {
        id: String(Date.now()),
        author: 'Sarah El Amrani',
        role: 'agent',
        avatarColor: 'bg-red-600',
        content: newMsg,
        timestamp: 'À l’instant',
      },
    ])
    setNewMsg('')
  }

  const handleCloseTicket = () => {
    setStatus('Résolu')
    setClosedToast(true)
    setTimeout(() => setClosedToast(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/sav"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à la liste SAV</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Accueil</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">SAV / Support</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Détail ticket</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/sav/planning?ticket=${ticketCode}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>Planifier intervention</span>
          </Link>
          <Link
            href={`/sav/${ticketCode}/resolution`}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Voir fiche résolution</span>
          </Link>
        </div>
      </div>

      {/* Ticket Banner matching Reference #32 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">{ticketCode}</span>
            <span className="inline-flex items-center rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
              {priority}
            </span>
            <span className="text-zinc-400 text-xs">· Bruit anormal à l’accélération</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-3">
            <span>Statut : <strong className="text-amber-400">{status}</strong></span>
            <span>· Échéance prévue : 16 mai 2025 à 10:30</span>
          </div>
        </div>

        <button
          onClick={handleCloseTicket}
          className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors self-start sm:self-auto"
        >
          Clôturer le ticket
        </button>
      </div>

      {/* 3-Column Layout matching Reference #32 Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Informations client & véhicule (span-3) */}
        <div className="lg:col-span-3 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-md h-fit">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Informations
          </h2>

          {/* Client info */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Client</span>
            <div className="font-bold text-white text-xs">Yassine Benali</div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Phone className="h-3 w-3 text-zinc-500" />
              <span>06 12 34 56 78</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Mail className="h-3 w-3 text-zinc-500" />
              <span>yassine@email.com</span>
            </div>
          </div>

          <div className="border-t border-[#1e1e24] pt-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Véhicule</span>
            <div className="font-bold text-white text-xs">Toyota Land Cruiser 2023</div>
            <div className="font-mono text-zinc-400 text-[10px]">VIN: JTMHV02J804567890</div>
            <div className="text-zinc-400 text-[11px]">12 450 km</div>
          </div>

          <div className="border-t border-[#1e1e24] pt-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Assigné à</span>
            <div className="font-bold text-white text-xs">Sarah El Amrani</div>
            <div className="text-zinc-400 text-[11px]">Technicienne SAV</div>
          </div>

          <div className="border-t border-[#1e1e24] pt-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Catégorie</span>
            <div className="font-bold text-cyan-400 text-xs">Mécanique</div>
          </div>
        </div>

        {/* Center Column: Conversation / Historique (span-6) */}
        <div className="lg:col-span-6 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-md flex flex-col justify-between min-h-[460px] space-y-3">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 mb-3">
              Conversation / Historique
            </h2>

            {/* Chat Messages */}
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${m.avatarColor}`}
                  >
                    {m.author.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-[11px]">{m.author}</span>
                      <span className="text-[9px] text-zinc-400 font-mono">{m.timestamp}</span>
                    </div>
                    <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-2.5 text-zinc-200 text-xs leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#222228] flex items-center gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Écrire un message..."
              className="h-9 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="h-9 px-3.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 flex items-center justify-center shadow-md transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column: Informations ticket (span-3) */}
        <div className="lg:col-span-3 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-md h-fit">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Informations ticket
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Ouvert">Ouvert</option>
                <option value="Résolu">Résolu</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Élevée">Élevée</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>

            <div className="border-t border-[#1e1e24] pt-2 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Créé le</span>
              <div className="font-mono text-zinc-300 text-xs">15 mai 2025 à 10:30</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Date souhaitée</span>
              <div className="font-mono text-zinc-300 text-xs">16 mai 2025 à 14:20</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Temps de réponse</span>
              <div className="font-mono font-bold text-cyan-400 text-xs">1h 15m</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">SLA assigné</span>
              <div className="font-mono font-bold text-emerald-400 text-xs">2h 15m</div>
            </div>
          </div>
        </div>
      </div>

      {closedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Ticket marqué comme résolu avec succès !</span>
        </div>
      )}
    </div>
  )
}
