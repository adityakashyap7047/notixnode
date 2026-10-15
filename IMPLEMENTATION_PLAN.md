# NOTIXNODE Implementation Plan - Agent 2 (Backend/Data Layer)

## Current Architecture Analysis
- **Framework**: Next.js 16.4.0 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Database**: None installed (will use file-based JSON storage for development)
- **Authentication**: None installed (admin workflows will be protected by simple token/env check)
- **Hosting**: Targeting Vercel (static export compatible where possible)

## Implementation Scope (Agent 2 - Data Layer & Business Logic)

### 1. Resource Data Model & Types (`src/types/resource.ts`)
- Complete resource schema with all required fields
- API response types (list, detail, search, error)
- Category and resource type enums
- Validation schemas (Zod or native TypeScript)

### 2. Data Layer (`src/lib/resources.ts`)
- In-memory JSON file storage (development)
- CRUD operations for resources
- Search, filter, sort, pagination logic
- Slug-based resource lookup
- Download tracking (simple counter in JSON)

### 3. Seed Data (`src/data/resources.json`)
- 8-10 sample resources across all categories
- Marked as `isDraft: true` and `isExample: true`
- No fake statistics or unverified claims
- Original descriptions and placeholder assets

### 4. Resource Library API (`src/app/api/resources/`)
- `GET /api/resources` - List with search, filter, sort, pagination
- `GET /api/resources/[slug]` - Detail by slug
- `GET /api/resources/categories` - Category metadata
- Consistent response structure with error handling

### 5. Download Workflow (`src/app/api/download/`)
- `GET /api/download/[id]` - Validate and serve/download
- File reference validation (no path exposure)
- Content-Type and filename handling
- External URL support with clear identification
- Download event recording (JSON counter)
- Premium/private access check (placeholder for entitlement)

### 6. Developer Utilities (Client-side, `src/app/tools/`)
1. **MOTD Previewer** - Formatting codes, preview, copy
2. **Rank Prefix Previewer** - Prefix/suffix, chat/tablist preview, copy
3. **Server Properties Generator** - Fields, validation, export .properties
4. **LuckPerms Permission Planner** - Groups, inheritance, nodes, export commands
5. **Server Launch Checklist** - LocalStorage persistence, export/copy
6. **Server Resource Calculator** - Player count, plugins, mode → guidance
7. **Compatibility Helper** - Version + software → verified compatibility matrix

### 7. Downloadable Templates (`public/downloads/`)
- Server setup checklist (.md/.txt)
- Server maintenance checklist
- Staff application template
- Ban appeal template
- Announcement templates
- Server rules template
- Resource documentation template
- Plugin inventory CSV template
- Backup and recovery checklist
- Server launch checklist
- Example config files (paper.yml, spigot.yml, bukkit.yml with license notes)

### 8. Admin Workflows (`src/app/api/admin/`)
- **Authentication check**: Reuse existing auth if present, else simple `ADMIN_TOKEN` env var
- `POST /api/admin/resources` - Create (draft)
- `PATCH /api/admin/resources/[id]` - Update
- `POST /api/admin/resources/[id]/publish` - Publish
- `POST /api/admin/resources/[id]/archive` - Archive
- `DELETE /api/admin/resources/[id]` - Delete (soft)
- Server-side validation on all inputs
- No arbitrary file uploads in this phase

### 9. Premium Product Preparation
- Resource metadata fields: `isPremium`, `externalCheckoutUrl`, `licenseType`
- No payment processing, no fake transactions
- Clear documentation for future integration

### 10. Documentation
- `docs/API.md` - API contracts and examples
- `docs/DATA_MODEL.md` - Resource schema
- `docs/SETUP.md` - Environment variables, seed data, running locally
- `docs/LIMITATIONS.md` - Known limitations, no fake capabilities

### 11. Validation & Testing
- TypeScript type checking (`npm run build`)
- ESLint (`npm run lint`)
- Manual API testing via curl/Postman
- Unit tests for utility functions (if test framework added)

## Coordination Notes
- **Agent 1 (Frontend)**: Will consume `/api/resources` and `/api/resources/[slug]` endpoints. Need stable response shapes.
- **Agent 3 (Security/QA)**: Will review `/api/download`, `/api/admin`, and input validation.
- **Shared files to avoid**: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

## Changed Files (Planned)
```
src/types/resource.ts
src/lib/resources.ts
src/data/resources.json
src/app/api/resources/route.ts
src/app/api/resources/[slug]/route.ts
src/app/api/resources/categories/route.ts
src/app/api/download/[id]/route.ts
src/app/api/admin/resources/route.ts
src/app/api/admin/resources/[id]/route.ts
src/app/api/admin/resources/[id]/publish/route.ts
src/app/api/admin/resources/[id]/archive/route.ts
src/app/tools/motd-previewer/page.tsx
src/app/tools/rank-prefix-previewer/page.tsx
src/app/tools/server-properties-generator/page.tsx
src/app/tools/luckperms-planner/page.tsx
src/app/tools/launch-checklist/page.tsx
src/app/tools/resource-calculator/page.tsx
src/app/tools/compatibility-helper/page.tsx
public/downloads/*.md, *.txt, *.csv, *.yml
docs/API.md
docs/DATA_MODEL.md
docs/SETUP.md
docs/LIMITATIONS.md
```

## Verification Checklist
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `GET /api/resources` returns paginated results with filters
- [ ] `GET /api/resources/[slug]` returns resource detail
- [ ] `GET /api/download/[id]` serves files or redirects to external URLs
- [ ] All 7 developer tools render and function
- [ ] Downloadable templates exist and are valid
- [ ] Admin endpoints require token and validate input
- [ ] No fake statistics, no fake payments, no exposed paths