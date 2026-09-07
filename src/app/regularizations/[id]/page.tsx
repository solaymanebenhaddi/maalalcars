'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  FileText,
  Mail,
  Plus,
  ChevronDown,
  CheckCircle2,
  History as HistoryIcon,
  Folder,
  Send,
  X,
} from 'lucide-react'

interface ScheduleItem {
  id: string
  dueDate: string
  plannedAmount: number
  dueAmount: number
  status: 'À venir' | 'Échu' | 'Payé'
  daysDiff: string
}

interface PaymentHistoryItem {
  id: string
  date: string
  amount: number
  paymentMethod: string
  reference: string
  receivedBy: string
}

export default function RegularizationDetailPage() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'REG-2025-0031'
  const code = decodeURIComponent(rawId)

  const [activeTab, setActiveTab] = useState<'info' | 'schedule' | 'payments' | 'history' | 'documents'>('info')
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false)
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false)

  // Payments and schedules state
  const amountDue = 24900
  const [amountPaid, setAmountPaid] = useState(5000)
  const balanceDue = amountDue - amountPaid

  const schedules: ScheduleItem[] = [
    { id: '1', dueDate: '26/06/2025', plannedAmount: 12450, dueAmount: 12450, status: 'À venir', daysDiff: '+7 jours' },
    { id: '2', dueDate: '26/07/2025', plannedAmount: 12450, dueAmount: 7450, status: 'À venir', daysDiff: '+37 jours' },
  ]

  const [payments, setPayments] = useState<PaymentHistoryItem[]>([
    { id: '1', date: '28/05/2025', amount: 5000, paymentMethod: 'Virement bancaire', reference: 'VIR-2025-154', receivedBy: 'Admin Maalal' },
  ])

  // New payment form
  const [newPayAmount, setNewPayAmount] = useState(5000)
  const [newPayMethod, setNewPayMethod] = useState('Virement bancaire')
  const [newPayRef, setNewPayRef] = useState('VIR-2025-155')

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()
    const added = Number(newPayAmount) || 0
    setAmountPaid(amountPaid + added)
    setPayments([
      ...payments,
      {
        id: String(payments.length + 1),
        date: new Date().toLocaleDateString('fr-MA'),
        amount: added,
        paymentMethod: newPayMethod,
        reference: newPayRef,
        receivedBy: 'Admin Maalal',
      },
    ])
    setAddPaymentModalOpen(false)
    setPaymentSuccessToast(true)
    setTimeout(() => setPaymentSuccessToast(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #31 Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/regularizations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Régularisations</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-300">Détail</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">{code}</span>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReminderModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[#3e3e4a] bg-[#1a1a22] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:border-red-500/50"
            >
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span>Relancer client</span>
            </button>

            <button
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <span>Actions</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>

          {actionMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[#282834] bg-[#141418] py-1 shadow-2xl z-20">
              <button
                onClick={() => {
                  setAddPaymentModalOpen(true)
                  setActionMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-[#1f1f28] hover:text-white flex items-center gap-2"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ajouter un encaissement</span>
              </button>
              <button
                onClick={() => {
                  setReminderModalOpen(true)
                  setActionMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-[#1f1f28] hover:text-white flex items-center gap-2"
              >
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>Envoyer relance</span>
              </button>
              <button
                onClick={() => alert('Dossier soldé manuellement')}
                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-[#1f1f28] hover:text-white flex items-center gap-2 border-t border-[#222228]"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Clôturer / Marquer soldé</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Reference Header & Summary Card matching Reference #31 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black font-mono text-white tracking-tight">
              {code}
            </h1>
            <span className="inline-flex items-center rounded bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-bold text-red-400">
              En retard
            </span>
          </div>
        </div>

        {/* Top Summary Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div>
            <div className="text-[10px] text-zinc-400">Client</div>
            <div className="font-bold text-white text-sm mt-0.5">Imane Zahiri</div>
            <div className="text-[10px] text-zinc-500">Contact: 06 12 34 56 78</div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400">Facture(s)</div>
            <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">FAC-2025-038</div>
            <div className="text-[10px] text-zinc-500">Échéance: 26/06/2025</div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400">Montant dû / Encaissé</div>
            <div className="font-mono text-white text-xs mt-0.5">
              Dû: <span className="font-bold">{amountDue.toLocaleString('fr-FR')} DH</span>
            </div>
            <div className="font-mono text-emerald-400 text-xs">
              Encaissé: <span className="font-bold">{amountPaid.toLocaleString('fr-FR')} DH</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400">Solde restant dû</div>
            <div className="font-mono font-black text-red-400 text-base mt-0.5">
              {balanceDue.toLocaleString('fr-FR')} DH
            </div>
            <div className="text-[10px] text-orange-400 font-semibold">
              Ancienneté: 31 jours
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[#222228] pb-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'info'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Informations</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'schedule'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Échéancier & Encaissements</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <HistoryIcon className="h-3.5 w-3.5" />
          <span>Historique & Relances</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'documents'
              ? 'bg-red-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-[#16161c]'
          }`}
        >
          <Folder className="h-3.5 w-3.5" />
          <span>Documents</span>
        </button>
      </div>

      {/* Tab 1: Informations matching Reference #31 Screen 2 */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Détails */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Détails de la créance</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Date facture :</span>
                <span className="font-mono text-white">27/05/2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Véhicule concerné :</span>
                <span className="font-semibold text-white">Mercedes-Benz C220d AMG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Mode de paiement convenu :</span>
                <span className="text-zinc-200">Virement bancaire</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Référence dernier paiement :</span>
                <span className="font-mono text-cyan-400">VIR-2025-154</span>
              </div>
              <div className="pt-2">
                <span className="text-zinc-400 block mb-1">Notes :</span>
                <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-2.5 text-zinc-300 italic text-[11px]">
                  &ldquo;Paiement en attente de validation du virement partiel de 5 000 DH.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Adresse de facturation */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-red-400" />
              <span>Adresse de facturation & Coordonnées</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Destinataire :</span>
                <span className="font-bold text-white">Imane Zahiri</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Adresse postale :</span>
                <span className="text-zinc-200">120, Rue des Orangers</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Ville & Pays :</span>
                <span className="text-zinc-200">Casablanca, MAROC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Téléphone direct :</span>
                <span className="font-mono text-cyan-400">06 12 34 56 78</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c24]">
                <span className="text-zinc-400">Email client :</span>
                <span className="text-zinc-200">imane.zahiri@email.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Échéancier & Encaissements matching Reference #31 Screen 3 */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Metrics summary banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 text-center">
              <div className="text-[10px] text-zinc-400">Montant dû</div>
              <div className="font-mono font-black text-white text-base mt-1">
                {amountDue.toLocaleString('fr-FR')} DH
              </div>
            </div>
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 text-center">
              <div className="text-[10px] text-zinc-400">Montant encaissé</div>
              <div className="font-mono font-black text-emerald-400 text-base mt-1">
                {amountPaid.toLocaleString('fr-FR')} DH
              </div>
            </div>
            <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 text-center">
              <div className="text-[10px] text-zinc-400">Solde restant dû</div>
              <div className="font-mono font-black text-red-400 text-base mt-1">
                {balanceDue.toLocaleString('fr-FR')} DH
              </div>
            </div>
          </div>

          {/* Section 1: Échéancier */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>Échéancier</span>
              </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Échéance</th>
                    <th className="py-2.5 px-3 text-right font-mono">Montant prévu</th>
                    <th className="py-2.5 px-3 text-right font-mono">Montant dû</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 text-right font-mono">Jours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{s.dueDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-300">
                        {s.plannedAmount.toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                        {s.dueAmount.toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-orange-400 font-semibold">
                        {s.daysDiff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Historique des encaissements */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>Historique des encaissements</span>
              </h3>

              <button
                onClick={() => setAddPaymentModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Ajouter un encaissement</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right font-mono">Montant</th>
                    <th className="py-2.5 px-3">Mode de paiement</th>
                    <th className="py-2.5 px-3 font-mono">Référence</th>
                    <th className="py-2.5 px-3">Reçu par</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-white">{p.date}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {p.amount.toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300">{p.paymentMethod}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-400">{p.reference}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{p.receivedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Historique */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Journal des relances et événements
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 border-l-2 border-red-600 pl-4 py-1">
              <div>
                <div className="font-bold text-white">Relance R2 envoyée (Email + SMS)</div>
                <div className="text-[11px] text-zinc-400">
                  Délai de paiement dépassé de 31 jours. Notification envoyée automatiquement à Imane Zahiri.
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">27/06/2025 10:15 par Automate Relances</div>
              </div>
            </div>

            <div className="flex gap-3 border-l-2 border-emerald-600 pl-4 py-1">
              <div>
                <div className="font-bold text-white">Encaissement partiel validé (5 000 DH)</div>
                <div className="text-[11px] text-zinc-400">
                  Virement bancaire VIR-2025-154 validé et imputé sur la facture FAC-2025-038.
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">28/05/2025 14:30 par Admin Maalal</div>
              </div>
            </div>

            <div className="flex gap-3 border-l-2 border-zinc-600 pl-4 py-1">
              <div>
                <div className="font-bold text-white">Création du dossier de solde</div>
                <div className="text-[11px] text-zinc-400">
                  Créance de 24 900 DH générée suite à la confirmation de vente VEN-2025-0032.
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">27/05/2025 09:00 par Système</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Documents associés
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-bold text-white">Facture client FAC-2025-038.pdf</div>
                  <div className="text-[10px] text-zinc-400 font-mono">245 KB &bull; 27/05/2025</div>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded bg-[#1f1f28] border border-[#2d2d38] text-[10px] text-zinc-200 hover:text-white">
                Télécharger
              </button>
            </div>

            <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">Bordereau encaissement 5000DH.pdf</div>
                  <div className="text-[10px] text-zinc-400 font-mono">180 KB &bull; 28/05/2025</div>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded bg-[#1f1f28] border border-[#2d2d38] text-[10px] text-zinc-200 hover:text-white">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ajouter un encaissement */}
      {addPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white">
                Ajouter un encaissement
              </h3>
              <button
                onClick={() => setAddPaymentModalOpen(false)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Montant à encaisser (DH)
                </label>
                <input
                  type="number"
                  required
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(Number(e.target.value) || 0)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Mode de paiement
                </label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Chèque certifié">Chèque certifié</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Carte bancaire TPE">Carte bancaire TPE</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Référence de transaction
                </label>
                <input
                  type="text"
                  required
                  value={newPayRef}
                  onChange={(e) => setNewPayRef(e.target.value)}
                  placeholder="Ex: VIR-2025-155"
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setAddPaymentModalOpen(false)}
                  className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Enregistrer l&apos;encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Relancer client */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#282834] bg-[#141418] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>Envoyer relance à Imane Zahiri</span>
              </h3>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-zinc-300">
                <div>Solde dû restant : <span className="font-mono font-bold text-red-400">{balanceDue.toLocaleString('fr-FR')} DH</span></div>
                <div>Facture associée : <span className="font-mono text-cyan-400">FAC-2025-038</span></div>
                <div>Canaux de relance : <span className="font-semibold text-white">Email & SMS</span></div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Modèle d&apos;email
                </label>
                <select className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
                  <option>Relance standard (Échéance dépassée de 31j)</option>
                  <option>Dernier avis avant contentieux</option>
                  <option>Demande d&apos;échéancier personnalisé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setReminderModalOpen(false)
                  setPaymentSuccessToast(true)
                  setTimeout(() => setPaymentSuccessToast(false), 3000)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Envoyer maintenant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {paymentSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Opération effectuée avec succès !</span>
        </div>
      )}
    </div>
  )
}
