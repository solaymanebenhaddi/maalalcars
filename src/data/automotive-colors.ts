/**
 * MAALAL CARS - Automotive Color Dataset
 * Real-world automotive exterior & interior color specifications with realistic CSS finishes,
 * categories, and search normalization.
 */

export interface AutomotiveColor {
  id: string
  name: string
  category: string
  hex: string
  secondaryHex?: string
  finish: 'Métallisé' | 'Nacré' | 'Mat' | 'Verni' | 'Cuir Nappa' | 'Alcantara' | 'Tissu' | 'Standard' | 'Personnalisé'
  cssBackground: string
  popular?: boolean
}

// ---------------------------------------------------------------------------
// 1. EXTERIOR COLORS
// ---------------------------------------------------------------------------

export const EXTERIOR_COLOR_CATEGORIES = [
  'Tous',
  'Gris & Argents',
  'Blancs & Perles',
  'Noirs',
  'Bleus',
  'Rouges',
  'Verts',
  'Sables & Autres',
] as const

export const EXTERIOR_COLORS: AutomotiveColor[] = [
  // Gris & Argents (très populaires au Maroc)
  {
    id: 'gris-metallise',
    name: 'Gris Métallisé',
    category: 'Gris & Argents',
    hex: '#7E848C',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #A2AAB3 0%, #6E747C 50%, #4D535A 100%)',
    popular: true,
  },
  {
    id: 'gris-nardo',
    name: 'Gris Nardo',
    category: 'Gris & Argents',
    hex: '#6E7278',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #7A7F85 0%, #686C72 100%)',
    popular: true,
  },
  {
    id: 'gris-daytona',
    name: 'Gris Daytona Anthracite',
    category: 'Gris & Argents',
    hex: '#3E4247',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #565C63 0%, #35393D 50%, #222528 100%)',
    popular: true,
  },
  {
    id: 'gris-selenite',
    name: 'Gris Sélénite Métallisé',
    category: 'Gris & Argents',
    hex: '#51555B',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #6C727A 0%, #4B5056 50%, #34383D 100%)',
    popular: true,
  },
  {
    id: 'argent-platine',
    name: 'Argent Platine / Réflex',
    category: 'Gris & Argents',
    hex: '#C0C3C8',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #E6E9EE 0%, #B2B7BE 50%, #8E939A 100%)',
    popular: true,
  },
  {
    id: 'gris-craie',
    name: 'Gris Craie / Crayon',
    category: 'Gris & Argents',
    hex: '#CCCABE',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #DDDCD0 0%, #C4C2B6 100%)',
    popular: true,
  },
  {
    id: 'gris-mineral',
    name: 'Gris Minéral',
    category: 'Gris & Argents',
    hex: '#585C61',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #72777D 0%, #4E5257 100%)',
  },

  // Blancs & Perles
  {
    id: 'blanc-glacier',
    name: 'Blanc Glacier',
    category: 'Blancs & Perles',
    hex: '#F8F9FA',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)',
    popular: true,
  },
  {
    id: 'blanc-nacre',
    name: 'Blanc Nacré / Perle',
    category: 'Blancs & Perles',
    hex: '#FAF9F6',
    finish: 'Nacré',
    cssBackground: 'linear-gradient(135deg, #FFFFFF 0%, #F6F3EB 40%, #E9E6DC 70%, #FFFFFF 100%)',
    popular: true,
  },
  {
    id: 'blanc-mineral',
    name: 'Blanc Minéral',
    category: 'Blancs & Perles',
    hex: '#EDEDEB',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #FAFAFA 0%, #E2E2E0 100%)',
  },

  // Noirs & Ombres
  {
    id: 'noir-obsidien',
    name: 'Noir Obsidien Métallisé',
    category: 'Noirs',
    hex: '#1B1C1E',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #2D2E32 0%, #161719 50%, #0D0D0E 100%)',
    popular: true,
  },
  {
    id: 'noir-vulcain',
    name: 'Noir Vulcain Profond',
    category: 'Noirs',
    hex: '#0A0A0C',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #1C1C20 0%, #060608 100%)',
    popular: true,
  },
  {
    id: 'noir-mythic',
    name: 'Noir Mythic / Onyx',
    category: 'Noirs',
    hex: '#141416',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #26262A 0%, #121214 60%, #0A0A0B 100%)',
  },
  {
    id: 'noir-carbone',
    name: 'Noir Carbone',
    category: 'Noirs',
    hex: '#111622',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #1C2436 0%, #0E131E 60%, #080B12 100%)',
  },

  // Bleus
  {
    id: 'bleu-nuit',
    name: 'Bleu Nuit / Cavansite',
    category: 'Bleus',
    hex: '#16233B',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #22375C 0%, #131E33 50%, #0A101C 100%)',
    popular: true,
  },
  {
    id: 'bleu-misano',
    name: 'Bleu Misano Électrique',
    category: 'Bleus',
    hex: '#0E5CA3',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #1B78D0 0%, #0B4E8C 60%, #063460 100%)',
    popular: true,
  },
  {
    id: 'bleu-tanzanite',
    name: 'Bleu Tanzanite',
    category: 'Bleus',
    hex: '#182C52',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #25447E 0%, #16294D 60%, #0C172E 100%)',
  },
  {
    id: 'bleu-portimao',
    name: 'Bleu Portimao',
    category: 'Bleus',
    hex: '#1B4784',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #2B66B8 0%, #163E75 60%, #0E294F 100%)',
  },

  // Rouges & Bordeau
  {
    id: 'rouge-soul-crystal',
    name: 'Rouge Soul Crystal',
    category: 'Rouges',
    hex: '#9C0E1E',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #D41C31 0%, #8F0A19 50%, #52050E 100%)',
    popular: true,
  },
  {
    id: 'rouge-flamme',
    name: 'Rouge Flamme / Magma',
    category: 'Rouges',
    hex: '#C61A2B',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #E82C3F 0%, #B81525 60%, #7A0A16 100%)',
    popular: true,
  },
  {
    id: 'bordeaux-imperial',
    name: 'Bordeaux Impérial',
    category: 'Rouges',
    hex: '#541723',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #7A2434 0%, #4A131E 60%, #2B0A11 100%)',
  },

  // Verts
  {
    id: 'vert-san-remo',
    name: 'Vert San Remo / Émeraude',
    category: 'Verts',
    hex: '#1B3B2B',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #2B5740 0%, #183526 60%, #0E2017 100%)',
    popular: true,
  },
  {
    id: 'british-racing-green',
    name: 'British Racing Green',
    category: 'Verts',
    hex: '#083E28',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #10593B 0%, #063422 100%)',
  },
  {
    id: 'vert-kaki-mat',
    name: 'Vert Olive / Kaki Mat',
    category: 'Verts',
    hex: '#484F38',
    finish: 'Mat',
    cssBackground: 'linear-gradient(135deg, #596147 0%, #3F4531 100%)',
  },

  // Sables, Bronzes & Sport
  {
    id: 'sable-mojave',
    name: 'Sable Mojave Champagne',
    category: 'Sables & Autres',
    hex: '#C0B397',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #D8CDAF 0%, #B5A88B 60%, #8A7F66 100%)',
    popular: true,
  },
  {
    id: 'bronze-manhattan',
    name: 'Bronze Manhattan',
    category: 'Sables & Autres',
    hex: '#5B4B3E',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #7A6655 0%, #524337 60%, #342A22 100%)',
  },
  {
    id: 'jaune-vegas',
    name: 'Jaune Vegas / Imola',
    category: 'Sables & Autres',
    hex: '#EBB412',
    finish: 'Verni',
    cssBackground: 'linear-gradient(135deg, #FCD13B 0%, #DFAB0B 100%)',
  },
  {
    id: 'orange-valencia',
    name: 'Orange Valencia / Papaye',
    category: 'Sables & Autres',
    hex: '#D75B1E',
    finish: 'Métallisé',
    cssBackground: 'linear-gradient(135deg, #F07335 0%, #C84F14 100%)',
  },
]

