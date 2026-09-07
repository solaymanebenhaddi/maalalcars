import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/db'
import {
  ArrowLeft,
  Printer,
  Send,
  ChevronDown,
  UserCheck,
  CreditCard,
  Car,
  User,
  CheckCircle2,
  Clock,
  Briefcase,
  BadgeDollarSign,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params

  // Look up sale by id or code
  const sale = await prisma.sale.findFirst({
    where: {
      OR: [{ id }, { code: id }],
    },
    include: {
      vehicle: {
        include: { photos: true },
      },
      buyer: true,
      salesperson: true,
      receivedBy: true,
      commissionPaidBy: true,
      commissioner: true,
      payments: {
        orderBy: { paymentDate: 'desc' },
      },
    },
  })

  // If sale not found in DB (e.g. mock reference URL), use fallback
  const isReal = Boolean(sale)
  const code = sale?.code || id || 'VTE-2025-0062'
  const saleDateStr = sale
    ? new Date(sale.saleDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '31/05/2025'

  const buyerName =
    sale?.buyerName ||
    (sale?.buyer ? `${sale.buyer.firstName} ${sale.buyer.lastName}` : 'Sami Martin')
  const buyerPhone = sale?.buyerPhone || sale?.buyer?.phone || '+212 6 00 00 00 00'
  const buyerCin = sale?.buyerCin || sale?.buyer?.cin || 'BE654321'
  const buyerAddress = sale?.buyerAddress || sale?.buyer?.city || 'Casablanca, Maroc'

  const vehicleTitle = sale
    ? `${sale.vehicle.brand} ${sale.vehicle.model} (${sale.vehicle.year})`
    : 'BMW X5 xDrive40d 2024'
  const vehicleVin = sale?.vehicle.vin || 'WBAJU010X0NL12456'
  const vehicleMatricule = sale?.vehicle.matricule || '11225 | A | 7'
  const vehiclePhoto =
    sale?.vehicle.photos.find((p) => p.isPrimary)?.url ||
    sale?.vehicle.photos[0]?.url ||
    '/vehicles/bmw-x5.jpg'

  const salePrice = sale?.salePrice || 250000
  const advanceAmount = sale?.advanceAmount || 0
  const totalPaid = sale
    ? sale.payments.reduce((sum, p) => (p.status === 'PAID' ? sum + p.amount : sum), 0)
    : 250000
  const remainingDue = Math.max(0, salePrice - totalPaid)
  const paymentMethod = sale?.paymentMethod || 'VIREMENT'
  const receiverName = sale?.receivedBy?.name || 'Maalal Admin'
  const salespersonName = sale?.salesperson?.name || 'Équipe Commerciale'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/sales"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux ventes</span>
        </Link>

        {isReal && (
          <span className="text-[11px] text-zinc-400 font-mono">
            ID: {sale?.id}
          </span>
        )}
      </div>

      {/* Main Container matching Reference #22 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Sale Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white font-mono">
                {code}
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {sale?.status || 'Confirmée'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Vente enregistrée le {saleDateStr}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Printer className="h-3.5 w-3.5 text-zinc-400" />
              <span>Imprimer</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Send className="h-3.5 w-3.5 text-zinc-400" />
              <span>Envoyer</span>
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <span>Plus</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Highlight Banner: Encaissement & Argent Récupéré Par */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Argent Récupéré Par :</span>
                <span className="text-emerald-400 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  {receiverName}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Règlement client encaissé par ce collaborateur • Tracé dans le journal des flux
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block">Total Encaissé</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {totalPaid.toLocaleString('fr-FR')} DH
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Résumé</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link href={`/sales/${code}/workflow`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Workflow &amp; Statut
          </Link>
          <Link href={`/sales/${code}/documents`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Documents
          </Link>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Paiements ({sale?.payments.length || 1})</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Historique</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Notes</button>
        </div>

        {/* 2 Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Left: Informations client */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span>Informations acheteur (client)</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nom complet</span>
                <span className="font-bold text-white">{buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Téléphone</span>
                <span className="font-mono text-zinc-200">{buyerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">CIN / ICE</span>
                <span className="font-mono text-zinc-200 uppercase">{buyerCin}</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Adresse</span>
                <span className="text-zinc-300 text-right">{buyerAddress}</span>
              </div>
            </div>
          </div>

          {/* Top Right: Informations véhicule */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
              <Car className="h-3.5 w-3.5 text-cyan-400" />
              <span>Informations véhicule</span>
            </h3>

            <div className="flex items-center gap-3 bg-[#121216] border border-[#22222c] p-2.5 rounded-lg">
              <div className="h-14 w-20 overflow-hidden rounded bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehiclePhoto}
                  alt={vehicleTitle}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-white text-xs">{vehicleTitle}</div>
                {vehicleVin && (
                  <div className="font-mono text-[10px] text-zinc-400">VIN: {vehicleVin}</div>
                )}
                {vehicleMatricule && (
                  <div className="font-mono text-[10px] text-cyan-400">
                    Matricule: {vehicleMatricule}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Left: Détails de la vente & Collaborateurs */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Détails de la vente &amp; Responsables</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Statut</span>
                <span className="font-bold text-emerald-400">{sale?.status || 'Confirmée'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date de vente</span>
                <span className="font-mono text-zinc-200">{saleDateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commercial (Vendeur)</span>
                <span className="font-semibold text-white">{salespersonName}</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2 items-center">
                <span className="text-zinc-300 font-semibold">Argent récupéré par :</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {receiverName}
                </span>
              </div>

              {/* Commissioner Section if present */}
              {sale?.commissionerName && (
                <div className="border-t border-[#202028] pt-2 space-y-1 bg-[#121216] p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[10px]">
                    <Briefcase className="h-3 w-3" />
                    <span>Courtier / Semsar</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Nom :</span>
                    <span className="text-white font-semibold">{sale.commissionerName}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Commission :</span>
                    <span className="font-mono text-purple-400 font-bold">
                      {sale.commissionAmount.toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                  {sale.commissionPaidBy && (
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">Payé par :</span>
                      <span className="text-white font-semibold">{sale.commissionPaidBy.name}</span>
                    </div>
                  )}
                </div>
              )}

              {sale?.notes && (
                <div className="space-y-1 border-t border-[#202028] pt-2">
                  <span className="text-zinc-400 block text-[10px]">Notes &amp; Remarques</span>
                  <p className="text-zinc-300">{sale.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Right: Montants & Paiement Réel */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-2">
              <BadgeDollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span>Modalités financières &amp; Règlements</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Prix de vente convenu</span>
                <span className="font-mono text-zinc-200 font-bold">
                  {salePrice.toLocaleString('fr-FR')} DH
                </span>
              </div>

              {advanceAmount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>- Acompte réservation reporté</span>
                  <span className="font-mono font-bold">
                    - {advanceAmount.toLocaleString('fr-FR')} DH
                  </span>
                </div>
              )}

              <div className="flex justify-between text-emerald-400">
                <span>- Total règlements encaissés</span>
                <span className="font-mono font-bold">
                  - {totalPaid.toLocaleString('fr-FR')} DH
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-[#202028] pt-2">
                <span className="text-xs font-bold text-white">Solde restant dû</span>
                <span
                  className={`font-mono font-black text-sm ${
                    remainingDue > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {remainingDue.toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>

            {/* Paiements réels enregistrés */}
            <div className="rounded-lg bg-[#121216] border border-[#22222c] p-3 space-y-2 text-[10px]">
              <div className="flex items-center justify-between text-zinc-400 border-b border-[#1e1e26] pb-1 font-semibold">
                <span className="flex items-center gap-1 text-white">
                  <CreditCard className="h-3 w-3 text-cyan-400" />
                  <span>Règlements reçus ({sale?.payments.length || 1})</span>
                </span>
                <span>Mode: {paymentMethod}</span>
              </div>

              {sale && sale.payments.length > 0 ? (
                <div className="space-y-1.5">
                  {sale.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-[#16161c] p-2 rounded border border-[#22222c]"
                    >
                      <div>
                        <span className="font-mono text-zinc-300 font-bold">{p.code}</span>
                        <div className="text-[9px] text-zinc-400">
                          {p.paymentMethod} •{' '}
                          {p.receivedBy ? (
                            <span className="text-emerald-400 font-semibold">
                              Reçu par {p.receivedBy}
                            </span>
                          ) : (
                            <span>Reçu par {receiverName}</span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        +{p.amount.toLocaleString('fr-FR')} DH
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-zinc-300">Règlement comptant</span>
                    <div className="text-[9px] text-emerald-400">
                      Reçu par : {receiverName}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    +{totalPaid.toLocaleString('fr-FR')} DH
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
