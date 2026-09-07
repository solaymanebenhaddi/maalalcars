Yes. The scope is now much clearer: **we should not rebuild Maalal Cars or delete the advanced system**. We should reduce the visible/active product to a focused operational MVP while preserving the existing architecture so advanced modules can be reactivated later.

## Refactored Maalal Cars MVP Scope

### 1. Core principle

For the current phase, Maalal Cars should answer only a few operational questions:

> What cars do we currently have?
> Which cars are reserved?
> Which cars are under repair?
> Which cars have already been sold?
> What did each car cost us?
> Who supplied it?
> Was a commissioner involved?
> What happened to the car since it entered the park?
> Who bought it and how was the sale handled?

Everything else should be temporarily disabled from the user-facing application.

---

# 2. Do not delete existing advanced modules

The existing application is already advanced, so I strongly recommend:

**Deactivate, don't remove.**

Use a central feature configuration such as:

```ts
features = {
  dashboard: true,
  vehicles: true,
  repairs: true,
  reservations: true,
  sales: true,
  documents: true,

  financing: false,
  marketing: false,
  workshopAdvanced: false,
  reportsAdvanced: false,
  invoices: false,
  crmAdvanced: false,
  warranties: false,
  insurance: false,
  integrations: false,
  tasks: false,
  communications: false,
  // ...
}
```

This configuration should control:

* Sidebar navigation
* Dashboard widgets
* Quick actions
* Routes
* Search domains
* Notifications
* Available actions

That way, later we can reactivate features without rebuilding them.

---

# 3. Active application structure

For this phase, keep only:

```text
Authentication
      ↓
Dashboard
      ↓
Véhicules
 ├── Parc actuel
 ├── Réservés
 ├── En réparation
 └── Vendus

Vehicle Details
 ├── Informations
 ├── Achat
 ├── Réparations
 ├── Réservation
 ├── Vente
 ├── Photos
 └── Documents
```

And the operational actions:

```text
Ajouter véhicule

Ajouter réparation

Réserver

Annuler réservation

Convertir réservation → vente

Vendre directement
```

This should become the entire visible MVP.

---

# 4. Authentication

The existing authentication remains.

After a successful login:

```text
Login
  ↓
Dashboard
```

No extra onboarding or complex navigation is needed.

---

# 5. Dashboard

The dashboard must now be **dynamic according to active features**.

Since only vehicles, repairs, reservations and sales are active, it should focus exclusively on those.

### Main KPIs

For example:

```text
Véhicules en stock        18

Réservés                   4

En réparation              3

Vendus ce mois             7
```

And perhaps:

```text
Valeur actuelle du stock

Véhicules entrés ce mois

Réservations arrivant à expiration

Réparations en cours
```

### Dashboard content

Keep it operational rather than overloaded:

**État du parc**

```text
En stock       18
Réservés        4
En réparation   3
```

**Derniers véhicules ajoutés**

**Réservations à surveiller**

**Réparations en cours**

**Dernières ventes**

### Quick actions

```text
+ Ajouter un véhicule

Voir le parc

Voir les réservations

Voir les réparations
```

No widgets from disabled modules should remain visible.

---

# 6. Main Vehicles / Park page

This becomes the most important page.

## `/vehicles`

At the top, use tabs:

```text
Parc actuel
Réservés
En réparation
Vendus
```

### Parc actuel

Contains all vehicles physically belonging to Maalal Cars and still available.

Relevant statuses:

```text
EN STOCK
RÉSERVÉ
EN RÉPARATION
```

### Sold tab

Contains:

```text
VENDU
```

This keeps the operational stock separate from historical sold vehicles.

---

# 7. Vehicle cards

Each vehicle card should immediately show:

```text
[PHOTO]

Volkswagen Tiguan
2023

Automatique • Diesel
84 000 km

Matricule
XXXXX-A-X

EN STOCK
```

And the appropriate quick actions.

### If in stock

```text
Réparation
Réserver
Vendre
Voir fiche
```

### If reserved

```text
Voir réservation
Annuler réservation
Convertir en vente
Voir fiche
```

### If under repair

```text
Voir réparation
Mettre à jour
Voir fiche
```

### If sold

```text
Voir vente
Voir fiche
```

The available actions must depend on the current status.

---

# 8. Add New Vehicle

## `/vehicles/new`

The form should be considerably simpler than the advanced version.

I would divide it into **four clear sections**.

---

## A. Vehicle information

Required/basic vehicle information:

```text
Marque
Modèle
Type
Année
Couleur
Transmission
Carburant
Kilométrage
Matricule
VIN / numéro de châssis
Date d'entrée
Prix d'achat
Remarques
```

Additional existing vehicle fields can remain if already implemented and useful, but don't overload the MVP form unnecessarily.

