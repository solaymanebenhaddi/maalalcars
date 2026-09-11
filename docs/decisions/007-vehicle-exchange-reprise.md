# ADR-007: Vehicle Exchange & Reprise Acquisition Architecture

## Status
Accepted

## Date
2026-09-11

## Context
MAALAL CARS needed to support vehicle trade-ins (**Reprise / Échange**) where an active vehicle already in the park is given in exchange for a newly acquired vehicle. The exchange can be:
1. Balanced (vehicle-for-vehicle with no extra money).
2. Company paying a cash adjustment (soulte) to the supplier.
3. Supplier paying a cash adjustment (soulte) to MAALAL CARS.

This required:
- Non-float authoritative money storage to prevent rounding inaccuracies.
- Strict state machine transitions ensuring the outgoing vehicle leaves active stock and is archived with the reason `REPRISE`.
- Relational integrity linking both vehicles through a `VehicleExchange` transaction.
- Atomic transactional consistency ensuring all steps commit together or roll back.

## Decision
1. **Model**: Introduced `VehicleExchange` with foreign key relations to incoming (`incomingVehicleId`) and outgoing (`outgoingVehicleId`) vehicles, and operator (`handledById`).
2. **Monetary Storage**: Authoritative exchange monetary amounts (`incomingVehicleValue`, `outgoingVehicleValue`, `cashAdjustmentAmount`) are stored as **integer minor units (centimes: 1 DH = 100 centimes)** to eliminate floating-point representation errors.
3. **State Machine**: Added `ECHANGE` status with valid transition `IN_STOCK` → `ECHANGE` → `ARCHIVED`. Vehicles in `ECHANGE` are soft-archived, marked with badge `ÉCHANGÉ`, and blocked from active stock queries, reservations, workshop orders, and sales.
4. **Atomicity**: The entire exchange lifecycle executes within a `prisma.$transaction`.
5. **Cross-Referencing**: Direct reciprocal relations in Prisma allow navigating seamlessly between the incoming and outgoing vehicle details.

## Consequences
### Advantages
- High precision and audit compliance for Moroccan automotive trading.
- Zero risk of phantom active stock: exchanged vehicles are immediately archived.
- Full traceability in history and detail views.
- 100% backward compatible with classic purchase workflows.
