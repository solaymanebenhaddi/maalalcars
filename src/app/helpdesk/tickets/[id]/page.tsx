'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  Paperclip,
  CheckCircle2,
  Lock,
} from 'lucide-react'

function TicketDetailContent() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'SUP-2025-0128'
  const ticketCode = decodeURIComponent(rawId)

  const [activeTab, setActiveTab] = useState<'conversation' | 'details' | 'history' | 'attachments' | 'sla'>('conversation')
  const [replyText, setReplyText] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Yassine Benali',
      role: 'client',
      time: '15/06/2025 10:12',
      text: "Bonjour, je n'ai pas reçu la confirmation de ma commande passée hier. Pouvez-vous vérifier ? Merci.",
    },
    {
      id: '2',
      sender: 'Sarah El Amrani',
      role: 'agent',
      time: '15/06/2025 10:28',
      text: 'Bonjour Yassine, Nous avons bien reçu votre commande. La confirmation a été renvoyée. Pouvez-vous vérifier vos spams ?',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setMessages([
      ...messages,
      {
        id: String(Date.now()),
        sender: isInternalNote ? 'Note interne (Sarah El Amrani)' : 'Sarah El Amrani',
        role: isInternalNote ? 'internal' : 'agent',
        time: 'À l’instant',
        text: replyText.trim(),
      },
    ])
    setReplyText('')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/helpdesk"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tous les tickets</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Support</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">{ticketCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-white">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Résoudre le ticket</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #39 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-white">{ticketCode}</span>
            <span className="rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
              Élevée
            </span>
            <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              En cours
            </span>
          </div>

          <span className="font-mono text-[10px] text-zinc-400">Créé le 15/06/2025 à 10:12</span>
        </div>

        <h1 className="text-base font-black text-white">
          Problème de confirmation de commande
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#202028] text-[11px]">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase">Client</span>
            <div className="font-semibold text-white">Yassine Benali</div>
            <div className="text-[10px] text-zinc-400 font-mono">06 12 34 56 78 · y.benali@email.com</div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase">Assigné à</span>
            <div className="font-semibold text-white">Sarah El Amrani</div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase">Dernière activité</span>
            <div className="font-mono text-zinc-300 text-[10px]">15/06/2025 à 10:32</div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase">SLA d&apos;attribution</span>
            <div className="font-mono font-bold text-emerald-400">Respecté (12 min)</div>
          </div>
        </div>
      </div>

      {/* Tabs matching Reference #39 Screen 4 */}
      <div className="flex items-center gap-1 border-b border-[#222228] pb-1">
        {[
          { id: 'conversation', label: 'Conversation' },
          { id: 'details', label: 'Détails' },
          { id: 'history', label: 'Historique' },
          { id: 'attachments', label: 'Pièces jointes (2)' },
          { id: 'sla', label: 'SLA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-red-500 text-white bg-[#141418]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Layout matching Reference #39 Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Thread (span-8) */}
        <div className="lg:col-span-8 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-4">
          {activeTab === 'conversation' && (
            <>
              {/* Message bubbles */}
              <div className="space-y-3 min-h-[220px]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border ${
                      m.role === 'client'
                        ? 'border-[#282834] bg-[#16161c]'
                        : m.role === 'internal'
                        ? 'border-amber-500/30 bg-amber-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span
                        className={`font-bold ${
                          m.role === 'client'
                            ? 'text-cyan-400'
                            : m.role === 'internal'
                            ? 'text-amber-400 flex items-center gap-1'
                            : 'text-red-400'
                        }`}
                      >
                        {m.role === 'internal' && <Lock className="h-2.5 w-2.5" />}
                        {m.sender}
                      </span>
                      <span className="font-mono text-zinc-400">{m.time}</span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form matching Reference #39 Screen 4 */}
              <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-[#202028]">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>Note interne confidentielle</span>
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? 'Ajouter une note interne...'
                        : 'Répondre au client...'
                    }
                    className={`w-full rounded-lg border p-2.5 text-xs text-white focus:outline-none leading-relaxed ${
                      isInternalNote
                        ? 'border-amber-500/40 bg-[#191712]'
                        : 'border-[#282834] bg-[#18181f] focus:border-red-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="submit"
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-lg transition-colors ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/50'
                        : 'bg-red-600 hover:bg-red-500 shadow-red-950/50'
                    }`}
                  >
                    <Send className="h-3 w-3" />
                    <span>{isInternalNote ? 'Enregistrer la note' : 'Envoyer'}</span>
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab !== 'conversation' && (
            <div className="p-6 text-center text-zinc-400 text-xs">
              Contenu de l&apos;onglet {activeTab} chargé.
            </div>
          )}
        </div>

        {/* Right: Ticket Details & SLA (span-4) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Informations ticket */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Informations ticket
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Source</span>
                <span className="text-white">Site web</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Catégorie</span>
                <span className="text-white">Commandes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Sous-catégorie</span>
                <span className="text-white">Confirmation</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Priorité</span>
                <span className="font-bold text-red-400">Élevée</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Objectif SLA</span>
                <span className="text-cyan-400 font-semibold">Réponse en 2h</span>
              </div>
            </div>
          </div>

          {/* SLA en cours matching Reference #39 Screen 4 */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                SLA en cours
              </h2>
              <span className="font-mono font-bold text-amber-400 text-xs">1h 23m restantes</span>
            </div>

            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden my-2">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }} />
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span>Échéance SLA</span>
              <span className="text-white">15/06/2025 à 12:12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TicketDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement du ticket...</div>}>
      <TicketDetailContent />
    </Suspense>
  )
}