// ---------------------------------------------------------------------------
// 2. INTERIOR COLORS
// ---------------------------------------------------------------------------

export const INTERIOR_COLOR_CATEGORIES = [
  'Tous',
  'Standard',
  'Cuir Noir',
  'Cuir Fauve & Marron',
  'Cuir Clair & Beige',
  'Cuir Rouge',
  'Alcantara & Tissus',
] as const

export const INTERIOR_COLORS: AutomotiveColor[] = [
  // Standard (BULL-ADD.xlsx & usine)
  {
    id: 'interieur-standard',
    name: 'Standard',
    category: 'Standard',
    hex: '#2E3036',
    finish: 'Standard',
    cssBackground: 'linear-gradient(135deg, #3C3E45 0%, #25262B 100%)',
    popular: true,
  },

  // Cuir Fauve & Marron (très recherché au Maroc)
  {
    id: 'cuir-fauve-camel',
    name: 'Cuir Fauve / Camel',
    category: 'Cuir Fauve & Marron',
    hex: '#A46633',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #BC7A42 0%, #9C5F2E 60%, #76441D 100%)',
    popular: true,
  },
  {
    id: 'cuir-cognac',
    name: 'Cuir Vernasca Cognac',
    category: 'Cuir Fauve & Marron',
    hex: '#8D4C20',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #A85E2C 0%, #804218 60%, #5D2E0E 100%)',
    popular: true,
  },
  {
    id: 'cuir-marron-moka',
    name: 'Cuir Marron Moka / Havane',
    category: 'Cuir Fauve & Marron',
    hex: '#4E3626',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #684B36 0%, #463021 60%, #2E1E14 100%)',
  },

  // Cuir Noir & Sombres
  {
    id: 'cuir-noir-titane',
    name: 'Cuir Noir Titane',
    category: 'Cuir Noir',
    hex: '#18191B',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #2A2B2F 0%, #151617 60%, #0D0E0F 100%)',
    popular: true,
  },
  {
    id: 'cuir-noir-surpiqures-rouges',
    name: 'Cuir Noir Surpiqûres Rouges',
    category: 'Cuir Noir',
    hex: '#1A1A1D',
    secondaryHex: '#DC2626',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #26262B 0%, #141416 85%, #B91C1C 100%)',
    popular: true,
  },
  {
    id: 'cuir-noir-ebene',
    name: 'Cuir Noir Ébène',
    category: 'Cuir Noir',
    hex: '#121214',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #202024 0%, #0E0E10 100%)',
  },

  // Cuir Clair & Beige
  {
    id: 'cuir-beige-macchiato',
    name: 'Cuir Beige Macchiato',
    category: 'Cuir Clair & Beige',
    hex: '#D7C6AD',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #E8DAC6 0%, #CEBCA2 60%, #B09F85 100%)',
    popular: true,
  },
  {
    id: 'cuir-craie-ivoire',
    name: 'Cuir Craie / Ivoire Nappa',
    category: 'Cuir Clair & Beige',
    hex: '#ECE7D8',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #F9F6ED 0%, #E2DCcb 60%, #C9C2B0 100%)',
    popular: true,
  },
  {
    id: 'cuir-blanc-perle',
    name: 'Cuir Blanc Perle',
    category: 'Cuir Clair & Beige',
    hex: '#F2F2F0',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #FFFFFF 0%, #E6E6E4 100%)',
  },

  // Cuir Rouge & Sport
  {
    id: 'cuir-rouge-cartier',
    name: 'Cuir Rouge Cartier / Bordeau',
    category: 'Cuir Rouge',
    hex: '#6A1926',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #8A2536 0%, #5E1521 60%, #3B0C14 100%)',
    popular: true,
  },
  {
    id: 'bi-ton-noir-rouge',
    name: 'Bi-ton Noir & Rouge Sport',
    category: 'Cuir Rouge',
    hex: '#1A1A1D',
    secondaryHex: '#991B1B',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #18181B 0%, #18181B 50%, #991B1B 50%, #7F1D1D 100%)',
  },

  // Alcantara & Tissus
  {
    id: 'alcantara-anthracite',
    name: 'Alcantara Anthracite / Dinamica',
    category: 'Alcantara & Tissus',
    hex: '#2B2D31',
    finish: 'Alcantara',
    cssBackground: 'linear-gradient(135deg, #383A40 0%, #25262A 100%)',
    popular: true,
  },
  {
    id: 'tissu-prestige-graphite',
    name: 'Tissu Prestige Graphite',
    category: 'Alcantara & Tissus',
    hex: '#27282C',
    finish: 'Tissu',
    cssBackground: 'linear-gradient(135deg, #35363B 0%, #1F2023 100%)',
  },
  {
    id: 'bi-ton-noir-camel',
    name: 'Bi-ton Noir & Camel',
    category: 'Alcantara & Tissus',
    hex: '#18191B',
    secondaryHex: '#A46633',
    finish: 'Cuir Nappa',
    cssBackground: 'linear-gradient(135deg, #18191B 0%, #18191B 50%, #A46633 50%, #7E491E 100%)',
  },
]

