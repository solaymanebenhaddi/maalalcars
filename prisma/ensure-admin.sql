-- MAALAL CARS — Production Database Schema & Admin User Guarantee

-- 1. Ensure Roles exist
INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtnlwh8s0000ctvs2g3bem3o', 'Super Admin', 'Super Administrateur avec pouvoirs exclusifs de validation finale des ventes et restauration des archives', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtj72xd60000ct1cifbj57ty', 'Administrateur', 'Accès complet à toutes les fonctionnalités et paramètres système', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtja4tx30001ctmk9yl081em', 'Gestionnaire', 'Gestion des opérations quotidiennes, stock, ventes, clients et achats', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtja4txe0002ctmkb28oq459', 'Vendeur', 'Gestion des opportunités, réservations, ventes et contacts clients', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtja4txp0003ctmkhn29ap6j', 'Comptable', 'Gestion financière, factures, encaissements, décaissements et TVA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO "Role" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('cmtja4txx0004ctmkb4whrvn0', 'Assistante', 'Support administratif, cartes grises, dossiers et accueil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Ensure Super Admin user exists (created if not present, never overwriting password on existing user)
INSERT INTO "User" ("id", "email", "name", "phone", "passwordHash", "roleId", "isActive", "createdAt", "updatedAt")
VALUES ('cmtmstm6v0008cteoinwh0g3s', 'maalalcars.911@gmail.com', 'Maalal Admin', '+212 6 00 00 00 00', '$2b$10$Pe2vcutWKmFhdtjDDqOe8eJz0Wio5TrCO48HggMJ4nKv0eALjC0oq', 'cmtnlwh8s0000ctvs2g3bem3o', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT("email") DO UPDATE SET
  "roleId" = excluded."roleId",
  "isActive" = 1;

-- 3. Ensure ApprovalRequest Table exists in Production
CREATE TABLE IF NOT EXISTS "ApprovalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestNumber" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityLabel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "beforeData" TEXT,
    "requestedData" TEXT NOT NULL,
    "entityUpdatedAt" DATETIME,
    "reason" TEXT,
    "rejectionReason" TEXT,
    "targetUrl" TEXT,
    "requestedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApprovalRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApprovalRequest_requestNumber_key" ON "ApprovalRequest"("requestNumber");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_actionType_idx" ON "ApprovalRequest"("actionType");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_entityType_entityId_idx" ON "ApprovalRequest"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_requestedById_idx" ON "ApprovalRequest"("requestedById");
CREATE INDEX IF NOT EXISTS "ApprovalRequest_createdAt_idx" ON "ApprovalRequest"("createdAt");
