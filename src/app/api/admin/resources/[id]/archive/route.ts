/**
 * POST /api/admin/resources/[id]/archive
 * Archive a resource (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { archiveResource } from '@/lib/resources';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await archiveResource(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }

    return NextResponse.json({ resource: result.resource });
  } catch (error) {
    console.error('[ADMIN] POST /api/admin/resources/[id]/archive error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to archive resource' } },
      { status: 500 }
    );
  }
}