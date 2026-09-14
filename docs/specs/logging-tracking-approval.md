# Technical Specification: Logging, Audit Trail & Approval Center

## 1. Overview
The Governance and Traceability subsystem provides:
1. **Journal d’activité (`/admin/activity`)**: Real-time chronological audit trail of all platform events.
2. **Centre des demandes (`/admin/requests`)**: Managerial approval inbox for operations submitted by non-Super-Admin users.
3. **Espace Collaborateur (`/my-requests`)**: Tracking portal for team members to monitor their pending and reviewed requests.

---

## 2. Models & Data Structures

### `ApprovalRequest`
| Field | Type | Description |
|---|---|---|
| `id` | String (cuid) | Primary identifier |
| `requestNumber` | String (unique) | Sequential code `REQ-YYYY-XXXXX` |
| `actionType` | Enum | `CREATE`, `UPDATE`, `DELETE`, `ARCHIVE`, `RESTORE`, `STATUS_CHANGE`, `SALE`, `RESERVATION`, `REPAIR`, `EXCHANGE`, `PRICE_CHANGE`, etc. |
| `entityType` | String | `Vehicle`, `Sale`, `Reservation`, `Repair`, `Contact`, `Document`, `Expense` |
| `entityId` | String? | ID of target entity (null for creation) |
| `entityLabel` | String? | Human readable descriptor |
| `status` | Enum | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`, `EXPIRED`, `CONFLICTED` |
| `beforeData` | String? | JSON snapshot of entity before mutation |
| `requestedData` | String | JSON payload of requested changes |
| `entityUpdatedAt` | DateTime? | Timestamp snapshot for conflict detection |
| `targetUrl` | String? | Deep link to entity |
| `reason` | String? | Requester note |
| `requestedByUserId`| String | Relation to User |
| `reviewedByUserId` | String? | Relation to User (Super Admin) |
| `reviewedAt` | DateTime? | Approval/Rejection timestamp |
| `rejectionReason` | String? | Required when rejected |
| `conflictDetails` | String? | JSON diff when concurrent edit detected |

### `ActivityLog` (Enhanced)
| Field | Type | Description |
|---|---|---|
| `id` | String (cuid) | Primary identifier |
| `action` | String | e.g. `VEHICLE_CREATED`, `VEHICLE_UPDATED_APPROVED` |
| `entityType` | String | `Vehicle`, `Sale`, etc. |
| `entityId` | String? | Target ID |
| `entityLabel` | String? | Descriptor |
| `details` | String? | Human readable summary |
| `beforeData` | String? | Initial state JSON |
| `afterData` | String? | Resulting state JSON |
| `approvalRequestId`| String? | Linked approval request ID |
| `userId` | String? | Actor ID |
| `ipAddress` | String? | Client IP address |
| `userAgent` | String? | Client browser / device |
| `createdAt` | DateTime | Timestamp |

---

## 3. Endpoints & Authorization

| Route | Method | Access | Description |
|---|---|---|---|
| `/api/approvals` | GET | Authenticated | List approval requests (filtered to self if non-admin) |
| `/api/approvals` | POST | Authenticated | Submit an approval request |
| `/api/approvals/[id]` | GET | Authenticated | View request details and field diffs |
| `/api/approvals/[id]/approve` | POST | Super Admin Only | Approve request and commit mutation |
| `/api/approvals/[id]/reject` | POST | Super Admin Only | Reject request with reason |
| `/api/approvals/[id]/cancel` | POST | Requester Only | Cancel own pending request |
| `/api/approvals/counts` | GET | Authenticated | Live badge counts |
| `/api/activity` | GET | Super Admin Only | Filtered audit logs (with `?export=csv`) |
| `/api/activity/stats` | GET | Super Admin Only | KPI metric counts |
