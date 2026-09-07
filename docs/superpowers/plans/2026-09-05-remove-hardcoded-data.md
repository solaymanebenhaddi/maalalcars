# Remove All Hardcoded Mock Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded mock/fake data across the codebase with real data fetched from the Prisma database, ensuring every UI component displays only authentic backend-driven information.

**Architecture:** Server components fetch data via repositories/services and pass it as props to client components. Client components that need dynamic data use `fetch('/api/...')` calls. The `getServerSession()` and `getActiveUserRole()` functions provide the authenticated user identity. Empty states replace fake fallback arrays.

**Tech Stack:** Next.js 16 App Router, Prisma ORM (SQLite), TypeScript, React Server Components, Zod validation

---

## File Structure Overview

### Files to modify (grouped by phase):

**Phase 1 — Layout Identity (user name, badges, parks)**
- `src/components/layout/topbar.tsx` — remove hardcoded "Adem Maalal", parks, notification count
- `src/components/layout/sidebar.tsx` — remove hardcoded "Adem Maalal", badge counts
- `src/components/layout/app-shell.tsx` — pass user + counts as props
- `src/app/layout.tsx` — fetch user + counts server-side, pass to AppShell
- `src/lib/auth-roles.ts` — clean up hardcoded fallback user

**Phase 2 — Dashboard (fake financials)**
- `src/app/page.tsx` — remove fake baseline chart data and radar scores

**Phase 3 — Pages with fallback arrays (invoices, appointments, expenses, workshop)**
- `src/app/invoices/page.tsx` — remove FALLBACK_INVOICES
- `src/app/invoices/[id]/page.tsx` — remove hardcoded fallback values and line items
- `src/app/invoices/new/page.tsx` — wire dropdowns to DB, remove DEFAULT_LINES
- `src/app/appointments/page.tsx` — remove FALLBACK_APPOINTMENTS
- `src/app/appointments/new/page.tsx` — wire dropdowns to DB
- `src/app/expenses/page.tsx` — remove FALLBACK_EXPENSES
- `src/app/workshop/page.tsx` — remove REFERENCE_CLIENTS

**Phase 4 — Form pages with pre-filled fake data**
- `src/app/financing/new/page.tsx` — clear fake applicant data
- `src/app/leads/new/page.tsx` — clear fake lead data
- `src/app/clients/new/page.tsx` — clear fake client data
- `src/app/reservations/new/page.tsx` — remove hardcoded salesperson name

**Phase 5 — Feature dashboards (mock arrays)**
- `src/features/sales/sales-dashboard-client.tsx` — props from server page
- `src/features/purchases/purchases-dashboard-client.tsx` — props from server page
- `src/features/commissioners/commissioners-dashboard-client.tsx` — props from server page
- `src/features/deliveries/deliveries-dashboard-client.tsx` — props from server page
- `src/features/contacts/contacts-dashboard-client.tsx` — props from server page
- `src/features/leads/leads-dashboard-client.tsx` — props from server page
- `src/features/clients/clients-dashboard-client.tsx` — props from server page
- `src/features/users/users-dashboard-client.tsx` — props from server page
- `src/features/appointments/appointments-dashboard-client.tsx` — props from server page

**Phase 6 — Remaining component hardcoding**
- `src/components/sales/sale-workflow-client.tsx` — remove hardcoded default user
- `src/components/vehicles/vehicle-lifecycle-timeline.tsx` — remove "Adem Maalal" fallback
- `src/components/modals/data-export-modal.tsx` — generate real CSV from API
- `src/app/vehicles/page.tsx` — fetch brands dynamically

---

## Phase 1: Layout Identity — Real User & Dynamic Counts

### Task 1: Clean up auth-roles.ts hardcoded fallbacks

**Files:**
- Modify: `src/lib/auth-roles.ts:49-56,89-95`

The vendeur fallback (lines 49-56) and super admin fallback (lines 89-95) use hardcoded names/emails. The vendeur override should find ANY user with role "Vendeur" instead of a specific email. The super admin fallback should return a generic "Utilisateur" rather than fake data.

- [ ] **Step 1: Fix vendeur fallback to not hardcode email**

In `src/lib/auth-roles.ts`, change the vendeur lookup to find by role instead of email:

