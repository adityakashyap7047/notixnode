# NOTIXNODE Setup Guide

## Prerequisites

- **Node.js**: 20.x or later
- **npm**: 10.x or later (comes with Node.js)
- **Git**: For version control

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd notixnode

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Environment Variables

Create `.env.local` in the project root:

```bash
# Admin authentication (required for admin API endpoints)
# Generate a secure random token: openssl rand -hex 32
ADMIN_TOKEN=your-secure-admin-token-here

# Allow admin access in development without token (development only)
# ALLOW_DEV_ADMIN=true

# Production URL (for metadata/social images)
# NEXT_PUBLIC_SITE_URL=https://notixnode.example

# Optional: Analytics, error tracking, etc.
# NEXT_PUBLIC_ANALYTICS_ID=
```

### Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_TOKEN` | Bearer token for admin API access. Generate with `openssl rand -hex 32` | Yes (for admin features) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOW_DEV_ADMIN` | Allow admin access in development without token | `false` |
| `NEXT_PUBLIC_SITE_URL` | Production URL for metadata | `http://localhost:3000` |

---

## Project Structure

```
notixnode/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin endpoints (protected)
│   │   │   ├── download/      # Download endpoint
│   │   │   └── resources/     # Resource library endpoints
│   │   ├── resources/         # Resource library pages
│   │   ├── tools/             # Developer tools (7 tools)
│   │   └── tutorials/         # Tutorial pages
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── resources/         # Resource-specific components
│   │   └── layout/            # Layout components (Header, Footer)
│   ├── lib/                   # Core libraries
│   │   ├── auth.ts            # Admin authentication
│   │   ├── resources.ts       # Data layer (CRUD, search, filters)
│   │   └── utils.ts           # Utility functions
│   ├── types/                 # TypeScript types
│   │   └── resource.ts        # Resource data model
│   └── data/                  # Static data
│       └── resources.json     # Seed data (10 example resources)
├── public/
│   └── downloads/             # Downloadable templates (13 files)
├── docs/                      # Documentation
├── .next/                     # Build output (gitignored)
├── node_modules/              # Dependencies (gitignored)
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.mjs          # ESLint configuration
├── package.json               # Project manifest
└── README.md                  # Project overview
```

---

## Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check (runs during build)
npx tsc --noEmit
```

---

## Data Layer

### Development Storage

The application uses file-based JSON storage in development:

- **`src/data/resources.json`** - Main resource database (10 example resources)
- **`src/data/download-counts.json`** - Download counters per resource ID

### Production Migration

To migrate to a database:

1. Replace `src/lib/resources.ts` with a database implementation (Prisma + PostgreSQL recommended)
2. Update the API routes to use the new data layer
3. Set up object storage (S3/R2) for file serving
4. Configure Redis for caching and download counters

The data layer interface in `src/lib/resources.ts` is designed to be swapable:

```typescript
// Current: File-based
export async function getResources(params: ResourceQueryParams): Promise<ResourceListResponse>

