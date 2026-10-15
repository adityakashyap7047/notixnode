# NOTIXNODE Data Model

Complete TypeScript type definitions for the resource system.

---

## Core Enums

### ResourceCategory
```typescript
type ResourceCategory =
  | 'plugin-configurations'
  | 'server-setup-guides'
  | 'graphics-icons'
  | 'maps-builds'
  | 'resource-packs'
  | 'discord-templates'
  | 'developer-tools'
  | 'tutorials'
  | 'premium-downloads';
```

### ResourceType
```typescript
type ResourceType =
  | 'configuration'
  | 'guide'
  | 'template'
  | 'pack'
  | 'tool'
  | 'tutorial'
  | 'other';
```

### PublicationStatus
```typescript
type PublicationStatus = 'draft' | 'published' | 'archived';
```

### MinecraftVersion
```typescript
type MinecraftVersion =
  | '1.12.2' | '1.13.2' | '1.14.4' | '1.15.2' | '1.16.5'
  | '1.17.1' | '1.18.2' | '1.19.4' | '1.20.4' | '1.21.1'
  | 'latest';
```

### ServerSoftware
```typescript
type ServerSoftware =
  | 'paper' | 'spigot' | 'purpur' | 'fabric' | 'forge' | 'neoforge'
  | 'velocity' | 'bungeecord' | 'waterfall' | 'folia';
```

### ResourceSortOption
```typescript
type ResourceSortOption =
  | 'newest' | 'oldest' | 'alphabetical' | 'popular' | 'updated';
```

---

## Core Interfaces

### ResourceFile
```typescript
interface ResourceFile {
  ref: string;                    // Internal reference key (not a filesystem path)
  filename: string;               // Original filename for download
  contentType: string;            // MIME type
  size: number;                   // File size in bytes
  sha256?: string;                // SHA-256 hash for integrity verification
  externalUrl?: string;           // If externally hosted, the full URL
  isPremium: boolean;             // Whether this file requires premium access
}
```

### ResourceAuthor
```typescript
interface ResourceAuthor {
  id: string;                     // Unique author identifier
  name: string;                   // Display name
  url?: string;                   // Profile URL (GitHub, Discord, website)
  isVerified: boolean;            // Verified publisher badge
}
```

### ResourceDependency
```typescript
interface ResourceDependency {
  name: string;                   // Display name
  version?: string;               // Optional version constraint
  url?: string;                   // Link to dependency resource or external site
  required: boolean;              // Whether required or optional
}
```

### ChangelogEntry
```typescript
interface ChangelogEntry {
  version: string;                // Version string
  date: string;                   // ISO 8601 date
  changes: string[];              // List of changes
}
```

### Resource (Main Entity)
```typescript
interface Resource {
  // Identity
  id: string;                     // UUID v4
  slug: string;                   // URL-safe slug for public URLs

  // Basic Info
  title: string;                  // Display title
  shortDescription: string;       // Max 280 chars for cards/lists
  description: string;            // Full description (Markdown supported)

  // Classification
  category: ResourceCategory;     // Primary category
  resourceType: ResourceType;     // Resource type within category
  tags: string[];                 // Searchable tags

  // Media
  thumbnail?: string;             // Thumbnail image URL (relative or absolute)
  screenshots: string[];          // Additional screenshot URLs

  // Compatibility
  minecraftVersions: MinecraftVersion[];  // Supported Minecraft versions
  serverSoftware: ServerSoftware[];       // Supported server software

  // Dependencies & Installation
  dependencies: ResourceDependency[];
  installationInstructions: string;       // Markdown

  // History
  changelog: ChangelogEntry[];

  // Licensing
  license: string;                // SPDX identifier or custom
  attribution?: string;           // Attribution requirements

  // Authorship
  author: ResourceAuthor;

  // Premium/Monetization
  isPremium: boolean;             // Free or premium classification
  externalCheckoutUrl?: string;   // Premium checkout URL (if applicable)
  licenseType?: 'single' | 'subscription' | 'server' | 'network';

  // Files
  files: ResourceFile[];

  // Status
  status: PublicationStatus;      // Publication status
  isFeatured: boolean;            // Featured flag
  isExample: boolean;             // Example/draft marker for development

  // Timestamps
  createdAt: string;              // ISO 8601 creation timestamp
  updatedAt: string;              // ISO 8601 last update timestamp

  // Statistics (only if genuinely tracked)
  downloadCount?: number;         // Self-reported download count
  verifiedDownloadCount?: number; // Verified download count (separate)
}
```

