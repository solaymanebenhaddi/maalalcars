'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react'

const CLIENT_OPTIONS = [
  { id: '1', name: 'Imane Zahiri', phone: '06 12 34 56 78', email: 'imane.zahiri@email.com', invoice: 'FAC-2025-038', amountDue: 24900 },
  { id: '2', name: 'Omar Bennis', phone: '06 98 76 54 32', email: 'omar.bennis@gmail.com', invoice: 'FAC-2025-036', amountDue: 31500 },
  { id: '3', name: "Ayoub M'rabet", phone: '06 44 33 22 11', email: 'ayoub.mrabet@outlook.com', invoice: 'FAC-2025-032', amountDue: 29900 },
  { id: '4', name: 'Nadia K.', phone: '06 55 66 77 88', email: 'nadia.k@gmail.com', invoice: 'FAC-2025-030', amountDue: 18400 },
  { id: '5', name: 'Youssef El Idrissi', phone: '06 11 22 33 44', email: 'youssef.idrissi@menara.ma', invoice: 'FAC-2025-028', amountDue: 12000 },
]

export default function NewRegularizationPage() {
  const router = useRouter()
  const [selectedClientId, setSelectedClientId] = useState('1')
  const [contactPhone, setContactPhone] = useState('06 12 34 56 78')
  const [contactEmail, setContactEmail] = useState('imane.zahiri@email.com')
  const [invoiceCode, setInvoiceCode] = useState('FAC-2025-038')
  const [invoiceDate, setInvoiceDate] = useState('2025-05-27')
  const [dueDate, setDueDate] = useState('2025-06-26')
  const [amountDue, setAmountDue] = useState(24900)
  const [amountPaid, setAmountPaid] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const balanceDue = Math.max(0, amountDue - amountPaid)

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId)
    const client = CLIENT_OPTIONS.find((c) => c.id === clientId)
    if (client) {
      setContactPhone(client.phone)
      setContactEmail(client.email)
      setInvoiceCode(client.invoice)
      setAmountDue(client.amountDue)
      setAmountPaid(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        router.push('/regularizations')
      }, 1000)
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/regularizations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour liste</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Régularisations</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Nouvelle régularisation</span>
        </div>
      </div>

      {/* Main Form Card matching Reference #31 Sub-screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-2xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base font-black text-white flex items-center gap-2">
            <span className="text-red-500">+</span>
            <span>Nouvelle régularisation</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Enregistrez un solde client ou ajustement d&apos;échéance avec suivi automatique.
          </p>
        </div>

        {success && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-400 flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>Régularisation enregistrée avec succès ! Redirection en cours...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Group 1: Informations client */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-red-500" />
              <span>Informations client</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {CLIENT_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Contact
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Téléphone"
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email"
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Références */}
          <div className="space-y-3 pt-2 border-t border-[#1e1e24]">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Références</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Facture(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={invoiceCode}
                  onChange={(e) => setInvoiceCode(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date facture
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Échéance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Montants */}
          <div className="space-y-3 pt-2 border-t border-[#1e1e24]">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              <span>Montants</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Montant dû (DH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={amountDue}
                  onChange={(e) => setAmountDue(Number(e.target.value) || 0)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Montant encaissé (DH)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Solde dû (DH)
                </label>
                <div className="h-9 w-full rounded-lg border border-red-500/40 bg-red-950/20 px-3 flex items-center font-mono font-black text-red-400 text-sm">
                  {balanceDue.toLocaleString('fr-FR')} DH
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
            <Link
              href="/regularizations"
              className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
