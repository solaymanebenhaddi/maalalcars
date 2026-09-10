/**
 * MAALAL CARS - Automotive Taxonomy Dataset
 * Hierarchical data structure: Marque -> Modèle -> Version / Finition
 * Specifically tailored for the Moroccan and International automotive market.
 */

export interface CarBrand {
  id: string
  name: string
  country: string
  category: 'Luxe & Prestige' | 'Premium' | 'Généraliste' | 'Sport & Supercar'
  popular?: boolean
}

export const AUTOMOTIVE_BRANDS: CarBrand[] = [
  // Top Popular in Morocco (German Triad + Range + French/Asian)
  { id: 'mercedes-benz', name: 'Mercedes-Benz', country: '🇩🇪 Allemagne', category: 'Premium', popular: true },
  { id: 'bmw', name: 'BMW', country: '🇩🇪 Allemagne', category: 'Premium', popular: true },
  { id: 'audi', name: 'Audi', country: '🇩🇪 Allemagne', category: 'Premium', popular: true },
  { id: 'land-rover', name: 'Land Rover', country: '🇬🇧 Royaume-Uni', category: 'Luxe & Prestige', popular: true },
  { id: 'porsche', name: 'Porsche', country: '🇩🇪 Allemagne', category: 'Luxe & Prestige', popular: true },
  { id: 'volkswagen', name: 'Volkswagen', country: '🇩🇪 Allemagne', category: 'Généraliste', popular: true },
  { id: 'toyota', name: 'Toyota', country: '🇯🇵 Japon', category: 'Généraliste', popular: true },
  { id: 'peugeot', name: 'Peugeot', country: '🇫🇷 France', category: 'Généraliste', popular: true },
  { id: 'renault', name: 'Renault', country: '🇫🇷 France', category: 'Généraliste', popular: true },
  { id: 'dacia', name: 'Dacia', country: '🇲🇦 Maroc / 🇷🇴 Roumanie', category: 'Généraliste', popular: true },
  { id: 'hyundai', name: 'Hyundai', country: '🇰🇷 Corée du Sud', category: 'Généraliste', popular: true },
  { id: 'kia', name: 'Kia', country: '🇰🇷 Corée du Sud', category: 'Généraliste', popular: true },
  { id: 'jeep', name: 'Jeep', country: '🇺🇸 États-Unis', category: 'Premium', popular: true },
  { id: 'volvo', name: 'Volvo', country: '🇸🇪 Suède', category: 'Premium', popular: true },
  { id: 'cupra', name: 'Cupra', country: '🇪🇸 Espagne', category: 'Premium', popular: true },

  // Prestige & Supercars
  { id: 'ferrari', name: 'Ferrari', country: '🇮🇹 Italie', category: 'Sport & Supercar' },
  { id: 'maserati', name: 'Maserati', country: '🇮🇹 Italie', category: 'Luxe & Prestige' },
  { id: 'lamborghini', name: 'Lamborghini', country: '🇮🇹 Italie', category: 'Sport & Supercar' },
  { id: 'bentley', name: 'Bentley', country: '🇬🇧 Royaume-Uni', category: 'Luxe & Prestige' },

  // Other Major Generalists & Premium
  { id: 'ford', name: 'Ford', country: '🇺🇸 États-Unis', category: 'Généraliste' },
  { id: 'nissan', name: 'Nissan', country: '🇯🇵 Japon', category: 'Généraliste' },
  { id: 'fiat', name: 'Fiat', country: '🇮🇹 Italie', category: 'Généraliste' },
  { id: 'citroen', name: 'Citroën', country: '🇫🇷 France', category: 'Généraliste' },
  { id: 'mini', name: 'Mini', country: '🇬🇧 Royaume-Uni', category: 'Premium' },
  { id: 'alfa-romeo', name: 'Alfa Romeo', country: '🇮🇹 Italie', category: 'Premium' },
  { id: 'jaguar', name: 'Jaguar', country: '🇬🇧 Royaume-Uni', category: 'Luxe & Prestige' },
  { id: 'honda', name: 'Honda', country: '🇯🇵 Japon', category: 'Généraliste' },
  { id: 'mitsubishi', name: 'Mitsubishi', country: '🇯🇵 Japon', category: 'Généraliste' },
  { id: 'suzuki', name: 'Suzuki', country: '🇯🇵 Japon', category: 'Généraliste' },
  { id: 'skoda', name: 'Škoda', country: '🇨🇿 République Tchèque', category: 'Généraliste' },
]

