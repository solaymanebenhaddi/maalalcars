import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Car } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { StatCard } from '@/components/shared/stat-card'

describe('StatCard', () => {
  it('renders a Lucide icon and server-provided content', () => {
    const markup = renderToStaticMarkup(
      <StatCard
        title="Véhicules en stock"
        value={8}
        icon={Car}
        trend={{ value: '+2', direction: 'up', label: 'ce mois' }}
      />
    )

    expect(markup).toContain('Véhicules en stock')
    expect(markup).toContain('+2')
    expect(markup).toContain('ce mois')
    expect(markup).toContain('<svg')
  })
})
