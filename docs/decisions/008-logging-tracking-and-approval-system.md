# ADR-008: Activity Logging, Audit Trail, and Approval Center Architecture

## Status
Accepted

## Date
2026-09-13

## Context
MAALAL CARS needed an enterprise-grade governance, traceability, and approval control system to oversee operations across the organization (purchases, vehicle creation, price changes, repairs, reservations, sales, and document modifications).

Previous pain points:
1. Operational mutations performed by non-admin staff immediately altered active database records with no prior managerial check.
2. Inconsistent audit trail coverage across services.
3. Lack of conflict protection when multiple team members or Super Admins modified the same vehicle concurrently.

## Decision
1. **Strict Separation of Concerns**:
   - **`ActivityLog` (Journal d’activité)**: Immutable history of all actual, committed business mutations, logins, security actions, and approval decisions, enriched with JSON before/after snapshots, diffs, client IP, and user-agent.
   - **`ApprovalRequest` (Centre des demandes)**: Isolated queue for proposed operations submitted by non-Super-Admin users awaiting review.
2. **Dual-Tier Mutation Engine**:
   - **Super Admin**: Mutations execute immediately and produce an immutable `ActivityLog` entry.
   - **Other Users (Vendeur, Gestionnaire, Comptable, etc.)**: Mutations do **not** touch live records. Instead, they produce an `ApprovalRequest` with status `PENDING` and a sequential Moroccan reference code (`REQ-YYYY-XXXXX`).
3. **Draft Vehicle Isolation**:
   - Vehicle additions by non-Super-Admins remain in the `ApprovalRequest` payload and never enter active stock, reservation queries, or public listings until approved.
4. **Conflict Protection**:
   - Every `ApprovalRequest` captures a snapshot of `entityUpdatedAt`. Upon review, `detectEntityConflict` verifies whether the underlying entity changed since submission. If a discrepancy exists, the request transitions to `CONFLICTED` and requires a 3-way visual resolution before any overwrite.
5. **Permanent Rejection Traceability**:
   - Rejected requests are **never physically deleted**. They transition to `REJECTED` with a mandatory `rejectionReason` (min 5 chars) to preserve institutional memory and prevent data loss.

## Consequences
### Advantages
- High governance and fraud prevention: Super Admin remains the final authority for all critical data changes.
- 100% auditable history with before/after diffs for every change.
- Concurrency protection preventing blind overwriting of prices or statuses.
- Clean user experience with `/admin/activity`, `/admin/requests`, and self-service `/my-requests`.