/**
 * Models dictionary indexed by normalized brand name
 */
export const MODELS_BY_BRAND: Record<string, string[]> = {
  'mercedes-benz': [
    'Classe A',
    'Classe B',
    'Classe C',
    'Classe E',
    'Classe S',
    'CLA',
    'CLS',
    'GLA',
    'GLB',
    'GLC',
    'GLC Coupé',
    'GLE',
    'GLE Coupé',
    'GLS',
    'Classe G',
    'AMG GT',
    'EQA',
    'EQB',
    'EQC',
    'EQE',
    'EQS',
    'Vito',
    'Classe V',
  ],
  bmw: [
    'Série 1',
    'Série 2',
    'Série 2 Gran Coupé',
    'Série 3',
    'Série 4',
    'Série 4 Gran Coupé',
    'Série 5',
    'Série 7',
    'Série 8',
    'X1',
    'X2',
    'X3',
    'X4',
    'X5',
    'X6',
    'X7',
    'XM',
    'Z4',
    'i4',
    'iX',
    'iX3',
    'M2',
    'M3',
    'M4',
    'M5',
  ],
  audi: [
    'A1 Sportback',
    'A3 Sportback',
    'A3 Berline',
    'A4',
    'A5 Sportback',
    'A5 Coupé',
    'A6',
    'A7 Sportback',
    'A8',
    'Q2',
    'Q3',
    'Q3 Sportback',
    'Q4 e-tron',
    'Q5',
    'Q5 Sportback',
    'Q7',
    'Q8',
    'RS3',
    'RS6 Avant',
    'RSQ8',
    'e-tron GT',
  ],
  'land-rover': [
    'Range Rover',
    'Range Rover Sport',
    'Range Rover Velar',
    'Range Rover Evoque',
    'Defender 90',
    'Defender 110',
    'Defender 130',
    'Discovery',
    'Discovery Sport',
  ],
  porsche: [
    '911 Carrera',
    '911 Turbo',
    '911 GT3',
    'Cayenne',
    'Cayenne Coupé',
    'Macan',
    'Macan GTS',
    'Panamera',
    'Taycan',
    '718 Cayman',
    '718 Boxster',
  ],
  volkswagen: [
    'Golf 7',
    'Golf 8',
    'Tiguan',
    'Touareg',
    'T-Roc',
    'Passat',
    'Arteon',
    'Polo',
    'Taigo',
    'T-Cross',
    'Caddy',
    'ID.4',
  ],
  toyota: [
    'Land Cruiser 300',
    'Land Cruiser Prado',
    'RAV4',
    'Hilux',
    'Corolla',
    'Yaris',
    'Yaris Cross',
    'C-HR',
    'Fortuner',
    'Camry',
  ],
  peugeot: [
    '208',
    '308',
    '408',
    '508',
    '2008',
    '3008',
    '5008',
    'Rifter',
    'Partner',
    'Landtrek',
  ],
  renault: [
    'Clio 4',
    'Clio 5',
    'Megane',
    'Megane Sedan',
    'Captur',
    'Kadjar',
    'Austral',
    'Arkana',
    'Koleos',
    'Express',
    'Kangoo',
    'Talisman',
  ],
  dacia: [
    'Duster',
    'Sandero',
    'Sandero Stepway',
    'Logan',
    'Jogger',
    'Spring',
    'Dokker',
  ],
  hyundai: [
    'Tucson',
    'Santa Fe',
    'Creta',
    'Kona',
    'Palisade',
    'Elantra',
    'i10',
    'i20',
    'i30',
    'Accent',
    'H-1',
  ],
  kia: [
    'Sportage',
    'Sorento',
    'Seltos',
    'Niro',
    'K5',
    'Picanto',
    'Rio',
    'Ceed',
    'EV6',
    'Carnival',
  ],
  jeep: [
    'Wrangler',
    'Wrangler Unlimited',
    'Grand Cherokee',
    'Compass',
    'Renegade',
    'Gladiator',
  ],
  volvo: [
    'XC40',
    'XC60',
    'XC90',
    'S60',
    'S90',
    'V60',
    'V90',
    'C40 Recharge',
  ],
  cupra: [
    'Formentor',
    'Leon',
    'Ateca',
    'Born',
    'Tavascan',
  ],
  ferrari: [
    '296 GTB',
    'F8 Tributo',
    'Roma',
    'Purosangue',
    'SF90 Stradale',
    '812 Superfast',
    'Portofino M',
  ],
  maserati: [
    'Grecale',
    'Levante',
    'Ghibli',
    'Quattroporte',
    'MC20',
    'GranTurismo',
  ],
  lamborghini: [
    'Urus',
    'Huracán EVO',
    'Huracán STO',
    'Revuelto',
    'Aventador',
  ],
  ford: [
    'Ranger',
    'Ranger Raptor',
    'Mustang',
    'Mustang Mach-E',
    'Kuga',
    'Puma',
    'Focus',
    'Explorer',
    'Transit Custom',
  ],
  nissan: [
    'Qashqai',
    'X-Trail',
    'Patrol',
    'Juke',
    'Navara',
    'Micra',
    'Ariya',
  ],
  mini: [
    'Cooper',
    'Cooper S',
    'Countryman',
    'Clubman',
    'John Cooper Works',
  ],
  fiat: [
    '500',
    '500X',
    'Tipo',
    'Doblo',
    'Fiorino',
    'Panda',
  ],
  citroen: [
    'C3',
    'C4',
    'C5 Aircross',
    'Berlingo',
    'C-Elysée',
  ],
  'alfa-romeo': [
    'Stelvio',
    'Giulia',
    'Tonale',
    'Junior',
  ],
}

