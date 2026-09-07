'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { QuickActionModal } from '@/components/modals/quick-action-modal'
import { NotificationDrawer } from '@/components/modals/notification-drawer'
import { DataExportModal } from '@/components/modals/data-export-modal'
import { useFeatures } from '@/contexts/features.context'
import { ModuleDisabled } from '@/components/shared/module-disabled'

interface LayoutPark {
  id: string
  name: string
  vehicleCount: number
}

interface LayoutData {
  user: { name: string; email: string; role: string }
  counts: { vehicles: number; parks: number; activeReservations: number }
  parks: LayoutPark[]
}

const ROUTE_TO_FEATURE_MAP: Record<string, { featureKey: string; name: string }> = {
  '/expenses': { featureKey: 'expenses', name: 'Dépenses & Frais' },
  '/clients': { featureKey: 'clients', name: 'Gestion des Clients' },
  '/buyers': { featureKey: 'buyers', name: 'Répertoire Acheteurs' },
  '/sellers': { featureKey: 'sellers', name: 'Répertoire Vendeurs' },
  '/commissioners': { featureKey: 'commissioners', name: 'Commissionnaires' },
  '/suppliers': { featureKey: 'suppliers', name: 'Fournisseurs' },
  '/finance': { featureKey: 'finance', name: 'Finance & Trésorerie' },
  '/payments': { featureKey: 'payments', name: 'Module Paiements' },
  '/regularizations': { featureKey: 'regularizations', name: 'Régularisations' },
  '/warranties': { featureKey: 'warranties', name: 'Garanties' },
  '/insurances': { featureKey: 'insurance', name: 'Assurances' },
  '/leads': { featureKey: 'leads', name: 'Prospects & Leads' },
  '/appointments': { featureKey: 'appointments', name: 'Agenda & RDV' },
  '/contracts': { featureKey: 'contracts', name: 'Contrats' },
  '/evaluations': { featureKey: 'evaluations', name: 'Évaluations & Reprises' },
  '/helpdesk': { featureKey: 'helpdesk', name: 'Support & Helpdesk' },
  '/communications': { featureKey: 'communications', name: 'Communications' },
  '/listings': { featureKey: 'listings', name: 'Annonces & Portails' },
  '/sav': { featureKey: 'sav', name: 'Service Après-Vente' },
  '/deliveries': { featureKey: 'deliveries', name: 'Livraisons' },
  '/purchases': { featureKey: 'purchases', name: 'Module Achats Détaillé' },
  '/stock': { featureKey: 'stock', name: 'Analyses de Rotation Stock' },
  '/financing': { featureKey: 'financing', name: 'Financement & Crédit' },
  '/balances': { featureKey: 'balances', name: 'Soldes & Encours' },
  '/tasks': { featureKey: 'tasks', name: 'Tâches & Rappels' },
  '/archives': { featureKey: 'archives', name: 'Archives' },
  '/registrations': { featureKey: 'registrations', name: 'Immatriculations' },
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isEnabled } = useFeatures()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null)

  useEffect(() => {
    fetch('/api/layout')
      .then((res) => res.ok ? res.json() as Promise<LayoutData> : null)
      .then((data) => { if (data) setLayoutData(data) })
      .catch((err) => console.error('Layout data fetch error:', err))
  }, [])

  // Check if current route belongs to a disabled feature flag
  const matchedRoute = Object.entries(ROUTE_TO_FEATURE_MAP).find(
    ([route]) => pathname === route || pathname.startsWith(route + '/')
  )

  const isRouteDisabled = Boolean(
    matchedRoute && !isEnabled(matchedRoute[1].featureKey)
  )

  // Dedicated standalone layout for login page
  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f2]">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        userName={layoutData?.user.name}
        counts={layoutData?.counts}
      />

      {/* Main App Layout Container */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Sticky Topbar */}
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          userName={layoutData?.user.name}
          userEmail={layoutData?.user.email}
          userRole={layoutData?.user.role}
          parks={layoutData?.parks}
          totalVehicleCount={layoutData?.counts.vehicles}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto">
          {isRouteDisabled && matchedRoute ? (
            <ModuleDisabled
              moduleName={matchedRoute[1].name}
              featureKey={matchedRoute[1].featureKey}
            />
          ) : (
            children
          )}
        </main>
      </div>

      {/* Universal Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Universal Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        defaultType="vehicles"
      />

      {/* Interactive Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </div>
  )
}
