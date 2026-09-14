This update is strong because it adds **governance, traceability, and approval control** on top of the existing MAALAL CARS workflows. I would structure it as two separate but connected features:

**1. Journal d’activité / Audit Log** — everything that actually happens is recorded.
**2. Centre des demandes / Approval Requests** — changes initiated by non-super-admin users wait for validation before they affect the real system.

The important point is: **do not mix audit history with approval requests**.

---

# 1. Core rule

There are now two user behaviors.

### Super Admin

When the Super Admin performs an action:

```text
Action
→ Applied immediately
→ Audit log created
```

Example:

```text
Adem Maalal changed vehicle price:
BMW X5
450 000 DH → 465 000 DH
```

The change is immediately active.

---

### Any other user

When a normal user performs a business modification:

```text
Action requested
→ NOT applied yet
→ Approval Request created
→ Super Admin reviews
→ Approve OR Reject
```

Therefore:

```text
Normal user action
≠ immediate database mutation
```

Instead:

```text
Normal user action
→ Pending Request
```

---

# 2. Actions requiring approval

For every non-Super-Admin user, approval should be required for all important mutations:

```text
CREATE
UPDATE
DELETE
ARCHIVE
RESTORE
STATUS CHANGE
SALE
RESERVATION
REPAIR
REPRISE / EXCHANGE
DOCUMENT CHANGE
PRICE CHANGE
COMMISSION CHANGE
PAYMENT CHANGE
```

Examples:

* Add vehicle
* Edit vehicle information
* Change purchase price
* Change sale price
* Add repair
* Complete repair
* Create reservation
* Cancel reservation
* Sell vehicle
* Convert reservation to sale
* Upload/delete legal document
* Archive vehicle
* Restore vehicle
* Add/change commissioner
* Add/change supplier information
* Create a REPRISE transaction

All should become requests unless executed by Super Admin.

---

# 3. Very important: read actions are different

I would **not** put normal page views such as:

```text
Opened Dashboard
Opened BMW X5
Clicked tab
```

inside the main audit log by default because it will create enormous noise.

The important log should track:

```text
Authentication
+
Business mutations
+
Approvals
+
Security-sensitive actions
```

Examples:

```text
Connexion réussie
Véhicule créé
Prix modifié
Réservation créée
Vente demandée
Demande approuvée
Document supprimé
Utilisateur modifié
```

If later you want complete user behavior tracking, we can have a secondary `AccessLog`.

---

# 4. Feature 1 — Journal d’activité

Super Admin gets a new menu:

```text
PILOTAGE & SYSTÈME

Utilisateurs & Rôles
Demandes d’approbation
Journal d’activité
Paramètres
```

Suggested route:

```text
/admin/activity
```

---

# 5. Audit Log UI/UX

This should look like a sophisticated operational/security timeline, not a basic table.

Top:

```text
Journal d’activité

Vue complète de toutes les opérations effectuées sur la plateforme
```

KPI cards:

```text
Actions aujourd’hui
148

Modifications
43

Demandes approuvées
18

Demandes rejetées
4

Utilisateurs actifs
7
```

Then advanced filters:

```text
[ Recherche ]

Utilisateur
Type d’action
Module
Entité
Résultat
Date
Importance
```

---

# 6. Activity feed design

Each activity should look like:

```text
[Avatar]

Youssef El Idrissi
Commercial

a modifié le prix du véhicule

BMW X5 2022

450 000 DH
→
465 000 DH

13/09/2026 • 10:42

[Voir le véhicule]
```

Use visual semantic colors:

```text
Green   → Creation / Approved
Blue    → Update
Amber   → Pending
Red     → Delete / Rejected
Purple  → Sale / Reservation / Workflow
Gray    → System
```

---

# 7. Detailed audit entry

Clicking an activity opens a drawer or detail page.

Example:

```text
Modification véhicule

Utilisateur
Youssef El Idrissi

Date
13/09/2026 10:42

Action
UPDATE

Entity
Vehicle

Vehicle
BMW X5 2022

Matricule
12345-A-6
```

Then show:

### Avant

```text
Prix de vente
450 000 DH

Kilométrage
68 000 km
```

### Après

```text
Prix de vente
465 000 DH

Kilométrage
69 250 km
```

And:

```text
Demande liée
REQ-2026-00142

Approuvée par
Adem Maalal

13/09/2026 • 11:03
```

---

# 8. Feature 2 — Centre des demandes

New Super Admin page:

```text
/admin/requests
```

Menu badge:

```text
Demandes d’approbation     12
```

This page contains every pending operation requested by other users.

---

# 9. Request statuses

Use:

```text
PENDING
APPROVED
REJECTED
CANCELLED
EXPIRED
CONFLICTED
```

French UI:

```text
EN ATTENTE
APPROUVÉE
REJETÉE
ANNULÉE
EXPIRÉE
CONFLIT
```

---

# 10. Request dashboard

Top KPI cards:

