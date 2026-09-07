'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

const STEPS = [
  { step: 1, label: 'Informations client' },
  { step: 2, label: 'Informations véhicule' },
  { step: 3, label: 'Financement souhaité' },
  { step: 4, label: 'Pièces justificatives' },
  { step: 5, label: 'Validation' },
]

export default function NewFinancingDossierPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Client
    fullName: '',
    phone: '',
    email: '',
    birthDate: '',
    profession: '',
    cin: '',
    address: '',
    monthlyIncome: '',
    otherIncome: '',
    monthlyExpenses: '',
    dependents: '',
    isHomeOwner: '',
    postalCode: '',

    // Step 2: Vehicle
    vehicleModel: '',
    vehiclePrice: '',
    registrationPlate: '',

    // Step 3: Financing
    partnerName: '',
    requestedAmount: '',
    downPayment: '',
    durationMonths: '',
    interestRate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    try {
      // Create financing application
      const res = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok || res.status === 404 || res.status === 405) {
        router.push('/financing')
      }
    } catch {
      router.push('/financing')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Nouveau Dossier Crédit"
        subtitle="Constitution d'un dossier de demande de financement bancaire et LLD"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Financement', href: '/financing' },
          { label: 'Nouveau dossier' },
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

      {/* 5-Step Stepper matching Reference #09 Screen 2 */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {STEPS.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className="flex items-center gap-2 text-left group"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs transition-all ${
                  currentStep === s.step
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                    : currentStep > s.step
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#1a1a22] text-zinc-400 border border-[#282834]'
                }`}
              >
                {currentStep > s.step ? <Check className="h-3.5 w-3.5" /> : s.step}
              </div>
              <span
                className={`text-xs font-semibold transition-colors ${
                  currentStep === s.step
                    ? 'text-white'
                    : currentStep > s.step
                    ? 'text-zinc-300'
                    : 'text-zinc-500'
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Form Content */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#222228] bg-[#121216] p-6 sm:p-8 shadow-sm space-y-6 text-xs"
      >
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Informations personnelles */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-2.5">
                Informations personnelles
              </h2>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">CIN / Passeport</label>
                  <input
                    type="text"
                    value={formData.cin}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono uppercase focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Profession</label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Cadre Supérieur">Cadre Supérieur / Dirigeant</option>
                  <option value="Fonctionnaire">Fonctionnaire / Secteur Public</option>
                  <option value="Profession Libérale">Profession Libérale (Médecin, Avocat, etc.)</option>
                  <option value="Salarié Secteur Privé">Salarié Secteur Privé (CDI)</option>
                  <option value="Commerçant">Commerçant / Entrepreneur</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Situation financière */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-2.5">
                Situation financière
              </h2>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Revenu mensuel net *</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    required
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 pr-10 text-white font-mono font-bold focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">DH</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Autres revenus</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={formData.otherIncome}
                    onChange={(e) => setFormData({ ...formData, otherIncome: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 pr-10 text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">DH</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Charges mensuelles</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 pr-10 text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 text-zinc-500 font-mono text-xs">DH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Personnes à charge</label>
                  <select
                    value={formData.dependents}
                    onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="">--</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4 ou plus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Propriétaire d&apos;un bien ?</label>
                  <div className="flex items-center gap-4 h-10 px-3 rounded-lg border border-[#282834] bg-[#18181f]">
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                      <input
                        type="radio"
                        name="homeOwner"
                        checked={formData.isHomeOwner === 'Oui'}
                        onChange={() => setFormData({ ...formData, isHomeOwner: 'Oui' })}
                        className="accent-red-600"
                      />
                      <span>Oui</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                      <input
                        type="radio"
                        name="homeOwner"
                        checked={formData.isHomeOwner === 'Non'}
                        onChange={() => setFormData({ ...formData, isHomeOwner: 'Non' })}
                        className="accent-red-600"
                      />
                      <span>Non</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Code postal</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-2.5">
              Informations sur le véhicule à financer
            </h2>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Modèle du véhicule</label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Prix TTC (DH)</label>
              <input
                type="number"
                value={formData.vehiclePrice}
                onChange={(e) => setFormData({ ...formData, vehiclePrice: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono font-bold focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Immatriculation</label>
              <input
                type="text"
                value={formData.registrationPlate}
                onChange={(e) => setFormData({ ...formData, registrationPlate: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {currentStep >= 3 && (
          <div className="space-y-4 max-w-xl">
            <h2 className="text-sm font-bold text-white border-b border-[#222228] pb-2.5">
              Paramètres de financement & Organisme partenaire
            </h2>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Organisme partenaire</label>
              <select
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">-- Sélectionner un organisme --</option>
                <option value="CIM Finance">CIM Finance</option>
                <option value="Wafasalaf">Wafasalaf</option>
                <option value="Eqdom">Eqdom</option>
                <option value="Saham Assurance">Saham Assurance</option>
                <option value="Salafin">Salafin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Montant demandé (DH)</label>
                <input
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono font-bold focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Apport (DH)</label>
                <input
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar matching Reference #09 Screen 2 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
          <Link
            href="/financing"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-5 py-2.5 font-bold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50"
          >
            <span>{currentStep === 5 ? 'Valider et transmettre' : 'Suivant'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
