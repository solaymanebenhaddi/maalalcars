import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/app-shell'
import { FeaturesProvider } from '@/contexts/features.context'
import { WheelLoaderProvider } from '@/contexts/wheel-loader.context'
import { AppInitialLoader } from '@/components/ui/app-initial-loader'
import './globals.css'

export const metadata: Metadata = {
  title: 'MAALAL CARS — Plateforme de Gestion Automobile au Maroc',
  description: 'Logiciel complet de gestion de concession, stock, achats, ventes, facturation et finances à Casablanca, Maroc.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#0a0a0b] text-[#f0f0f2] antialiased selection:bg-red-900 selection:text-white">
        <FeaturesProvider>
          <WheelLoaderProvider>
            <AppInitialLoader />
            <AppShell>{children}</AppShell>
          </WheelLoaderProvider>
        </FeaturesProvider>
      </body>
    </html>
  )
}
