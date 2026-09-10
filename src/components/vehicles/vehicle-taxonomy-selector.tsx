'use client'

import * as React from 'react'
import {
  Car,
  Check,
  ChevronDown,
  X,
  Search,
  Lock,
  Sparkles,
  Layers,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CarBrandLogo } from '@/components/shared/car-brand-logos'
import {
  AUTOMOTIVE_BRANDS,
  CarBrand,
  getModelsForBrand,
  getVersionsForModel,
  normalizeTaxonomyString,
} from '@/data/automotive-taxonomy'

export interface VehicleTaxonomySelectorProps {
  initialBrand?: string
  initialModel?: string
  initialVersion?: string
  nameBrand?: string
  nameModel?: string
  nameVersion?: string
  required?: boolean
  className?: string
  onChange?: (values: { brand: string; model: string; version: string }) => void
}

const BRAND_CATEGORIES: Array<'Tous' | CarBrand['category']> = [
  'Tous',
  'Luxe & Prestige',
  'Premium',
  'Généraliste',
  'Sport & Supercar',
]

export function VehicleTaxonomySelector({
  initialBrand = '',
  initialModel = '',
  initialVersion = '',
  nameBrand = 'brand',
  nameModel = 'model',
  nameVersion = 'version',
  required = true,
  className,
  onChange,
}: VehicleTaxonomySelectorProps) {
  // Cascading Selection State
  const [selectedBrand, setSelectedBrand] = React.useState<string>(initialBrand)
  const [selectedModel, setSelectedModel] = React.useState<string>(initialModel)
  const [selectedVersion, setSelectedVersion] = React.useState<string>(initialVersion)

  // Dropdown States
  const [isBrandOpen, setIsBrandOpen] = React.useState(false)
  const [isModelOpen, setIsModelOpen] = React.useState(false)
  const [isVersionOpen, setIsVersionOpen] = React.useState(false)

  // Search & Category Filters
  const [brandSearch, setBrandSearch] = React.useState('')
  const [brandCategory, setBrandCategory] = React.useState<'Tous' | CarBrand['category']>('Tous')
  const [modelSearch, setModelSearch] = React.useState('')
  const [customModelInput, setCustomModelInput] = React.useState('')
  const [showCustomModelField, setShowCustomModelField] = React.useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false)

  // Container refs for outside click detection
  const brandContainerRef = React.useRef<HTMLDivElement>(null)
  const modelContainerRef = React.useRef<HTMLDivElement>(null)
  const versionContainerRef = React.useRef<HTMLDivElement>(null)
  const brandSearchInputRef = React.useRef<HTMLInputElement>(null)
  const modelSearchInputRef = React.useRef<HTMLInputElement>(null)

  // Lock status
  const isModelDisabled = !selectedBrand || selectedBrand.trim() === ''
  const isVersionDisabled = isModelDisabled || !selectedModel || selectedModel.trim() === ''

  // Form submit interception for validation
  React.useEffect(() => {
    const form = brandContainerRef.current?.closest('form')
    if (!form || !required) return

    const handleFormSubmit = (e: SubmitEvent) => {
      if (!selectedBrand || !selectedBrand.trim()) {
        e.preventDefault()
        e.stopPropagation()
        setHasAttemptedSubmit(true)
        setIsBrandOpen(true)
        return
      }
      if (!selectedModel || !selectedModel.trim()) {
        e.preventDefault()
        e.stopPropagation()
        setHasAttemptedSubmit(true)
        setIsModelOpen(true)
        return
      }
    }

    form.addEventListener('submit', handleFormSubmit)
    return () => form.removeEventListener('submit', handleFormSubmit)
  }, [selectedBrand, selectedModel, required])

  // Focus search inputs when dropdown opens
  React.useEffect(() => {
    if (isBrandOpen) {
      setTimeout(() => brandSearchInputRef.current?.focus(), 60)
    }
  }, [isBrandOpen])

  React.useEffect(() => {
    if (isModelOpen) {
      setTimeout(() => modelSearchInputRef.current?.focus(), 60)
    }
  }, [isModelOpen])

  // Handle outside clicks to close dropdowns
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (brandContainerRef.current && !brandContainerRef.current.contains(target)) {
        setIsBrandOpen(false)
      }
      if (modelContainerRef.current && !modelContainerRef.current.contains(target)) {
        setIsModelOpen(false)
      }
      if (versionContainerRef.current && !versionContainerRef.current.contains(target)) {
        setIsVersionOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsBrandOpen(false)
        setIsModelOpen(false)
        setIsVersionOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filtered Brands
  const filteredBrands = React.useMemo(() => {
    return AUTOMOTIVE_BRANDS.filter((b) => {
      const matchCat = brandCategory === 'Tous' || b.category === brandCategory
      if (!matchCat) return false

      if (!brandSearch.trim()) return true
      const q = normalizeTaxonomyString(brandSearch)
      return (
        normalizeTaxonomyString(b.name).includes(q) ||
        normalizeTaxonomyString(b.country).includes(q) ||
        normalizeTaxonomyString(b.category).includes(q)
      )
    })
  }, [brandCategory, brandSearch])

  // Exact Brand Match check for custom brand fallback
  const hasExactBrandMatch = React.useMemo(() => {
    if (!brandSearch.trim()) return true
    const q = normalizeTaxonomyString(brandSearch)
    return AUTOMOTIVE_BRANDS.some((b) => normalizeTaxonomyString(b.name) === q)
  }, [brandSearch])

  // Available Models for current selected brand
  const availableModels = React.useMemo(() => {
    return getModelsForBrand(selectedBrand)
  }, [selectedBrand])

  // Filtered Models
  const filteredModels = React.useMemo(() => {
    if (!modelSearch.trim()) return availableModels
    const q = normalizeTaxonomyString(modelSearch)
    return availableModels.filter((m) => normalizeTaxonomyString(m).includes(q))
  }, [availableModels, modelSearch])

  // Exact Model Match check
  const hasExactModelMatch = React.useMemo(() => {
    if (!modelSearch.trim()) return true
    const q = normalizeTaxonomyString(modelSearch)
    return availableModels.some((m) => normalizeTaxonomyString(m) === q)
  }, [availableModels, modelSearch])

  // Available Trims/Versions for current brand and model
  const availableVersions = React.useMemo(() => {
    return getVersionsForModel(selectedBrand, selectedModel)
  }, [selectedBrand, selectedModel])

  // Cascading Selection Handlers
  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(brandName)
    setSelectedModel('')
    setSelectedVersion('')
    setIsBrandOpen(false)
    setBrandSearch('')
    setShowCustomModelField(false)
    onChange?.({ brand: brandName, model: '', version: '' })
  }

  const handleClearBrand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedVersion('')
    setBrandSearch('')
    setShowCustomModelField(false)
    onChange?.({ brand: '', model: '', version: '' })
  }

  const handleSelectModel = (modelName: string) => {
    setSelectedModel(modelName)
    setSelectedVersion('')
    setIsModelOpen(false)
    setModelSearch('')
    setShowCustomModelField(false)
    onChange?.({ brand: selectedBrand, model: modelName, version: '' })
  }

  const handleClearModel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedModel('')
    setSelectedVersion('')
    setModelSearch('')
    setShowCustomModelField(false)
    onChange?.({ brand: selectedBrand, model: '', version: '' })
  }

  const handleSelectVersion = (versionName: string) => {
    setSelectedVersion(versionName)
    setIsVersionOpen(false)
    onChange?.({ brand: selectedBrand, model: selectedModel, version: versionName })
  }

  const handleVersionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSelectedVersion(val)
    onChange?.({ brand: selectedBrand, model: selectedModel, version: val })
  }

  const handleClearVersion = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVersion('')
    onChange?.({ brand: selectedBrand, model: selectedModel, version: '' })
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4', className)}>
      {/* Native Hidden Inputs for Server Actions Form Submission */}
      <input type="hidden" name={nameBrand} value={selectedBrand} />
      <input type="hidden" name={nameModel} value={selectedModel} />
      <input type="hidden" name={nameVersion} value={selectedVersion} />

      {/* ============================================================ */}
      {/* 1. MARQUE (BRAND) COMBBOBOX                                  */}
      {/* ============================================================ */}
      <div className="relative" ref={brandContainerRef}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-zinc-300">
            Marque {required && <span className="text-red-500">*</span>}
          </label>
          {selectedBrand ? (
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3 w-3" />
              Sélectionné
            </span>
          ) : hasAttemptedSubmit ? (
            <span className="text-[10px] text-red-400 font-medium">Marque requise</span>
          ) : null}
        </div>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsBrandOpen((prev) => !prev)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs transition-all duration-150',
            'border border-[#282834] bg-[#16161c] text-white',
            'hover:border-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30',
            isBrandOpen && 'border-red-500 ring-1 ring-red-500/20',
            hasAttemptedSubmit && !selectedBrand && 'border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30'
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {selectedBrand ? (
              <>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#20202a] border border-[#2e2e3e] p-0.5">
                  <CarBrandLogo brand={selectedBrand} className="h-4 w-4 text-white" />
                </div>
                <span className="truncate font-semibold text-white">{selectedBrand}</span>
              </>
            ) : (
              <>
                <Car className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="truncate text-zinc-500">Choisir une marque...</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selectedBrand && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Effacer la marque"
                onClick={handleClearBrand}
                className="p-1 rounded hover:bg-[#282834] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-zinc-400 transition-transform duration-200',
                isBrandOpen && 'rotate-180 text-red-500'
              )}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isBrandOpen && (
          <div className="absolute z-50 left-0 top-[calc(100%+6px)] w-[320px] sm:w-[380px] max-w-[95vw] rounded-xl border border-[#2a2a38] bg-[#14141a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="p-2.5 border-b border-[#22222e] bg-[#111116]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  ref={brandSearchInputRef}
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder="Rechercher une marque (ex: Mercedes, BMW, Toyota)..."
                  className="h-8 w-full rounded-md border border-[#282836] bg-[#181822] pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                {brandSearch && (
                  <button
                    type="button"
                    onClick={() => setBrandSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                {BRAND_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBrandCategory(cat)}
                    className={cn(
                      'px-2 py-0.5 rounded-full whitespace-nowrap transition-colors border',
                      brandCategory === cat
                        ? 'bg-red-600 text-white border-red-500 font-medium'
                        : 'bg-[#1b1b24] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands List */}
            <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-[#1e1e28]">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((b) => {
                  const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase()
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBrand(b.name)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors',
                        isSelected
                          ? 'bg-red-600/15 border border-red-500/30 text-white'
                          : 'hover:bg-[#1f1f2a] text-zinc-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#22222e] border border-[#2e2e3e] p-1 text-white">
                          <CarBrandLogo brand={b.name} className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-xs text-white truncate">{b.name}</div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <span>{b.country}</span>
                            <span>•</span>
                            <span className="text-zinc-400">{b.category}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-xs text-zinc-400">
                  Aucune marque trouvée pour &quot;{brandSearch}&quot;
                </div>
              )}

              {/* Saisie libre / Custom Brand Option */}
              {!hasExactBrandMatch && brandSearch.trim() && (
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectBrand(brandSearch.trim())}
                    className="flex w-full items-center justify-between rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>
                        Utiliser la marque : <strong className="text-white">&quot;{brandSearch.trim()}&quot;</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400/80">Personnalisée</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-[#20202c] bg-[#0e0e12] px-3 py-1.5 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>{filteredBrands.length} marques répertoriées</span>
              <span className="text-zinc-400">MAALAL Catalog</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. MODÈLE (MODEL) COMBOBOX - DEPENDS ON MARQUE               */}
      {/* ============================================================ */}
      <div className="relative" ref={modelContainerRef}>
        <div className="flex items-center justify-between mb-1">
          <label
            className={cn(
              'block text-xs font-semibold transition-colors',
              isModelDisabled ? 'text-zinc-400' : 'text-zinc-300'
            )}
          >
            Modèle {required && <span className="text-red-500">*</span>}
          </label>
          {selectedModel && !isModelDisabled ? (
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3 w-3" />
              Sélectionné
            </span>
          ) : hasAttemptedSubmit && !selectedModel && !isModelDisabled ? (
            <span className="text-[10px] text-red-400 font-medium">Modèle requis</span>
          ) : null}
        </div>

        {/* Disabled State or Active Trigger Button */}
        {isModelDisabled ? (
          <div
            className="flex h-10 w-full items-center justify-between rounded-lg px-3 text-xs border border-dashed border-[#282834]/80 bg-[#16161c]/50 text-zinc-400 cursor-not-allowed select-none"
            title="Veuillez d'abord sélectionner une marque automobile"
          >
            <div className="flex items-center gap-2 truncate">
              <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate italic">Sélectionnez d&apos;abord une marque...</span>
            </div>
            <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">
              Verrouillé
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModelOpen((prev) => !prev)}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs transition-all duration-150',
              'border border-[#282834] bg-[#16161c] text-white',
              'hover:border-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30',
              isModelOpen && 'border-red-500 ring-1 ring-red-500/20',
              hasAttemptedSubmit && !selectedModel && 'border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30'
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Layers className="h-4 w-4 text-red-500 shrink-0" />
              {selectedModel ? (
                <span className="truncate font-semibold text-white">{selectedModel}</span>
              ) : (
                <span className="truncate text-zinc-500">Choisir un modèle {selectedBrand}...</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {selectedModel && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Effacer le modèle"
                  onClick={handleClearModel}
                  className="p-1 rounded hover:bg-[#282834] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-zinc-400 transition-transform duration-200',
                  isModelOpen && 'rotate-180 text-red-500'
                )}
              />
            </div>
          </button>
        )}

        {/* Model Dropdown Menu */}
        {isModelOpen && !isModelDisabled && (
          <div className="absolute z-50 left-0 top-[calc(100%+6px)] w-[300px] sm:w-[350px] max-w-[95vw] rounded-xl border border-[#2a2a38] bg-[#14141a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header & Search */}
            <div className="p-2.5 border-b border-[#22222e] bg-[#111116]">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <CarBrandLogo brand={selectedBrand} className="h-3.5 w-3.5 text-zinc-400" />
                  Modèles de {selectedBrand}
                </span>
                <span className="text-[10px] text-zinc-400 bg-[#1c1c26] px-1.5 py-0.5 rounded">
                  {availableModels.length} modèle{availableModels.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  ref={modelSearchInputRef}
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder={`Rechercher un modèle ${selectedBrand}...`}
                  className="h-8 w-full rounded-md border border-[#282836] bg-[#181822] pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                {modelSearch && (
                  <button
                    type="button"
                    onClick={() => setModelSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Model List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
              {filteredModels.length > 0 ? (
                filteredModels.map((m) => {
                  const isSelected = selectedModel.toLowerCase() === m.toLowerCase()
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectModel(m)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                        isSelected
                          ? 'bg-red-600/15 border border-red-500/30 text-white font-medium'
                          : 'hover:bg-[#1f1f2a] text-zinc-300'
                      )}
                    >
                      <span className="truncate">{m}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-red-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-xs text-zinc-400">
                  Aucun modèle officiel trouvé pour &quot;{modelSearch}&quot;
                </div>
              )}

              {/* Custom Model Fallback Option */}
              {!hasExactModelMatch && modelSearch.trim() && (
                <button
                  type="button"
                  onClick={() => handleSelectModel(modelSearch.trim())}
                  className="flex w-full items-center justify-between rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-300 hover:bg-amber-500/20 transition-colors mt-1"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <span>
                      Saisir : <strong className="text-white">&quot;{modelSearch.trim()}&quot;</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">Personnalisé</span>
                </button>
              )}

              {/* Option to reveal free-text custom model field if not searching */}
              {!modelSearch && !showCustomModelField && (
                <button
                  type="button"
                  onClick={() => setShowCustomModelField(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-700/70 p-2 text-center text-[11px] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors mt-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Autre modèle non listé...</span>
                </button>
              )}

              {/* Inline Custom Model Input Box */}
              {showCustomModelField && (
                <div className="p-2 border border-zinc-700 rounded-lg bg-[#181822] mt-1 space-y-1.5">
                  <div className="text-[10px] font-medium text-zinc-300">Nom du modèle sur mesure :</div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customModelInput}
                      onChange={(e) => setCustomModelInput(e.target.value)}
                      placeholder="Ex: Classe X, Vintage 1980..."
                      className="h-7 flex-1 rounded border border-[#282834] bg-[#121218] px-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={!customModelInput.trim()}
                      onClick={() => handleSelectModel(customModelInput.trim())}
                      className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-[11px] font-medium text-white transition-colors"
                    >
                      Valider
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#20202c] bg-[#0e0e12] px-3 py-1.5 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>Gamme {selectedBrand}</span>
              <span className="text-zinc-400">Catalogue à jour</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. VERSION / FINITION - DEPENDS ON MODÈLE                     */}
      {/* ============================================================ */}
      <div className="relative" ref={versionContainerRef}>
        <div className="flex items-center justify-between mb-1">
          <label
            className={cn(
              'block text-xs font-semibold transition-colors',
              isVersionDisabled ? 'text-zinc-400' : 'text-zinc-300'
            )}
          >
            Version / Finition <span className="text-[10px] font-normal text-zinc-400">(Optionnel)</span>
          </label>
          {selectedVersion && !isVersionDisabled && (
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              Renseigné
            </span>
          )}
        </div>

        {/* Disabled State or Interactive Combobox */}
        {isVersionDisabled ? (
          <div
            className="flex h-10 w-full items-center justify-between rounded-lg px-3 text-xs border border-dashed border-[#282834]/80 bg-[#16161c]/50 text-zinc-400 cursor-not-allowed select-none"
            title="Veuillez d'abord sélectionner un modèle"
          >
            <div className="flex items-center gap-2 truncate">
              <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate italic">Sélectionnez d&apos;abord un modèle...</span>
            </div>
            <span className="text-[10px] bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">
              En attente
            </span>
          </div>
        ) : (
          <div className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={selectedVersion}
                onChange={handleVersionInputChange}
                onFocus={() => setIsVersionOpen(true)}
                placeholder="Ex: AMG Line, Pack M, VXR..."
                className={cn(
                  'h-10 w-full rounded-lg border border-[#282834] bg-[#16161c] pl-3 pr-16 text-xs text-white placeholder-zinc-500 transition-all',
                  'hover:border-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30'
                )}
              />

              {/* Dropdown trigger and clear icons */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {selectedVersion && (
                  <button
                    type="button"
                    onClick={handleClearVersion}
                    className="p-1 text-zinc-400 hover:text-white rounded"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsVersionOpen((prev) => !prev)}
                  className="p-1 text-zinc-400 hover:text-white rounded"
                  title="Afficher les finitions suggérées"
                >
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      isVersionOpen && 'rotate-180 text-red-500'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Suggestions Popover for Trims/Finitions */}
            {isVersionOpen && (
              <div className="absolute z-50 left-0 top-[calc(100%+6px)] w-full min-w-[260px] rounded-xl border border-[#2a2a38] bg-[#14141a] shadow-2xl p-2.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#22222e]">
                  <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Finitions populaires {selectedBrand}
                  </span>
                  <span className="text-[10px] text-zinc-400">Suggestions</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1">
                  {availableVersions.map((ver) => {
                    const isSelected = selectedVersion.toLowerCase() === ver.toLowerCase()
                    return (
                      <button
                        key={ver}
                        type="button"
                        onClick={() => handleSelectVersion(ver)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                          isSelected
                            ? 'bg-red-600/20 text-red-400 font-medium'
                            : 'hover:bg-[#20202c] text-zinc-300'
                        )}
                      >
                        <span className="truncate">{ver}</span>
                        {isSelected && <Check className="h-3 w-3 text-red-500" />}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-[#20202c] text-[10px] text-zinc-400 text-center">
                  Vous pouvez aussi taper librement dans le champ texte
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
