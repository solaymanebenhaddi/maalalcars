export interface MoroccanCity {
  id: string
  name: string
  region: string
  isMajor?: boolean
  searchTerms?: string[]
}

export const MOROCCAN_REGIONS = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Tanger-Tétouan-Al Hoceïma',
  'Marrakech-Safi',
  'Fès-Meknès',
  'Souss-Massa',
  "L'Oriental",
  'Béni Mellal-Khénifra',
  'Drâa-Tafilalet',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
] as const

export type MoroccanRegion = (typeof MOROCCAN_REGIONS)[number]

export const MOROCCAN_CITIES: MoroccanCity[] = [
  // --- Casablanca-Settat ---
  { id: 'casablanca', name: 'Casablanca', region: 'Casablanca-Settat', isMajor: true, searchTerms: ['casa', 'dar el beida', 'anfa'] },
  { id: 'mohammedia', name: 'Mohammédia', region: 'Casablanca-Settat', isMajor: true, searchTerms: ['mohammedia', 'fedala'] },
  { id: 'el-jadida', name: 'El Jadida', region: 'Casablanca-Settat', isMajor: true, searchTerms: ['mazagan'] },
  { id: 'settat', name: 'Settat', region: 'Casablanca-Settat', isMajor: false, searchTerms: ['chaouia'] },
  { id: 'berrechid', name: 'Berrechid', region: 'Casablanca-Settat', isMajor: false },
  { id: 'bouskoura', name: 'Bouskoura', region: 'Casablanca-Settat', isMajor: false },
  { id: 'dar-bouazza', name: 'Dar Bouazza', region: 'Casablanca-Settat', isMajor: false },
  { id: 'nouaceur', name: 'Nouaceur', region: 'Casablanca-Settat', isMajor: false },
  { id: 'mediouna', name: 'Médiouna', region: 'Casablanca-Settat', isMajor: false },
  { id: 'tit-mellil', name: 'Tit Mellil', region: 'Casablanca-Settat', isMajor: false },
  { id: 'sidi-bennour', name: 'Sidi Bennour', region: 'Casablanca-Settat', isMajor: false },
  { id: 'azemmour', name: 'Azemmour', region: 'Casablanca-Settat', isMajor: false },
  { id: 'ben-ahmed', name: 'Ben Ahmed', region: 'Casablanca-Settat', isMajor: false },
  { id: 'deroua', name: 'Deroua', region: 'Casablanca-Settat', isMajor: false },
  { id: 'bouznika', name: 'Bouznika', region: 'Casablanca-Settat', isMajor: false },
  { id: 'benslimane', name: 'Benslimane', region: 'Casablanca-Settat', isMajor: false },

  // --- Rabat-Salé-Kénitra ---
  { id: 'rabat', name: 'Rabat', region: 'Rabat-Salé-Kénitra', isMajor: true, searchTerms: ['capitale', 'agdal', 'souissi'] },
  { id: 'sale', name: 'Salé', region: 'Rabat-Salé-Kénitra', isMajor: true, searchTerms: ['sala'] },
  { id: 'kenitra', name: 'Kénitra', region: 'Rabat-Salé-Kénitra', isMajor: true, searchTerms: ['port lyautey', 'kenitra'] },
  { id: 'temara', name: 'Témara', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'skhirat', name: 'Skhirat', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'khemisset', name: 'Khémisset', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'tiflet', name: 'Tiflet', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'sidi-slimane', name: 'Sidi Slimane', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'sidi-kacem', name: 'Sidi Kacem', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'sidi-yahya-el-gharb', name: 'Sidi Yahya El Gharb', region: 'Rabat-Salé-Kénitra', isMajor: false },
  { id: 'souk-el-arbaa', name: 'Souk El Arbaa', region: 'Rabat-Salé-Kénitra', isMajor: false },

  // --- Tanger-Tétouan-Al Hoceïma ---
  { id: 'tanger', name: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: true, searchTerms: ['tangier', 'tanja'] },
  { id: 'tetouan', name: 'Tétouan', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: true, searchTerms: ['tetouan', 'titawin'] },
  { id: 'al-hoceima', name: 'Al Hoceïma', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false, searchTerms: ['hoceima', 'alhucemas'] },
  { id: 'larache', name: 'Larache', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false },
  { id: 'ksar-el-kebir', name: 'Ksar El Kébir', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false },
  { id: 'chefchaouen', name: 'Chefchaouen', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false, searchTerms: ['chaouen', 'ville bleue'] },
  { id: 'asilah', name: 'Asilah', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false },
  { id: 'm-diq', name: "M'diq", region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false, searchTerms: ['mdiq', 'rincon'] },
  { id: 'fnideq', name: 'Fnideq', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false, searchTerms: ['castillejos'] },
  { id: 'martil', name: 'Martil', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false },
  { id: 'ouezzane', name: 'Ouezzane', region: 'Tanger-Tétouan-Al Hoceïma', isMajor: false },

  // --- Marrakech-Safi ---
  { id: 'marrakech', name: 'Marrakech', region: 'Marrakech-Safi', isMajor: true, searchTerms: ['kech', 'marrakesh', 'ville ocre'] },
  { id: 'safi', name: 'Safi', region: 'Marrakech-Safi', isMajor: true, searchTerms: ['asfi'] },
  { id: 'essaouira', name: 'Essaouira', region: 'Marrakech-Safi', isMajor: false, searchTerms: ['mogador'] },
  { id: 'el-kelaa-des-sraghna', name: 'El Kelâa des Sraghna', region: 'Marrakech-Safi', isMajor: false, searchTerms: ['kelaa'] },
  { id: 'ben-guerir', name: 'Ben Guerir', region: 'Marrakech-Safi', isMajor: false },
  { id: 'youssoufia', name: 'Youssoufia', region: 'Marrakech-Safi', isMajor: false },
  { id: 'chichaoua', name: 'Chichaoua', region: 'Marrakech-Safi', isMajor: false },
  { id: 'tahannaout', name: 'Tahannaout', region: 'Marrakech-Safi', isMajor: false },
  { id: 'amizmiz', name: 'Amizmiz', region: 'Marrakech-Safi', isMajor: false },

  // --- Fès-Meknès ---
  { id: 'fes', name: 'Fès', region: 'Fès-Meknès', isMajor: true, searchTerms: ['fez', 'fes'] },
  { id: 'meknes', name: 'Meknès', region: 'Fès-Meknès', isMajor: true, searchTerms: ['meknes'] },
  { id: 'taza', name: 'Taza', region: 'Fès-Meknès', isMajor: false },
  { id: 'sefrou', name: 'Sefrou', region: 'Fès-Meknès', isMajor: false },
  { id: 'ifrane', name: 'Ifrane', region: 'Fès-Meknès', isMajor: false, searchTerms: ['petite suisse'] },
  { id: 'azrou', name: 'Azrou', region: 'Fès-Meknès', isMajor: false },
  { id: 'el-hajeb', name: 'El Hajeb', region: 'Fès-Meknès', isMajor: false },
  { id: 'missour', name: 'Missour', region: 'Fès-Meknès', isMajor: false },
  { id: 'taounate', name: 'Taounate', region: 'Fès-Meknès', isMajor: false },
  { id: 'boulemane', name: 'Boulemane', region: 'Fès-Meknès', isMajor: false },

  // --- Souss-Massa ---
  { id: 'agadir', name: 'Agadir', region: 'Souss-Massa', isMajor: true, searchTerms: ['agadir ida-outanane'] },
  { id: 'inezgane', name: 'Inezgane', region: 'Souss-Massa', isMajor: false },
  { id: 'ait-melloul', name: 'Aït Melloul', region: 'Souss-Massa', isMajor: false },
  { id: 'dcheira-el-jihadia', name: 'Dcheira El Jihadia', region: 'Souss-Massa', isMajor: false },
  { id: 'taroudant', name: 'Taroudant', region: 'Souss-Massa', isMajor: false },
  { id: 'tiznit', name: 'Tiznit', region: 'Souss-Massa', isMajor: false },
  { id: 'ouled-teima', name: 'Ouled Teïma', region: 'Souss-Massa', isMajor: false },
  { id: 'biougra', name: 'Biougra', region: 'Souss-Massa', isMajor: false },
  { id: 'tata', name: 'Tata', region: 'Souss-Massa', isMajor: false },

  // --- L'Oriental ---
  { id: 'oujda', name: 'Oujda', region: "L'Oriental", isMajor: true, searchTerms: ['oujda-angad'] },
  { id: 'nador', name: 'Nador', region: "L'Oriental", isMajor: true },
  { id: 'berkane', name: 'Berkane', region: "L'Oriental", isMajor: false },
  { id: 'taourirt', name: 'Taourirt', region: "L'Oriental", isMajor: false },
  { id: 'driouch', name: 'Driouch', region: "L'Oriental", isMajor: false },
  { id: 'jerada', name: 'Jerada', region: "L'Oriental", isMajor: false },
  { id: 'zaio', name: 'Zaïo', region: "L'Oriental", isMajor: false },
  { id: 'bouarfa', name: 'Bouarfa', region: "L'Oriental", isMajor: false },
  { id: 'figuig', name: 'Figuig', region: "L'Oriental", isMajor: false },
  { id: 'al-aroui', name: 'Al Aroui', region: "L'Oriental", isMajor: false },
  { id: 'ahfir', name: 'Ahfir', region: "L'Oriental", isMajor: false },

  // --- Béni Mellal-Khénifra ---
  { id: 'beni-mellal', name: 'Béni Mellal', region: 'Béni Mellal-Khénifra', isMajor: true },
  { id: 'khouribga', name: 'Khouribga', region: 'Béni Mellal-Khénifra', isMajor: true },
  { id: 'khenifra', name: 'Khénifra', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'fquih-ben-salah', name: 'Fquih Ben Salah', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'oued-zem', name: 'Oued Zem', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'kasba-tadla', name: 'Kasba Tadla', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'azilal', name: 'Azilal', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'demnate', name: 'Demnate', region: 'Béni Mellal-Khénifra', isMajor: false },
  { id: 'souk-sebt', name: 'Souk Sebt Oulad Nemma', region: 'Béni Mellal-Khénifra', isMajor: false },

  // --- Drâa-Tafilalet ---
  { id: 'errachidia', name: 'Errachidia', region: 'Drâa-Tafilalet', isMajor: false, searchTerms: ['ksar es-souk'] },
  { id: 'ouarzazate', name: 'Ouarzazate', region: 'Drâa-Tafilalet', isMajor: false, searchTerms: ['hollywood afrique'] },
  { id: 'tinghir', name: 'Tinghir', region: 'Drâa-Tafilalet', isMajor: false },
  { id: 'midelt', name: 'Midelt', region: 'Drâa-Tafilalet', isMajor: false },
  { id: 'zagora', name: 'Zagora', region: 'Drâa-Tafilalet', isMajor: false },
  { id: 'erfoud', name: 'Erfoud', region: 'Drâa-Tafilalet', isMajor: false },
  { id: 'rissani', name: 'Rissani', region: 'Drâa-Tafilalet', isMajor: false },
  { id: 'kalaat-mgouna', name: "Kalaat M'Gouna", region: 'Drâa-Tafilalet', isMajor: false },

  // --- Guelmim-Oued Noun ---
  { id: 'guelmim', name: 'Guelmim', region: 'Guelmim-Oued Noun', isMajor: false, searchTerms: ['porte du sahara'] },
  { id: 'tan-tan', name: 'Tan-Tan', region: 'Guelmim-Oued Noun', isMajor: false },
  { id: 'sidi-ifni', name: 'Sidi Ifni', region: 'Guelmim-Oued Noun', isMajor: false },
  { id: 'assa', name: 'Assa', region: 'Guelmim-Oued Noun', isMajor: false },
  { id: 'bouizakarne', name: 'Bouizakarne', region: 'Guelmim-Oued Noun', isMajor: false },

  // --- Laâyoune-Sakia El Hamra ---
  { id: 'laayoune', name: 'Laâyoune', region: 'Laâyoune-Sakia El Hamra', isMajor: true, searchTerms: ['laayoune', 'el aaiun'] },
  { id: 'boujdour', name: 'Boujdour', region: 'Laâyoune-Sakia El Hamra', isMajor: false },
  { id: 'tarfaya', name: 'Tarfaya', region: 'Laâyoune-Sakia El Hamra', isMajor: false },
  { id: 'es-semara', name: 'Es-Semara', region: 'Laâyoune-Sakia El Hamra', isMajor: false },

  // --- Dakhla-Oued Ed-Dahab ---
  { id: 'dakhla', name: 'Dakhla', region: 'Dakhla-Oued Ed-Dahab', isMajor: true, searchTerms: ['villa cisneros'] },
  { id: 'aousserd', name: 'Aousserd', region: 'Dakhla-Oued Ed-Dahab', isMajor: false },
]

/**
 * Normalise a string for accent-insensitive and case-insensitive comparison
 */
export function normalizeSearchString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Filter Moroccan cities by a search query
 */
export function filterMoroccanCities(query: string): MoroccanCity[] {
  const normalizedQuery = normalizeSearchString(query)
  if (!normalizedQuery) return MOROCCAN_CITIES

  return MOROCCAN_CITIES.filter((city) => {
    const normalizedName = normalizeSearchString(city.name)
    const normalizedRegion = normalizeSearchString(city.region)
    if (normalizedName.includes(normalizedQuery) || normalizedRegion.includes(normalizedQuery)) {
      return true
    }
    if (city.searchTerms?.some((term) => normalizeSearchString(term).includes(normalizedQuery))) {
      return true
    }
    return false
  })
}

/**
 * Major Moroccan cities for quick selection
 */
export const MAJOR_MOROCCAN_CITIES = MOROCCAN_CITIES.filter((c) => c.isMajor)