```text
En attente
12

Urgentes
3

Créations
5

Modifications
4

Suppressions
1

Ventes
2
```

Then tabs:

```text
En attente
Approuvées
Rejetées
Toutes
```

---

# 11. Sophisticated request list

A request should contain enough information so the Super Admin understands it without opening everything.

Example:

```text
REQ-2026-00142

MODIFICATION VÉHICULE

Youssef El Idrissi
Commercial

BMW X5 2022

Prix de vente
450 000 DH → 465 000 DH

Demandée il y a 18 min

[Voir les détails]
[Approuver]
[Rejeter]
```

---

# 12. New vehicle request

If a normal user creates a car:

```text
User
→ fills full Add Vehicle form
→ submits
```

The vehicle must NOT appear in:

```text
Stock
Vehicle list active
Dashboard counts
Reservations
Sales
```

Instead:

```text
Vehicle Draft
+
Approval Request
```

Super Admin sees:

```text
NOUVEAU VÉHICULE

Demandé par:
Karim Benali

BMW Série 3
2021

Prix d'achat
285 000 DH

Fournisseur
Mohamed Amrani

Commission
5 000 DH

[Preview]
[Approuver]
[Rejeter]
```

If approved:

```text
Draft
→ Active Vehicle
→ EN STOCK
```

Then:

```text
Audit:
Vehicle created by Karim
Approved by Adem
```

---

# 13. If rejected

Very important correction:

**Do not physically delete the request itself.**

Otherwise you lose auditability.

Instead:

```text
Request → REJECTED
```

and the business change is discarded.

For a new vehicle:

```text
Draft vehicle
→ discarded / archived internally
```

but:

```text
Approval Request
→ kept permanently
```

The Super Admin can later see:

```text
REJETÉE

Ajout BMW X5
Demandé par Youssef
Rejeté par Adem
Motif: Prix d'achat incorrect
```

This is much safer than deleting history.

---

# 14. Request detail page

Clicking a request should open a rich detail view.

Example:

```text
REQ-2026-00142
Modification véhicule

EN ATTENTE
```

Left:

```text
Demandé par
Youssef El Idrissi

Rôle
Commercial

Date
13/09/2026 10:42
```

Center:

```text
BMW X5 2022

Matricule
12345-A-6

VIN
WBA...
```

Then diff:

```text
CHAMP               AVANT          DEMANDÉ

Prix de vente       450 000 DH     465 000 DH
Kilométrage         68 000 km      69 250 km
Couleur             Noir           Noir
```

Only changed fields should be highlighted.

---

# 15. Direct navigation to concerned object

You explicitly asked for this, and it is important.

Every request should store:

```text
entityType
entityId
targetUrl
```

Example:

```text
Vehicle
veh_123

/vehicles/veh_123
```

The Super Admin gets:

```text
[Ouvrir la fiche véhicule]
```

For sale:

```text
[Voir la vente proposée]
```

For reservation:

```text
[Voir la réservation]
```

For repair:

```text
[Voir la réparation]
```

---

# 16. Approval

When Super Admin clicks:

```text
Approuver
```

show confirmation modal:

```text
Approuver cette demande ?

Modification :
BMW X5 — Prix de vente

450 000 DH
→
465 000 DH

Demandée par:
Youssef El Idrissi
```

Buttons:

```text
Annuler
Approuver la modification
```

Once confirmed:

```text
Validate request
↓
Apply actual mutation
↓
Create audit event
↓
Request = APPROVED
↓
Notify requesting user
```

---

# 17. Rejection

Click:

```text
Rejeter
```

Modal:

```text
Rejeter cette demande

Motif du rejet *
[................................]

[Annuler]
[Rejeter la demande]
```

Then:

```text
Request = REJECTED
Actual business data unchanged
```

Create audit:

```text
Adem Maalal rejected request REQ-2026-00142
```

---

# 18. User experience for normal users

Normal users should also see the status of their own requests.

For example after submitting a new vehicle:

```text
Demande envoyée

L'ajout du véhicule doit être validé
par un Super Administrateur.

REQ-2026-00152

Statut:
EN ATTENTE
```

They can have:

```text
Mes demandes
```

with:

```text
En attente
Approuvées
Rejetées
```

But they must NEVER be able to approve their own request.

---

# 19. Pending indicators inside the existing UI

This can dramatically improve UX.

Imagine user requests changing BMW X5 price.

Until approval, vehicle still displays:

```text
450 000 DH
```

But user who requested the change can see:

```text
450 000 DH

Modification en attente
→ 465 000 DH
```

with amber badge:

**EN ATTENTE DE VALIDATION**

Super Admin also sees that indicator.

---

# 20. Delete workflow

Normal user clicks Delete:

Do NOT delete entity.

Create:

```text
DELETE REQUEST
```

Entity remains fully active until approval.

Super Admin sees:

```text
SUPPRESSION DEMANDÉE

BMW X5 2022

Demandé par:
Karim Benali

Motif:
Erreur d'enregistrement
```

If approved:

```text
archive/delete according to business rules
```

