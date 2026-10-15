/**
 * NOTIXNODE Resource Data Model
 * Core types for the resource library and API contracts.
 */

export type ResourceCategory =
  | 'plugin-configurations'
  | 'server-setup-guides'
  | 'graphics-icons'
  | 'maps-builds'
  | 'resource-packs'
  | 'discord-templates'
  | 'developer-tools'
  | 'tutorials'
  | 'premium-downloads';

export type ResourceType = 'configuration' | 'guide' | 'template' | 'pack' | 'tool' | 'tutorial' | 'other';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type MinecraftVersion =
  | '1.12.2'
  | '1.13.2'
  | '1.14.4'
  | '1.15.2'
  | '1.16.5'
  | '1.17.1'
  | '1.18.2'
  | '1.19.4'
  | '1.20.4'
  | '1.21.1'
  | 'latest';

export type ServerSoftware =
  | 'paper'
  | 'spigot'
  | 'purpur'
  | 'fabric'
  | 'forge'
  | 'neoforge'
  | 'velocity'
  | 'bungeecord'
  | 'waterfall'
  | 'folia';

export interface ResourceFile {
  /** Internal reference key (not a filesystem path) */
  ref: string;
  /** Original filename for download */
  filename: string;
  /** MIME type */
  contentType: string;
  /** File size in bytes */
  size: number;
  /** SHA-256 hash for integrity verification */
  sha256?: string;
  /** If externally hosted, the full URL */
  externalUrl?: string;
  /** Whether this file requires premium access */
  isPremium: boolean;
}

export interface ResourceAuthor {
  id: string;
  name: string;
  /** Profile URL (GitHub, Discord, website) */
  url?: string;
  /** Verified publisher badge */
  isVerified: boolean;
}

export interface ResourceDependency {
  /** Display name */
  name: string;
  /** Optional version constraint */
  version?: string;
  /** Link to dependency resource or external site */
  url?: string;
  /** Whether required or optional */
  required: boolean;
}

export interface ChangelogEntry {
  version: string;
  date: string; // ISO 8601
  changes: string[];
}

export interface Resource {
  /** Unique identifier (UUID) */
  id: string;
  /** URL-safe slug for public URLs */
  slug: string;
  /** Display title */
  title: string;
  /** Short description for cards/lists (max 280 chars) */
  shortDescription: string;
  /** Full description (Markdown supported) */
  description: string;
  /** Primary category */
  category: ResourceCategory;
  /** Resource type within category */
  resourceType: ResourceType;
  /** Searchable tags */
  tags: string[];
  /** Thumbnail image URL (relative or absolute) */
  thumbnail?: string;
  /** Additional screenshot URLs */
  screenshots: string[];
  /** Supported Minecraft versions */
  minecraftVersions: MinecraftVersion[];
  /** Supported server software */
  serverSoftware: ServerSoftware[];
  /** Dependencies */
  dependencies: ResourceDependency[];
  /** Installation instructions (Markdown) */
  installationInstructions: string;
  /** Changelog */
  changelog: ChangelogEntry[];
  /** License identifier (SPDX) or custom */
  license: string;
  /** Attribution requirements */
  attribution?: string;
  /** Author/publisher */
  author: ResourceAuthor;
  /** Free or premium classification */
  isPremium: boolean;
  /** Premium checkout URL (if applicable) */
  externalCheckoutUrl?: string;
  /** License type for premium */
  licenseType?: 'single' | 'subscription' | 'server' | 'network';
  /** Associated files */
  files: ResourceFile[];
  /** Publication status */
  status: PublicationStatus;
  /** Featured flag */
  isFeatured: boolean;
  /** Example/draft marker for development */
  isExample: boolean;
  /** Creation timestamp (ISO 8601) */
  createdAt: string;
  /** Last update timestamp (ISO 8601) */
  updatedAt: string;
  /** Download count (only if genuinely tracked) */
  downloadCount?: number;
  /** Verified download count (separate from self-reported) */
  verifiedDownloadCount?: number;
}