// ---------------------------------------------------------------------------
// 3. UTILITIES & HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Normalizes string for accent and case insensitive matching
 */
export function normalizeColorString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Filters color list by query and category
 */
export function filterAutomotiveColors(
  colors: AutomotiveColor[],
  query: string,
  category: string = 'Tous'
): AutomotiveColor[] {
  let list = colors

  if (category && category !== 'Tous') {
    list = list.filter((c) => c.category === category)
  }

  if (!query || !query.trim()) {
    return list
  }

  const normalizedQuery = normalizeColorString(query)

  return list.filter((c) => {
    const normName = normalizeColorString(c.name)
    const normFinish = normalizeColorString(c.finish)
    const normCat = normalizeColorString(c.category)
    return (
      normName.includes(normalizedQuery) ||
      normFinish.includes(normalizedQuery) ||
      normCat.includes(normalizedQuery)
    )
  })
}

/**
 * Finds matching color item by name from both exterior and interior catalogs
 */
export function findColorByName(name?: string | null, mode?: 'exterior' | 'interior'): AutomotiveColor | null {
  if (!name) return null
  const normalized = normalizeColorString(name)

  const pool =
    mode === 'exterior'
      ? EXTERIOR_COLORS
      : mode === 'interior'
      ? INTERIOR_COLORS
      : [...EXTERIOR_COLORS, ...INTERIOR_COLORS]

  // Exact match first
  const exact = pool.find((c) => normalizeColorString(c.name) === normalized)
  if (exact) return exact

  // Substring match
  return (
    pool.find((c) => {
      const norm = normalizeColorString(c.name)
      return norm.includes(normalized) || normalized.includes(norm)
    }) || null
  )
}

