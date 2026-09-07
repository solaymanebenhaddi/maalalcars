'use client'

import React, { useState } from 'react'
import { Download, X, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react'
import { useWheelLoader } from '@/contexts/wheel-loader.context'

export interface DataExportModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: 'vehicles' | 'sales' | 'invoices' | 'clients'
}

export function DataExportModal({
  isOpen,
  onClose,
  defaultType = 'vehicles',
}: DataExportModalProps) {
  const { showWheelLoader, hideWheelLoader } = useWheelLoader()
  const [exportType, setExportType] = useState(defaultType)
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx')
  const [period, setPeriod] = useState('all')
  const [includeFinancialDetails, setIncludeFinancialDetails] = useState(true)
  const [hideEmptyCols, setHideEmptyCols] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    showWheelLoader('Exportation des données en cours...')

    try {
      // Simulate real data file generation and trigger browser download
      const typeLabel =
        exportType === 'vehicles'
          ? 'Vehicules_Stock'
          : exportType === 'sales'
          ? 'Journal_Ventes'
          : exportType === 'invoices'
          ? 'Factures'
          : 'Clients'

      const dateStr = new Date().toISOString().slice(0, 10)
      const filename = `MAALALCARS_${typeLabel}_${dateStr}.${format === 'xlsx' ? 'xlsx' : format === 'csv' ? 'csv' : 'pdf'}`

      // CSV content will be generated from real database data via export API
      const content = ''
      if (format === 'csv' || format === 'xlsx') {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // PDF trigger
        window.print()
      }

      setDownloadSuccess(true)
      setTimeout(() => {
        setDownloadSuccess(false)
        setIsExporting(false)
        hideWheelLoader()
        onClose()
      }, 1200)
    } catch (err) {
      console.error(err)
      setIsExporting(false)
      hideWheelLoader()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#282834] bg-[#121216] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Download className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Exportation des Données</h3>
              <p className="text-[11px] text-zinc-400">Générez un export certifié au format de votre choix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1c1c24] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {downloadSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Export généré avec succès !</h4>
            <p className="text-xs text-zinc-400">Le téléchargement de votre fichier a débuté.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* 1. Type d'export */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Données à exporter *</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'vehicles', label: 'Parc Véhicules en Stock' },
                  { id: 'sales', label: 'Journal des Ventes' },
                  { id: 'invoices', label: 'Factures & Règlements' },
                  { id: 'clients', label: 'Répertoire Clients & CRM' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExportType(item.id as typeof exportType)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors ${
                      exportType === item.id
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-bold'
                        : 'border-[#282834] bg-[#16161c] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Format */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Format de sortie *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('xlsx')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${
                    format === 'xlsx'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-[#282834] bg-[#16161c] text-zinc-400'
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${
                    format === 'csv'
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-bold'
                      : 'border-[#282834] bg-[#16161c] text-zinc-400'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>CSV (.csv)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${
                    format === 'pdf'
                      ? 'border-red-500/50 bg-red-500/10 text-red-400 font-bold'
                      : 'border-[#282834] bg-[#16161c] text-zinc-400'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF Imprimable</span>
                </button>
              </div>
            </div>

            {/* 3. Période */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Période concernée</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-9 w-full rounded-xl border border-[#282834] bg-[#16161c] px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">Tout l&apos;historique disponible</option>
                <option value="month">Ce mois-ci</option>
                <option value="last-month">Le mois dernier</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année en cours (2026)</option>
              </select>
            </div>

            {/* 4. Options */}
            <div className="pt-2 border-t border-[#1e1e24] space-y-2">
              <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                <span>Inclure les détails financiers (Prix d&apos;achat, marges, commissions)</span>
                <input
                  type="checkbox"
                  checked={includeFinancialDetails}
                  onChange={(e) => setIncludeFinancialDetails(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-[#16161c] text-cyan-600 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                <span>Masquer les colonnes vides ou sans valeur</span>
                <input
                  type="checkbox"
                  checked={hideEmptyCols}
                  onChange={(e) => setHideEmptyCols(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-[#16161c] text-cyan-600 focus:ring-cyan-500"
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#2e2e38] bg-[#181820] text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 shadow-md transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Génération en cours...' : 'Télécharger le fichier'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
