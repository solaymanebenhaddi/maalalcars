# MVP Scope Reduction — Design Spec

**Date:** 2026-09-03
**Source:** `docs/architecture/OFFECIAL-ARCH.md`
**Principle:** Deactivate, don't delete. Reduce the visible app to a focused vehicle-park operating system.

---

## 0. Critical Architectural Rule

**Feature flags control user-facing modules, navigation, routes, and optional widgets. They must NOT deactivate underlying domain services or relational data required by active MVP workflows.**

Even when a module's UI is hidden, its backend services remain operational if referenced by an active workflow. Examples:

- `payments` UI is hidden, but the Payment model is used internally when recording sale/reservation advances
- `purchases` UI is hidden, but purchase data is persisted when adding a vehicle
- `expenses` UI is hidden, but repair costs are stored as vehicle-related expenses
- `stock` UI is hidden, but vehicle counts and stock calculations power the dashboard
- `documents` service remains active for vehicle photo/document uploads

The feature flag system gates **user navigation and UI visibility only**. It never short-circuits service-layer calls or repository queries.

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

Routes `/dashboard` and `/login` are always feature-allowed (not gated by feature flags).

`/settings` is always feature-allowed but **admin-protected**: the server-side permission model must enforce that only admin-role users can access it. "Always allowed" means feature-gating does not block it, not that every authenticated user has access.

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

### Schema

The existing `WorkshopOrder` model is too complex for the MVP (technician assignments, workshop bays, parts lists, progress percent, etc.). We create a new lightweight `Repair` model alongside it. `WorkshopOrder` stays untouched for future reactivation.

```prisma
model Repair {
  id              String    @id @default(cuid())
  code            String    @unique // REP-2026-0001
  vehicleId       String
  vehicle         Vehicle   @relation(fields: [vehicleId], references: [id], onDelete: Restrict)

  repairType      String    // MECANIQUE, CARROSSERIE, ELECTRICITE, PNEUMATIQUES, CLIMATISATION, ENTRETIEN, NETTOYAGE, AUTRE
  description     String?
  garageName      String?   // Garage / réparateur

  startedAt       DateTime  @default(now())
  estimatedAmount Float?    // DH

  finalAmount     Float?    // DH — filled on completion
  paidById        String?   // FK to User — null at creation, set on completion
  paidBy          User?     @relation(fields: [paidById], references: [id], onDelete: SetNull)
  completedAt     DateTime? // filled on completion

  status          String    @default("EN_COURS") // EN_COURS, TERMINEE, ANNULEE
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

A `repairs Repair[]` relation must be added to the `Vehicle` model.

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

### Schema

The existing `Reservation` model requires `contactId` (FK to `Contact`). Since the MVP must work without the CRM/Contact module, we add client snapshot columns so the reservation is self-contained. The existing `contactId` becomes optional.

Schema changes to existing `Reservation` model:

```
contactId       String?   // Make optional (was required)

// Add client snapshot columns:
clientName      String    // Nom complet
clientPhone     String    // Téléphone
clientCin       String?   // CIN
clientAddress   String?   // Adresse
```

The existing fields are already sufficient for the rest:
- `depositAmount` (Float) → advance amount
- `paymentMethod` (String) → payment method
- `startDate` (DateTime) → reservation date
- `expiryDate` (DateTime) → expiration date
- `status` (String) → lifecycle status
- `notes` (String?) → remarks
- `convertedSaleId` → link to converted sale

Status values change from `ACTIVE, EXPIRING, EXPIRED, CANCELLED, CONVERTED` to `ACTIVE, EXPIREE, ANNULEE, CONVERTIE_EN_VENTE` for consistency with the French MVP. Existing seed data must be migrated.

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

A centralized `expireDueReservations()` function checks for any reservation past its expiration date with status `ACTIVE`, updates it to `EXPIREE`, and returns the vehicle to `EN_STOCK`.

This function is called before every availability-sensitive operation:
- Vehicle availability lookup
- Reservation creation
- Sale creation
- Vehicle detail page load
- Vehicle list page load
- Dashboard load

This ensures correctness even when no user has opened the dashboard. Later, when the application has a server/worker environment, this can become a scheduled task.

---

## 10. Sales

### Two entry points — same form

- **Direct sale:** Vehicle card or detail → "Vendre"
- **Reservation conversion:** Reservation → "Convertir en vente" (pre-fills client + advance)

### Sale Form Sections

**A. Véhicule (read-only):** Name, matricule, VIN, kilométrage, couleur, date d'entrée, prix d'achat.

**B. Acheteur:** Nom complet, Téléphone, CIN, Adresse (optional). Documents client (multiple upload): CIN Recto, CIN Verso, Permis, Passeport, Contrat signé, Autre.
*Note : Tout comme pour les réservations, `buyerContactId` devient optionnel (`String?`) pour permettre la vente sans dépendance au module CRM/Contacts.*

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

### Financial Truth — Use Existing Payment Model

Sale money handling reuses the existing `Payment` model internally, even though the Payments UI module is hidden. This avoids duplicating financial truth across Sale fields.

**Reservation converted to sale example:**

```
Reservation advance: 10 000 DH
  → Payment record: type=INFLOW, amount=10000, method=ESPECES, saleId=...

