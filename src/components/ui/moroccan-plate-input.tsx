'use client'

import * as React from 'react'
import { Info, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export const MOROCCAN_PREFECTURE_CODES: Record<string, string> = {
  '1': 'Rabat',
  '2': 'Salé',
  '3': 'Skhirat-Témara',
  '4': 'Kénitra',
  '5': 'Khémisset',
  '6': 'Casablanca - Anfa',
  '7': 'Casablanca - Hay Hassani',
  '8': 'Casablanca - Aïn Sebaâ / Hay Mohammadi',
  '9': 'Casablanca - Ben M\'sik',
  '10': 'Casablanca - Moulay Rachid',
  '11': 'Casablanca - Aïn Chock',
  '12': 'Casablanca - Sidi Bernoussi',
  '13': 'Casablanca - Médiouna',
  '14': 'Fès - Ville',
  '15': 'Fès - Zouagha / Moulay Yacoub',
  '16': 'Fès - Sefrou',
  '17': 'Boulemane',
  '20': 'Meknès - Ville',
  '21': 'Meknès - El Menzeh',
  '22': 'El Hajeb',
  '23': 'Ifrane',
  '24': 'Khénifra',
  '26': 'Marrakech - Médina / Guéliz',
  '27': 'Marrakech - Menara',
  '28': 'Chichaoua',
  '29': 'Al Haouz',
  '30': 'Kelâa des Sraghna',
  '31': 'Essaouira',
  '33': 'Agadir - Ida-Ou-Tanane',
  '34': 'Inezgane - Aït Melloul',
  '35': 'Chtouka Aït Baha',
  '36': 'Taroudant',
  '37': 'Tiznit',
  '38': 'Ouarzazate',
  '39': 'Zagora',
  '40': 'Tanger - Ville',
  '41': 'Fahs-Anjra',
  '42': 'Tétouan',
  '43': 'M\'diq - Fnideq',
  '44': 'Larache',
  '45': 'Chefchaouen',
  '46': 'Al Hoceïma',
  '47': 'Ouezzane',
  '50': 'Oujda - Angad',
  '51': 'Berkane',
  '52': 'Nador',
  '53': 'Taourirt',
  '54': 'Jerada',
  '55': 'Figuig',
  '56': 'Guercif',
  '57': 'Driouch',
  '60': 'Guelmim',
  '61': 'Tan-Tan',
  '68': 'Laâyoune',
  '70': 'Dakhla - Oued Ed-Dahab',
}

export const MOROCCAN_SERIES_LETTERS = [
  { code: 'A', label: 'A', arabic: 'أ' },
  { code: 'B', label: 'B', arabic: 'ب' },
  { code: 'D', label: 'D', arabic: 'د' },
  { code: 'E', label: 'E', arabic: 'هـ' },
  { code: 'H', label: 'H', arabic: 'ح' },
  { code: 'J', label: 'J', arabic: 'ج' },
  { code: 'K', label: 'K', arabic: 'ك' },
  { code: 'L', label: 'L', arabic: 'ل' },
  { code: 'M', label: 'M', arabic: 'م' },
  { code: 'N', label: 'N', arabic: 'ن' },
  { code: 'S', label: 'S', arabic: 'س' },
  { code: 'T', label: 'T', arabic: 'ت' },
  { code: 'V', label: 'V', arabic: 'ف' },
  { code: 'W', label: 'W', arabic: 'و' },
  { code: 'Y', label: 'Y', arabic: 'ي' },
  { code: 'WW', label: 'WW', arabic: 'WW' },
] as const

const POPULAR_PREFECTURES = [
  { code: '6', name: 'Casablanca' },
  { code: '14', name: 'Fès' },
  { code: '26', name: 'Marrakech' },
  { code: '40', name: 'Tanger' },
  { code: '1', name: 'Rabat' },
  { code: '33', name: 'Agadir' },
]

export interface MoroccanPlateInputProps {
  name?: string
  defaultValue?: string | null
  required?: boolean
  className?: string
  onChange?: (formattedValue: string) => void
}

/**
 * Normalizes series letter matching Latin code or Arabic character
 */
export function normalizeSeriesLetter(letter: string): string {
  if (!letter) return 'A'
  const clean = letter.trim().toUpperCase()
  const found = MOROCCAN_SERIES_LETTERS.find(
    (s) => s.code.toUpperCase() === clean || s.arabic === letter.trim()
  )
  return found ? found.code : (clean || 'A')
}

/**
 * Parses any incoming matricule format (e.g. "12345 | A | 6", "12345-A-6", "12345 A 6", "WW-123456")
 */
export function parseMatricule(raw: string | null | undefined): {
  isWW: boolean
  part1: string
  part2: string
  part3: string
} {
  if (!raw) {
    return { isWW: false, part1: '', part2: 'A', part3: '' }
  }

  const trimmed = raw.trim()

  // Case WW: WW-123456 or WW 123456
  if (/^WW[- ]?\d+/i.test(trimmed)) {
    const num = trimmed.replace(/^WW[- ]?/i, '').replace(/\D/g, '').slice(0, 6)
    return { isWW: true, part1: num, part2: 'WW', part3: '' }
  }

  // Case standard with dividers: e.g. "12345 | A | 6" or "12345|A|6"
  if (trimmed.includes('|')) {
    const parts = trimmed.split('|').map((s) => s.trim())
    return {
      isWW: false,
      part1: parts[0]?.replace(/\D/g, '').slice(0, 6) || '',
      part2: normalizeSeriesLetter(parts[1] || 'A'),
      part3: parts[2]?.replace(/\D/g, '').slice(0, 2) || '',
    }
  }

  // Case dash, slash or space: "12345-A-6" or "12345 A 6" or "12345/A/6"
  const match = trimmed.match(/^(\d{1,6})[\s\-_/]+([A-Za-zأ-ي]{1,3})[\s\-_/]+(\d{1,2})$/)
  if (match) {
    return {
      isWW: false,
      part1: match[1] || '',
      part2: normalizeSeriesLetter(match[2] || 'A'),
      part3: match[3] || '',
    }
  }

  // Fallback: digits only
  return {
    isWW: false,
    part1: trimmed.replace(/\D/g, '').slice(0, 6),
    part2: 'A',
    part3: '',
  }
}

export function MoroccanPlateInput({
  name = 'matricule',
  defaultValue = '',
  required = false,
  className,
  onChange,
}: MoroccanPlateInputProps) {
  const initial = React.useMemo(() => parseMatricule(defaultValue), [defaultValue])

  const [mode, setMode] = React.useState<'STANDARD' | 'WW' | 'EN_COURS'>(
    initial.isWW ? 'WW' : defaultValue ? 'STANDARD' : 'STANDARD'
  )

  const [part1, setPart1] = React.useState<string>(initial.part1)
  const [part2, setPart2] = React.useState<string>(initial.part2)
  const [part3, setPart3] = React.useState<string>(initial.part3)
  const [wwNumber, setWwNumber] = React.useState<string>(initial.isWW ? initial.part1 : '')

  const part2Ref = React.useRef<HTMLSelectElement>(null)
  const part3Ref = React.useRef<HTMLInputElement>(null)

  // Compute final formatted matricule: xxxxxx | x | xx
  const formattedValue = React.useMemo(() => {
    if (mode === 'EN_COURS') {
      return ''
    }
    if (mode === 'WW') {
      return wwNumber.trim() ? `WW-${wwNumber.trim()}` : ''
    }
    // Only return formatted plate if registration number or prefecture is provided
    if (part1.trim() || part3.trim()) {
      const clean1 = part1.trim()
      const clean2 = normalizeSeriesLetter(part2)
      const clean3 = part3.trim()
      return `${clean1} | ${clean2} | ${clean3}`
    }
    return ''
  }, [mode, part1, part2, part3, wwNumber])

  React.useEffect(() => {
    onChange?.(formattedValue)
  }, [formattedValue, onChange])

  const currentCity = MOROCCAN_PREFECTURE_CODES[part3]
  const currentArabic = MOROCCAN_SERIES_LETTERS.find((s) => s.code === part2)?.arabic || ''

  // Handle fast paste into Part 1 (e.g. pasting "54321 | B | 14")
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    if (text && (text.includes('|') || text.includes('-') || text.includes(' ') || text.includes('/'))) {
      e.preventDefault()
      const parsed = parseMatricule(text)
      if (parsed.isWW) {
        setMode('WW')
        setWwNumber(parsed.part1)
      } else {
        setMode('STANDARD')
        setPart1(parsed.part1)
        setPart2(parsed.part2)
        setPart3(parsed.part3)
      }
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Hidden input for native HTML form submission */}
      <input type="hidden" name={name} value={formattedValue} required={required} />

      {/* Datalist for fast browser suggestions of all 30+ prefectures */}
      <datalist id="moroccan-prefectures-list">
        {Object.entries(MOROCCAN_PREFECTURE_CODES).map(([code, city]) => (
          <option key={code} value={code}>
            {city} ({code})
          </option>
        ))}
      </datalist>

      {/* Header bar: Field title & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold text-zinc-200">
            Immatriculation / Matricule {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-zinc-500">
            Format officiel : <code className="font-mono text-zinc-300">xxxxxx | x | xx</code>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-lg border border-[#24242c]">
          <button
            type="button"
            onClick={() => setMode('STANDARD')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all',
              mode === 'STANDARD'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Marocain Standard
          </button>
          <button
            type="button"
            onClick={() => setMode('WW')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all',
              mode === 'WW'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            WW Provisoire
          </button>
          <button
            type="button"
            onClick={() => setMode('EN_COURS')}
            className={cn(
              'px-2 py-1 text-[11px] font-semibold rounded-md transition-all',
              mode === 'EN_COURS'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            En cours
          </button>
        </div>
      </div>

      {/* Standard Moroccan Plate Segmented Input */}
      {mode === 'STANDARD' && (
        <div className="space-y-2.5">
          {/* Main Visual Moroccan License Plate Bar */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#2b2b38] bg-[#0c0c10] p-2 shadow-inner focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <div className="flex items-center gap-2">
              {/* Part 1: Registration Digits (1 à 6 chiffres) */}
              <div className="flex-1 min-w-[110px]">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Numéro (1-6)
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">{part1.length}/6</span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={part1}
                  placeholder="12345"
                  onPaste={handlePaste}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setPart1(val)
                    if (val.length === 6) {
                      part2Ref.current?.focus()
                    }
                  }}
                  className="h-11 w-full rounded-xl bg-[#16161e] px-3 text-center text-base sm:text-lg font-mono font-black tracking-widest text-white placeholder-zinc-700 focus:bg-[#1d1d28] focus:outline-none transition-all shadow-sm"
                />
              </div>

              {/* Plate Divider Bar 1 */}
              <div className="flex flex-col items-center justify-center pt-4 select-none">
                <div className="h-9 w-0.5 bg-[#2f2f3e] rounded-full" />
              </div>

              {/* Part 2: Series Letter (A à WW + Arabe) */}
              <div className="w-36 sm:w-40">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Série / حرف
                  </span>
                  {currentArabic && (
                    <span className="text-[11px] font-bold text-amber-400 font-sans">
                      {currentArabic}
                    </span>
                  )}
                </div>
                <select
                  ref={part2Ref}
                  value={part2}
                  onChange={(e) => {
                    setPart2(e.target.value)
                    part3Ref.current?.focus()
                  }}
                  className="h-11 w-full rounded-xl bg-[#16161e] px-2 text-center text-xs sm:text-sm font-mono font-bold text-amber-400 border border-[#2b2b3a] focus:border-amber-500/50 focus:bg-[#1d1d28] focus:outline-none cursor-pointer transition-all shadow-sm"
                >
                  {MOROCCAN_SERIES_LETTERS.map((s) => (
                    <option key={s.code} value={s.code} className="bg-[#16161e] text-white">
                      {s.label} ({s.arabic})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plate Divider Bar 2 */}
              <div className="flex flex-col items-center justify-center pt-4 select-none">
                <div className="h-9 w-0.5 bg-[#2f2f3e] rounded-full" />
              </div>

              {/* Part 3: Prefecture Code (1 à 2 chiffres) */}
              <div className="w-24 sm:w-28">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Ville (Code)
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400">#</span>
                </div>
                <input
                  ref={part3Ref}
                  type="text"
                  list="moroccan-prefectures-list"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={part3}
                  placeholder="6"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
                    setPart3(val)
                  }}
                  className="h-11 w-full rounded-xl bg-[#16161e] px-2 text-center text-base sm:text-lg font-mono font-black text-cyan-400 placeholder-zinc-700 focus:bg-[#1d1d28] focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Prefecture Pills & Live Location Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-zinc-500" />
                Villes rapides :
              </span>
              {POPULAR_PREFECTURES.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setPart3(p.code)}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all border',
                    part3 === p.code
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-[#181822] text-zinc-400 border-[#242430] hover:text-white hover:border-[#383848]'
                  )}
                >
                  {p.name} ({p.code})
                </button>
              ))}
            </div>

            {/* Resolved city badge */}
            <div className="flex items-center gap-2">
              {currentCity ? (
                <span className="inline-flex items-center gap-1 font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md text-[11px]">
                  📍 <strong className="text-white">{currentCity}</strong> (Code {part3})
                </span>
              ) : part3 ? (
                <span className="text-zinc-400 font-mono text-[11px]">Code ville : {part3}</span>
              ) : null}

              {/* Formatted preview */}
              <div className="font-mono text-[11px] text-zinc-400 bg-[#16161e] px-2 py-0.5 rounded-md border border-[#242430]">
                Aperçu : <span className="text-white font-bold">{formattedValue || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WW Provisoire Mode */}
      {mode === 'WW' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-[#14141c] p-2">
            <span className="font-mono font-bold text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              WW -
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={wwNumber}
              placeholder="123456"
              onChange={(e) => setWwNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-10 flex-1 bg-transparent text-sm font-mono font-bold text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            Immatriculation garage provisoire pour véhicules neufs en attente de carte grise définitive.
          </p>
        </div>
      )}

      {/* En cours Mode */}
      {mode === 'EN_COURS' && (
        <div className="rounded-xl border border-zinc-800 bg-[#14141c]/60 p-3 text-xs text-zinc-400 flex items-center gap-2.5">
          <Info className="h-4 w-4 text-zinc-400 shrink-0" />
          <span>Le véhicule sera enregistré sans matricule. Vous pourrez le renseigner ultérieurement lors de la réception de la carte grise.</span>
        </div>
      )}
    </div>
  )
}
