# NOTIXNODE Limitations & Known Issues

This document honestly describes the current limitations, missing features, and known issues. No fake capabilities are claimed.

---

## Architecture Limitations

### File-Based Storage (Development Only)

**Current**: JSON files in `src/data/`
- Not suitable for production
- No concurrent write handling
- No indexing or query optimization
- Download counters may race condition

**Planned**: PostgreSQL + Prisma + Redis + Object Storage

### No Real Database

- All data operations are in-memory with file persistence
- No transactions, no migrations, no relationships enforcement
- Admin operations rewrite entire JSON files

### No Authentication System

- Admin: Simple Bearer token (`ADMIN_TOKEN` env var)
- No user accounts, no OAuth, no sessions
- No password reset, no email verification
- No role-based access beyond admin/non-admin

---

## Resource Library Limitations

### Search & Filtering

- **In-memory filtering only** - loads all resources, then filters
- No full-text search (PostgreSQL tsvector, Meilisearch, Algolia)
- No faceted search UI
- Search matches substrings only (no stemming, synonyms, typo tolerance)

### Pagination

- Offset-based pagination (inefficient for large datasets)
- No cursor-based pagination
- Total count requires loading all filtered items

### Resource Detail

- Related resources: simple category/author match, no ML recommendations
- No version history UI (changelog only)
- No dependency resolution graph
- No real-time compatibility checking

### Download Tracking

- Simple counter in JSON file
- No unique visitor tracking
- No geographic or referrer analytics
- Race condition possible on concurrent downloads

---

## Download System Limitations

### Local File Serving

- Files served from `public/downloads/{ref}/` in development
- **No signed URLs, no CDN, no object storage integration**
- No range requests (resume interrupted downloads)
- No streaming for large files (loads entire file into memory)
- `FILE_UNAVAILABLE` error if file not found locally

### Premium/Private Access

- **Entitlement check is a placeholder** (logs warning only)
- No license validation, no purchase verification
- No subscription status checking
- No download limits or rate limiting

### External URLs

- Redirects (302) to external URLs
- No proxy/streaming through our domain
- No referral tracking on external redirects
- No validation that external URL still exists

---

## Admin Workflow Limitations

### No File Upload

- Admin API accepts file metadata only (`ref`, `filename`, `contentType`, `size`, `sha256`, `externalUrl`)
- **No multipart/form-data upload endpoint**
- Files must be manually placed in storage
- No virus scanning, no type validation beyond MIME string

### No Rich Text Editor

- Description/Instructions: raw Markdown in JSON
- No WYSIWYG editor in admin UI
- No live preview in admin

### No Audit Log

- No record of who created/updated/deleted resources
- No timestamps on admin actions beyond `updatedAt`

### No Bulk Operations

- No bulk publish/archive/delete
- No CSV import/export for resources

---

## Developer Tools Limitations

### All Tools Are Client-Side

**Pros**: No server load, works offline, privacy-friendly
**Cons**: No persistence, no sharing, no collaboration

### MOTD Previewer

- Legacy code parsing: basic regex, not full specification
- MiniMessage: limited tag support (no nested gradients, no click/hover events)
- JSON: basic text component rendering only
- No Bedrock-specific formatting (bold/italic only via § codes)

### Rank Prefix Previewer

- Gradient: CSS linear-gradient only (no Minecraft gradient format)
- LuckPerms export: YAML format only, no SQL/JSON storage formats
- No context/permission preview (only prefix/suffix)
- No weight/inheritance conflict detection

### Server Properties Generator

- **Estimates only** - not validated against actual server software
- No version-specific property validation (shows all properties for all versions)
- No JVM flag generator (separate tool needed)
- Presets based on community knowledge, not official recommendations

### LuckPerms Permission Planner

- **Generates commands only** - does not connect to LuckPerms API
- No live validation against running server
- No context support in UI (world/server contexts in export only)
- No permission node autocomplete (manual entry)
- Circular inheritance detection: basic only (direct parent only)

### Server Launch Checklist

- **LocalStorage only** - no cloud sync, no multi-user
- No email/notification reminders
- No template customization (fixed checklist)
- Export: Markdown only (no PDF, no CSV)

### Server Resource Calculator

- **Rough estimates only** - explicitly not guarantees
- Based on community heuristics, not benchmarks
- No modpack-specific calculations (Forge/Fabric overhead varies wildly)
- No database sizing (just +2GB)
- No network topology consideration (proxy, CDN, load balancer)

### Compatibility Helper

- **Static data only** - no live API queries
- Data current as of 2024 (may be outdated)
- No plugin/mod compatibility (only server software)
- No version range support (exact versions only)
- "Unverified" ≠ "Doesn't work" - means "not officially confirmed"

