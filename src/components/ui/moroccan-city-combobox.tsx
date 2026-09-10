'use client'

import * as React from 'react'
import { MapPin, Check, ChevronDown, X, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOROCCAN_CITIES,
  MAJOR_MOROCCAN_CITIES,
  MoroccanCity,
  filterMoroccanCities,
  normalizeSearchString,
} from '@/data/moroccan-cities'

export interface MoroccanCityComboboxProps {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (city: string, cityData?: MoroccanCity) => void
  placeholder?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
  autoFocus?: boolean
}

export function MoroccanCityCombobox({
  id,
  name,
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = 'Sélectionner ou rechercher une ville...',
  label,
  error,
  required = false,
  disabled = false,
  className,
  containerClassName,
  autoFocus = false,
}: MoroccanCityComboboxProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue)
  const selectedCity = isControlled ? controlledValue : internalValue

  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Filter cities based on search
  const filteredCities = React.useMemo(() => {
    return filterMoroccanCities(searchQuery)
  }, [searchQuery])

  // Exact match detection for custom option
  const hasExactMatch = React.useMemo(() => {
    if (!searchQuery.trim()) return true
    const norm = normalizeSearchString(searchQuery)
    return MOROCCAN_CITIES.some((c) => normalizeSearchString(c.name) === norm)
  }, [searchQuery])

  const selectCity = React.useCallback(
    (cityName: string, cityData?: MoroccanCity) => {
      if (!isControlled) {
        setInternalValue(cityName)
      }
      onChange?.(cityName, cityData)
      setIsOpen(false)
      setSearchQuery('')
    },
    [isControlled, onChange]
  )

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
        setHighlightedIndex(0)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Scroll active item into view
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${highlightedIndex}"]`)
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    const totalItems = filteredCities.length + (!hasExactMatch && searchQuery.trim() ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % Math.max(1, totalItems))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex < filteredCities.length) {
          const item = filteredCities[highlightedIndex]
          if (item) selectCity(item.name, item)
        } else if (!hasExactMatch && searchQuery.trim()) {
          selectCity(searchQuery.trim())
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectCity('')
  }

  const inputId = id || (name ? `combobox-${name}` : undefined)

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input for native Next.js form submits */}
      {name && <input type="hidden" name={name} value={selectedCity} />}

      {/* Trigger Button */}
      <button
        type="button"
        id={inputId}
        autoFocus={autoFocus}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'relative flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs transition-all duration-150',
          'border border-[#282834] bg-[#16161c] text-white',
          'hover:border-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30',
          disabled && 'opacity-50 cursor-not-allowed bg-zinc-900',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          isOpen && 'border-red-500 ring-1 ring-red-500/20',
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin
            className={cn(
              'h-3.5 w-3.5 shrink-0 transition-colors',
              selectedCity ? 'text-red-500' : 'text-zinc-500'
            )}
          />
          {selectedCity ? (
            <span className="truncate font-medium text-white">{selectedCity}</span>
          ) : (
            <span className="truncate text-zinc-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {selectedCity && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Effacer la ville sélectionnée"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  selectCity('')
                }
              }}
              className="rounded p-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-zinc-500 transition-transform duration-200',
              isOpen && 'rotate-180 text-red-400'
            )}
          />
        </div>
      </button>

      {/* Error message */}
      {error && (
        <p className="text-[11px] text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-[calc(100%+4px)] left-0 z-50 w-full min-w-[280px] max-w-sm rounded-xl',
            'border border-[#2e2e3a] bg-[#141418] shadow-2xl backdrop-blur-md',
            'animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden'
          )}
        >
          {/* Search Header */}
          <div className="p-2 border-b border-[#22222a] bg-[#121216]">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher une ville du Maroc..."
                className="h-8 w-full rounded-md border border-[#282834] bg-[#181820] pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-zinc-400 hover:text-white p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Quick Chips for Major Moroccan Cities */}
            {!searchQuery && (
              <div className="mt-2 pt-2 border-t border-[#1e1e26]">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold mb-1.5 px-0.5">
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                  <span>Villes principales :</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {MAJOR_MOROCCAN_CITIES.slice(0, 7).map((c) => {
                    const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase()
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectCity(c.name, c)}
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                          isSelected
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-[#1a1a22] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-[#262632]'
                        )}
                      >
                        {c.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto p-1 text-xs divide-y divide-[#1e1e24] scrollbar-thin scrollbar-thumb-zinc-700"
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city, idx) => {
                const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase()
                const isHighlighted = idx === highlightedIndex

                return (
                  <div
                    key={city.id}
                    data-index={idx}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectCity(city.name, city)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-colors',
                      isHighlighted && 'bg-[#20202a]',
                      isSelected && !isHighlighted && 'bg-red-600/10 text-red-400',
                      isSelected && isHighlighted && 'bg-red-600 text-white'
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('font-medium', isSelected ? 'font-bold' : 'text-white')}>
                          {city.name}
                        </span>
                        {city.isMajor && (
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase',
                              isSelected && isHighlighted
                                ? 'bg-white/20 text-white'
                                : 'bg-red-500/15 text-red-400 border border-red-500/20'
                            )}
                          >
                            Majeure
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-[10px]',
                          isSelected && isHighlighted ? 'text-white/80' : 'text-zinc-400'
                        )}
                      >
                        {city.region}
                      </span>
                    </div>

                    {isSelected && (
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isSelected && isHighlighted ? 'text-white' : 'text-red-400'
                        )}
                      />
                    )}
                  </div>
                )
              })
            ) : (
              <div className="p-3 text-center text-zinc-400 text-[11px]">
                Aucune ville marocaine trouvée pour &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Custom City Fallback Option */}
            {!hasExactMatch && searchQuery.trim() && (
              <div
                data-index={filteredCities.length}
                role="option"
                aria-selected={highlightedIndex === filteredCities.length}
                onClick={() => selectCity(searchQuery.trim())}
                onMouseEnter={() => setHighlightedIndex(filteredCities.length)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer mt-1 border border-dashed border-zinc-700 transition-colors',
                  highlightedIndex === filteredCities.length ? 'bg-[#20202a]' : 'bg-[#16161c]'
                )}
              >
                <div className="flex items-center gap-2 text-[11px]">
                  <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>
                    Utiliser : <strong className="text-white">&quot;{searchQuery.trim()}&quot;</strong>
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">Ville personnalisée</span>
              </div>
            )}
          </div>

          {/* Footer count info */}
          <div className="border-t border-[#1e1e24] bg-[#101014] px-3 py-1.5 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>
              {filteredCities.length} ville{filteredCities.length > 1 ? 's' : ''} répertoriée{filteredCities.length > 1 ? 's' : ''}
            </span>
            <span>Royaume du Maroc 🇲🇦</span>
          </div>
        </div>
      )}
    </div>
  )
}
