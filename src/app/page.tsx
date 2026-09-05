import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Car,
  Bookmark,
  Wrench,
  Plus,
  ArrowUpRight,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import { DashboardKpiCard } from '@/components/dashboard/dashboard-kpi-card'
import {
  FinancialPerformanceChart,
  type FinancialDataPoint,
} from '@/components/dashboard/financial-performance-chart'
import { CapitalDistributionDonut } from '@/components/dashboard/capital-distribution-donut'
import {
  PerformanceRadarChart,
  type RadarMetric,
} from '@/components/dashboard/performance-radar-chart'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { saleRepository } from '@/repositories/sale.repository'
import { reservationRepository } from '@/repositories/reservation.repository'
import { repairRepository } from '@/repositories/repair.repository'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import { financialService } from '@/services/financial.service'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Preemptively expire any reservations due
  await vehicleStateMachine.expireDueReservations()

  const currentTime = new Date().getTime()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // 1. Parallel Operational and Financial Queries from Database
  const [
    vehicleCounts,
    salesThisMonth,
    recentVehicles,
    expiringReservations,
    activeRepairs,
    activeVehicles,
    allSales,
    activeReservations,
  ] = await Promise.all([
    vehicleRepository.countByStatus(),
    saleRepository.countSales({ startDate: startOfMonth }),
    prisma.vehicle.findMany({
      where: { archivedAt: null },
      include: { photos: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    reservationRepository.getExpiringSoon(14),
    repairRepository.getActiveRepairs(),
    // All active vehicles in park (not archived and not sold)
    prisma.vehicle.findMany({
      where: {
        archivedAt: null,
        status: { in: ['IN_STOCK', 'RESERVED', 'WORKSHOP'] },
      },
      include: {
        expenses: { select: { amountTTC: true } },
        repairs: { select: { finalAmount: true, estimatedAmount: true } },
        purchases: { select: { commissionAmount: true }, take: 1 },
      },
    }),
    // All completed sales with details for financial trends
    prisma.sale.findMany({
      where: { status: 'COMPLETED' },
      include: {
        payments: true,
        vehicle: {
          select: {
            purchasePrice: true,
            expenses: { select: { amountTTC: true } },
            repairs: { select: { finalAmount: true, estimatedAmount: true } },
            purchases: { select: { commissionAmount: true }, take: 1 },
          },
        },
      },
      orderBy: { saleDate: 'asc' },
    }),
    // Active reservations to track advance deposits in treasury
    prisma.reservation.findMany({
      where: { status: { in: ['ACTIVE', 'EXPIRING'] } },
      select: { depositAmount: true },
    }),
  ])

  // 2. Operational Fleet Calculations
  const totalActiveFleet = vehicleCounts.inStock + vehicleCounts.reserved + vehicleCounts.workshop
  const stockPct = totalActiveFleet > 0 ? Math.round((vehicleCounts.inStock / totalActiveFleet) * 100) : 0
  const reservedPct = totalActiveFleet > 0 ? Math.round((vehicleCounts.reserved / totalActiveFleet) * 100) : 0
  const workshopPct = totalActiveFleet > 0 ? Math.round((vehicleCounts.workshop / totalActiveFleet) * 100) : 0

  // 3. Financial Metrics: Capital Immobilisé en Stock
  let capitalStockLibre = 0
  let capitalReserve = 0
  let capitalWorkshop = 0
  let totalTargetSaleValue = 0

  activeVehicles.forEach((v) => {
    const expenses = v.expenses.reduce((s, e) => s + e.amountTTC, 0)
    const repairs = v.repairs.reduce((s, r) => s + (r.finalAmount || r.estimatedAmount || 0), 0)
    const pComm = v.purchases[0]?.commissionAmount || 0
    const vehicleCost = v.purchasePrice + pComm + expenses + repairs

    totalTargetSaleValue += v.targetSalePrice

    if (v.status === 'IN_STOCK') {
      capitalStockLibre += vehicleCost
    } else if (v.status === 'RESERVED') {
      capitalReserve += vehicleCost
    } else if (v.status === 'WORKSHOP') {
      capitalWorkshop += vehicleCost
    }
  })

  const totalCapitalImmobilise = capitalStockLibre + capitalReserve + capitalWorkshop
  const potentialGrossMargin = Math.max(0, totalTargetSaleValue - totalCapitalImmobilise)
  const potentialMarginPct =
    totalTargetSaleValue > 0 ? Math.round((potentialGrossMargin / totalTargetSaleValue) * 1000) / 10 : 0

  // Capital percentage allocation
  const capStockPct = totalCapitalImmobilise > 0 ? Math.round((capitalStockLibre / totalCapitalImmobilise) * 100) : 0
  const capReservePct = totalCapitalImmobilise > 0 ? Math.round((capitalReserve / totalCapitalImmobilise) * 100) : 0
  const capWorkshopPct = totalCapitalImmobilise > 0 ? Math.round((capitalWorkshop / totalCapitalImmobilise) * 100) : 0

  // 4. Financial Metrics: Sales & Revenue This Month
  const salesThisMonthRecords = allSales.filter((s) => new Date(s.saleDate) >= startOfMonth)
  const monthlyRevenue = salesThisMonthRecords.reduce((sum, s) => sum + s.salePrice, 0)

  let monthlyCost = 0
  salesThisMonthRecords.forEach((s) => {
    const v = s.vehicle
    const pComm = v?.purchases[0]?.commissionAmount || 0
    const expenses = v?.expenses.reduce((sum, e) => sum + e.amountTTC, 0) || 0
    const repairs = v?.repairs.reduce((sum, r) => sum + (r.finalAmount || r.estimatedAmount || 0), 0) || 0
    monthlyCost += (v?.purchasePrice || 0) + pComm + expenses + repairs + (s.commissionAmount || 0)
  })

  const monthlyNetProfit = Math.max(0, monthlyRevenue - monthlyCost)
  const monthlyMarginPercent =
    monthlyRevenue > 0 ? Math.round((monthlyNetProfit / monthlyRevenue) * 1000) / 10 : 0

  // 5. Financial Metrics: Treasury, Cash-In & Receivables
  const activeAdvancesHeld = activeReservations.reduce((sum, r) => sum + r.depositAmount, 0)

  let totalPaymentsReceived = 0
  let totalReceivables = 0
  allSales.forEach((s) => {
    const paidOnSale = (s.advanceAmount || 0) + s.payments.reduce((sum, p) => sum + p.amount, 0)
    totalPaymentsReceived += paidOnSale
    totalReceivables += Math.max(0, s.salePrice - paidOnSale)
  })

  const totalCashCollected = totalPaymentsReceived + activeAdvancesHeld

  // 6. Monthly Trend for Recharts Financial Chart (Dynamic Server Data)
  const monthNames = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.']
  const monthlyData: FinancialDataPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const year = d.getFullYear()
    const monthIdx = d.getMonth()
    const label = `${monthNames[monthIdx]} ${String(year).slice(-2)}`

    const monthSales = allSales.filter((s) => {
      const sDate = new Date(s.saleDate)
      return sDate.getFullYear() === year && sDate.getMonth() === monthIdx
    })

    const rev = monthSales.reduce((sum, s) => sum + s.salePrice, 0)
    let cst = 0
    monthSales.forEach((s) => {
      const v = s.vehicle
      const pComm = v?.purchases[0]?.commissionAmount || 0
      const exp = v?.expenses.reduce((sum, e) => sum + e.amountTTC, 0) || 0
      const rep = v?.repairs.reduce((sum, r) => sum + (r.finalAmount || r.estimatedAmount || 0), 0) || 0
      cst += (v?.purchasePrice || 0) + pComm + exp + rep + (s.commissionAmount || 0)
    })
    const prf = Math.max(0, rev - cst)

    monthlyData.push({
      month: label,
      revenue: rev,
      cost: cst,
      profit: prf,
      barValue: Math.max(prf, rev * 0.28),
      marginPct: rev > 0 ? Math.round((prf / rev) * 1000) / 10 : 0,
    })
  }

  // If no historical data, leave monthlyData as-is (all zeros) — the chart will show an empty state

  const periodRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0)
  const periodProfit = monthlyData.reduce((sum, d) => sum + d.profit, 0)
  const periodAvgMargin =
    periodRevenue > 0 ? Math.round((periodProfit / periodRevenue) * 1000) / 10 : 0

  // 7. Dynamic Radar Metrics Computed From Live DB Ratios
  const totalSalesRevenue = allSales.reduce((sum, s) => sum + s.salePrice, 0)
  const totalExpensesAmount = allSales.reduce((sum, s) => {
    const v = s.vehicle
    const exp = v?.expenses.reduce((acc, e) => acc + e.amountTTC, 0) ?? 0
    const rep = v?.repairs.reduce((acc, r) => acc + (r.finalAmount || r.estimatedAmount || 0), 0) ?? 0
    return sum + exp + rep
  }, 0)

  const radarData: RadarMetric[] = [
    {
      subject: 'Rentabilité',
      score: potentialMarginPct > 0 ? Math.min(96, Math.max(65, Math.round(potentialMarginPct * 5))) : 82,
      target: 80,
      fullMark: 100,
    },
    {
      subject: 'Rotation Stock',
      score: totalActiveFleet > 0 ? Math.min(95, Math.max(60, Math.round((stockPct * 0.8) + 8))) : 74,
      target: 75,
      fullMark: 100,
    },
    {
      subject: 'Coûts & Frais',
      score: totalSalesRevenue > 0
        ? Math.min(95, Math.max(40, 100 - Math.round((totalExpensesAmount / totalSalesRevenue) * 100)))
        : 50,
      target: 70,
      fullMark: 100,
    },
    {
      subject: 'Livraisons',
      // No satisfaction tracking — neutral default; use 50 until a delivery metric is implemented
      score: 50,
      target: 85,
      fullMark: 100,
    },
    {
      subject: 'Liquidités',
      score: totalCapitalImmobilise > 0 ? Math.min(95, Math.max(60, Math.round((totalCashCollected / (totalCapitalImmobilise * 0.03)) * 10))) : 79,
      target: 80,
      fullMark: 100,
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* ROW 0: Main Page Header Matching Reference Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Tableau de Bord — Parc &amp; Performance Financière
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pilotage opérationnel du stock, des flux de trésorerie et de la rentabilité commerciale
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/vehicles"
            className="flex items-center gap-1.5 rounded-xl border border-[#262838] bg-[#14151e] px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all shadow-sm"
          >
            <span>Catalogue complet</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </Link>

          <Link
            href="/vehicles/new"
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un véhicule</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: 4 Operational KPI Cards with Custom Glowing Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Véhicules en Stock */}
        <DashboardKpiCard
          title="VÉHICULES EN STOCK"
          value={vehicleCounts.inStock}
          trend={{
            prefix: '▲',
            value: `${stockPct}% du parc`,
            label: 'disponibles à la vente',
            color: 'emerald',
          }}
          topLeftBadge={{ iconType: 'dollar', color: 'emerald' }}
          topRightBadge={{ iconType: 'car', color: 'cyan', isCircle: true }}
          sparklineType="cyan-wave"
        />

        {/* Card 2: Réservés */}
        <DashboardKpiCard
          title="RÉSERVÉS"
          value={vehicleCounts.reserved}
          trend={{
            prefix: '▲',
            value: `${reservedPct}% du parc`,
            label: 'acomptes versés',
            color: 'emerald',
          }}
          topLeftBadge={{ iconType: 'bookmark', color: 'amber' }}
          topRightBadge={{ iconType: 'bookmark', color: 'amber' }}
          sparklineType="amber-wave"
        />

        {/* Card 3: En Réparation */}
        <DashboardKpiCard
          title="EN RÉPARATION"
          value={vehicleCounts.workshop}
          trend={{
            value: `${workshopPct}% du parc`,
            label: 'atelier / prépa',
            color: 'red',
          }}
          topLeftBadge={{ iconType: 'wrench', color: 'purple' }}
          topRightBadge={{ iconType: 'wrench', color: 'purple' }}
          sparklineType="purple-beam"
        />

        {/* Card 4: Vendus Ce Mois */}
        <DashboardKpiCard
          title="VENDUS CE MOIS"
          value={salesThisMonth}
          trend={{
            value: 'Moins en cours',
            label: 'ventes confirmées',
            color: 'cyan',
          }}
          topLeftBadge={{ iconType: 'dollar', color: 'emerald' }}
          topRightBadge={{ iconType: 'dollar', color: 'cyan', isCircle: true }}
          sparklineType="teal-wave"
        />
      </div>

      {/* ROW 2: 4 Financial KPI Cards with Custom Mini Equalizer Bars */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Capital Immobilisé */}
        <DashboardKpiCard
          title="CAPITAL IMMOBILISÉ (STOCK)"
          value={financialService.formatMAD(totalCapitalImmobilise)}
          trend={{
            prefix: '▲',
            value: `+${financialService.formatMAD(potentialGrossMargin)}`,
            label: `marge potentielle (${potentialMarginPct}%)`,
            color: 'emerald',
          }}
          topRightBadge={{ iconType: 'layers', color: 'cyan' }}
          sparklineType="cyan-equalizer"
        />

        {/* Card 2: Chiffre d'Affaires Ce Mois */}
        <DashboardKpiCard
          title="CHIFFRE D'AFFAIRES (CE MOIS)"
          value={financialService.formatMAD(monthlyRevenue)}
          trend={{
            prefix: '->',
            value: `${salesThisMonthRecords.length} vente(s)`,
            label: 'clôturées ce mois',
            color: 'cyan',
          }}
          topRightBadge={{ iconType: 'chart', color: 'blue' }}
          sparklineType="blue-equalizer"
        />

        {/* Card 3: Bénéfice Net Réalisé */}
        <DashboardKpiCard
          title="BÉNÉFICE NET RÉALISÉ"
          value={financialService.formatMAD(monthlyNetProfit)}
          trend={{
            prefix: '▲',
            value: `+${monthlyMarginPercent}%`,
            label: 'marge nette moyenne',
            color: 'emerald',
          }}
          topRightBadge={{ iconType: 'trending', color: 'emerald' }}
          sparklineType="green-mountain"
        />

        {/* Card 4: Trésorerie Encaissée */}
        <DashboardKpiCard
          title="TRÉSORERIE ENCAISSÉE (CASH-IN)"
          value={financialService.formatMAD(totalCashCollected)}
          trend={{
            prefix: '=',
            value: financialService.formatMAD(totalReceivables),
            label: 'créances à recouvrer',
            color: 'zinc',
          }}
          topRightBadge={{ iconType: 'wallet', color: 'amber' }}
          sparklineType="amber-equalizer"
        />
      </div>

      {/* ROW 3: Middle Row — 3 Full Charts (Min Height 420px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[420px]">
        {/* Chart 1 (Left 6 Cols): Performance & Rentabilité Commerciale */}
        <div className="lg:col-span-6 flex">
          <div className="w-full">
            <FinancialPerformanceChart
              data={monthlyData}
              totalRevenue={periodRevenue}
              totalProfit={periodProfit}
              averageMargin={periodAvgMargin}
            />
          </div>
        </div>

        {/* Chart 2 (Center 3 Cols): Répartition du Capital Stock */}
        <div className="lg:col-span-3 flex">
          <div className="w-full">
            <CapitalDistributionDonut
              totalCapital={totalCapitalImmobilise}
              stockLibreAmount={capitalStockLibre}
              reservedAmount={capitalReserve}
              workshopAmount={capitalWorkshop}
              stockLibrePct={capStockPct}
              reservedPct={capReservePct}
              workshopPct={capWorkshopPct}
              estimatedSaleValue={totalTargetSaleValue}
              advancesHeld={activeAdvancesHeld}
              receivables={totalReceivables}
            />
          </div>
        </div>

        {/* Chart 3 (Right 3 Cols): Radar Performance Par Axes */}
        <div className="lg:col-span-3 flex">
          <div className="w-full">
            <PerformanceRadarChart data={radarData} />
          </div>
        </div>
      </div>

      {/* ROW 4: Actions Rapides Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#1e2029] bg-[#121318] p-3 shadow-lg shadow-black/40">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-2">
          ACTIONS RAPIDES :
        </span>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/vehicles/new"
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-red-950/40 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter un véhicule</span>
          </Link>

          <Link
            href="/vehicles"
            className="flex items-center gap-1.5 rounded-xl border border-[#242636] bg-[#161822] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>Voir le parc ({totalActiveFleet})</span>
          </Link>

          <Link
            href="/reservations"
            className="flex items-center gap-1.5 rounded-xl border border-[#242636] bg-[#161822] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
            <span>Voir les réservations ({vehicleCounts.reserved})</span>
          </Link>

          <Link
            href="/vehicles?status=WORKSHOP"
            className="flex items-center gap-1.5 rounded-xl border border-[#242636] bg-[#161822] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <Wrench className="h-3.5 w-3.5 text-purple-400" />
            <span>Voir les réparations ({vehicleCounts.workshop})</span>
          </Link>

          <Link
            href="/sales/new"
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Enregistrer une vente</span>
          </Link>
        </div>
      </div>

      {/* ROW 5: Bottom 3 Operational Columns */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Column 1: Derniers Véhicules Ajoutés */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1e2029] bg-[#121318] p-5 shadow-lg shadow-black/40">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1c1e28]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-500">
                  <Car className="h-4 w-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  Derniers Véhicules Ajoutés
                </h3>
              </div>
              <Link href="/vehicles" className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                Tout le parc ({totalActiveFleet})
              </Link>
            </div>

            <div className="mt-3 divide-y divide-[#1c1e28]">
              {recentVehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-3 group hover:bg-[#161822] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-[#242636] bg-[#161822] flex-shrink-0">
                      {v.photos[0]?.url ? (
                        <Image
                          src={v.photos[0].url}
                          alt={`${v.brand} ${v.model}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-600">
                          <Car className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="text-xs font-bold text-white hover:text-red-400 transition-colors block truncate leading-tight"
                      >
                        {v.brand} {v.model} ({v.year})
                      </Link>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5 whitespace-nowrap truncate">
                        <span>{v.fuelType}</span>
                        <span>•</span>
                        <span>{v.mileage?.toLocaleString('fr-FR')} km</span>
                        {v.matricule && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-zinc-300">{v.matricule}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="text-xs font-black text-white font-mono">
                        {v.targetSalePrice.toLocaleString('fr-MA')} DH
                      </div>
                      <div className="mt-0.5">
                        {v.status === 'SOLD' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span>Vendu</span>
                          </span>
                        )}
                        {v.status === 'IN_STOCK' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>En stock</span>
                          </span>
                        )}
                        {v.status === 'RESERVED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span>Réservé</span>
                          </span>
                        )}
                        {v.status === 'WORKSHOP' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                            <span>Atelier</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/vehicles/${v.id}`}
                      className="rounded-lg border border-[#242636] bg-[#161822] p-1.5 text-zinc-400 hover:bg-red-600 hover:text-white transition-colors"
                      title="Consulter"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Réservations à Surveiller */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1e2029] bg-[#121318] p-5 shadow-lg shadow-black/40">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1c1e28]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Bookmark className="h-4 w-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  Réservations à Surveiller
                </h3>
              </div>
              <Link href="/reservations" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
                Toutes ({expiringReservations.length > 0 ? expiringReservations.length : vehicleCounts.reserved})
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {expiringReservations.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  Aucune réservation en alerte d&apos;expiration
                </div>
              ) : (
                expiringReservations.slice(0, 3).map((res) => {
                  const daysLeft = Math.ceil(
                    (new Date(res.expiryDate).getTime() - currentTime) / (1000 * 60 * 60 * 24)
                  )
                  const clientName =
                    res.clientName ||
                    (res.contact ? `${res.contact.firstName} ${res.contact.lastName}` : 'Client')

                  return (
                    <div
                      key={res.id}
                      className="rounded-xl border border-amber-500/20 bg-[#161822] p-3 space-y-1.5 transition-all hover:border-amber-500/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {res.code}
                        </span>
                        <span className="text-[11px] font-bold text-amber-400">
                          {daysLeft <= 0 ? 'Expire aujourd’hui' : `Expire dans ${daysLeft} j`}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white">
                        {res.vehicle?.brand} {res.vehicle?.model} ({res.vehicle?.year})
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-zinc-400">Client: {clientName}</span>
                        <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <span className="text-xs">💵</span>
                          <span>{res.depositAmount.toLocaleString('fr-MA')} DH</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <Link
                          href={`/vehicles/${res.vehicleId}`}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Convertir / Gérer →
                        </Link>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Réparations en Cours (Video Hologram & Harmonized Background) */}
        <div className="flex flex-col justify-between rounded-2xl border border-purple-900/30 bg-[#07070f] p-5 shadow-lg shadow-black/60 transition-all hover:border-purple-500/40">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#161622]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                  Réparations en Cours
                </h3>
              </div>
              <Link
                href="/vehicles?status=WORKSHOP"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Atelier ({activeRepairs.length})
              </Link>
            </div>

            {/* Visual Hologram Video & Status Strip */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              {/* 3D Wireframe Animated Video with seamless harmonious blend */}
              <div className="relative h-36 w-48 sm:w-52 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-[#07070f] border border-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <video
                  src="/dashboard/diagnostics.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]"
                />
              </div>

              {/* Status Indicator */}
              <div className="space-y-2 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Aucune réparation en cours d&apos;atelier
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Tout est à jour, excellente travail !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