---

## Frontend/UI Limitations

### No Server-Side Rendering for Tools

- All 7 tools are `"use client"` - full hydration cost
- No streaming, no progressive enhancement

### No Design System Documentation

- UI components in `src/components/ui/` lack Storybook/docs
- Inconsistent prop interfaces across components

### Accessibility

- Basic ARIA labels present
- No formal accessibility audit
- Color contrast not systematically verified
- Keyboard navigation not fully tested

### Responsive Design

- Mobile layouts functional but not polished
- Some tables overflow on small screens
- Tool UIs dense on mobile

---

## Missing Features (Not Implemented)

### Resource Features
- [ ] Resource ratings/reviews
- [ ] Resource favorites/bookmarks
- [ ] Resource collections/lists
- [ ] Version download history
- [ ] Dependency installation order
- [ ] Automatic update notifications
- [ ] Resource fork/derivative tracking
- [ ] Translations/localization

### Search Features
- [ ] Full-text search with ranking
- [ ] Search suggestions/autocomplete
- [ ] Filter by multiple categories
- [ ] Filter by date range
- [ ] Sort by download count (real)
- [ ] Save searches/alerts

### User Features
- [ ] User accounts (GitHub, Discord, email)
- [ ] Profile pages
- [ ] Submission workflow (community resources)
- [ ] Moderation queue
- [ ] Comment system
- [ ] Follow authors/tags

### Premium/Commerce
- [ ] Payment provider integration (Stripe, Paddle, etc.)
- [ ] License key generation/validation
- [ ] Subscription management
- [ ] Refund handling
- [ ] Tax calculation (VAT, sales tax)
- [ ] Affiliate/referral system

### Admin Features
- [ ] File upload with validation
- [ ] Rich text editor for descriptions
- [ ] Bulk operations
- [ ] Analytics dashboard
- [ ] Audit log
- [ ] Role-based admin permissions

### Technical
- [ ] Automated tests (unit, integration, E2E)
- [ ] CI/CD pipeline
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] CDN integration
- [ ] Database migrations
- [ ] Backup/restore procedures

---

## Security Considerations

### Current State

- No CSP headers configured
- No rate limiting on API
- No input sanitization beyond TypeScript types
- Admin token in plain text (env var)
- No CORS policy
- No security headers middleware

### Required for Production

- [ ] Implement CSP, HSTS, X-Frame-Options
- [ ] Add rate limiting (API + download)
- [ ] Add request validation/sanitization
- [ ] Rotate admin token regularly
- [ ] Add audit logging
- [ ] Implement proper auth (NextAuth/Clerk)
- [ ] Add dependency scanning (npm audit, Snyk)
- [ ] Penetration testing

---

## Performance

### Current Metrics (Development)

- First load: ~2-3s (Turbopack dev)
- Build time: ~30-60s
- Bundle size: Not optimized
- No caching strategy for API responses beyond Cache-Control headers

### Needed Optimizations

- [ ] React Server Components for non-interactive pages
- [ ] Image optimization (next/image)
- [ ] Font optimization (next/font)
- [ ] Code splitting for tools
- [ ] API response caching (Redis)
- [ ] Database connection pooling
- [ ] CDN for static assets

---

## Browser Support

### Tested
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

### Not Tested
- Older browsers
- Mobile browsers extensively
- Screen readers
- Text-only browsers

---

## Legal/Compliance

### Not Implemented
- [ ] GDPR data export/delete
- [ ] Cookie consent banner
- [ ] Terms of Service acceptance tracking
- [ ] Age verification (COPPA/GDPR)
- [ ] DMCA takedown process
- [ ] Accessibility compliance (WCAG 2.1 AA)

---

## Honest Assessment

### What Works Well
- Resource data model and API contracts
- 7 developer tools with client-side logic
- Downloadable templates (13 original files)
- Category/tag/search/filter/sort/pagination
- Admin CRUD with validation
- TypeScript strict mode throughout

### What Needs Work Before Production
1. **Database + real auth** (critical)
2. **File storage + CDN** (critical for downloads)
3. **Premium entitlement system** (if monetizing)
4. **Automated testing** (CI/CD)
5. **Security hardening** (headers, rate limits, validation)
6. **Accessibility audit**
7. **Performance optimization**
8. **Monitoring/error tracking**

### What Will Not Be Implemented (By Design)
- Payment processing (use external providers)
- User-generated content moderation (manual review only)
- Real-time features (WebSockets)
- Multi-language support (English only)
- Legacy Minecraft version support (< 1.12.2)

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | 2024-10-15 | Initial implementation (Agent 2) |

---

*This document is maintained alongside the codebase. Update when limitations are addressed or new ones discovered.*