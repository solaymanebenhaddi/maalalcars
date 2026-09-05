'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Car,
  Boxes,
  CalendarDays,
  BadgePercent,
  ShoppingCart,
  Receipt,
  CreditCard,
  Scale,
  ReceiptText,
  DollarSign,
  Users,
  UserCheck,
  UserPlus,
  Briefcase,
  Building2,
  Wrench,
  CalendarCheck,
  Target,
  Banknote,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  FileText,
  ClipboardCheck,
  Truck,
  CheckSquare,
  MessageSquare,
  Megaphone,
  FolderArchive,
  BarChart3,
  UserCog,
  Settings,
  HelpCircle,
  Archive,
  LifeBuoy,
  Plus,
  X,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import clsx from 'clsx'
import { useFeatures } from '@/contexts/features.context'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string | number
  badgeColor?: 'red' | 'cyan' | 'amber' | 'green' | 'purple'
  featureKey?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  userName?: string
  counts?: { vehicles: number; parks: number; activeReservations: number }
}

function buildNavigationSections(counts?: { vehicles: number; parks: number; activeReservations: number }): NavSection[] {
  return [
    {
      items: [
        { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'COMMERCE & STOCK',
      items: [
        { name: 'Véhicules', href: '/vehicles', icon: Car, badge: counts?.vehicles ?? 0, badgeColor: 'cyan', featureKey: 'vehicles' },
        { name: '+ Ajouter un véhicule', href: '/vehicles/new', icon: Plus, featureKey: 'vehicles' },
        { name: 'Parcs Automobiles', href: '/parks', icon: Building2, badge: counts?.parks ?? 0, badgeColor: 'cyan', featureKey: 'stock' },
        { name: 'Stock & Rotation', href: '/stock', icon: Boxes, featureKey: 'stock' },
        { name: 'Réservations', href: '/reservations', icon: CalendarDays, badge: counts?.activeReservations ?? 0, badgeColor: 'amber', featureKey: 'reservations' },
        { name: 'Ventes', href: '/sales', icon: BadgePercent, featureKey: 'sales' },
        { name: 'Achats', href: '/purchases', icon: ShoppingCart, featureKey: 'purchases' },
        { name: 'Livraisons', href: '/deliveries', icon: Truck, featureKey: 'deliveries' },
      ],
    },
    {
      title: 'FINANCES & FACTURATION',
      items: [
        { name: 'Vue Financière', href: '/finance', icon: DollarSign, featureKey: 'finance' },
        { name: 'Factures', href: '/invoices', icon: Receipt, featureKey: 'invoices' },
        { name: 'Paiements & Encaissements', href: '/payments', icon: CreditCard, featureKey: 'payments' },
        { name: 'Régularisations & Soldes', href: '/regularizations', icon: Scale, featureKey: 'regularizations' },
        { name: 'Dépenses & Frais', href: '/expenses', icon: ReceiptText, featureKey: 'expenses' },
      ],
    },
    {
      title: 'RELATIONS & CRM',
      items: [
        { name: 'Contacts CRM', href: '/contacts', icon: Users, featureKey: 'crmAdvanced' },
        { name: 'Acheteurs', href: '/buyers', icon: UserCheck, featureKey: 'buyers' },
        { name: 'Vendeurs', href: '/sellers', icon: UserPlus, featureKey: 'sellers' },
        { name: 'Commissionnaires', href: '/commissioners', icon: Briefcase, featureKey: 'commissioners' },
        { name: 'Fournisseurs', href: '/suppliers', icon: Building2, featureKey: 'suppliers' },
      ],
    },
    {
      title: 'SERVICES & OPÉRATIONS',
      items: [
        { name: 'Atelier & Entretien', href: '/workshop', icon: Wrench, featureKey: 'workshopAdvanced' },
        { name: 'Agenda & RDV', href: '/appointments', icon: CalendarCheck, featureKey: 'appointments' },
        { name: 'Évaluations Véhicules', href: '/evaluations', icon: ClipboardCheck, featureKey: 'evaluations' },
        { name: 'Contrats & Signatures', href: '/contracts', icon: FileText, featureKey: 'contracts' },
        { name: 'Documents & Cartes Grises', href: '/documents', icon: FolderArchive, featureKey: 'documents' },
        { name: 'Immatriculations', href: '/registrations', icon: FileCheck2, featureKey: 'registrations' },
        { name: 'Garanties', href: '/warranties', icon: ShieldCheck, featureKey: 'warranties' },
        { name: 'Assurances', href: '/insurances', icon: ShieldAlert, featureKey: 'insurance' },
      ],
    },
    {
      title: 'MARKETING & PROSPECTION',
      items: [
        { name: 'Leads & Pipeline', href: '/leads', icon: Target, featureKey: 'leads' },
        { name: 'Financement / Crédit', href: '/financing', icon: Banknote, featureKey: 'financing' },
        { name: 'Annonces & Portails', href: '/listings', icon: Megaphone, featureKey: 'listings' },
        { name: 'Messagerie Client', href: '/communications', icon: MessageSquare, featureKey: 'communications' },
        { name: 'Tâches & Approbations', href: '/tasks', icon: CheckSquare, featureKey: 'tasks' },
      ],
    },
    {
      title: 'PILOTAGE & SYSTÈME',
      items: [
        { name: 'Rapports & Analytics', href: '/reports', icon: BarChart3, featureKey: 'reportsAdvanced' },
        { name: 'SAV & Support Client', href: '/sav', icon: HelpCircle, featureKey: 'sav' },
        { name: 'Support & Helpdesk', href: '/helpdesk', icon: LifeBuoy, featureKey: 'helpdesk' },
        { name: 'Utilisateurs & Rôles', href: '/users', icon: UserCog, featureKey: 'settings' },
        { name: 'Paramètres', href: '/settings', icon: Settings, featureKey: 'settings' },
        { name: "Centre d'Archives", href: '/archives', icon: Archive, featureKey: 'archives' },
      ],
    },
  ]
}

export function Sidebar({ isOpen, onClose, userName, counts }: SidebarProps) {
  const pathname = usePathname()
  const { isEnabled } = useFeatures()

  const visibleSections = buildNavigationSections(counts)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.featureKey || isEnabled(item.featureKey)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#222228] bg-[#0c0c0e] transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#222228] px-4">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <Image
              src="/logo.png?v=3"
              alt="MAALAL CARS"
              width={48}
              height={40}
              unoptimized
              className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
              priority
            />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white">MAALAL CARS</span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Plateforme Maroc</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-[#1a1a20] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {visibleSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      'group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'border border-red-900/50 bg-gradient-to-r from-red-950/70 via-red-900/30 to-red-950/10 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                        : 'text-zinc-400 hover:bg-[#18181d] hover:text-zinc-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={clsx(
                          'h-4 w-4 transition-colors',
                          isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-300'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && (
                        <span
                          className={clsx(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                            item.badgeColor === 'red' && 'bg-red-500/20 text-red-400 border border-red-500/30',
                            item.badgeColor === 'cyan' && 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
                            item.badgeColor === 'amber' && 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                            item.badgeColor === 'green' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                            item.badgeColor === 'purple' && 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
                            !item.badgeColor && 'bg-zinc-800 text-zinc-300'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && item.href === '/' && (
                        <ChevronRight className="h-3.5 w-3.5 text-red-500/70" />
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="border-t border-[#222228] p-3 bg-[#0a0a0c]">
          <div className="flex items-center justify-between rounded-lg bg-[#141418] p-2.5 border border-[#222228]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/30">
                {(userName || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white leading-tight">{userName || 'Utilisateur'}</span>
                <span className="text-[10px] text-zinc-400">Administrateur</span>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="Connecté" />
          </div>
        </div>
      </aside>
    </>
  )
}
