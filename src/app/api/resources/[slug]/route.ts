/**
 * GET /api/resources/[slug]
 * Get single resource by slug
 */
import { NextRequest, NextResponse } from 'next/server';
import { getResourceBySlug } from '@/lib/resources';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const includeDrafts = request.nextUrl.searchParams.get('includeDrafts') === 'true';
    const includeExamples = request.nextUrl.searchParams.get('includeExamples') === 'false' ? false : true;

    const result = await getResourceBySlug(slug, includeDrafts, includeExamples);

    if (!result) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Resource not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[API] /api/resources/[slug] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch resource' } },
      { status: 500 }
    );
  }
}