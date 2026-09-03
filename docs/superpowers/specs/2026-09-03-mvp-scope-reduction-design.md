# MVP Scope Reduction — Design Spec

**Date:** 2026-09-03
**Source:** `docs/architecture/OFFECIAL-ARCH.md`
**Principle:** Deactivate, don't delete. Reduce the visible app to a focused vehicle-park operating system.

---

## 1. Feature Flag System (Database-Driven)

### Prisma Model

```prisma
model FeatureFlag {
  id          String   @id @default(cuid())
  key         String   @unique
  label       String
  description String?
  enabled     Boolean  @default(false)
  category    String   // "core", "finance", "crm", "services", "marketing", "system"
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Seed Data

**Enabled:** `dashboard`, `vehicles`, `repairs`, `reservations`, `sales`, `documents`, `settings`

**Disabled:** `financing`, `marketing`, `workshopAdvanced`, `reportsAdvanced`, `invoices`, `crmAdvanced`, `warranties`, `insurance`, `integrations`, `tasks`, `communications`, `leads`, `appointments`, `evaluations`, `contracts`, `registrations`, `archives`, `helpdesk`, `notifications`, `sav`, `deliveries`, `purchases`, `buyers`, `sellers`, `commissioners`, `suppliers`, `clients`, `finance`, `payments`, `regularizations`, `expenses`, `balances`, `stock`, `listings`

### API

- `GET /api/features` — returns all flags (cached, public)
- `PATCH /api/features/:key` — toggles a flag (admin-only)

### Client Hook

`useFeatures()` hook fetches flags once at app load, caches in React context via `FeaturesProvider`. Components and sidebar consume it.

### Route Protection

A `FeatureGate` component in the root app layout maps route prefixes to feature keys. If the current route's module is disabled, it renders a "Module désactivé" page with a link back to the dashboard.

Routes `/dashboard`, `/login`, and `/settings` are always allowed.

---

## 2. Sidebar & Navigation

### Regular Users

```
MAALAL CARS

Tableau de bord          /dashboard
Véhicules               /vehicles
+ Ajouter un véhicule   /vehicles/new