If rejected:

```text
no change
```

---

# 21. Sale workflow

This is particularly important.

If normal user sells a vehicle:

```text
Create Sale Request
```

Vehicle should NOT immediately become `VENDU`.

Instead:

```text
Vehicle remains EN_STOCK / RESERVE
```

with maybe:

```text
VENTE EN ATTENTE
```

Super Admin receives:

```text
NOUVELLE VENTE

BMW X5 2022

Client
Ahmed Bennani

Prix
465 000 DH

Commission
8 000 DH

Paiement
Virement

Argent reçu par
Youssef

[Voir]
[Approuver]
[Rejeter]
```

Only approval triggers:

```text
Vehicle → VENDU
Sale → active
Financial effects → applied
```

---

# 22. Conflict protection

This is essential technically.

Example:

```text
User A requests:
BMW X5 price 450k → 465k

Before approval:

Super Admin directly changes:
450k → 470k
```

The original request must NOT blindly overwrite:

```text
470k → 465k
```

The request should become:

```text
CONFLICT
```

and Super Admin sees:

```text
Les données ont changé depuis cette demande.

Valeur initiale:
450 000 DH

Valeur actuelle:
470 000 DH

Valeur demandée:
465 000 DH
```

Then he can:

```text
Reject
or
Review manually
```

This requires entity versioning or an `updatedAt` snapshot.

---

# 23. Recommended architecture

Create a general system rather than separate approval logic for every page.

Something like:

```text
ApprovalRequest
```

with:

```text
id

requestNumber

requestedByUserId

actionType

entityType
entityId

status

beforeData
requestedData

entityVersion

targetUrl

reason

reviewedByUserId
reviewedAt

rejectionReason

createdAt
updatedAt
```

And perhaps:

```text
AuditLog
```

with:

```text
id

actorUserId

actionType

entityType
entityId

entityLabel

beforeData
afterData

approvalRequestId

ipAddress
userAgent

createdAt
```

JSON snapshots here are appropriate because they represent **history/diff metadata**, not transactional business storage.

---

# 24. General request engine

Instead of coding:

```text
if vehicle ...
if reservation ...
if sale ...
```

inside every page, create:

```text
ApprovalService
```

Conceptually:

```text
requestMutation()
approveRequest()
rejectRequest()
cancelRequest()
detectConflict()
```

Then application services use it.

Example:

```text
Normal user
VehicleService.update()
↓
ApprovalService.requestMutation()
```

versus:

```text
Super Admin
VehicleService.update()
↓
apply immediately
↓
AuditLog
```

---

# 25. Audit engine

Likewise, create centralized:

```text
AuditService
```

Every successful mutation uses it.

Examples:

```text
VEHICLE_CREATED
VEHICLE_UPDATED
VEHICLE_ARCHIVED

REPAIR_CREATED
REPAIR_COMPLETED

RESERVATION_CREATED
RESERVATION_CANCELLED

SALE_CREATED

EXCHANGE_CREATED

REQUEST_APPROVED
REQUEST_REJECTED

USER_CREATED
ROLE_CHANGED
LOGIN_SUCCESS
```

---

# 26. UI recommendation

For the Super Admin sidebar:

```text
PILOTAGE & SYSTÈME

Utilisateurs & Rôles

Demandes
       [12]

Journal d'activité

Paramètres
```

`Demandes` should have a red/amber live badge.

I would also add topbar notification:

```text
🔔 3

2 nouvelles demandes
1 modification urgente
```

---

# 27. Dashboard integration

For Super Admin only, add a compact control widget:

```text
VALIDATIONS

12 demandes en attente

5 Ajouts
3 Modifications
2 Ventes
1 Suppression
1 Autre

[Voir les demandes]
```

For regular users:

```text
MES DEMANDES

3 en attente
2 approuvées aujourd'hui

[Voir mes demandes]
```

---

# 28. Final logic

The system becomes:

```text
                    USER ACTION
                         │
              ┌──────────┴─────────┐
              │                    │
        SUPER ADMIN            OTHER USER
              │                    │
              ▼                    ▼
        APPLY CHANGE        CREATE REQUEST
              │                    │
              ▼                    ▼
          AUDIT LOG              PENDING
                                   │
                            SUPER ADMIN
                                   │
                      ┌────────────┴────────────┐
                      ▼                         ▼
                   APPROVE                    REJECT
                      │                         │
                      ▼                         ▼
                APPLY CHANGE                NO CHANGE
                      │                         │
                      └────────────┬────────────┘
                                   ▼
                               AUDIT LOG
```

## The strongest improvement

The architecture should guarantee one central rule:

> **No non-Super-Admin mutation may alter approved business data until the corresponding request has been approved.**

And the audit rule:

> **No important mutation or approval decision may happen without leaving an immutable history entry.**

That gives MAALAL CARS a much more professional control layer: every vehicle, reservation, repair, sale, exchange, price change, document modification, and deletion becomes traceable, while the Super Admin remains the final authority.
