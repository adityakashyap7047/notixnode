/**
 * GET /api/resources
 * List resources with search, filter, sort, pagination
 */
import { NextRequest, NextResponse } from 'next/server';
import { getResources, getCategories, isValidCategory, isValidResourceType, isValidMinecraftVersion, isValidServerSoftware, isValidStatus, normalizeSort } from '@/lib/resources';
import type { ResourceQueryParams, ResourceCategory, ResourceType, MinecraftVersion, ServerSoftware, PublicationStatus, ResourceSortOption } from '@/types/resource';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const resourceType = searchParams.get('resourceType');
    const minecraftVersion = searchParams.get('minecraftVersion');
    const serverSoftware = searchParams.get('serverSoftware');
    const sort = searchParams.get('sort');
    const status = searchParams.get('status');

    const params: ResourceQueryParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined,
      category: category && isValidCategory(category) ? category : undefined,
      resourceType: resourceType && isValidResourceType(resourceType) ? resourceType : undefined,
      minecraftVersion: minecraftVersion && isValidMinecraftVersion(minecraftVersion) ? minecraftVersion : undefined,
      serverSoftware: serverSoftware && isValidServerSoftware(serverSoftware) ? serverSoftware : undefined,
      search: searchParams.get('search') || undefined,
      sort: sort && ['newest', 'oldest', 'alphabetical', 'popular', 'updated'].includes(sort) ? sort as ResourceSortOption : undefined,
      status: status && isValidStatus(status) ? status : undefined,
      includeDrafts: searchParams.get('includeDrafts') === 'true',
      includeExamples: searchParams.get('includeExamples') === 'false' ? false : true,
    };

    const result = await getResources(params);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[API] /api/resources error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch resources' } },
      { status: 500 }
    );
  }
}