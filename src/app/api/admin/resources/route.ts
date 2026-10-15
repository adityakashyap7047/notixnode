/**
 * POST /api/admin/resources
 * Create new resource (admin only)
 * GET /api/admin/resources
 * List all resources including drafts/archived (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  createResource,
  getAllResourcesAdmin,
  isValidCategory,
  isValidResourceType,
  isValidStatus,
  isValidMinecraftVersion,
  isValidServerSoftware,
} from '@/lib/resources';
import type { Resource, PublicationStatus } from '@/types/resource';

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const resources = await getAllResourcesAdmin();
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('[ADMIN] GET /api/admin/resources error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch resources' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'shortDescription', 'description', 'category', 'resourceType', 'author'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: `Missing required field: ${field}` } },
          { status: 400 }
        );
      }
    }

    // Validate enums
    if (!isValidCategory(body.category)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid category' } },
        { status: 400 }
      );
    }
    if (!isValidResourceType(body.resourceType)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid resourceType' } },
        { status: 400 }
      );
    }
    if (body.status && !isValidStatus(body.status)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } },
        { status: 400 }
      );
    }
    if (body.minecraftVersions) {
      for (const v of body.minecraftVersions) {
        if (!isValidMinecraftVersion(v)) {
          return NextResponse.json(
            { error: { code: 'VALIDATION_ERROR', message: `Invalid Minecraft version: ${v}` } },
            { status: 400 }
          );
        }
      }
    }
    if (body.serverSoftware) {
      for (const s of body.serverSoftware) {
        if (!isValidServerSoftware(s)) {
          return NextResponse.json(
            { error: { code: 'VALIDATION_ERROR', message: `Invalid server software: ${s}` } },
            { status: 400 }
          );
        }
      }
    }

    // Validate author
    if (!body.author?.id || !body.author?.name) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Author must have id and name' } },
        { status: 400 }
      );
    }

    // Validate files
    if (!body.files || !Array.isArray(body.files) || body.files.length === 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'At least one file is required' } },
        { status: 400 }
      );
    }

    const status: PublicationStatus = (['published', 'archived', 'draft'] as const).includes(body.status as any) ? body.status as PublicationStatus : 'draft';

    // Set defaults
    const resourceData: Omit<Resource, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'downloadCount'> = {
      title: body.title,
      shortDescription: body.shortDescription,
      description: body.description,
      category: body.category,
      resourceType: body.resourceType,
      author: {
        id: body.author.id,
        name: body.author.name,
        url: body.author.url,
        isVerified: Boolean(body.author.isVerified),
      },
      tags: Array.isArray(body.tags) ? body.tags : [],
      thumbnail: body.thumbnail,
      screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
      minecraftVersions: Array.isArray(body.minecraftVersions) ? body.minecraftVersions : ['latest'],
      serverSoftware: Array.isArray(body.serverSoftware) ? body.serverSoftware : [],
      dependencies: Array.isArray(body.dependencies) ? body.dependencies : [],
      installationInstructions: body.installationInstructions || '',
      changelog: Array.isArray(body.changelog) ? body.changelog : [],
      license: body.license || 'MIT',
      attribution: body.attribution,
      isPremium: Boolean(body.isPremium),
      externalCheckoutUrl: body.externalCheckoutUrl,
      licenseType: body.licenseType,
      files: body.files.map((f: { ref: string; filename: string; contentType: string; size: number; sha256?: string; externalUrl?: string; isPremium?: boolean }) => ({
        ref: f.ref,
        filename: f.filename,
        contentType: f.contentType,
        size: Number(f.size),
        sha256: f.sha256,
        externalUrl: f.externalUrl,
        isPremium: Boolean(f.isPremium),
      })),
      status,
      isFeatured: Boolean(body.isFeatured),
      isExample: Boolean(body.isExample),
    };

    const result = await createResource(resourceData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.code === 'DUPLICATE_SLUG' ? 409 : 400 }
      );
    }

    return NextResponse.json({ resource: result.resource }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN] POST /api/admin/resources error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create resource' } },
      { status: 500 }
    );
  }
}