/**
 * Standard Finitions / Versions per brand or model
 */
export const VERSIONS_BY_BRAND: Record<string, string[]> = {
  'mercedes-benz': [
    'AMG Line',
    'Avantgarde',
    'Exclusive',
    'Night Edition',
    'Edition 1',
    'Progressive',
    'Pack Sport Black',
    'Standard',
  ],
  bmw: [
    'Pack M Sport',
    'xLine',
    'Luxury Line',
    'M Performance',
    'Business Edition',
    'Sport Lounge',
    'Standard',
  ],
  audi: [
    'S Line',
    'Design Luxe',
    'Advanced',
    'Black Edition',
    'Competition',
    'Pack Esthétique Noir',
    'Standard',
  ],
  'land-rover': [
    'Autobiography',
    'HSE Dynamic',
    'SE',
    'R-Dynamic',
    'First Edition',
    'SV Edition',
    'Standard',
  ],
  porsche: [
    'GTS',
    'Turbo',
    'Turbo S',
    'Carrera 4S',
    'GT3',
    'Pack Sport Chrono',
    'Platinum Edition',
    'Standard',
  ],
  volkswagen: [
    'R-Line',
    'Carat',
    'Carat Exclusive',
    'Elegance',
    'Life',
    'Style',
    'GTI',
    'GTD',
    'Standard',
  ],
  toyota: [
    'Executive',
    'GR Sport',
    'VX',
    'VXR',
    'Lounge',
    'Dynamic',
    'Adventure',
    'Standard',
  ],
  peugeot: [
    'GT',
    'Allure',
    'Active Pack',
    'GT Line',
    'Style',
    'Standard',
  ],
  renault: [
    'Esprit Alpine',
    'Techno',
    'Iconic',
    'Equilibre',
    'RS Line',
    'Intens',
    'Standard',
  ],
  dacia: [
    'Extreme',
    'Journey',
    'Expression',
    'Essential',
    'Prestige',
    'Standard',
  ],
  hyundai: [
    'N Line',
    'Prestige',
    'Edition 1',
    'Premium',
    'Comfort',
    'Standard',
  ],
  kia: [
    'GT-Line',
    'Active',
    'Design',
    'Motion',
    'SX',
    'Standard',
  ],
  jeep: [
    'Rubicon',
    'Sahara',
    'Overland',
    'Limited',
    'Trailhawk',
    'Standard',
  ],
  volvo: [
    'R-Design',
    'Inscription',
    'Ultimate',
    'Plus',
    'Momentum',
    'Standard',
  ],
  cupra: [
    'VZ',
    'VZ5',
    'Copper Edition',
    'Standard',
  ],
  ford: [
    'Raptor',
    'Wildtrak',
    'ST-Line',
    'Titanium',
    'Platinum',
    'Standard',
  ],
  nissan: [
    'Tekna',
    'N-Connecta',
    'Acenta',
    'Nismo',
    'Standard',
  ],
  mini: [
    'John Cooper Works (JCW)',
    'Chili',
    'Camden',
    'Classic',
    'Standard',
  ],
}

