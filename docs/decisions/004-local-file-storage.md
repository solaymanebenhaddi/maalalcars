# ADR-004: Local File Storage Strategy

## Status
Accepted

## Date
2026-09-01

## Context
The application manages vehicle photos, contracts, invoices, inspection reports, and other documents. Need a storage strategy for the MVP.

## Decision
Use local filesystem storage with structured directories under `storage/`. SQLite stores metadata and file path references. Files are stored with UUID-prefixed safe filenames.

## Alternatives Considered
1. **Cloud storage (S3/GCS)** — Scalable but adds infrastructure complexity for MVP
2. **Database BLOBs** — Simple but bloats database, poor performance for large files
3. **Base64 in JSON** — Extremely wasteful, slow, and fragile

## Consequences
### Advantages
- Zero infrastructure cost
- Simple backup (copy storage directory)
- Fast local access
- Easy to migrate to cloud storage later (swap storage abstraction)

### Disadvantages
- Single server only (no CDN)
- Manual backup management
- Disk space limitations

### Risks
- Must prevent directory traversal attacks (implemented in storage.ts)
- Must validate upload file types and sizes
