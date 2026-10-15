/**
 * NOTIXNODE Resource Data Layer
 * File-based JSON storage for development. Replace with database in production.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type {
  Resource,
  ResourceListResponse,
  ResourceDetailResponse,
  CategoriesResponse,
  ResourceQueryParams,
  ResourceSortOption,
  ResourceCategory,
  ResourceType,
  PublicationStatus,
  DownloadValidationResult,
  AdminOperationResult,
  MinecraftVersion,
  ServerSoftware,
  ResourceFile,
  ChangelogEntry,
  ResourceDependency,
  ResourceAuthor,
} from '@/types/resource';

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json');
const DOWNLOAD_COUNTS_FILE = path.join(DATA_DIR, 'download-counts.json');

// In-memory cache
let resourcesCache: Resource[] | null = null;
let downloadCountsCache: Record<string, number> | null = null;

// Type for status filter that includes 'all'
type StatusFilter = PublicationStatus | 'all';

/** Ensure data directory exists */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/** Load resources from JSON file */
async function loadResources(): Promise<Resource[]> {
  if (resourcesCache) return resourcesCache;

  await ensureDataDir();

  try {
    const data = await fs.readFile(RESOURCES_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Resource[];
    resourcesCache = parsed;
    return resourcesCache;
  } catch (error) {
    // File doesn't exist or invalid JSON - return empty array
    resourcesCache = [];
    return [];
  }
}

/** Save resources to JSON file */
async function saveResources(resources: Resource[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf-8');
  resourcesCache = resources;
}

/** Load download counts */
async function loadDownloadCounts(): Promise<Record<string, number>> {
  if (downloadCountsCache) return downloadCountsCache;

  try {
    const data = await fs.readFile(DOWNLOAD_COUNTS_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Record<string, number>;
    downloadCountsCache = parsed;
    return downloadCountsCache;
  } catch {
    downloadCountsCache = {};
    return {};
  }
}

/** Save download counts */
async function saveDownloadCounts(counts: Record<string, number>): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DOWNLOAD_COUNTS_FILE, JSON.stringify(counts, null, 2), 'utf-8');
  downloadCountsCache = counts;
}

/** Generate a simple UUID v4 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Generate slug from title */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
}

/** Validate and normalize sort option */
export function normalizeSort(sort?: string): ResourceSortOption {
  const validSorts: ResourceSortOption[] = ['newest', 'oldest', 'alphabetical', 'popular', 'updated'];
  return validSorts.includes(sort as ResourceSortOption) ? (sort as ResourceSortOption) : 'newest';
}

/** Validate page and pageSize */
function normalizePagination(page?: number, pageSize?: number): { page: number; pageSize: number } {
  const p = Math.max(1, Math.floor(page || 1));
  const ps = Math.min(Math.max(1, Math.floor(pageSize || 12)), 50);
  return { page: p, pageSize: ps };
}

/** Filter resources based on query params */
function filterResources(resources: Resource[], params: ResourceQueryParams): Resource[] {
  let filtered = [...resources];

  // Status filter
  const status = (params.status as StatusFilter) || 'published';
  if (status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }

  // Exclude drafts unless explicitly included
  if (!params.includeDrafts) {
    filtered = filtered.filter((r) => r.status !== 'draft');
  }

  // Exclude examples only if explicitly set to false
  if (params.includeExamples === false) {
    filtered = filtered.filter((r) => !r.isExample);
  }

  // Category filter
  if (params.category) {
    filtered = filtered.filter((r) => r.category === params.category);
  }

  // Resource type filter
  if (params.resourceType) {
    filtered = filtered.filter((r) => r.resourceType === params.resourceType);
  }

  // Minecraft version filter
  if (params.minecraftVersion) {
    filtered = filtered.filter((r) => r.minecraftVersions.includes(params.minecraftVersion!));
  }

  // Server software filter
  if (params.serverSoftware) {
    filtered = filtered.filter((r) => r.serverSoftware.includes(params.serverSoftware!));
  }

  // Search filter (title, shortDescription, description, tags)
  if (params.search) {
    const searchLower = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(searchLower) ||
        r.shortDescription.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}

/** Sort resources */
function sortResources(resources: Resource[], sort: ResourceSortOption): Resource[] {
  const sorted = [...resources];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'popular':
      return sorted.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    default:
      return sorted;
  }
}