---

# 9. Supplier information

Important architectural decision:

### Supplier is NOT a reusable entity.

Do not create:

```text
Supplier table
Supplier profile
Supplier CRM
Supplier history
```

For this MVP, supplier information belongs directly to the vehicle purchase.

Store a **snapshot**:

```text
Fournisseur

Nom complet
Adresse
Téléphone
CIN
```

Example:

```text
Fournisseur

Nom:
Mohamed El Amrani

Téléphone:
06 12 34 56 78

CIN:
BK123456

Adresse:
Casablanca
```

This is sufficient.

---

# 10. Purchase commissioner

A purchase can optionally involve a commissioner.

Again, for this phase, I would **not make the commissioner a CRM entity**.

Use a transaction snapshot.

### Commissioner purchase information

```text
Commissionnaire impliqué ?
[Oui / Non]
```

If yes:

```text
Nom
Téléphone
CIN
Adresse

Commission
```

The commission should be stored in DH.

Example:

```text
Commission:
5 000 DH
```

Then:

### Who paid the commissioner?

```text
Commission payée par
[Personnel Maalal Cars]
```

This should preferably be a selection from company personnel/users rather than free text.

Example:

```text
Commissionnaire:
Ahmed Benali

Commission:
5 000 DH

Payé par:
Youssef Maalal
```

---

# 11. Vehicle photos

During vehicle creation:

```text
Photos du véhicule
```

Support:

* Multiple photos
* Main/cover photo
* Upload
* Preview
* Delete before saving
* Reorder if already available

Example:

```text
[ Main photo ]

[photo] [photo] [photo] [photo]

+ Ajouter des photos
```

---

# 12. Legal documents

During vehicle creation, the user can upload legal documents.

Keep this simple.

Possible documents:

```text
Carte grise
Document d'achat
CIN fournisseur
Procuration
Contrat
Autre
```

Each document can contain:

```text
Type
File
Optional note
```

No need for the complete advanced Document Center workflow in this phase.

The files should simply appear under the vehicle.

---

# 13. Vehicle detail page

## `/vehicles/:id`

This becomes the central record of the vehicle.

Header example:

```text
Volkswagen Tiguan 2023

EN STOCK

Matricule: XXXXX-A-X
VIN: ...
```

Quick actions:

```text
Ajouter réparation
Réserver
Vendre
Modifier
```

Then tabs:

```text
Aperçu
Achat
Réparations
Réservation
Vente
Photos & Documents
Historique
```

The displayed actions/tabs can adapt according to vehicle status.

---

# 14. Repairs

A vehicle can leave the park temporarily for repair.

The repair should belong directly to a vehicle.

From the vehicle card:

```text
Réparation
```

or from vehicle detail:

```text
+ Ajouter une réparation
```

This opens a modal.

---

# 15. Add Repair Modal

When creating the repair:

```text
Véhicule
```

Preselected automatically.

Then:

```text
Type de réparation
Description
Date de sortie / début
Garage / réparateur
Montant estimé ou coût
Remarques
```

Potential repair types:

```text
Mécanique
Carrosserie
Électricité
Pneumatiques
Climatisation
Entretien
Nettoyage / préparation
Autre
```

### Important requirement

You specified:

> "Qui a payé ?" should NOT appear during creation.

Correct.

At creation:

```text
paid_by = null
```

When the repair is later updated/completed, show:

```text
Coût final
Qui a payé ?
Date de fin
Notes
```

`Qui a payé ?` should select company personnel.

---

# 16. Repair status

I recommend this very small lifecycle:

```text
EN COURS
TERMINÉE
ANNULÉE
```

When a repair starts:

```text
Vehicle status → EN RÉPARATION
```

When completed:

```text
Vehicle status → EN STOCK
```

Unless the vehicle has another valid overriding state.

For example, the system should prevent impossible combinations like:

```text
VENDU + EN RÉPARATION
```

without an explicit workflow.

---

# 17. Reservations

A car in stock can be reserved.

From card:

```text
Réserver
```

This opens the reservation form.

---

# 18. Reservation information

### Vehicle

Automatically selected.

### Client

For this phase, client data can also be stored as a snapshot inside the reservation unless we deliberately reuse the existing Contact model.

Required:

```text
Nom complet
Téléphone
CIN
Adresse (optional)
```

Then:

```text
Montant de l'avance
Mode de paiement
Date de réservation
Date d'expiration
Remarques
```

---

# 19. Custom reservation period

The user decides the expiration.

Do NOT hardcode:

```text
3 days
7 days
15 days
```

Allow:

```text
Date début
Date expiration
```

Optionally provide quick presets:

```text
+1 jour
+3 jours
+7 jours
Personnalisé
```

But the final expiration date must remain customizable.

