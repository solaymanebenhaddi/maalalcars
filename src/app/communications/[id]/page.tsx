'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Smartphone,
  Phone,
  Send,
  CheckCircle2,
} from 'lucide-react'

function ConversationDetailContent() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : '2'
  const convId = decodeURIComponent(rawId)

  const [replyText, setReplyText] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Sarah El Amrani',
      role: 'client',
      time: '10:21',
      text: 'Bonjour, est-ce que le BMW X5 est toujours disponible ?',
    },
    {
      id: '2',
      sender: 'Nadia K.',
      role: 'agent',
      time: '10:23',
      text: 'Oui, elle est toujours disponible. Souhaitez-vous plus d’informations ou planifier un essai ?',
    },
    {
      id: '3',
      sender: 'Sarah El Amrani',
      role: 'client',
      time: '10:26',
      text: 'Oui, merci. Quelles sont les options de financement possibles ?',
    },
    {
      id: '4',
      sender: 'Nadia K.',
      role: 'agent',
      time: '10:28',
      text: 'Nous avons plusieurs solutions adaptées. Je vous envoie une simulation détaillée par email dans quelques minutes.',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setMessages([
      ...messages,
      {
        id: String(Date.now()),
        sender: 'Nadia K.',
        role: 'agent',
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
            href="/communications"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Boîte de réception</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Communications</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Conversation #{convId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Marquer résolue</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #37 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">Sarah El Amrani</h1>
              <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                En cours
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              sarah.elamrani@email.com · +212 6 98 76 54 32
            </div>
          </div>
        </div>

        <div className="text-right text-[11px]">
          <span className="text-zinc-400">Assigné à : </span>
          <strong className="text-white">Nadia K.</strong>
        </div>
      </div>

      {/* Main Layout matching Reference #37 Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Chat Thread (span-8) */}
        <div className="lg:col-span-8 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3 min-h-[280px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border ${
                  m.role === 'client'
                    ? 'border-[#282834] bg-[#16161c]'
                    : 'border-red-500/30 bg-red-950/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className={`font-bold ${m.role === 'client' ? 'text-cyan-400' : 'text-red-400'}`}>
                    {m.sender}
                  </span>
                  <span className="font-mono text-zinc-400">{m.time}</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-[#202028]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Répondre..."
                className="h-9 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-red-950/50 transition-colors"
              >
                <Send className="h-3 w-3" />
                <span>Envoyer</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Contact Details & Quick Actions (span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Détails contact
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Nom</span>
                <span className="text-white font-semibold">Sarah El Amrani</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Email</span>
                <span className="font-mono text-zinc-300">sarah.elamrani@email.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Téléphone</span>
                <span className="font-mono text-zinc-300">+212 6 98 76 54 32</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Ville</span>
                <span className="text-white">Casablanca, Maroc</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202028] space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Intérêt commercial</span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Véhicule</span>
                <span className="text-white font-bold">BMW X5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Source</span>
                <span className="text-cyan-400">Site web</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Client depuis</span>
                <span className="font-mono text-zinc-400 text-[10px]">14/05/2025</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Actions rapides
            </h2>

            <div className="space-y-1.5">
              <button className="w-full py-2 px-3 rounded-lg border border-[#282834] bg-[#16161c] hover:bg-[#1a1a24] text-zinc-200 hover:text-white flex items-center gap-2 text-xs font-semibold">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                <span>Envoyer un email</span>
              </button>
              <button className="w-full py-2 px-3 rounded-lg border border-[#282834] bg-[#16161c] hover:bg-[#1a1a24] text-zinc-200 hover:text-white flex items-center gap-2 text-xs font-semibold">
                <Smartphone className="h-3.5 w-3.5 text-amber-400" />
                <span>Envoyer un SMS</span>
              </button>
              <button className="w-full py-2 px-3 rounded-lg border border-[#282834] bg-[#16161c] hover:bg-[#1a1a24] text-zinc-200 hover:text-white flex items-center gap-2 text-xs font-semibold">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Planifier un appel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConversationDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement de la conversation...</div>}>
      <ConversationDetailContent />
    </Suspense>
  )
}