/** Paginate resources */
function paginateResources<T>(resources: T[], page: number, pageSize: number): {
  items: T[];
  pagination: ResourceListResponse['pagination'];
} {
  const totalItems = resources.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = resources.slice(start, end);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/** Get related resources */
function getRelatedResources(resources: Resource[], current: Resource, limit = 4): Resource[] {
  return resources
    .filter((r) => r.id !== current.id && r.status === 'published')
    .filter((r) => r.category === current.category || r.author.id === current.author.id)
    .sort((a, b) => {
      // Prioritize same category, then same author
      const aSameCat = a.category === current.category ? 1 : 0;
      const bSameCat = b.category === current.category ? 1 : 0;
      if (aSameCat !== bSameCat) return bSameCat - aSameCat;
      const aSameAuthor = a.author.id === current.author.id ? 1 : 0;
      const bSameAuthor = b.author.id === current.author.id ? 1 : 0;
      return bSameAuthor - aSameAuthor;
    })
    .slice(0, limit);
}

/** Increment download count */
export async function incrementDownloadCount(resourceId: string): Promise<number> {
  const counts = await loadDownloadCounts();
  const newCount = (counts[resourceId] || 0) + 1;
  counts[resourceId] = newCount;
  await saveDownloadCounts(counts);

  // Also update resource cache
  const resources = await loadResources();
  const resource = resources.find((r) => r.id === resourceId);
  if (resource) {
    resource.downloadCount = newCount;
    await saveResources(resources);
  }

  return newCount;
}

/**
 * PUBLIC API
 */

/** Get paginated, filtered, sorted resource list */
export async function getResources(params: ResourceQueryParams = {}): Promise<ResourceListResponse> {
  const resources = await loadResources();
  const { page, pageSize } = normalizePagination(params.page, params.pageSize);
  const sort = normalizeSort(params.sort);

  const filtered = filterResources(resources, params);
  const sorted = sortResources(filtered, sort);
  const { items, pagination } = paginateResources(sorted, page, pageSize);

  return {
    resources: items,
    pagination,
    filters: {
      category: params.category,
      resourceType: params.resourceType,
      minecraftVersion: params.minecraftVersion,
      serverSoftware: params.serverSoftware,
      search: params.search,
      sort,
    },
  };
}

/** Get single resource by slug */
export async function getResourceBySlug(slug: string, includeDrafts = false, includeExamples = true): Promise<ResourceDetailResponse | null> {
  const resources = await loadResources();
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) return null;
  if (resource.status !== 'published' && !includeDrafts) return null;
  if (resource.isExample && !includeExamples) return null;

  const related = getRelatedResources(resources, resource);

  return {
    resource,
    related,
  };
}

/** Get single resource by ID */
export async function getResourceById(id: string, includeDrafts = false, includeExamples = true): Promise<Resource | null> {
  const resources = await loadResources();
  const resource = resources.find((r) => r.id === id);

  if (!resource) return null;
  if (resource.status !== 'published' && !includeDrafts) return null;
  if (resource.isExample && !includeExamples) return null;

  return resource;
}

/** Get categories with counts */
export async function getCategories(): Promise<CategoriesResponse> {
  const resources = await loadResources();
  const published = resources.filter((r) => r.status === 'published');

  const categoryCounts: Record<ResourceCategory, number> = {
    'plugin-configurations': 0,
    'server-setup-guides': 0,
    'graphics-icons': 0,
    'maps-builds': 0,
    'resource-packs': 0,
    'discord-templates': 0,
    'developer-tools': 0,
    tutorials: 0,
    'premium-downloads': 0,
  };

  for (const r of published) {
    categoryCounts[r.category]++;
  }

  const { CATEGORY_METADATA, RESOURCE_TYPE_METADATA } = await import('@/types/resource');

  return {
    categories: Object.entries(categoryCounts).map(([value, count]) => ({
      value: value as ResourceCategory,
      label: CATEGORY_METADATA[value as ResourceCategory].label,
      description: CATEGORY_METADATA[value as ResourceCategory].description,
      count,
    })),
    resourceTypes: Object.entries(RESOURCE_TYPE_METADATA).map(([value, meta]) => ({
      value: value as ResourceType,
      label: meta.label,
      description: meta.description,
    })),
  };
}

/** Validate download access and return file info */
export async function validateDownload(resourceId: string, fileRef?: string): Promise<DownloadValidationResult> {
  const resource = await getResourceById(resourceId, true, true); // Allow drafts/examples for download

  if (!resource) {
    return { valid: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } };
  }

  if (resource.status === 'archived') {
    return { valid: false, error: { code: 'ARCHIVED', message: 'Resource is archived' } };
  }

  if (!resource.files || resource.files.length === 0) {
    return { valid: false, error: { code: 'FILE_NOT_FOUND', message: 'Resource has no downloadable files configured' } };
  }

  const file = fileRef
    ? resource.files.find((f) => f.ref === fileRef || f.filename === fileRef)
    : resource.files[0];

  if (!file) {
    return { valid: false, error: { code: 'FILE_NOT_FOUND', message: `File '${fileRef}' not found in resource` } };
  }

  // Check premium entitlement
  if (file.isPremium || resource.isPremium) {
    if (resource.externalCheckoutUrl) {
      return {
        valid: false,
        error: {
          code: 'PREMIUM_REQUIRED',
          message: 'This is a premium resource. Please purchase through the official checkout provider.',
        },
      };
    }
  }

  return { valid: true, resource, file };
}