---

# 20. Reservation status

Use:

```text
ACTIVE
EXPIRÉE
ANNULÉE
CONVERTIE_EN_VENTE
```

When active:

```text
Vehicle → RÉSERVÉ
```

When cancelled:

```text
Vehicle → EN STOCK
```

When expired:

```text
Vehicle → EN STOCK
```

When converted:

```text
Reservation → CONVERTIE_EN_VENTE
Vehicle → VENDU
```

---

# 21. Reservation actions

From the reserved car:

```text
Voir réservation
```

Then:

```text
Annuler réservation

Convertir en vente
```

These are the only important actions needed now.

---

# 22. Reservation → Sale

When converting a reservation into a sale:

Automatically prefill:

```text
Vehicle

Client
Nom
Téléphone
CIN

Advance already paid
```

The user should not need to re-enter these values.

The advance must be preserved as part of the transaction.

### Recommended behavior

If:

```text
Prix de vente = 250 000 DH

Avance réservation = 10 000 DH
```

then sale should know:

```text
Déjà reçu = 10 000 DH
```

This avoids losing financial information.

---

# 23. Direct Sale

A vehicle can also be sold without reservation.

The user can trigger it from:

### Vehicle card

```text
Vendre
```

or:

### Vehicle detail

```text
Vendre le véhicule
```

Both actions should open the same sale workflow.

---

# 24. Sale — Vehicle information

The sale screen must clearly show the concerned vehicle.

Example:

```text
Volkswagen Tiguan 2023

Matricule
VIN
Kilométrage
Couleur
Date d'entrée
Prix d'achat
```

These values should be read-only within the sale.

---

# 25. Sale — Customer information

Required buyer information:

```text
Nom complet
Téléphone
CIN
Adresse (optional)
```

Then allow uploading customer documents.

### Documents client

Examples:

```text
CIN Recto
CIN Verso
Permis
Passeport
Contrat signé
Autre
```

Support multiple uploads.

---

# 26. Sale Commissioner

A sale may have a commissioner.

Again:

```text
Commissionnaire ?
Oui / Non
```

If yes:

```text
Nom
Téléphone
CIN
Adresse
Commission
```

Then:

```text
Commission payée par
[Personnel]
```

This mirrors the purchase-side commissioner concept.

Important: purchase commissioner and sale commissioner are **independent**.

A vehicle could therefore have:

```text
Commission achat:
3 000 DH

Commission vente:
4 500 DH
```

They must not overwrite one another.

---

# 27. Sale financial information

Required:

```text
Prix de vente
```

If reservation existed:

```text
Avance déjà reçue
```

Then:

```text
Montant reçu à la vente
```

Although you didn't explicitly request multiple future payments here, I recommend preserving the existing payment architecture internally while keeping this UI simple.

That gives future flexibility without exposing complexity now.

---

# 28. Who received the money?

Required:

```text
Argent récupéré par
```

This should select a company personnel member.

Example:

```text
Argent récupéré par:
Mohamed Maalal
```

This is different from:

```text
Commission payée par
```

Do not confuse the two.

---

# 29. Payment method

Required:

```text
Mode de paiement
```

Suggested available values:

```text
Espèces
Virement bancaire
Chèque
Paiement mixte
Autre
```

If the existing configurable payment methods system already exists, keep using it internally.

---

# 30. Sale final information structure

The complete sale should therefore contain:

```text
SALE

Vehicle
├── Vehicle ID
└── Vehicle snapshot/reference

Buyer
├── Full name
├── Phone
├── CIN
├── Address
└── Documents

Commissioner [optional]
├── Name
├── Phone
├── CIN
├── Address
├── Commission amount
└── Commission paid by personnel

Financial
├── Sale price
├── Reservation advance
├── Amount received
├── Payment method
└── Money received by personnel

Meta
├── Sale date
└── Notes
```

---

# 31. Personnel

There is one concept we should keep centralized:

### Company personnel.

Because multiple workflows reference them:

```text
Purchase commissioner → paid by

Repair → paid by

Sale commissioner → paid by

Sale money → received by
```

Therefore, unlike supplier and commissioner, **Personnel should remain an actual entity or reuse existing Users**.

I recommend:

```text
User / Personnel

id
name
phone
role
active
```

Then every relevant field stores a personnel ID.

This prevents variants like:

```text
Mohamed
mohamed
Mohamed Maalal
M. Maalal
```

from becoming separate people.

---

# 32. Supplier and commissioner snapshot principle

This is an important distinction.

### Personnel

Reusable entity.

### Supplier

Not entity in this MVP.

Snapshot stored with purchase.

### Purchase commissioner

Not entity in this MVP.

Snapshot stored with purchase.

### Sale commissioner