──────────────
Déconnexion
```

### Admin Users (additional)

```
Paramètres              /settings
```

### Implementation

Each nav item in `sidebar.tsx` gets a `featureKey` property. The sidebar reads from `useFeatures()` and only renders items whose feature is enabled. No items are deleted from the code. The topbar also respects feature flags for quick actions and search domains.

---

## 3. "Module Désactivé" Component

Location: `src/components/shared/module-disabled.tsx`

Displays when a user navigates to a disabled route via direct URL or stale bookmark. Disabled modules do not appear in the sidebar at all — this is a safety net only.

Content:
- Title: "Ce module n'est pas encore disponible"
- Description: "Ce module est actuellement désactivé. Contactez votre administrateur pour l'activer."
- Button: "Retour au tableau de bord" → `/dashboard`

---

## 4. Dashboard

### KPI Cards (top row)

| Label | Value |
|---|---|
| Véhicules en stock | count |
| Réservés | count |
| En réparation | count |
| Vendus ce mois | count |

### Sections

| Section | Content |
|---|---|
| Etat du parc | Visual showing stock / réservés / en réparation counts |
| Derniers véhicules ajoutés | 5 most recent vehicles |
| Réservations à surveiller | Reservations expiring soon |
| Réparations en cours | Active repairs with vehicle name and garage |
| Dernières ventes | Recent completed sales |

### Quick Actions

```
+ Ajouter un véhicule
Voir le parc
Voir les réservations
Voir les réparations
```

Each dashboard widget has a `featureKey`. The dashboard filters widgets through `useFeatures()`. When modules are reactivated later, their widgets reappear automatically.

---

## 5. Vehicle List Page (`/vehicles`)

### Tab-based status filtering

```
Tous | En stock | Réservés | En réparation | Vendus
```

Each tab filters by status. Count badge per tab.

### Vehicle Cards

```
[PHOTO]
Volkswagen Tiguan 2023
Automatique · Diesel · 84 000 km
Matricule: XXXXX-A-X
EN STOCK
```

### Status-dependent quick actions

| Status | Actions |
|---|---|
| En stock | Réparation, Réserver, Vendre, Voir fiche |
| Réservé | Voir réservation, Annuler, Convertir en vente, Voir fiche |
| En réparation | Voir réparation, Mettre à jour, Voir fiche |
| Vendu | Voir vente, Voir fiche |

---

## 6. Add Vehicle Form (`/vehicles/new`)

### Section A — Informations véhicule

Marque, Modèle, Type, Année, Couleur, Transmission, Carburant, Kilométrage, Matricule, VIN / Numéro de châssis, Date d'entrée, Prix d'achat, Remarques.

### Section B — Fournisseur (snapshot)

Inline columns on the purchase/vehicle record:

- `supplierName` — Nom complet
- `supplierPhone` — Téléphone
- `supplierCin` — CIN
- `supplierAddress` — Adresse

### Section C — Commissionnaire d'achat (optional)

Toggle: "Commissionnaire impliqué ? Oui / Non"

If yes, inline columns:

- `commissionerName`, `commissionerPhone`, `commissionerCin`, `commissionerAddress`
- `commissionAmount` (Float, DH)
- `commissionPaidById` (FK to User — personnel dropdown)

### Section D — Photos & Documents

**Photos:** Multiple upload, main/cover selection, preview, delete, reorder. Uses existing `STORAGE_CONFIG` and local filesystem.

**Documents:** Type dropdown (Carte grise, Document d'achat, CIN fournisseur, Procuration, Contrat, Autre) + file upload + optional note.

---

## 7. Vehicle Detail Page (`/vehicles/:id`)

### Header

```
Volkswagen Tiguan 2023
EN STOCK
Matricule: XXXXX-A-X | VIN: ...
```

Action buttons change based on vehicle status (same logic as vehicle cards).

### Tabs

```
Aperçu | Achat | Réparations | Réservation | Vente | Photos & Documents | Historique
```

| Tab | Content |
|---|---|
| Aperçu | Vehicle info summary, current status, key dates |
| Achat | Purchase price, supplier snapshot, commissioner snapshot |
| Réparations | List of repairs with status, cost, garage |
| Réservation | Current or past reservation details |
| Vente | Sale details if sold |
| Photos & Documents | Gallery + document list with upload |
| Historique | Activity timeline (existing audit system) |

---

## 8. Repairs

### Add Repair — Modal

Fields:
- Véhicule (pre-selected, read-only)
- Type de réparation: Mécanique, Carrosserie, Electricité, Pneumatiques, Climatisation, Entretien, Nettoyage / préparation, Autre
- Description
- Date de sortie / début
- Garage / réparateur
- Montant estimé
- Remarques

**"Qui a payé ?" does NOT appear at creation.** `paidById = null`.

### Complete/Update Repair — Modal

- Coût final
- Qui a payé ? → Personnel dropdown
- Date de fin
- Notes

### Repair Status Lifecycle

```
EN_COURS → TERMINEE
EN_COURS → ANNULEE
```

**Side effects:**
- Created → Vehicle becomes `EN_REPARATION`
- Completed → Vehicle returns to `EN_STOCK`
- Cancelled → Vehicle returns to `EN_STOCK`

---

## 9. Reservations

### Create Reservation — Modal

Fields:
- Véhicule (pre-selected, read-only)
- Client: Nom complet, Téléphone, CIN, Adresse (optional)
- Montant de l'avance (DH)
- Mode de paiement
- Date de réservation
- Date d'expiration (free date picker with quick presets: +1j, +3j, +7j, Personnalisé)
- Remarques

### Reservation Status Lifecycle

```
ACTIVE → EXPIREE          (automatic on date)
ACTIVE → ANNULEE          (manual action)
ACTIVE → CONVERTIE_EN_VENTE  (manual conversion)
```

**Side effects:**
- Created → Vehicle becomes `RESERVE`
- Cancelled/Expired → Vehicle returns to `EN_STOCK`
- Converted → Vehicle becomes `VENDU`

### Expiration Handling

A check runs when the dashboard or vehicle list loads: any reservation past its expiration date with status `ACTIVE` gets automatically updated to `EXPIREE` and the vehicle returns to `EN_STOCK`.

---

## 10. Sales

### Two entry points — same form

- **Direct sale:** Vehicle card or detail → "Vendre"
- **Reservation conversion:** Reservation → "Convertir en vente" (pre-fills client + advance)

### Sale Form Sections

**A. Véhicule (read-only):** Name, matricule, VIN, kilométrage, couleur, date d'entrée, prix d'achat.

**B. Acheteur:** Nom complet, Téléphone, CIN, Adresse (optional). Documents client (multiple upload): CIN Recto, CIN Verso, Permis, Passeport, Contrat signé, Autre.

**C. Commissionnaire de vente (optional, independent from purchase):**
Toggle Oui/Non. If yes: Nom, Téléphone, CIN, Adresse, Commission (DH), Commission payée par → Personnel dropdown. Stored as inline columns on Sale record.

**D. Informations financières:**
- Prix de vente (DH)
- Avance déjà reçue (DH) — auto-filled from reservation, 0 otherwise
- Montant reçu à la vente (DH)
- Mode de paiement: Espèces, Virement bancaire, Chèque, Paiement mixte, Autre
- Argent récupéré par → Personnel dropdown
- Date de vente
- Notes

**Side effect:** Vehicle becomes `VENDU`.

---

## 11. Vehicle State Machine

### Valid Transitions

```
EN_STOCK → RESERVE              (reservation created)
EN_STOCK → EN_REPARATION        (repair created)
EN_STOCK → VENDU                (direct sale)
RESERVE → EN_STOCK              (reservation cancelled/expired)
RESERVE → VENDU                 (reservation converted to sale)
EN_REPARATION → EN_STOCK        (repair completed/cancelled)
```

### Blocked Transitions

Any transition not listed above is rejected:
- `VENDU → anything` — sold car cannot change status
- `EN_REPARATION → VENDU` — must return to stock first
- `RESERVE → EN_REPARATION` — must cancel reservation first

### Implementation

A `VehicleStateMachine` service with `transition(vehicleId, fromStatus, toStatus)`. Validates the transition, updates the vehicle, creates an audit log entry. All repair, reservation, and sale operations call this service.

---

## 12. Prisma Schema Changes

### New model

`FeatureFlag` (as described in Section 1).

### Modified — Purchase/Vehicle record

Add supplier + purchase commissioner snapshot columns:

```
supplierName        String?
supplierPhone       String?
supplierCin         String?
supplierAddress     String?
commissionerName    String?
commissionerPhone   String?
commissionerCin     String?
commissionerAddress String?
commissionAmount    Float?
commissionPaidById  String?  → FK to User
```

### Modified — Sale record

Add buyer + sale commissioner + financial columns:

```
buyerName           String
buyerPhone          String
buyerCin            String
buyerAddress        String?
commissionerName    String?
commissionerPhone   String?
commissionerCin     String?
commissionerAddress String?
commissionAmount    Float?
commissionPaidById  String?  → FK to User
receivedById        String   → FK to User
paymentMethod       String
reservationId       String?  → FK to Reservation
advanceAmount       Float    @default(0)
```

### Existing models untouched

All existing models (Contact, Supplier, Commissioner, etc.) remain in the schema. They are not exposed in the MVP UI but preserved for future reactivation.

---

## 13. Implementation Order

Each step must pass `npm run verify` before moving to the next.

1. Schema migration — FeatureFlag model + supplier/commissioner snapshot columns on Purchase and Sale
2. Seed feature flags (enabled/disabled per MVP spec)
3. Feature flag API (`GET /api/features`, `PATCH /api/features/:key`)
4. `useFeatures()` hook + `FeaturesProvider` context
5. `FeatureGate` route protection + "Module désactivé" component
6. Sidebar wired to feature flags
7. Dashboard rebuilt for active-feature-only KPIs and widgets
8. Vehicle list page with tab-based status filtering
9. Vehicle cards with status-dependent quick actions
10. Vehicle state machine service with transition validation
11. Add vehicle form (4 sections: info, supplier, commissioner, photos/docs)
12. Vehicle detail page with restructured tabs
13. Repair modal (create + complete/update)
14. Reservation modal (create + cancel + expire)
15. Sale form (direct + reservation conversion with financial carry-forward)