/** Create new resource (admin) */
export async function createResource(data: Omit<Resource, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'downloadCount'>): Promise<AdminOperationResult> {
  const resources = await loadResources();

  // Check slug uniqueness
  const slug = generateSlug(data.title);
  const existingSlug = resources.find((r) => r.slug === slug);
  if (existingSlug) {
    return {
      success: false,
      error: { code: 'DUPLICATE_SLUG', message: 'A resource with this title already exists' },
    };
  }

  const now = new Date().toISOString();
  const newResource: Resource = {
    ...data,
    id: generateId(),
    slug,
    createdAt: now,
    updatedAt: now,
    downloadCount: 0,
  };

  resources.push(newResource);
  await saveResources(resources);

  return { success: true, resource: newResource };
}

/** Update resource (admin) */
export async function updateResource(id: string, data: Partial<Resource>): Promise<AdminOperationResult> {
  const resources = await loadResources();
  const index = resources.findIndex((r) => r.id === id);

  if (index === -1) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } };
  }

  // Prevent changing immutable fields
  const allowedData: Partial<Resource> = { ...data };
  delete allowedData.id;
  delete allowedData.slug;
  delete allowedData.createdAt;
  delete allowedData.downloadCount;

  // If title changed, check slug uniqueness
  if (data.title && data.title !== resources[index].title) {
    const newSlug = generateSlug(data.title);
    const existingSlug = resources.find((r) => r.slug === newSlug && r.id !== id);
    if (existingSlug) {
      return {
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'A resource with this title already exists' },
      };
    }
    allowedData.slug = newSlug;
  }

  const updated: Resource = {
    ...resources[index],
    ...allowedData,
    updatedAt: new Date().toISOString(),
  };

  resources[index] = updated;
  await saveResources(resources);

  return { success: true, resource: updated };
}

/** Publish resource (admin) */
export async function publishResource(id: string): Promise<AdminOperationResult> {
  return updateResource(id, { status: 'published' });
}

/** Archive resource (admin) */
export async function archiveResource(id: string): Promise<AdminOperationResult> {
  return updateResource(id, { status: 'archived' });
}

/** Soft delete resource (admin) */
export async function deleteResource(id: string): Promise<AdminOperationResult> {
  const resources = await loadResources();
  const index = resources.findIndex((r) => r.id === id);

  if (index === -1) {
    return { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } };
  }

  // Soft delete by archiving
  resources[index] = { ...resources[index], status: 'archived', updatedAt: new Date().toISOString() };
  await saveResources(resources);

  return { success: true, resource: resources[index] };
}

/** Get all resources for admin (including drafts/archived) */
export async function getAllResourcesAdmin(): Promise<Resource[]> {
  return loadResources();
}

/** Search resources (simplified for autocomplete) */
export async function searchResources(query: string, limit = 10): Promise<Pick<Resource, 'id' | 'slug' | 'title' | 'category'>[]> {
  const resources = await loadResources();
  const searchLower = query.toLowerCase().trim();

  if (!searchLower) return [];

  return resources
    .filter((r) => r.status === 'published')
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchLower) ||
        r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
    .slice(0, limit)
    .map((r) => ({ id: r.id, slug: r.slug, title: r.title, category: r.category }));
}

const VALID_MINECRAFT_VERSIONS: MinecraftVersion[] = [
  '1.12.2', '1.13.2', '1.14.4', '1.15.2', '1.16.5',
  '1.17.1', '1.18.2', '1.19.4', '1.20.4', '1.21.1', 'latest',
];

const VALID_SERVER_SOFTWARE: ServerSoftware[] = [
  'paper', 'spigot', 'purpur', 'fabric', 'forge', 'neoforge',
  'velocity', 'bungeecord', 'waterfall', 'folia',
];

/** Validate Minecraft version */
export function isValidMinecraftVersion(version: string): version is MinecraftVersion {
  return VALID_MINECRAFT_VERSIONS.includes(version as MinecraftVersion);
}

/** Validate server software */
export function isValidServerSoftware(software: string): software is ServerSoftware {
  return VALID_SERVER_SOFTWARE.includes(software as ServerSoftware);
}

/** Validate category */
export function isValidCategory(category: string): category is ResourceCategory {
  const validCategories: ResourceCategory[] = [
    'plugin-configurations',
    'server-setup-guides',
    'graphics-icons',
    'maps-builds',
    'resource-packs',
    'discord-templates',
    'developer-tools',
    'tutorials',
    'premium-downloads',
  ];
  return validCategories.includes(category as ResourceCategory);
}

/** Validate resource type */
export function isValidResourceType(type: string): type is ResourceType {
  const validTypes: ResourceType[] = ['configuration', 'guide', 'template', 'pack', 'tool', 'tutorial', 'other'];
  return validTypes.includes(type as ResourceType);
}

/** Validate publication status */
export function isValidStatus(status: string): status is PublicationStatus {
  return ['draft', 'published', 'archived'].includes(status);
}