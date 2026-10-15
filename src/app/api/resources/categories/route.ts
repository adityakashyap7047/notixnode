/**
 * GET /api/resources/categories
 * Get category metadata with counts
 */
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/resources';

export async function GET() {
  try {
    const result = await getCategories();
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] /api/resources/categories error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    );
  }
}