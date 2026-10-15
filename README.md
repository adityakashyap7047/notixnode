# NOTIXNODE — Minecraft Server Developer Resource Platform

NOTIXNODE is a high-performance developer resource marketplace and server administration toolkit built with Next.js 16 (App Router, Turbopack), TypeScript, and Tailwind CSS.

---

## 1. Architecture & Core Stack

- **Framework**: Next.js 16.4.0 (App Router)
- **Runtime**: Node.js 18+ (tested on Node.js 20+)
- **Styling**: Tailwind CSS v4, Obsidian Dark Theme (`#0B0F19`, `#161F30`, `#06B6D4`, `#10B981`)
- **Icons**: Lucide React
- **Data Layer**: File-backed structured JSON store (`src/data/resources.json`) with in-memory caching and atomic writes, designed for immediate database migration (PostgreSQL / MongoDB / DynamoDB).
- **Test Runner**: Node.js Native Test Runner (`node:test`, `node:assert`)

---

## 2. Resource Data Model

The resource data model is defined in [`src/types/resource.ts`](./src/types/resource.ts) and backed by [`src/data/resources.json`](./src/data/resources.json).

```typescript
export interface Resource {
  id: string;                          // Unique identifier (UUID or semantic slug id)
  slug: string;                        // URL-safe route slug
  title: string;                       // Display name
  shortDescription: string;            // Summary for cards (max 280 chars)
  description: string;                 // Full markdown documentation
  category: ResourceCategory;          // One of 9 platform categories
  resourceType: ResourceType;          // configuration | guide | template | pack | tool | tutorial | other
  tags: string[];                      // Searchable tags
  thumbnail?: string;                  // Card thumbnail image
  screenshots: string[];               // Preview gallery
  minecraftVersions: string[];         // e.g. ["1.20.4", "1.21.1", "latest"]
  serverSoftware: ServerSoftware[];    // ["paper", "purpur", "spigot", "velocity", etc.]
  dependencies: ResourceDependency[];  // Required & optional plugin/mod dependencies
  installationInstructions: string;    // Step-by-step setup instructions
  changelog: ChangelogEntry[];         // Version history with change notes
  license: string;                     // SPDX identifier (MIT, CC-BY-4.0, etc.)
  author: ResourceAuthor;              // Publisher profile and verification status
  isPremium: boolean;                  // Free vs. commercial tier
  externalCheckoutUrl?: string;        // Official checkout provider (BuiltByBit, Tebex, etc.)
  files: ResourceFile[];               // File manifest with safe refs, mime types, and hashes
  status: PublicationStatus;           // draft | published | archived
  isFeatured: boolean;                 // Curated homepage highlight
  isExample: boolean;                  // Explicit seed/development demo flag
  createdAt: string;                   // ISO-8601
  updatedAt: string;                   // ISO-8601
  downloadCount?: number;              // Server-tracked download events
  verifiedDownloadCount?: number;      // Authenticated metrics
}
```

---

## 3. API Contracts

### Public Endpoints

#### `GET /api/resources`
Query parameters:
- `search`: Full-text search across title, short description, description, and tags
- `category`: Filter by valid category
- `resourceType`: Filter by resource type
- `minecraftVersion`: Compatibility filter
- `serverSoftware`: Server core filter
- `sort`: `newest` (default), `oldest`, `alphabetical`, `popular`, `updated`
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 12, max: 50)
- `includeExamples`: Boolean (default: true for development seed data)

Response:
```json
{
  "resources": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "totalItems": 17,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": { ... }
}
```

#### `GET /api/resources/[slug]`
Returns a single resource and up to 4 related resources within the same category or author. Returns `404` if not found or archived.

#### `GET /api/resources/categories`
Returns category metadata, descriptions, and dynamic resource counts per category.

#### `GET /api/download/[id]?file=[ref|filename]`
Secure download endpoint:
- **Validation**: Enforces published status, non-archived status, and verified file association.
- **Premium Check**: If `isPremium: true` and an `externalCheckoutUrl` exists, returns HTTP 402 with checkout redirection details; never serves private files without entitlement.
- **Path Traversal Defense**: All filenames and refs are sanitized with `path.basename()`. Paths are strictly confined to `public/downloads/`.
- **Integrity**: Increments download count asynchronously and serves with `Content-Disposition`, `Content-Length`, and `nosniff` headers.

---

### Protected Admin Endpoints

All admin endpoints require authorization via `Authorization: Bearer <ADMIN_TOKEN>`.

- `GET /api/admin/resources`: List all resources including drafts and archived items.
- `POST /api/admin/resources`: Create a new resource with strict server-side schema validation.
- `PATCH /api/admin/resources/[id]`: Partial update of resource metadata.
- `DELETE /api/admin/resources/[id]`: Soft-delete (sets status to `archived`).
- `POST /api/admin/resources/[id]/publish`: Transition resource to `published`.
- `POST /api/admin/resources/[id]/archive`: Transition resource to `archived`.

---

## 4. Environment Variables

Configure in `.env.local` (never commit secrets):

| Variable | Description | Default / Dev Fallback |
|---|---|---|
| `ADMIN_TOKEN` | Bearer token for admin API authorization | None (All admin endpoints deny in production if unset) |
| `ALLOW_DEV_ADMIN` | Allow admin operations without token in `NODE_ENV=development` | `false` |
| `NEXT_PUBLIC_APP_URL` | Canonical origin for OpenGraph and social previews | `http://localhost:3000` |

---

## 5. Development & Testing Commands

```bash
# Install dependencies
npm install

# Run unit and integration tests (Data Layer, Downloads, Schema)
npm test

# Run TypeScript strict type-check
npx tsc --noEmit

# Run production build (Turbopack)
npm run build

# Start production server
npm start
```