/** API Response: Resource List */
export interface ResourceListResponse {
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

/** API Response: Single Resource */
export interface ResourceDetailResponse {
  resource: Resource;
  /** Related resources by same author or category */
  related: Pick<Resource, 'id' | 'slug' | 'title' | 'thumbnail' | 'category'>[];
}

/** API Response: Categories */
export interface CategoriesResponse {
  categories: {
    value: ResourceCategory;
    label: string;
    description: string;
    count: number;
  }[];
  resourceTypes: {
    value: ResourceType;
    label: string;
    description: string;
  }[];
}

/** API Response: Error */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/** Sort options */
export type ResourceSortOption =
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'popular'
  | 'updated';

/** Search/Filter parameters */
export interface ResourceQueryParams {
  page?: number;
  pageSize?: number;
  category?: ResourceCategory;
  resourceType?: ResourceType;
  minecraftVersion?: MinecraftVersion;
  serverSoftware?: ServerSoftware;
  search?: string;
  sort?: ResourceSortOption;
  status?: PublicationStatus;
  includeDrafts?: boolean;
  includeExamples?: boolean;
}

/** Download validation result */
export interface DownloadValidationResult {
  valid: boolean;
  resource?: Resource;
  file?: ResourceFile;
  error?: {
    code: string;
    message: string;
  };
}

/** Admin operation result */
export interface AdminOperationResult {
  success: boolean;
  resource?: Resource;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/** Category metadata for UI */
export const CATEGORY_METADATA: Record<ResourceCategory, { label: string; description: string; icon: string }> = {
  'plugin-configurations': {
    label: 'Plugin Configurations',
    description: 'Ready-to-use configuration files for popular plugins',
    icon: '⚙️',
  },
  'server-setup-guides': {
    label: 'Server Setup Guides',
    description: 'Step-by-step guides for server installation and configuration',
    icon: '📖',
  },
  'graphics-icons': {
    label: 'Graphics & Icons',
    description: 'Server icons, logos, banners, and graphical assets',
    icon: '🎨',
  },
  'maps-builds': {
    label: 'Maps & Builds',
    description: 'Custom maps, spawn builds, and schematic files',
    icon: '🗺️',
  },
  'resource-packs': {
    label: 'Resource Packs',
    description: 'Texture packs, models, and client-side resource packs',
    icon: '📦',
  },
  'discord-templates': {
    label: 'Discord Templates',
    description: 'Discord server templates, bot configs, and role setups',
    icon: '💬',
  },
  'developer-tools': {
    label: 'Developer Tools',
    description: 'Utilities, scripts, and tools for server developers',
    icon: '🛠️',
  },
  tutorials: {
    label: 'Tutorials',
    description: 'Educational content for server administration and development',
    icon: '📚',
  },
  'premium-downloads': {
    label: 'Premium Downloads',
    description: 'Curated premium resources with external checkout',
    icon: '⭐',
  },
};

/** Resource type metadata */
export const RESOURCE_TYPE_METADATA: Record<ResourceType, { label: string; description: string }> = {
  configuration: { label: 'Configuration', description: 'Config files (YAML, JSON, HOCON, TOML)' },
  guide: { label: 'Guide', description: 'Step-by-step instructions and documentation' },
  template: { label: 'Template', description: 'Starter templates and boilerplate' },
  pack: { label: 'Pack', description: 'Resource packs, data packs, mod packs' },
  tool: { label: 'Tool', description: 'Scripts, utilities, and developer tools' },
  tutorial: { label: 'Tutorial', description: 'Educational walkthroughs' },
  other: { label: 'Other', description: 'Miscellaneous resources' },
};

/** Known Minecraft versions for validation */
export const MINECRAFT_VERSIONS: MinecraftVersion[] = [
  '1.12.2',
  '1.13.2',
  '1.14.4',
  '1.15.2',
  '1.16.5',
  '1.17.1',
  '1.18.2',
  '1.19.4',
  '1.20.4',
  '1.21.1',
  'latest',
];

/** Known server software for validation */
export const SERVER_SOFTWARE: ServerSoftware[] = [
  'paper',
  'spigot',
  'purpur',
  'fabric',
  'forge',
  'neoforge',
  'velocity',
  'bungeecord',
  'waterfall',
  'folia',
];

/** Default pagination */
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;