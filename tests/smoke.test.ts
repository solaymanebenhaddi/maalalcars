import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { resolve } from 'path'

describe('Project Smoke Tests', () => {
  it('should have package.json', () => {
    expect(existsSync(resolve(__dirname, '../package.json'))).toBe(true)
  })

  it('should have prisma schema', () => {
    expect(existsSync(resolve(__dirname, '../prisma/schema.prisma'))).toBe(true)
  })

  it('should have src directory', () => {
    expect(existsSync(resolve(__dirname, '../src'))).toBe(true)
  })

  it('should have reference-uiux directory', () => {
    expect(existsSync(resolve(__dirname, '../reference-uiux'))).toBe(true)
  })

  it('should have .ai configuration', () => {
    expect(existsSync(resolve(__dirname, '../.ai/config/project.yaml'))).toBe(true)
  })

  it('should have storage directories', () => {
    const categories = ['vehicles', 'documents', 'invoices', 'contracts', 'inspections', 'expenses', 'insurance', 'warranties', 'temp']
    for (const cat of categories) {
      expect(existsSync(resolve(__dirname, `../storage/${cat}`))).toBe(true)
    }
  })
})