/**
 * Normalizes string for taxonomy searches
 */
export function normalizeTaxonomyString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Returns brand key from display name
 */
export function getBrandKey(brandName?: string | null): string {
  if (!brandName) return ''
  const norm = normalizeTaxonomyString(brandName)

  if (norm.includes('mercedes')) return 'mercedes-benz'
  if (norm.includes('bmw')) return 'bmw'
  if (norm.includes('audi')) return 'audi'
  if (norm.includes('land rover') || norm.includes('range rover')) return 'land-rover'
  if (norm.includes('porsche')) return 'porsche'
  if (norm.includes('volkswagen') || norm.includes('vw')) return 'volkswagen'
  if (norm.includes('toyota')) return 'toyota'
  if (norm.includes('peugeot')) return 'peugeot'
  if (norm.includes('renault')) return 'renault'
  if (norm.includes('dacia')) return 'dacia'
  if (norm.includes('hyundai')) return 'hyundai'
  if (norm.includes('kia')) return 'kia'
  if (norm.includes('jeep')) return 'jeep'
  if (norm.includes('volvo')) return 'volvo'
  if (norm.includes('cupra') || norm.includes('seat')) return 'cupra'
  if (norm.includes('ferrari')) return 'ferrari'
  if (norm.includes('maserati')) return 'maserati'
  if (norm.includes('lamborghini')) return 'lamborghini'
  if (norm.includes('ford')) return 'ford'
  if (norm.includes('nissan')) return 'nissan'
  if (norm.includes('mini')) return 'mini'
  if (norm.includes('fiat')) return 'fiat'
  if (norm.includes('citroen')) return 'citroen'
  if (norm.includes('alfa')) return 'alfa-romeo'

  return norm.replace(/\s+/g, '-')
}

/**
 * Gets models list for a selected brand
 */
export function getModelsForBrand(brandName?: string | null): string[] {
  if (!brandName) return []
  const key = getBrandKey(brandName)
  return MODELS_BY_BRAND[key] || [
    'Standard',
    'Berline',
    'SUV',
    'Coupé',
  ]
}

/**
 * Gets versions list for a selected brand and model
 */
export function getVersionsForModel(brandName?: string | null, _modelName?: string | null): string[] {
  if (!brandName) return []
  const key = getBrandKey(brandName)
  return (
    VERSIONS_BY_BRAND[key] || [
      'Standard',
      'Luxe',
      'Sport',
      'Pack Confort',
      'Toutes Options',
    ]
  )
}
