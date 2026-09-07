'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { FinancingEcheancierChart } from '@/features/financing/financing-echeancier-chart'

export default function FinancingSimulatorPage() {
  const [vehiclePrice, setVehiclePrice] = useState(24000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25)
  const [durationMonths, setDurationMonths] = useState(60)
  const [interestRate, setInterestRate] = useState(5.20)
  const [insuranceOption, setInsuranceOption] = useState('INCLUDED')
  const [rateType, setRateType] = useState('FIXED')

  // Computations matching Reference #09 Screen 1
  const downPayment = Math.round((vehiclePrice * downPaymentPercent) / 100)
  const loanAmount = Math.max(0, vehiclePrice - downPayment)
  const monthlyRate = interestRate / 100 / 12
  const insuranceMonthly = insuranceOption === 'INCLUDED' ? 22.0 : 0.0

  const baseMonthlyPayment =
    loanAmount > 0 && durationMonths > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, durationMonths))) /
        (Math.pow(1 + monthlyRate, durationMonths) - 1)
      : 0

  const totalMonthlyPayment = baseMonthlyPayment + insuranceMonthly
  const totalCostCredit = baseMonthlyPayment * durationMonths - loanAmount + insuranceMonthly * durationMonths
  const totalDue = loanAmount + totalCostCredit
  const taeg = (interestRate + (insuranceMonthly * 12 * 100) / loanAmount).toFixed(2)

  // Generate 6 stacked periods for chart
  const scheduleData = [
    { period: 'Mois 1', capital: Math.round(baseMonthlyPayment * 0.75), interets: Math.round(baseMonthlyPayment * 0.25) },
    { period: '12', capital: Math.round(baseMonthlyPayment * 0.79), interets: Math.round(baseMonthlyPayment * 0.21) },
    { period: '24', capital: Math.round(baseMonthlyPayment * 0.83), interets: Math.round(baseMonthlyPayment * 0.17) },
    { period: '36', capital: Math.round(baseMonthlyPayment * 0.88), interets: Math.round(baseMonthlyPayment * 0.12) },
    { period: '48', capital: Math.round(baseMonthlyPayment * 0.93), interets: Math.round(baseMonthlyPayment * 0.07) },
    { period: '60', capital: Math.round(baseMonthlyPayment * 0.97), interets: Math.round(baseMonthlyPayment * 0.03) },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Simulation de Financement"
        subtitle="Simulateur de crédit automobile avec calcul des mensualités, TAEG et échéancier d’amortissement"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Financement', href: '/financing' },
          { label: 'Simulation' },
        ]}
        actions={
          <Link
            href="/financing"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
        }
      />

      {/* Two-Column Simulation Layout matching Reference #09 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
        {/* Left Col: Paramètres du financement (6 cols) */}
        <div className="md:col-span-6 rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-3">
              Paramètres du financement
            </h2>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Prix du véhicule</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 pr-10 text-white font-mono font-bold focus:border-red-500 focus:outline-none"
                />
                <span className="absolute right-3 text-zinc-500 font-mono font-bold text-xs">DH</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Apport</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setDownPaymentPercent(vehiclePrice > 0 ? Math.round((val / vehiclePrice) * 100) : 0)
                    }}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 pr-10 text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">DH</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Pourcentage</label>
                <select
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value={10}>10 %</option>
                  <option value={20}>20 %</option>
                  <option value={25}>25 %</option>
                  <option value={30}>30 %</option>
                  <option value={40}>40 %</option>
                  <option value={50}>50 %</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Montant à financer</label>
              <div className="h-10 w-full rounded-lg border border-[#24242e] bg-[#15151a] px-3 flex items-center justify-between font-mono font-bold text-white">
                <span>{loanAmount.toLocaleString('fr-MA')} DH</span>
                <span className="text-zinc-500 text-[11px] font-normal">Calculé auto</span>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Durée</label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
              >
                <option value={12}>12 mois (1 an)</option>
                <option value={24}>24 mois (2 ans)</option>
                <option value={36}>36 mois (3 ans)</option>
                <option value={48}>48 mois (4 ans)</option>
                <option value={60}>60 mois (5 ans)</option>
                <option value={72}>72 mois (6 ans)</option>
                <option value={84}>84 mois (7 ans)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Type de taux</label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="FIXED">Fixe</option>
                  <option value="VARIABLE">Variable</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Taux annuel (%)</label>
                <select
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
                >
                  <option value={4.75}>4,75 %</option>
                  <option value={5.20}>5,20 %</option>
                  <option value={5.50}>5,50 %</option>
                  <option value={5.75}>5,75 %</option>
                  <option value={6.20}>6,20 %</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Assurance emprunteur</label>
              <select
                value={insuranceOption}
                onChange={(e) => setInsuranceOption(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="INCLUDED">Incluse (22,00 DH / mois)</option>
                <option value="EXCLUDED">Non incluse</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#222228]">
            <button className="w-full rounded-xl border border-[#282834] bg-[#16161c] py-2.5 font-bold text-zinc-200 hover:text-white hover:bg-[#1e1e26] transition-all">
              Enregistrer la simulation
            </button>
          </div>
        </div>

        {/* Right Col: Résultat de la simulation & Échéancier (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          {/* Top Result Card matching Reference #09 Screen 1 */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-3">
              Résultat de la simulation
            </h2>

            {/* Glowing Monthly Payment Box */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-1">
              <span className="text-[11px] font-semibold text-zinc-300">Mensualité estimée</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {totalMonthlyPayment.toFixed(2)} DH
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">TAEG : {taeg} %</span>
            </div>

            {/* Financial Details Table */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Montant financé</span>
                <span className="font-mono font-bold text-white">{loanAmount.toLocaleString('fr-MA')} DH</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Coût total du crédit</span>
                <span className="font-mono font-bold text-white">{totalCostCredit.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1e1e26]">
                <span className="text-zinc-400">Montant total dû</span>
                <span className="font-mono font-black text-cyan-400">{totalDue.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-400">Assurance mensuelle</span>
                <span className="font-mono text-zinc-300">{insuranceMonthly.toFixed(2)} DH</span>
              </div>
            </div>
          </div>

          {/* Échéancier (aperçu) Stacked Chart Card matching Reference #09 Screen 1 */}
          <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-white border-b border-[#222228] pb-2">
              Échéancier (aperçu)
            </h2>
            <FinancingEcheancierChart data={scheduleData} />

            <div className="pt-3 border-t border-[#222228]">
              <button className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                <span>Envoyer au client</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