// Future: Database
export async function getResources(params: ResourceQueryParams): Promise<ResourceListResponse>
```

---

## Seed Data

The repository includes 10 example resources in `src/data/resources.json` covering all categories:

| ID | Slug | Category | Type | Premium |
|----|------|----------|------|---------|
| ex-1 | essential-plugin-config-starter | plugin-configurations | configuration | No |
| ex-2 | paper-server-optimization-guide | server-setup-guides | guide | No |
| ex-3 | minimal-server-icon-pack | graphics-icons | pack | No |
| ex-4 | medieval-spawn-schematic | maps-builds | pack | No |
| ex-5 | vanilla-plus-resource-pack | resource-packs | pack | No |
| ex-6 | discord-bot-config-template | discord-templates | template | No |
| ex-7 | luckperms-setup-tutorial | tutorials | tutorial | No |
| ex-8 | plugin-dev-utils-library | developer-tools | tool | No |
| ex-9 | premium-custom-enchants-plugin | premium-downloads | tool | Yes |
| ex-10 | server-rules-template | server-setup-guides | template | No |

All seed resources have:
- `isExample: true` - Clearly marked as development examples
- `isDraft: false` / `status: 'published'` - Visible in library
- `downloadCount: 0` - No fake statistics
- Placeholder SHA256 hashes (empty string hash)
- Placeholder image paths (not real images)

---

## Downloadable Templates

Located in `public/downloads/` (13 files):

| File | Description |
|------|-------------|
| `server-setup-checklist.md` | Pre-installation to go-live checklist |
| `server-maintenance-checklist.md` | Ongoing maintenance tasks |
| `staff-application-template.md` | Staff application form template |
| `ban-appeal-template.md` | Ban appeal form template |
| `announcement-templates.md` | Server announcement templates |
| `server-rules-template.md` | Comprehensive server rules |
| `resource-documentation-template.md` | Resource documentation template |
| `plugin-inventory-template.csv` | Plugin tracking spreadsheet |
| `backup-recovery-checklist.md` | Backup and recovery procedures |
| `server-launch-checklist-detailed.md` | Detailed launch checklist |
| `paper.yml.example` | PaperMC configuration template |
| `spigot.yml.example` | Spigot configuration template |
| `bukkit.yml.example` | Bukkit configuration template |

All templates:
- Original content (NOTIXNODE Team)
- Clearly licensed (MIT, CC0, or CC-BY)
- No real secrets, tokens, or passwords
- Validated formats (YAML, CSV, Markdown)

---

## Developer Tools

Seven client-side tools at `/tools/`:

| Tool | Route | Description |
|------|-------|-------------|
| MOTD Previewer | `/tools/motd` | Legacy, MiniMessage, JSON format preview |
| Rank Prefix Previewer | `/tools/prefix` | Gradient, hex, legacy colors with LuckPerms export |
| Server Properties Generator | `/tools/properties` | Interactive server.properties with Paper/Folia presets |
| LuckPerms Permission Planner | `/tools/luckperms-planner` | Visual group/permission planning with command export |
| Server Launch Checklist | `/tools/checklist` | Interactive checklist with progress tracking |
| Server Resource Calculator | `/tools/calculator` | RAM/CPU/storage/bandwidth estimation |
| Compatibility Helper | `/tools/compatibility-helper` | Version/software compatibility matrix |

All tools:
- Run entirely client-side (no server requests)
- Export/copy functionality
- Clear disclaimers (not guarantees)
- Accessible markup

---

## Admin Authentication

Simple token-based authentication:

1. Set `ADMIN_TOKEN` in environment
2. Include header: `Authorization: Bearer <ADMIN_TOKEN>`
3. Admin endpoints at `/api/admin/*`

**Development**: Set `ALLOW_DEV_ADMIN=true` to bypass token (NOT for production).

**Production**: Integrate with NextAuth, Clerk, or similar for proper auth.

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

For static hosting, configure `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // Note: API routes won't work with static export
};
```

---

## Troubleshooting

### Build Fails with "Another next build process is already running"

```bash
# Kill existing Node processes
pkill -f "next"
# Or on Windows:
taskkill /F /IM node.exe

# Clean build cache
rm -rf .next

# Retry
npm run build
```

### OneDrive/Network Drive Issues

Turbopack cache may conflict with OneDrive sync. Solutions:
1. Move project outside OneDrive
2. Set `turbopack.root` in `next.config.ts` (already configured)
3. Disable Turbopack: remove `"@tailwindcss/turbopack"` from devDependencies

### Port 3000 Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
# Or change port
npm run dev -- -p 3001
```

### TypeScript Errors After Dependency Changes

```bash
# Regenerate types
rm -rf .next node_modules
npm install
npm run build
```

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes with tests
4. Run lint and build: `npm run lint && npm run build`
5. Submit pull request

### Code Standards

- TypeScript strict mode
- ESLint with Next.js config
- Tailwind CSS v4 for styling
- Client components marked with `"use client"`
- Server components by default