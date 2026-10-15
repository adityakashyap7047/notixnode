/**
 * PATCH /api/admin/resources/[id]
 * Update resource (admin only)
 * DELETE /api/admin/resources/[id]
 * Soft delete (archive) resource (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { updateResource, deleteResource, getResourceById } from '@/lib/resources';
import {
  isValidCategory,
  isValidResourceType,
  isValidStatus,
  isValidMinecraftVersion,
  isValidServerSoftware,
} from '@/lib/resources';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate enums if provided
    if (body.category && !isValidCategory(body.category)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid category' } },
        { status: 400 }
      );
    }
    if (body.resourceType && !isValidResourceType(body.resourceType)) {
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

    // Validate files if provided
    if (body.files) {
      if (!Array.isArray(body.files) || body.files.length === 0) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: 'At least one file is required' } },
          { status: 400 }
        );
      }
      body.files = body.files.map((f: any) => ({
        ref: f.ref,
        filename: f.filename,
        contentType: f.contentType,
        size: Number(f.size),
        sha256: f.sha256,
        externalUrl: f.externalUrl,
        isPremium: Boolean(f.isPremium),
      }));
    }

    // Prevent changing immutable fields
    const { id: _, slug, createdAt, downloadCount, ...allowedData } = body;

    const result = await updateResource(id, allowedData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }

    return NextResponse.json({ resource: result.resource });
  } catch (error) {
    console.error('[ADMIN] PATCH /api/admin/resources/[id] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update resource' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await deleteResource(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }

    return NextResponse.json({ success: true, resource: result.resource });
  } catch (error) {
    console.error('[ADMIN] DELETE /api/admin/resources/[id] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete resource' } },
      { status: 500 }
    );
  }
}