```typescript
// Line 34-56: Replace this block
if (overrideRole === 'vendeur') {
  const vendeurUser = await prisma.user.findFirst({
    where: { role: { name: 'Vendeur' }, isActive: true },
    include: { role: true },
  })

  if (vendeurUser) {
    return {
      id: vendeurUser.id,
      name: vendeurUser.name,
      email: vendeurUser.email,
      role: vendeurUser.role.name,
      isSuperAdmin: isSuperAdminRole(vendeurUser.role.name),
    }
  }

  // No vendeur user exists — fall through to session check
}
```

- [ ] **Step 2: Fix super admin fallback to not use hardcoded identity**

```typescript
// Lines 89-95: Replace with a safe generic fallback
return {
  id: 'anonymous',
  name: 'Utilisateur',
  email: '',
  role: 'Invité',
  isSuperAdmin: false,
}
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth-roles.ts
git commit -m "fix: remove hardcoded user identities from auth-roles fallbacks"
```

---

### Task 2: Make AppShell pass user identity and counts to Sidebar/Topbar

The AppShell is a client component. It needs to fetch the current user and sidebar badge counts via API so Sidebar and Topbar display real data.

**Files:**
- Create: `src/app/api/layout/route.ts`
- Modify: `src/components/layout/app-shell.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/topbar.tsx`

- [ ] **Step 1: Create layout data API route**

Create `src/app/api/layout/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getActiveUserRole } from '@/lib/auth-roles'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getActiveUserRole()

    const [vehicleCount, parkCount, activeReservationCount, parks] = await Promise.all([
      prisma.vehicle.count({ where: { archivedAt: null } }),
      prisma.park.count(),
      prisma.reservation.count({ where: { status: { in: ['ACTIVE', 'EXPIRING'] } } }),
      prisma.park.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { vehicles: { where: { archivedAt: null } } } },
        },
        orderBy: { name: 'asc' },
      }),
    ])

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      counts: {
        vehicles: vehicleCount,
        parks: parkCount,
        activeReservations: activeReservationCount,
      },
      parks: parks.map((p) => ({
        id: p.id,
        name: p.name,
        vehicleCount: p._count.vehicles,
      })),
    })
  } catch (error: unknown) {
    console.error('API Layout GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Add a useLayoutData hook in AppShell**

In `src/components/layout/app-shell.tsx`, add a `useEffect` fetch for `/api/layout` and pass results to Sidebar and Topbar:

```typescript
'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { QuickActionModal } from '@/components/modals/quick-action-modal'
import { NotificationDrawer } from '@/components/modals/notification-drawer'
import { useFeatures } from '@/contexts/features.context'
import { ModuleDisabled } from '@/components/shared/module-disabled'

// ... keep ROUTE_TO_FEATURE_MAP unchanged ...

interface LayoutData {
  user: { name: string; email: string; role: string }
  counts: { vehicles: number; parks: number; activeReservations: number }
  parks: { id: string; name: string; vehicleCount: number }[]
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isEnabled } = useFeatures()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null)

  useEffect(() => {
    fetch('/api/layout')
      .then((res) => res.json())
      .then((data) => setLayoutData(data))
      .catch(() => {})
  }, [pathname])

  // ... keep route disabled check unchanged ...

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f2]">
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        userName={layoutData?.user.name}
        counts={layoutData?.counts}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          userName={layoutData?.user.name}
          userEmail={layoutData?.user.email}
          userRole={layoutData?.user.role}
          parks={layoutData?.parks}
          totalVehicleCount={layoutData?.counts.vehicles}
        />

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

      <QuickActionModal isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
      <NotificationDrawer isOpen={isNotificationDrawerOpen} onClose={() => setIsNotificationDrawerOpen(false)} />
    </div>
  )
}
```

- [ ] **Step 3: Update Sidebar to accept props instead of hardcoding**

In `src/components/layout/sidebar.tsx`:

1. Add props to the component signature:
```typescript
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  counts?: { vehicles: number; parks: number; activeReservations: number }
}

