import { describe, it, expect } from 'vitest'
import {
  MOROCCAN_CITIES,
  MAJOR_MOROCCAN_CITIES,
  filterMoroccanCities,
  normalizeSearchString,
} from '@/data/moroccan-cities'

describe('Moroccan Cities Dataset & Filtering', () => {
  it('contains Moroccan cities with all essential regions', () => {
    expect(MOROCCAN_CITIES.length).toBeGreaterThan(50)

    const casablanca = MOROCCAN_CITIES.find((c) => c.name === 'Casablanca')
    expect(casablanca).toBeDefined()
    expect(casablanca?.region).toBe('Casablanca-Settat')
    expect(casablanca?.isMajor).toBe(true)

    const rabat = MOROCCAN_CITIES.find((c) => c.name === 'Rabat')
    expect(rabat).toBeDefined()
    expect(rabat?.region).toBe('Rabat-Salé-Kénitra')

    const fes = MOROCCAN_CITIES.find((c) => c.name === 'Fès')
    expect(fes).toBeDefined()

    const tanger = MOROCCAN_CITIES.find((c) => c.name === 'Tanger')
    expect(tanger).toBeDefined()
  })

  it('correctly normalizes search strings ignoring case and accents', () => {
    expect(normalizeSearchString('Casablanca')).toBe('casablanca')
    expect(normalizeSearchString('Fès')).toBe('fes')
    expect(normalizeSearchString('MÉKNÈS')).toBe('meknes')
    expect(normalizeSearchString('Tanger-Tétouan')).toBe('tangertetouan')
  })

  it('filters cities by accent-free query', () => {
    const resultsFes = filterMoroccanCities('fes')
    expect(resultsFes.some((c) => c.name === 'Fès')).toBe(true)

    const resultsTetouan = filterMoroccanCities('tetouan')
    expect(resultsTetouan.some((c) => c.name === 'Tétouan')).toBe(true)

    const resultsKenitra = filterMoroccanCities('kenitra')
    expect(resultsKenitra.some((c) => c.name === 'Kénitra')).toBe(true)
  })

  it('filters cities by region name', () => {
    const soussCities = filterMoroccanCities('Souss')
    expect(soussCities.some((c) => c.name === 'Agadir')).toBe(true)
    expect(soussCities.some((c) => c.name === 'Taroudant')).toBe(true)
  })

  it('filters cities by alternate search terms', () => {
    const casaSearch = filterMoroccanCities('casa')
    expect(casaSearch.some((c) => c.name === 'Casablanca')).toBe(true)

    const kechSearch = filterMoroccanCities('kech')
    expect(kechSearch.some((c) => c.name === 'Marrakech')).toBe(true)
  })

  it('identifies major cities properly', () => {
    expect(MAJOR_MOROCCAN_CITIES.length).toBeGreaterThanOrEqual(10)
    const majorNames = MAJOR_MOROCCAN_CITIES.map((c) => c.name)
    expect(majorNames).toContain('Casablanca')
    expect(majorNames).toContain('Rabat')
    expect(majorNames).toContain('Marrakech')
    expect(majorNames).toContain('Tanger')
    expect(majorNames).toContain('Fès')
    expect(majorNames).toContain('Agadir')
  })
})