At sale: customer pays 190 000 DH
  → Payment record: type=INFLOW, amount=190000, method=VIREMENT, receivedBy=Mohamed, saleId=...

Sale price: 250 000 DH
Total received: 200 000 DH (sum of Payment records)
Remaining: 50 000 DH
```

The Sale record stores `salePrice` and links to its `payments Payment[]` relation. The advance from a reservation is carried forward as a Payment record linked to the new Sale. The UI shows the simplified view (prix de vente, avance, montant reçu) but the backend writes proper Payment records.

The `receivedById` field on Sale stores who received the money at the point of sale. Each Payment record also has its own `receivedBy` for auditability.

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

### Business Invariants (Enforced at Service Level)

These rules must be enforced as strict service-layer constraints:

1. **Only one ACTIVE reservation per vehicle.** A vehicle cannot have multiple concurrent active reservations.
2. **Only one EN_COURS repair per vehicle.** A vehicle cannot enter a second repair while already in repair.
3. **Cannot reserve an EN_REPARATION vehicle.** Must complete or cancel the repair first.
4. **Cannot repair a RESERVE vehicle.** Must cancel the reservation first.
5. **Cannot directly sell a RESERVE vehicle.** The user must use "Convertir en vente" to preserve the client identity and advance.
6. **Cannot sell an EN_REPARATION vehicle.** Must return to stock first.
7. **Cannot create another sale for VENDU.** A sold vehicle cannot be resold.
8. **Cannot convert an expired or cancelled reservation.** Only `ACTIVE` reservations can be converted to sale.
9. **A VENDU vehicle is terminal.** Once sold, no status changes or operational actions are permitted.

### Implementation

A `VehicleStateMachine` service with `transition(vehicleId, fromStatus, toStatus)`. Validates the transition, updates the vehicle, creates an audit log entry. All repair, reservation, and sale operations call this service.

---

## 12. Prisma Schema Changes

### New models

1. **`FeatureFlag`** (as described in Section 1):
   - `id`, `key` (@unique), `label`, `description`, `enabled`, `category`, `sortOrder`.

2. **`Repair`** (as described in Section 8):
   - `id`, `code` (@unique, e.g. REP-2026-0001), `vehicleId` (FK to Vehicle), `repairType`, `description`, `garageName`, `startedAt`, `estimatedAmount`, `finalAmount`, `paidById` (FK to User, nullable at creation), `completedAt`, `status` (default "EN_COURS"), `notes`.
   - Add `repairs Repair[]` relation to `Vehicle`.

### Modified — Reservation record

Update existing `Reservation` model:

```prisma
contactId       String?   // Changed from required to optional

// Add client snapshot columns:
clientName      String    // Nom complet
clientPhone     String    // Téléphone
clientCin       String?   // CIN
clientAddress   String?   // Adresse
```

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

Update existing `Sale` model:

```prisma
buyerContactId      String?   // Changed from required to optional

// Add buyer + sale commissioner + financial columns:
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

All existing models (Contact, Supplier, Commissioner, WorkshopOrder, etc.) remain in the schema. They are not exposed in the MVP UI but preserved for future reactivation.

---

## 13. Implementation Order

Each step must pass `npm run verify` before moving to the next.

1. Schema migration — `FeatureFlag` model, `Repair` model, plus snapshot columns on `Purchase`, `Sale`, and `Reservation`
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