/**
 * Generates a realistic CSS gradient given a base hex code and finish
 */
export function generateFinishBackground(
  hex: string,
  finish: AutomotiveColor['finish'] = 'Métallisé'
): string {
  if (finish === 'Mat') {
    return hex
  }
  if (finish === 'Nacré') {
    return `linear-gradient(135deg, #FFFFFF 0%, ${hex} 40%, #EFEFEF 70%, ${hex} 100%)`
  }
  if (finish === 'Verni') {
    return `linear-gradient(135deg, ${hex}CC 0%, ${hex} 100%)`
  }
  if (finish === 'Alcantara' || finish === 'Tissu') {
    return `linear-gradient(135deg, ${hex} 0%, #1F1F24 100%)`
  }
  // Default metallic shimmer
  return `linear-gradient(135deg, ${hex}FF 0%, ${hex}AA 50%, ${hex}66 100%)`
}

/**
 * Returns a fallback CSS background for arbitrary custom color strings or hex
 */
export function getVisualColorSwatch(
  colorName?: string | null,
  mode: 'exterior' | 'interior' = 'exterior'
): { cssBackground: string; hex: string; finish?: string } {
  if (!colorName || colorName === 'def-Couleur' || colorName === 'Non spécifiée') {
    return {
      cssBackground: 'linear-gradient(135deg, #3A3A42 0%, #222228 100%)',
      hex: '#3A3A42',
      finish: 'Indéterminé',
    }
  }

  const match = findColorByName(colorName, mode)
  if (match) {
    return {
      cssBackground: match.cssBackground,
      hex: match.hex,
      finish: match.finish,
    }
  }

  // Heuristic color matching for custom / exotic vehicle names
  const norm = normalizeColorString(colorName)

  if (norm.includes('blanc') || norm.includes('white')) {
    return { cssBackground: 'linear-gradient(135deg, #FFFFFF 0%, #E8E8E8 100%)', hex: '#FFFFFF', finish: 'Verni' }
  }
  if (norm.includes('noir') || norm.includes('black')) {
    return { cssBackground: 'linear-gradient(135deg, #2A2A2E 0%, #0A0A0C 100%)', hex: '#111114', finish: 'Verni' }
  }
  if (
    norm.includes('nardo') ||
    norm.includes('gris') ||
    norm.includes('grey') ||
    norm.includes('silver') ||
    norm.includes('argent')
  ) {
    return { cssBackground: 'linear-gradient(135deg, #9FA5AE 0%, #686D74 100%)', hex: '#787D84', finish: 'Métallisé' }
  }
  if (norm.includes('bleu') || norm.includes('blue')) {
    return { cssBackground: 'linear-gradient(135deg, #1E4E8C 0%, #0D284C 100%)', hex: '#1A3F70', finish: 'Métallisé' }
  }
  if (norm.includes('rouge') || norm.includes('red') || norm.includes('bordeaux')) {
    return { cssBackground: 'linear-gradient(135deg, #C41C2C 0%, #6B0C15 100%)', hex: '#A81523', finish: 'Métallisé' }
  }
  if (norm.includes('vert') || norm.includes('green')) {
    return { cssBackground: 'linear-gradient(135deg, #275238 0%, #122B1D 100%)', hex: '#1B3B2B', finish: 'Métallisé' }
  }
  if (
    norm.includes('fauve') ||
    norm.includes('camel') ||
    norm.includes('cognac') ||
    norm.includes('marron') ||
    norm.includes('brown')
  ) {
    return { cssBackground: 'linear-gradient(135deg, #A86532 0%, #6E3B16 100%)', hex: '#8B4513', finish: 'Cuir Nappa' }
  }
  if (norm.includes('beige')) {
    return { cssBackground: 'linear-gradient(135deg, #E2D3BE 0%, #B8A68E 100%)', hex: '#CDBCA6', finish: 'Cuir Nappa' }
  }
  if (norm.includes('jaune') || norm.includes('yellow')) {
    return { cssBackground: 'linear-gradient(135deg, #ECC115 0%, #C49B06 100%)', hex: '#E5B80B', finish: 'Verni' }
  }
  if (norm.includes('orange')) {
    return { cssBackground: 'linear-gradient(135deg, #E6611F 0%, #B3440E 100%)', hex: '#D75B1E', finish: 'Métallisé' }
  }

  // Generic neutral metallic swatch
  return {
    cssBackground: 'linear-gradient(135deg, #5A5A66 0%, #303038 100%)',
    hex: '#4A4A54',
    finish: 'Personnalisé',
  }
}