export function Sidebar({ isOpen, onClose, userName, counts }: SidebarProps) {
```

2. Replace hardcoded badge values (lines 74, 76, 78, 124):
- Line 74: `badge: 8` → `badge: counts?.vehicles ?? 0`
- Line 76: `badge: '2'` → `badge: counts?.parks ?? 0`
- Line 78: `badge: 1` → `badge: counts?.activeReservations ?? 0`
- Line 124: Remove `badge: 3` entirely (or keep as 0)

3. Replace hardcoded user name (line 266):
- `'Adem Maalal'` → `{userName || 'Utilisateur'}`

- [ ] **Step 4: Update Topbar to accept props instead of hardcoding**

In `src/components/layout/topbar.tsx`:

1. Add props to the component:
```typescript
interface TopbarProps {
  onOpenMobileNav: () => void
  onOpenQuickAction: () => void
  onOpenNotifications: () => void
  userName?: string
  userEmail?: string
  userRole?: string
  parks?: { id: string; name: string; vehicleCount: number }[]
  totalVehicleCount?: number
}
```

2. Replace hardcoded notification count (line 74):
- `unreadNotificationsCount = 3` → `unreadNotificationsCount = 0`

3. Replace hardcoded parks section (lines 287-312) with dynamic parks:
```typescript
{/* Park selector */}
<div className="...">
  <div className="..." onClick={...}>
    <span>Tous les Parcs (National)</span>
    <span className="...">{totalVehicleCount ?? 0} véhicules</span>
  </div>
  {parks?.map((park) => (
    <div key={park.id} className="...">
      <span>{park.name}</span>
      <span className="...">{park.vehicleCount} voitures</span>
    </div>
  ))}
</div>
```

4. Replace hardcoded user identity (lines 371-385):
- `'Adem Maalal'` → `{userName || 'Utilisateur'}`
- `'admin@maalalcars.com'` → `{userEmail || ''}`
- `'Administrateur'` → `{userRole || ''}`

- [ ] **Step 5: Run typecheck and tests**

Run: `npx tsc --noEmit && npx vitest run`
Expected: All pass

- [ ] **Step 6: Commit**

```bash
git add src/app/api/layout/route.ts src/components/layout/app-shell.tsx src/components/layout/sidebar.tsx src/components/layout/topbar.tsx
git commit -m "feat: wire sidebar/topbar to real user identity and dynamic counts from API"
```

---

## Phase 2: Dashboard — Remove Fake Financial Data

### Task 3: Replace hardcoded baseline chart data with empty state

**Files:**
- Modify: `src/app/page.tsx:207-262`

- [ ] **Step 1: Replace hardcoded financial chart baseline**

In `src/app/page.tsx`, find the baseline data block (lines 207-221) and replace with empty array:

```typescript
// Remove the hardcoded fallback with fake months data.
// Replace the entire block that sets baseline financialData with:
const financialData: FinancialDataPoint[] = monthlyData.length > 0
  ? monthlyData.map((m) => ({
      month: m.month,
      revenue: m.revenue,
      cost: m.cost,
      profit: m.profit,
      marginPercent: m.revenue > 0 ? ((m.profit / m.revenue) * 100) : 0,
    }))
  : []
```

- [ ] **Step 2: Replace hardcoded radar scores with computed values**

Find the radar metrics block (lines 231-262) and replace hardcoded scores:

```typescript
// Compute real scores from available data
const totalVehicleCount = vehiclesByStatus.reduce((s, v) => s + v._count._all, 0)
const soldCount = vehiclesByStatus.find((v) => v.status === 'SOLD')?._count._all || 0
const rotationScore = totalVehicleCount > 0 ? Math.round((soldCount / totalVehicleCount) * 100) : 0
const profitScore = totalSalesRevenue > 0 ? Math.min(100, Math.round((totalNetProfit / totalSalesRevenue) * 100)) : 0

const radarMetrics: RadarMetric[] = [
  { label: 'Rentabilité', value: profitScore },
  { label: 'Rotation Stock', value: rotationScore },
  { label: 'Coûts & Frais', value: totalSalesRevenue > 0 ? Math.max(0, 100 - Math.round((totalExpensesAmount / totalSalesRevenue) * 100)) : 0 },
  { label: 'Réservations', value: Math.min(100, activeReservationsCount * 20) },
  { label: 'Liquidités', value: totalSalesRevenue > 0 ? Math.round(((totalSalesRevenue - outstandingBalance) / totalSalesRevenue) * 100) : 0 },
]
```

Note: The exact variable names depend on what's already computed in the dashboard page. Read the full page to map correctly to existing variables.

- [ ] **Step 3: Update the FinancialPerformanceChart component to handle empty data**

Ensure the chart component renders an empty state message when `data.length === 0`:

```typescript
// In the chart component, add at the top of the render:
if (data.length === 0) {
  return (
    <div className="flex items-center justify-center h-64 text-xs text-zinc-500">
      Aucune donnée financière disponible pour le moment.
    </div>
  )
}
```

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/dashboard/financial-performance-chart.tsx
git commit -m "fix: replace hardcoded dashboard financials with real computed data and empty states"
```

---

## Phase 3: Pages with Fallback Arrays

### Task 4: Remove FALLBACK_INVOICES from invoices page

**Files:**
- Modify: `src/app/invoices/page.tsx:10-21`

- [ ] **Step 1: Remove the FALLBACK_INVOICES constant**

Delete the entire `FALLBACK_INVOICES` array (lines 10-21). Replace any reference to it with an empty array `[]`. Where the page uses `FALLBACK_INVOICES` as fallback data, use an empty state instead:

```typescript
// Where invoices are set:
const invoices = dbInvoices // no fallback array
```

- [ ] **Step 2: Add empty state UI where the list renders**

If `invoices.length === 0`, render:
```tsx
<div className="rounded-2xl border border-[#222228] bg-[#121216] p-8 text-center text-xs text-zinc-500">
  Aucune facture enregistrée pour le moment.
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/invoices/page.tsx
git commit -m "fix: remove fake invoice fallback data, show empty state"
```

---

### Task 5: Remove hardcoded data from invoice detail page

**Files:**
- Modify: `src/app/invoices/[id]/page.tsx:60-74,247-266`

- [ ] **Step 1: Replace hardcoded fallback values with null-safe defaults**

Lines 60-74: Replace all `|| 'Imane Zahiri'`, `|| 72530.0`, etc. with safe defaults:

```typescript
const code = invoice.code || 'N/A'
const clientName = invoice.sale?.buyerName || invoice.sale?.buyer?.firstName
  ? `${invoice.sale.buyer.firstName} ${invoice.sale.buyer.lastName}`
  : 'Client non renseigné'
const vehicleName = invoice.sale?.vehicle
  ? `${invoice.sale.vehicle.brand} ${invoice.sale.vehicle.model}`
  : 'Véhicule non renseigné'
const saleCode = invoice.sale?.code || 'N/A'
const subtotalHT = invoice.subtotalHT || 0
const taxAmount = invoice.taxAmount || 0
const totalTTC = invoice.totalTTC || 0
const paidAmount = invoice.paidAmount || 0
const paymentMethod = invoice.paymentMethod || 'Non renseigné'
```

- [ ] **Step 2: Replace hardcoded line items with real invoice lines**

Lines 247-266: Replace the 3 hardcoded table rows with dynamic rendering:

```tsx
{invoice.lines && invoice.lines.length > 0 ? (
  invoice.lines.map((line, idx) => (
    <tr key={idx} className="border-b border-[#1e1e24]">
      <td className="py-3 text-zinc-200">{line.description}</td>
      <td className="py-3 text-center text-zinc-300">{line.quantity}</td>
      <td className="py-3 text-right font-mono text-zinc-300">{line.unitPriceHT.toLocaleString('fr-MA')} DH</td>
      <td className="py-3 text-right font-mono text-zinc-300">{line.taxRate}%</td>
      <td className="py-3 text-right font-mono font-bold text-white">
        {(line.quantity * line.unitPriceHT * (1 + line.taxRate / 100)).toLocaleString('fr-MA')} DH
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={5} className="py-6 text-center text-xs text-zinc-500">
      Aucun article sur cette facture.
    </td>
  </tr>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/invoices/[id]/page.tsx
git commit -m "fix: replace hardcoded invoice detail values with real data"
```

---

### Task 6: Wire invoice creation form to database

**Files:**
- Modify: `src/app/invoices/new/page.tsx:25-29,108-157,184`

- [ ] **Step 1: Convert to server component and fetch real data**

At the top of the file, fetch clients and sales from the database:

```typescript
const [contacts, recentSales] = await Promise.all([
  prisma.contact.findMany({
    where: { archivedAt: null },
    select: { id: true, firstName: true, lastName: true, phone: true, address: true },
    orderBy: { lastName: 'asc' },
  }),
  prisma.sale.findMany({
    where: { status: { not: 'CANCELLED' } },
    select: { id: true, code: true, buyerName: true },
    orderBy: { saleDate: 'desc' },
    take: 20,
  }),
])
```

- [ ] **Step 2: Remove DEFAULT_LINES constant**

Replace lines 25-29 with an empty initial line:

```typescript
const DEFAULT_LINES: LineItem[] = [
  { id: '1', description: '', quantity: 1, unitPriceHT: 0, taxRate: 20 },
]
```

- [ ] **Step 3: Replace hardcoded client dropdown**

Lines 108-116: Replace hardcoded `<option>` elements with dynamic ones:

```tsx
<option value="">-- Sélectionner un client --</option>
{contacts.map((c) => (
  <option key={c.id} value={c.id}>
    {c.firstName} {c.lastName}
  </option>
))}
```

- [ ] **Step 4: Replace hardcoded sale dropdown**

Lines 123-130: Replace hardcoded sale options:

```tsx
<option value="">-- Lier à une vente --</option>
{recentSales.map((s) => (
  <option key={s.id} value={s.id}>
    {s.code} — {s.buyerName || 'Client'}
  </option>
))}
```

- [ ] **Step 5: Replace hardcoded dates with today's date**

Lines 141-157: Replace `defaultValue="2025-05-30"` and `defaultValue="2025-06-27"`:

```typescript
const today = new Date().toISOString().split('T')[0]
const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
```

Use `defaultValue={today}` and `defaultValue={dueDate}`.

- [ ] **Step 6: Remove hardcoded address**

Line 184: Replace `defaultValue="Imane Zahiri..."` with empty `defaultValue=""`.

- [ ] **Step 7: Commit**

```bash
git add src/app/invoices/new/page.tsx
git commit -m "fix: wire invoice creation form to real DB data, remove fake defaults"
```

---

### Task 7: Remove FALLBACK_APPOINTMENTS

**Files:**
- Modify: `src/app/appointments/page.tsx:7-118`

- [ ] **Step 1: Delete the FALLBACK_APPOINTMENTS array entirely**

Remove lines 7-118. Replace any reference to `FALLBACK_APPOINTMENTS` with `[]`. Add empty state UI.

- [ ] **Step 2: Commit**

```bash
git add src/app/appointments/page.tsx
git commit -m "fix: remove fake appointment fallback data"
```

---

### Task 8: Wire appointments/new form to database

**Files:**
- Modify: `src/app/appointments/new/page.tsx:76-262`

- [ ] **Step 1: Fetch real data at the top of the page**

```typescript
const [contacts, vehicles, personnelList] = await Promise.all([
  prisma.contact.findMany({
    where: { archivedAt: null },
    select: { id: true, firstName: true, lastName: true, phone: true, email: true },
    orderBy: { lastName: 'asc' },
  }),
  prisma.vehicle.findMany({
    where: { archivedAt: null },
    select: { id: true, brand: true, model: true, matricule: true, vin: true },
    orderBy: { createdAt: 'desc' },
  }),
  prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  }),
])
```

- [ ] **Step 2: Replace all hardcoded dropdowns with dynamic options**

- Client dropdown (lines 79-83): Map `contacts`
- Vehicle dropdown (lines 123-127): Map `vehicles`
- Advisor dropdown (lines 203-206): Map `personnelList`
- Remove all `defaultValue` with fake data (lines 91, 100, 137, 148, 219, 233, 262)
- Set date `defaultValue` to `new Date().toISOString().split('T')[0]`
- Set time `defaultValue` to empty string `""`
- Set notes `defaultValue` to empty string `""`

- [ ] **Step 3: Commit**

```bash
git add src/app/appointments/new/page.tsx
git commit -m "fix: wire appointment form to real DB data, clear fake defaults"
```

---

### Task 9: Remove FALLBACK_EXPENSES

**Files:**
- Modify: `src/app/expenses/page.tsx:10-71`

- [ ] **Step 1: Delete the FALLBACK_EXPENSES array entirely**

Remove lines 10-71. Replace references with `[]`. Add empty state.

- [ ] **Step 2: Commit**

```bash
git add src/app/expenses/page.tsx
git commit -m "fix: remove fake expense fallback data"
```

---

### Task 10: Remove REFERENCE_CLIENTS from workshop page

**Files:**
- Modify: `src/app/workshop/page.tsx:7-18`

- [ ] **Step 1: Delete the REFERENCE_CLIENTS object**

Remove the hardcoded client mapping (lines 7-18). Replace any fallback client lookup with data from the workshop order's actual relations. Where `REFERENCE_CLIENTS[code]` was used, use the workshop order's linked contact or show "Client non renseigné".

Also replace fallback values at lines 43-46 ("BMW Série 3", "WW-123-AA", etc.) with `'N/A'` or null-safe access to the order's actual relations.

- [ ] **Step 2: Commit**

```bash
git add src/app/workshop/page.tsx
git commit -m "fix: remove fake workshop client references, use real order data"
```

---

## Phase 4: Form Pages with Pre-filled Fake Data

### Task 11: Clear all fake form defaults

**Files:**
- Modify: `src/app/financing/new/page.tsx:22-49`
- Modify: `src/app/leads/new/page.tsx:97-233`
- Modify: `src/app/clients/new/page.tsx:69-224`
- Modify: `src/app/reservations/new/page.tsx:170`

- [ ] **Step 1: Clear financing/new form data**

In `src/app/financing/new/page.tsx`, replace lines 22-49 (the initial formData state) with empty strings:

```typescript
const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  email: '',
  birthDate: '',
  profession: '',
  cin: '',
  address: '',
  monthlyIncome: '',
  otherIncome: '',
  monthlyExpenses: '',
  dependents: '',
  homeOwner: '',
  postalCode: '',
  vehicleModel: '',
  vehiclePrice: '',
  registrationPlate: '',
  partnerName: '',
  requestedAmount: '',
  downPayment: '',
  durationMonths: '',
  interestRate: '',
})
```

- [ ] **Step 2: Clear leads/new form defaults**

In `src/app/leads/new/page.tsx`, remove all `defaultValue` attributes that contain fake data:
- Line 97: `defaultValue="Yanis"` → remove defaultValue
- Line 108: `defaultValue="Bennani"` → remove defaultValue
- Line 119: `defaultValue="06 98 76 54 32"` → remove defaultValue
- Line 131: `defaultValue="yanis.bennani@gmail.com"` → remove defaultValue
- Line 190: `defaultValue="240000"` → remove defaultValue
- Line 215: `defaultValue="SUV, Diesel, Automatique"` → remove defaultValue
- Line 233: Remove the fake notes defaultValue entirely

- [ ] **Step 3: Clear clients/new form defaults**

In `src/app/clients/new/page.tsx`, remove all fake defaultValues:
- Line 69: `defaultValue="Thomas"` → remove
- Line 80: `defaultValue="Bernard"` → remove
- Line 104: `defaultValue="thomas.bernard@gmail.com"` → remove
- Line 115: `defaultValue="+33 6 71 23 45 67"` → remove
- Line 134: `defaultValue="45 Avenue des Champs-Élysées"` → remove
- Line 145: `defaultValue="Appartement 12B"` → remove
- Line 157: `defaultValue="75008"` → remove
- Line 168: `defaultValue="Paris"` → remove

Also replace hardcoded salesperson dropdown (lines 222-224) with a `personnelList` prop passed from the server page.

- [ ] **Step 4: Clear reservations/new salesperson default**

In `src/app/reservations/new/page.tsx`, line 170: `defaultValue="Yassine Benali"` → remove defaultValue

- [ ] **Step 5: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/app/financing/new/page.tsx src/app/leads/new/page.tsx src/app/clients/new/page.tsx src/app/reservations/new/page.tsx
git commit -m "fix: clear all fake pre-filled form data across creation pages"
```

---

## Phase 5: Feature Dashboard Mock Arrays

Each feature dashboard client component currently has hardcoded mock arrays. The pattern is the same for each: the server page (`src/app/{feature}/page.tsx`) must fetch real data and pass it as props to the client dashboard component.

### Task 12: Sales dashboard — real data

**Files:**
- Modify: `src/features/sales/sales-dashboard-client.tsx:31-37`
- Modify: `src/app/sales/page.tsx` (server page — pass props)

- [ ] **Step 1: Add props interface to sales dashboard client**

Replace the hardcoded `SALES` array (lines 31-37) with a prop:

```typescript
interface SalesDashboardProps {
  sales: {
    reference: string
    client: string
    vehicle: string
    amount: string
    status: string
    date: string
    salesperson: string
    paymentMethod: string
  }[]
}

export function SalesDashboardClient({ sales }: SalesDashboardProps) {
  // Remove const SALES = [...] entirely
  // Use `sales` prop where SALES was referenced
```

- [ ] **Step 2: Fetch real sales in the server page**

In `src/app/sales/page.tsx`, fetch recent sales from the database and map them to the prop shape:

```typescript
const recentSales = await saleRepository.getAll({ limit: 10 })
const salesForDashboard = recentSales.map((s) => ({
  reference: s.code,
  client: s.buyerName || 'Client',
  vehicle: s.vehicle ? `${s.vehicle.brand} ${s.vehicle.model}` : 'N/A',
  amount: `${s.salePrice.toLocaleString('fr-MA')} DH`,
  status: s.status,
  date: new Date(s.saleDate).toLocaleDateString('fr-MA'),
  salesperson: s.salesperson?.name || 'N/A',
  paymentMethod: s.paymentMethod || 'N/A',
}))
```

Pass `salesForDashboard` as the `sales` prop to `<SalesDashboardClient sales={salesForDashboard} />`.

If no sales exist, the component should show an empty state.

- [ ] **Step 3: Commit**

```bash
git add src/features/sales/sales-dashboard-client.tsx src/app/sales/page.tsx
git commit -m "fix: wire sales dashboard to real database data"
```

---

### Task 13: Repeat pattern for remaining feature dashboards

Apply the same pattern (props interface, server-side fetch, pass as props) for each remaining feature dashboard. Each task follows the exact same structure as Task 12.

**Files to modify (pairs of server page + client component):**

- [ ] **Step 1: Purchases dashboard**
  - `src/features/purchases/purchases-dashboard-client.tsx` — Remove `PURCHASES` (37-43) and `TOP_SUPPLIERS` (45-51), accept as props
  - `src/app/purchases/page.tsx` — Fetch from `purchaseRepository`

- [ ] **Step 2: Commissioners dashboard**
  - `src/features/commissioners/commissioners-dashboard-client.tsx` — Remove `TOP_BROKERS` (30-36) and `CHANNELS` (44-49), accept as props
  - `src/app/commissioners/page.tsx` — Fetch commissioner stats from DB

- [ ] **Step 3: Deliveries dashboard**
  - `src/features/deliveries/deliveries-dashboard-client.tsx` — Remove `UPCOMING_DELIVERIES` (30-36) and `DELIVERIES_TABLE` (51-57), accept as props
  - `src/app/deliveries/page.tsx` — Fetch from sales with delivery status

- [ ] **Step 4: Contacts dashboard**
  - `src/features/contacts/contacts-dashboard-client.tsx` — Remove `CONTACTS` (35-44), accept as props
  - `src/app/contacts/page.tsx` — Fetch from `contactRepository`

- [ ] **Step 5: Leads dashboard**
  - `src/features/leads/leads-dashboard-client.tsx` — Remove `PIPELINE_STAGES` (60-109) and `STATIC_LEADS_DATA` (128-213), accept as props
  - `src/app/leads/page.tsx` — Fetch from `leadRepository` with pipeline aggregation

- [ ] **Step 6: Clients dashboard**
  - `src/features/clients/clients-dashboard-client.tsx` — Remove `CLIENTS` (39-45), `REGIONS` (47-54), `TOP_CLIENTS` (56-62), accept as props
  - `src/app/clients/page.tsx` — Fetch from `contactRepository`

- [ ] **Step 7: Users dashboard**
  - `src/features/users/users-dashboard-client.tsx` — Remove `USERS_LIST` (30-39), accept as props
  - `src/app/users/page.tsx` — Fetch from `prisma.user.findMany()`

- [ ] **Step 8: Appointments dashboard**
  - `src/features/appointments/appointments-dashboard-client.tsx` — Remove `RAPPELS_ITEMS` (50-55), hardcoded KPIs (131-178), advisor dropdown (380-383), workshop bays (369-372), accept as props
  - `src/app/appointments/page.tsx` — Fetch from DB + pass personnel list

- [ ] **Step 9: Run typecheck and tests after all changes**

Run: `npx tsc --noEmit && npx vitest run`
Expected: All pass

- [ ] **Step 10: Commit**

```bash
git add src/features/ src/app/purchases/ src/app/commissioners/ src/app/deliveries/ src/app/contacts/ src/app/leads/ src/app/clients/ src/app/users/ src/app/appointments/
git commit -m "fix: wire all feature dashboards to real database data, remove mock arrays"
```

---

## Phase 6: Remaining Component Hardcoding

### Task 14: Fix sale-workflow-client default user

**Files:**
- Modify: `src/components/sales/sale-workflow-client.tsx:91-97`

- [ ] **Step 1: Replace hardcoded fallback user**

Lines 91-97: Replace the hardcoded `initialCurrentUser` fallback:

```typescript
initialCurrentUser || {
  id: '',
  name: 'Utilisateur',
  email: '',
  role: '',
  isSuperAdmin: false,
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sales/sale-workflow-client.tsx
git commit -m "fix: remove hardcoded default user from sale workflow"
```

---

### Task 15: Fix vehicle-lifecycle-timeline fallback

**Files:**
- Modify: `src/components/vehicles/vehicle-lifecycle-timeline.tsx:91-92`

- [ ] **Step 1: Replace hardcoded fallbacks**

Line 91: `'Super Admin'` → `currentUserRole || 'Utilisateur'`
Line 92: `'Adem Maalal'` → `currentUserName || 'Utilisateur'`

- [ ] **Step 2: Commit**

```bash
git add src/components/vehicles/vehicle-lifecycle-timeline.tsx
git commit -m "fix: remove hardcoded user name from vehicle lifecycle timeline"
```

---

### Task 16: Fix data export modal mock CSV

**Files:**
- Modify: `src/components/modals/data-export-modal.tsx:48-58`

- [ ] **Step 1: Replace mock CSV with dynamic fetch**

Replace the hardcoded CSV strings (lines 48-58) with a fetch to the relevant API that generates real CSV content. Alternatively, show a "Télécharger" button that calls an export API endpoint:

```typescript
// Instead of hardcoded CSV, fetch from API on export
const handleExport = async (type: string) => {
  const res = await fetch(`/api/export/${type}`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
```

If the export API doesn't exist yet, create a simple one that queries the DB and generates CSV.

- [ ] **Step 2: Commit**

```bash
git add src/components/modals/data-export-modal.tsx
git commit -m "fix: replace mock CSV export data with real database export"
```

---

### Task 17: Fetch vehicle brands dynamically

**Files:**
- Modify: `src/app/vehicles/page.tsx:75-87`

- [ ] **Step 1: Replace hardcoded brands with DB query**

Remove the static `brands` array (lines 75-87). Fetch distinct brands from the database:

```typescript
const distinctBrands = await prisma.vehicle.findMany({
  where: { archivedAt: null },
  select: { brand: true },
  distinct: ['brand'],
  orderBy: { brand: 'asc' },
})

const brands = ['Toutes', ...distinctBrands.map((v) => v.brand)]
```

- [ ] **Step 2: Commit**

```bash
git add src/app/vehicles/page.tsx
git commit -m "fix: fetch vehicle brands dynamically from database"
```

---

### Task 18: Final verification

- [ ] **Step 1: Run full quality gate**

```bash
npm run verify
```

This runs: `tsc --noEmit` + `eslint` + `vitest run` + `next build`

Expected: All pass with zero errors.

- [ ] **Step 2: Manual smoke test**

Open `http://localhost:3000` and verify:
1. Sidebar shows real user name and dynamic badge counts
2. Topbar shows real user identity and real parks
3. Dashboard shows empty charts or real data (not fake 6-month financials)
4. `/invoices/new` has empty form fields (no "Imane Zahiri")
5. `/appointments/new` has empty form fields (no "Sami Martin")
6. `/financing/new` has empty form fields (no "Yassine Benali")
7. `/leads/new` has empty form fields (no "Yanis Bennani")
8. `/clients/new` has empty form fields (no "Thomas Bernard")
9. Feature dashboards show empty states or real data
10. Vehicle brands filter shows brands from actual DB inventory

- [ ] **Step 3: Final commit if any remaining fixes**

```bash
git add -A
git commit -m "fix: final cleanup after hardcoded data removal audit"
```