---

## API Response Types

### ResourceListResponse
```typescript
interface ResourceListResponse {
  resources: Resource[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    category?: ResourceCategory;
    resourceType?: ResourceType;
    minecraftVersion?: MinecraftVersion;
    serverSoftware?: ServerSoftware;
    search?: string;
    sort: ResourceSortOption;
  };
}
```

### ResourceDetailResponse
```typescript
interface ResourceDetailResponse {
  resource: Resource;
  related: Pick<Resource, 'id' | 'slug' | 'title' | 'thumbnail' | 'category'>[];
}
```

### CategoriesResponse
```typescript
interface CategoriesResponse {
  categories: {
    value: ResourceCategory;
    label: string;
    description: string;
    icon: string;
    count: number;
  }[];
  resourceTypes: {
    value: ResourceType;
    label: string;
    description: string;
  }[];
}
```

### ApiErrorResponse
```typescript
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

---

## Query Parameters

### ResourceQueryParams
```typescript
interface ResourceQueryParams {
  page?: number;                  // Page number (1-indexed, default: 1)
  pageSize?: number;              // Items per page (default: 12, max: 50)
  category?: ResourceCategory;    // Category filter
  resourceType?: ResourceType;    // Resource type filter
  minecraftVersion?: MinecraftVersion;  // Minecraft version filter
  serverSoftware?: ServerSoftware;      // Server software filter
  search?: string;                // Search query
  sort?: ResourceSortOption;      // Sort option (default: 'newest')
  status?: PublicationStatus;     // Status filter (default: 'published')
  includeDrafts?: boolean;        // Include drafts (default: false)
  includeExamples?: boolean;      // Include example resources (default: false)
}
```

---

## Download Types

### DownloadValidationResult
```typescript
interface DownloadValidationResult {
  valid: boolean;
  resource?: Resource;
  file?: ResourceFile;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## Admin Types

### AdminOperationResult
```typescript
interface AdminOperationResult {
  success: boolean;
  resource?: Resource;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

---

## Metadata Constants

### CATEGORY_METADATA
```typescript
const CATEGORY_METADATA: Record<ResourceCategory, { label: string; description: string; icon: string }> = {
  'plugin-configurations': { label: 'Plugin Configurations', description: 'Ready-to-use configuration files for popular plugins', icon: '⚙️' },
  'server-setup-guides': { label: 'Server Setup Guides', description: 'Step-by-step guides for server installation and configuration', icon: '📖' },
  'graphics-icons': { label: 'Graphics & Icons', description: 'Server icons, logos, banners, and graphical assets', icon: '🎨' },
  'maps-builds': { label: 'Maps & Builds', description: 'Custom maps, spawn builds, and schematic files', icon: '🗺️' },
  'resource-packs': { label: 'Resource Packs', description: 'Texture packs, models, and client-side resource packs', icon: '📦' },
  'discord-templates': { label: 'Discord Templates', description: 'Discord server templates, bot configs, and role setups', icon: '💬' },
  'developer-tools': { label: 'Developer Tools', description: 'Utilities, scripts, and tools for server developers', icon: '🛠️' },
  'tutorials': { label: 'Tutorials', description: 'Educational content for server administration and development', icon: '📚' },
  'premium-downloads': { label: 'Premium Downloads', description: 'Curated premium resources with external checkout', icon: '⭐' },
};
```

### RESOURCE_TYPE_METADATA
```typescript
const RESOURCE_TYPE_METADATA: Record<ResourceType, { label: string; description: string }> = {
  configuration: { label: 'Configuration', description: 'Config files (YAML, JSON, HOCON, TOML)' },
  guide: { label: 'Guide', description: 'Step-by-step instructions and documentation' },
  template: { label: 'Template', description: 'Starter templates and boilerplate' },
  pack: { label: 'Pack', description: 'Resource packs, data packs, mod packs' },
  tool: { label: 'Tool', description: 'Scripts, utilities, and developer tools' },
  tutorial: { label: 'Tutorial', description: 'Educational walkthroughs' },
  other: { label: 'Other', description: 'Miscellaneous resources' },
};
```

### Validation Arrays
```typescript
const MINECRAFT_VERSIONS: MinecraftVersion[] = [
  '1.12.2', '1.13.2', '1.14.4', '1.15.2', '1.16.5',
  '1.17.1', '1.18.2', '1.19.4', '1.20.4', '1.21.1', 'latest',
];

const SERVER_SOFTWARE: ServerSoftware[] = [
  'paper', 'spigot', 'purpur', 'fabric', 'forge', 'neoforge',
  'velocity', 'bungeecord', 'waterfall', 'folia',
];
```

### Pagination Constants
```typescript
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
```

---

## Seed Data Structure

Example resources in `src/data/resources.json` follow the `Resource` interface with:
- `isExample: true` - marks development/sample resources
- `isDraft: true` for drafts (or `status: 'draft'`)
- `downloadCount: 0` - no fake statistics
- `verifiedDownloadCount: 0` - no fake verified counts
- Placeholder SHA256 hashes (`e3b0c442...` - SHA256 of empty string)
- Placeholder thumbnail/screenshot paths (`/images/resources/...`)

---

## Storage

### Development (File-based JSON)
- `src/data/resources.json` - Main resource data
- `src/data/download-counts.json` - Download counters

### Production (Planned)
- PostgreSQL with Prisma ORM
- Object storage (S3/R2) for files
- Redis for caching/download counters

---

## Validation Rules

### Slug Generation
- Lowercase, alphanumeric + hyphens
- Max 80 characters
- Must be unique

### File References
- `ref` must be unique within resource
- No path traversal (`../`, absolute paths)
- `externalUrl` must be valid HTTPS URL

### Premium Files
- `isPremium: true` requires entitlement check (TODO)
- `externalCheckoutUrl` required for premium resources
- `licenseType` required for premium

### Status Transitions
```
draft → published → archived
  ↓         ↓
archived  archived
```

---

## Example Resource (JSON)

```json
{
  "id": "ex-1",
  "slug": "essential-plugin-config-starter",
  "title": "Essential Plugin Configuration Starter",
  "shortDescription": "A clean, documented config.yml template for EssentialsX",
  "description": "# Essential Plugin Configuration Starter\n\nThis is an **example resource**...",
  "category": "plugin-configurations",
  "resourceType": "configuration",
  "tags": ["essentialsx", "survival", "config"],
  "thumbnail": "/images/resources/essentials-config-thumb.png",
  "screenshots": ["/images/resources/essentials-config-preview.png"],
  "minecraftVersions": ["1.20.4", "1.21.1", "latest"],
  "serverSoftware": ["paper", "spigot", "purpur"],
  "dependencies": [
    { "name": "EssentialsX", "version": "2.20.0+", "url": "https://essentialsx.net/", "required": true }
  ],
  "installationInstructions": "1. Download...\n2. Place in plugins/Essentials/\n3. Restart server",
  "changelog": [{ "version": "1.0.0", "date": "2024-01-15", "changes": ["Initial template release"] }],
  "license": "MIT",
  "author": { "id": "notixnode-team", "name": "NOTIXNODE Team", "url": "https://github.com/notixnode", "isVerified": true },
  "isPremium": false,
  "files": [{
    "ref": "config-yml",
    "filename": "config.yml",
    "contentType": "text/yaml",
    "size": 12450,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "isPremium": false
  }],
  "status": "published",
  "isFeatured": true,
  "isExample": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "downloadCount": 0,
  "verifiedDownloadCount": 0
}
```