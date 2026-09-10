'use client'

import React, { useState, useRef, useEffect, useId } from 'react'
import {
  Palette,
  Check,
  ChevronDown,
  X,
  Search,
  Plus,
  Sparkles,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AutomotiveColor,
  EXTERIOR_COLORS,
  EXTERIOR_COLOR_CATEGORIES,
  INTERIOR_COLORS,
  INTERIOR_COLOR_CATEGORIES,
  filterAutomotiveColors,
  getVisualColorSwatch,
  generateFinishBackground,
} from '@/data/automotive-colors'

export interface VehicleColorPickerProps {
  name?: string
  label?: string
  mode?: 'exterior' | 'interior'
  value?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onChange?: (colorName: string, colorItem?: AutomotiveColor) => void
}

export function VehicleColorPicker({
  name = 'colorExterior',
  label,
  mode = 'exterior',
  value: controlledValue,
  defaultValue = '',
  placeholder,
  required = false,
  disabled = false,
  className,
  onChange,
}: VehicleColorPickerProps) {
  const generatedId = useId()
  const pickerId = `color-picker-${name || generatedId}`

  const baseColors = mode === 'exterior' ? EXTERIOR_COLORS : INTERIOR_COLORS
  const categories = mode === 'exterior' ? EXTERIOR_COLOR_CATEGORIES : INTERIOR_COLOR_CATEGORIES
  const defaultPlaceholder =
    placeholder ||
    (mode === 'exterior'
      ? 'Sélectionner une couleur extérieure...'
      : 'Sélectionner une sellerie / couleur intérieure...')

  // State
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous')
  const [internalColor, setInternalColor] = useState<string>(controlledValue ?? defaultValue ?? '')
  const selectedColor = controlledValue !== undefined ? controlledValue : internalColor
  const [customColors, setCustomColors] = useState<AutomotiveColor[]>([])
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [hoveredColor, setHoveredColor] = useState<AutomotiveColor | null>(null)

  // Custom Color Form State
  const [customName, setCustomName] = useState('')
  const [customHex, setCustomHex] = useState(mode === 'exterior' ? '#2A52BE' : '#A66E38')
  const [customFinish, setCustomFinish] = useState<AutomotiveColor['finish']>(
    mode === 'exterior' ? 'Métallisé' : 'Cuir Nappa'
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setIsAddingCustom(false)
        setHoveredColor(null)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // All colors including dynamically added custom colors
  const allAvailableColors = React.useMemo(() => {
    return [...customColors, ...baseColors]
  }, [customColors, baseColors])

  // Filtered colors
  const filteredColors = React.useMemo(() => {
    return filterAutomotiveColors(allAvailableColors, searchQuery, selectedCategory)
  }, [allAvailableColors, searchQuery, selectedCategory])

  // Current visual details of selected color
  const activeSwatch = React.useMemo(() => {
    if (!selectedColor) return null
    return getVisualColorSwatch(selectedColor, mode)
  }, [selectedColor, mode])

  // Item currently selected in the pool
  const activeColorItem = React.useMemo(() => {
    if (!selectedColor) return null
    return (
      allAvailableColors.find(
        (c) => c.name.toLowerCase().trim() === selectedColor.toLowerCase().trim()
      ) || null
    )
  }, [allAvailableColors, selectedColor])

  // Prominent Preview Spotlight color: hovered item, or selected item, or first search match
  const previewColor = React.useMemo<AutomotiveColor | null>(() => {
    if (hoveredColor) return hoveredColor
    if (activeColorItem) return activeColorItem
    if (filteredColors.length > 0) return filteredColors[0]
    if (selectedColor && activeSwatch) {
      return {
        id: 'active-preview',
        name: selectedColor,
        category: 'Sélection actuelle',
        hex: activeSwatch.hex,
        finish: (activeSwatch.finish as AutomotiveColor['finish']) || 'Verni',
        cssBackground: activeSwatch.cssBackground,
      }
    }
    return null
  }, [hoveredColor, activeColorItem, filteredColors, selectedColor, activeSwatch])

  const selectColor = (colorName: string, item?: AutomotiveColor) => {
    if (controlledValue === undefined) {
      setInternalColor(colorName)
    }
    onChange?.(colorName, item)
    setIsOpen(false)
    setIsAddingCustom(false)
    setHoveredColor(null)
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (controlledValue === undefined) {
      setInternalColor('')
    }
    onChange?.('')
  }

  const handleSaveCustomColor = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    if (!customName.trim()) return

    const newColorItem: AutomotiveColor = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: 'Personnalisée',
      hex: customHex,
      finish: customFinish,
      cssBackground: generateFinishBackground(customHex, customFinish),
      popular: true,
    }

    setCustomColors((prev) => [newColorItem, ...prev])
    selectColor(newColorItem.name, newColorItem)
    setCustomName('')
  }

  const exactMatch = allAvailableColors.some(
    (c) => c.name.toLowerCase().trim() === searchQuery.toLowerCase().trim()
  )

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={pickerId} className="block text-xs font-semibold text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input for standard Next.js form submits / FormData */}
      {name && <input type="hidden" name={name} value={selectedColor} />}

      {/* Main Trigger Button */}
      <button
        type="button"
        id={pickerId}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border bg-[#16161c] px-3 text-xs text-white transition-all text-left',
          isOpen
            ? 'border-red-500 ring-1 ring-red-500/20 shadow-lg shadow-red-950/20'
            : 'border-[#282834] hover:border-zinc-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {selectedColor && activeSwatch ? (
            <div className="flex items-center gap-2.5 truncate">
              {/* Luxury Circular Swatch */}
              <div
                className="h-5 w-5 rounded-full shrink-0 border border-white/20 shadow-sm relative overflow-hidden"
                style={{ background: activeSwatch.cssBackground }}
              >
                {/* Metallic / Gloss highlight shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>

              <span className="font-semibold text-white truncate">{selectedColor}</span>

              {activeSwatch.finish && activeSwatch.finish !== 'Indéterminé' && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0">
                  {activeSwatch.finish}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400">
              <Palette className="h-4 w-4 text-zinc-400" />
              <span className="truncate">{defaultPlaceholder}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {selectedColor && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Effacer la couleur"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (controlledValue === undefined) {
                    setInternalColor('')
                  }
                  onChange?.('')
                }
              }}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800/80 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn('h-4 w-4 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {/* Dropdown Floating Popover - Generously Sized with Real-Time Hover Spotlight Card */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[380px] sm:w-[540px] md:w-[600px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#2c2c38] bg-[#121217]/98 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150 space-y-3.5 max-h-[620px] flex flex-col">
          {/* Header Search Input */}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une teinte (ex: Nardo, Nacré, Fauve, Noir, Bleu...)"
              className="h-9 w-full rounded-lg border border-[#282834] bg-[#1a1a22] pl-9 pr-8 text-xs text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-[#1b1b22] text-zinc-400 hover:text-white hover:bg-[#23232c] border border-transparent hover:border-[#2a2a36]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Prominent Hover Spotlight Card - Gives Big Color Swatch and Full Details on Hover */}
          {previewColor && (
            <div className="rounded-xl border border-[#2c2c3c] bg-gradient-to-r from-[#171722] via-[#15151e] to-[#121217] p-3 shadow-inner flex items-center gap-3.5 shrink-0 transition-all duration-150">
              {/* Large High-Definition Color Swatch with 3D Gloss Sheen */}
              <div
                className="h-12 w-12 rounded-xl border-2 border-white/25 shadow-lg relative overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: previewColor.cssBackground }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/30 rounded-xl pointer-events-none" />
              </div>

              {/* Full Color Specs */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate drop-shadow-sm">
                    {previewColor.name}
                  </span>
                  {hoveredColor && hoveredColor.name !== selectedColor ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 flex items-center gap-1">
                      <Eye className="h-2.5 w-2.5" />
                      <span>Aperçu</span>
                    </span>
                  ) : selectedColor &&
                    previewColor.name.toLowerCase().trim() === selectedColor.toLowerCase().trim() ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      Choisie
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 flex-wrap">
                  <span className="font-medium text-zinc-300">{previewColor.category}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#22222e] text-zinc-200 border border-zinc-700/60 font-medium text-[10px]">
                    {previewColor.finish}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-zinc-400 text-[10px]">{previewColor.hex}</span>
                </div>
              </div>

              {/* Instant Choose Button */}
              <button
                type="button"
                onClick={() => selectColor(previewColor.name, previewColor)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 shadow-sm',
                  selectedColor.toLowerCase().trim() === previewColor.name.toLowerCase().trim()
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40'
                )}
              >
                {selectedColor.toLowerCase().trim() === previewColor.name.toLowerCase().trim()
                  ? '✓ Sélectionné'
                  : 'Sélectionner'}
              </button>
            </div>
          )}

          {/* Action Header to Toggle Custom Color Creation */}
          <div className="flex items-center justify-between pt-1 border-t border-[#20202a] shrink-0">
            <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
              {mode === 'exterior' ? 'Nuancier Constructeurs' : 'Selleries & Teintes'} ({filteredColors.length})
            </span>

            <button
              type="button"
              onClick={() => setIsAddingCustom((prev) => !prev)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              {isAddingCustom ? (
                <span>Retour à la liste</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Ajouter une couleur</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Container for Custom Color Creation */}
          {isAddingCustom ? (
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSaveCustomColor()
                }
              }}
              className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-3 shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">Créer une couleur personnalisée</h4>
                </div>
                <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Nouvelle Teinte
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Color Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Nom de la couleur <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={
                      mode === 'exterior'
                        ? 'Ex: Gris Kemora Métallisé, Vert Isle of Man...'
                        : 'Ex: Cuir Havane Surpiqué, Cuir Cognac Exclusive...'
                    }
                    className="h-8 w-full rounded-lg border border-[#333342] bg-[#16161c] px-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Color Palette & Hex Picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Nuance Visuelle
                  </label>
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border border-[#333342] bg-transparent p-0.5"
                      />
                    </div>
                    <div
                      className="h-8 flex-1 rounded-lg border border-white/20 px-3 flex items-center gap-2 shadow-inner"
                      style={{ background: generateFinishBackground(customHex, customFinish) }}
                    >
                      <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                        {customHex.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Finish Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Finition
                  </label>
                  <select
                    value={customFinish}
                    onChange={(e) => setCustomFinish(e.target.value as AutomotiveColor['finish'])}
                    className="h-8 w-full rounded-lg border border-[#333342] bg-[#16161c] px-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Métallisé">Métallisé</option>
                    <option value="Nacré">Nacré</option>
                    <option value="Verni">Verni / Uni</option>
                    <option value="Mat">Mat / Satiné</option>
                    <option value="Cuir Nappa">Cuir Nappa</option>
                    <option value="Alcantara">Alcantara</option>
                    <option value="Tissu">Tissu</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3 py-1 rounded-md border border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCustomColor()}
                  className="px-4 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-sm transition-colors"
                >
                  Enregistrer & Sélectionner
                </button>
              </div>
            </div>
          ) : (
            /* Scrollable Grid of Colors - Generously spaced so every color name is fully legible */
            <div className="overflow-y-auto space-y-1.5 pr-1 scrollbar-thin flex-1 min-h-[180px]">
              {filteredColors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredColors.map((color) => {
                    const isSelected =
                      selectedColor.toLowerCase().trim() === color.name.toLowerCase().trim()
                    const isHovered = hoveredColor?.id === color.id

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => selectColor(color.name, color)}
                        onMouseEnter={() => setHoveredColor(color)}
                        onMouseLeave={() => setHoveredColor(null)}
                        onFocus={() => setHoveredColor(color)}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-xl border text-left transition-all',
                          isSelected
                            ? 'border-red-500 bg-red-950/30 shadow-md ring-1 ring-red-500/30'
                            : isHovered
                            ? 'border-amber-500/50 bg-[#1e1e28] shadow-md'
                            : 'border-[#22222a] bg-[#16161f] hover:bg-[#1c1c26] hover:border-zinc-600'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Circular Swatch with Highlight */}
                          <div
                            className="h-7 w-7 rounded-full shrink-0 border border-white/25 relative shadow-sm overflow-hidden"
                            style={{ background: color.cssBackground }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span
                              className={cn(
                                'block text-xs font-semibold truncate',
                                isSelected
                                  ? 'text-red-400'
                                  : isHovered
                                  ? 'text-amber-300'
                                  : 'text-zinc-200'
                              )}
                            >
                              {color.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 truncate mt-0.5">
                              <span>{color.category}</span>
                              <span>•</span>
                              <span className="text-zinc-300 font-medium">{color.finish}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <Check className="h-4 w-4 text-red-400 shrink-0 ml-1.5" />
                        ) : isHovered ? (
                          <span className="text-[10px] font-bold text-amber-400 opacity-80 shrink-0 ml-1">
                            Voir
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-zinc-400 space-y-2">
                  <p>Aucune teinte correspondante trouvée pour &quot;{searchQuery}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomName(searchQuery.trim())
                      setIsAddingCustom(true)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Créer la couleur &quot;{searchQuery}&quot;</span>
                  </button>
                </div>
              )}

              {/* Direct Fallback Option if user typed arbitrary text not matching exactly */}
              {!exactMatch && searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => selectColor(searchQuery.trim())}
                  onMouseEnter={() =>
                    setHoveredColor({
                      id: 'custom-query',
                      name: searchQuery.trim(),
                      category: 'Personnalisée',
                      hex: getVisualColorSwatch(searchQuery.trim(), mode).hex,
                      finish: 'Personnalisé',
                      cssBackground: getVisualColorSwatch(searchQuery.trim(), mode).cssBackground,
                    })
                  }
                  onMouseLeave={() => setHoveredColor(null)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl border border-dashed border-zinc-700 bg-[#171720] hover:bg-[#20202c] transition-colors mt-2 text-left"
                >
                  <div className="flex items-center gap-2 text-xs min-w-0">
                    <div
                      className="h-6 w-6 rounded-full border border-white/20 shrink-0 shadow-sm"
                      style={{ background: getVisualColorSwatch(searchQuery.trim(), mode).cssBackground }}
                    />
                    <span className="text-zinc-300 truncate">
                      Utiliser directement : <strong className="text-white">&quot;{searchQuery.trim()}&quot;</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 ml-2">
                    Personnalisé
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
