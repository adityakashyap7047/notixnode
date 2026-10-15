# NOTIXNODE API Documentation

## Overview

NOTIXNODE provides a RESTful API for managing Minecraft server resources. All endpoints return JSON responses with consistent structure.

**Base URL**: `/api`

**Authentication**: Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>` header.

---

## Resource Library Endpoints

### GET /api/resources

List resources with search, filter, sort, and pagination.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `pageSize` | integer | 12 | Items per page (max 50) |
| `category` | string | - | Filter by category |
| `resourceType` | string | - | Filter by resource type |
| `minecraftVersion` | string | - | Filter by Minecraft version |
| `serverSoftware` | string | - | Filter by server software |
| `search` | string | - | Search in title, description, tags |
| `sort` | string | `newest` | Sort: `newest`, `oldest`, `alphabetical`, `popular`, `updated` |
| `status` | string | `published` | Filter by status: `published`, `draft`, `archived`, `all` |
| `includeDrafts` | boolean | false | Include draft resources |
| `includeExamples` | boolean | false | Include example resources |

**Response**:
```json
{
  "resources": [
    {
      "id": "uuid",
      "slug": "resource-slug",
      "title": "Resource Title",
      "shortDescription": "Short description",
      "description": "Full markdown description",
      "category": "plugin-configurations",
      "resourceType": "configuration",
      "tags": ["tag1", "tag2"],
      "thumbnail": "/images/thumb.png",
      "screenshots": ["/images/screen1.png"],
      "minecraftVersions": ["1.21.1", "latest"],
      "serverSoftware": ["paper", "purpur"],
      "dependencies": [...],
      "installationInstructions": "Installation steps",
      "changelog": [...],
      "license": "MIT",
      "attribution": "Optional attribution",
      "author": { "id": "author-id", "name": "Author Name", "url": "https://...", "isVerified": true },
      "isPremium": false,
      "externalCheckoutUrl": null,
      "licenseType": null,
      "files": [...],
      "status": "published",
      "isFeatured": false,
      "isExample": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "downloadCount": 0,
      "verifiedDownloadCount": 0
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "totalItems": 100,
    "totalPages": 9,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "category": "plugin-configurations",
    "resourceType": "configuration",
    "minecraftVersion": "1.21.1",
    "serverSoftware": "paper",
    "search": "essentials",
    "sort": "newest"
  }
}
```

**Cache Headers**: `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`

---

### GET /api/resources/[slug]

Get a single resource by slug.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | URL-safe resource slug |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeDrafts` | boolean | false | Allow access to draft resources |

**Response**:
```json
{
  "resource": { ...Resource object... },
  "related": [
    { "id": "uuid", "slug": "related-slug", "title": "Related Resource", "thumbnail": "/img.png", "category": "plugin-configurations" }
  ]
}
```

**Error Responses**:
- `404`: Resource not found or not published
- `500`: Internal server error

**Cache Headers**: `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`

---

### GET /api/resources/categories

Get category metadata with resource counts.

**Response**:
```json
{
  "categories": [
    {
      "value": "plugin-configurations",
      "label": "Plugin Configurations",
      "description": "Ready-to-use configuration files for popular plugins",
      "icon": "⚙️",
      "count": 15
    }
  ],
  "resourceTypes": [
    { "value": "configuration", "label": "Configuration", "description": "Config files (YAML, JSON, HOCON, TOML)" },
    { "value": "guide", "label": "Guide", "description": "Step-by-step instructions and documentation" }
  ]
}
```

**Cache Headers**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`

---

## Download Endpoint

### GET /api/download/[id]

Validate and serve/download a resource file.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Resource UUID |

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | string | File reference (ref) to download. Defaults to first file. |

**Behavior**:
1. Validates resource exists and is not archived
2. Validates file reference exists in resource
3. Checks premium access (placeholder - implement entitlement check)
4. If `externalUrl` exists: redirects (302) to external URL
5. If local file: serves file with appropriate headers
6. Increments download counter (async)

**Response** (local file):
- Binary file content
- Headers:
  - `Content-Type`: File MIME type
  - `Content-Disposition`: `attachment; filename="original-filename.ext"`
  - `Content-Length`: File size in bytes
  - `Cache-Control`: `private, no-cache`
  - `X-Content-Type-Options`: `nosniff`

**Error Responses**:
- `403`: Download not allowed (archived, premium without entitlement)
- `404`: Resource not found, file not found, or file unavailable locally
- `500`: Internal server error

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>` header.

### GET /api/admin/resources

List all resources including drafts and archived.

**Response**:
```json
{ "resources": [ ...Resource objects... ] }
```

---

### POST /api/admin/resources

Create a new resource (starts as draft).

**Request Body**: Resource object (without `id`, `slug`, `createdAt`, `updatedAt`, `downloadCount`)

**Required Fields**:
- `title`, `shortDescription`, `description`, `category`, `resourceType`, `author`
- `files` array with at least one file

**Response**: `201 Created`
```json
{ "resource": { ...Created resource... } }
```

**Error Responses**:
- `400`: Validation error
- `409`: Duplicate slug (title already exists)
- `401`: Unauthorized (invalid/missing admin token)
- `500`: Internal server error

---

### PATCH /api/admin/resources/[id]

Update an existing resource.

**Path Parameters**: `id` (resource UUID)

**Request Body**: Partial resource object (immutable fields ignored: `id`, `slug`, `createdAt`, `downloadCount`)

**Response**:
```json
{ "resource": { ...Updated resource... } }
```

**Error Responses**:
- `400`: Validation error
- `404`: Resource not found
- `409`: Duplicate slug (if title changed)
- `401`: Unauthorized
- `500`: Internal server error

---

### DELETE /api/admin/resources/[id]

Soft delete (archive) a resource.

**Path Parameters**: `id` (resource UUID)

**Response**:
```json
{ "success": true, "resource": { ...Archived resource... } }
```

---

### POST /api/admin/resources/[id]/publish

Publish a draft resource.

**Response**:
```json
{ "resource": { ...Published resource... } }
```

---

### POST /api/admin/resources/[id]/archive

Archive a published resource.

**Response**:
```json
{ "resource": { ...Archived resource... } }
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ...optional additional details... }
  }
}
```

**Common Error Codes**:
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `DUPLICATE_SLUG`: Resource with this title already exists
- `FORBIDDEN`: Access denied (premium, archived, etc.)
- `FILE_NOT_FOUND`: File reference not found in resource
- `FILE_UNAVAILABLE`: File not available on local storage
- `UNAUTHORIZED`: Admin authentication required
- `INTERNAL_ERROR`: Server error

---

## Data Models

See [DATA_MODEL.md](./DATA_MODEL.md) for complete TypeScript interfaces.

---

## Rate Limiting

No rate limiting implemented in development. Implement at reverse proxy/CDN level for production.

---

## CORS

CORS not configured. Configure in `next.config.ts` or reverse proxy for production use.