Not entity in this MVP.

Snapshot stored with sale.

### Customer

Could technically use the existing Contact entity, but for this reduced MVP I recommend keeping customer data attached to the reservation/sale while still allowing the existing backend relationship if already built.

Do not expose a full CRM module.

---

# 33. Simplified vehicle lifecycle

The most important business state machine should become:

```text
                ┌──────────────┐
                │   EN STOCK   │
                └──────┬───────┘
                       │
              ┌────────┼─────────┐
              │        │         │
              ▼        ▼         ▼
          RÉSERVÉ  EN RÉPARATION VENDU
              │        │
          ┌───┴───┐    │
          │       │    │
          ▼       ▼    ▼
       VENDU   EN STOCK
        OR
      EN STOCK
```

More explicitly:

```text
EN STOCK
 ├──→ RÉSERVÉ
 │      ├──→ EN STOCK      [annulation / expiration]
 │      └──→ VENDU         [conversion]
 │
 ├──→ EN RÉPARATION
 │      └──→ EN STOCK      [réparation terminée]
 │
 └──→ VENDU                [vente directe]
```

This is the heart of the current product.

---

# 34. Vehicle activity timeline

Even in this simplified MVP, keep the existing audit/history system.

Example:

```text
02/09/2026
Véhicule ajouté au parc

04/09/2026
Réparation créée — Carrosserie

07/09/2026
Réparation terminée
Payée par Ahmed

09/09/2026
Réservation créée
Avance : 10 000 DH

12/09/2026
Réservation convertie en vente

12/09/2026
Véhicule vendu à Youssef Bennani
250 000 DH
```

This gives extremely useful traceability without requiring extra user effort.

---

# 35. Simplified sidebar

The sidebar should now be extremely clean.

```text
MAALAL CARS

Dashboard

Parc automobile
  Tous les véhicules
  En stock
  Réservés
  En réparation
  Vendus

+ Ajouter un véhicule

Déconnexion
```

Depending on UX, the status sections could simply be tabs inside `/vehicles`, making the sidebar even smaller:

```text
Dashboard

Véhicules

Ajouter un véhicule

Déconnexion
```

I prefer the **second version** for the current MVP.

The tabs already handle the vehicle states.

---

# 36. Final active pages

The user-facing MVP therefore only really needs:

```text
/login

/dashboard

/vehicles

/vehicles/new

/vehicles/:id

/vehicles/:id/edit
```

And actions/modal/subflows:

```text
Add Repair

Edit Repair

Create Reservation

View Reservation

Cancel Reservation

Convert Reservation to Sale

Direct Sale

Sale Detail

Upload Vehicle Photos

Upload Vehicle Documents

Upload Buyer Documents
```

These actions don't all need independent routes.

That keeps the app extremely focused.

---

# 37. What should be hidden for now

Hide from navigation and normal access:

```text
Advanced Finance
Reports
Leads
Marketing
Financing
Workshop advanced module
Agenda
CRM
Supplier management
Commissioner management
Invoice management
Warranty
Insurance
Registration workflows
Tasks
Messaging
Listings
Support
API
Integrations
Advanced settings
Archives
Advanced document center
Analytics
```

Again:

### Hide / disable them.

Don't delete their implementation.

---

# 38. Current MVP in one workflow

The complete application can now be understood as:

```text
LOGIN
 ↓
DASHBOARD
 ↓
VEHICLE PARK
 ↓
ADD VEHICLE
 │
 ├── Vehicle information
 ├── Purchase information
 ├── Supplier snapshot
 ├── Purchase commissioner
 ├── Commission
 ├── Commission paid by personnel
 ├── Photos
 └── Legal documents
 ↓
EN STOCK
 │
 ├───────────────┐
 │               │
 ▼               ▼
REPAIR        RESERVATION
 │               │
 ▼               ├── Cancel → EN STOCK
EN STOCK          │
                  └── Convert → SALE
 │
 └──────────────────────┐
                        │
                        ▼
                  DIRECT SALE
                        │
                  ├── Buyer
                  ├── Buyer documents
                  ├── Sale commissioner
                  ├── Commission
                  ├── Commission paid by
                  ├── Sale price
                  ├── Payment method
                  └── Money received by
                        │
                        ▼
                      SOLD
```

## The important architectural result

This turns the current advanced ERP into a **very focused vehicle-park operating system** for this phase.

The user really does only four things:

**1. Add a car**
**2. Manage what happens to it while it is in the park**
**3. Reserve it**
**4. Sell it**

Everything else becomes supporting data around those four operations.

And because we **deactivate instead of delete** the advanced features already implemented, Maalal Cars can later progressively reactivate finance, invoices, CRM, advanced workshop, marketing, reports, insurance, etc. without having to rebuild the system.
