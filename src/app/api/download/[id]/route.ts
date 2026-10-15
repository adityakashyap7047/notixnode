/**
 * GET /api/download/[id]
 * Validate and serve/download a resource file
 * Query params: ?file=ref (optional, defaults to first file)
 */
import { NextRequest, NextResponse } from 'next/server';
import { validateDownload, incrementDownloadCount, getResourceById } from '@/lib/resources';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const fileRef = searchParams.get('file');

    // Validate download access
    const validation = await validateDownload(id, fileRef || undefined);

    if (!validation.valid || !validation.resource || !validation.file) {
      const status =
        validation.error?.code === 'NOT_FOUND'
          ? 404
          : validation.error?.code === 'PREMIUM_REQUIRED'
          ? 402
          : 403;
      return NextResponse.json(
        { error: validation.error || { code: 'FORBIDDEN', message: 'Download not allowed' } },
        { status }
      );
    }

    const { resource, file } = validation;

    // If external URL, redirect with clear identification
    if (file.externalUrl) {
      return NextResponse.redirect(file.externalUrl, {
        headers: {
          'Cache-Control': 'no-store',
          'X-External-Download-Destination': file.externalUrl,
        },
      });
    }

    // Resolve safe local path inside public/downloads/
    const downloadsDir = path.resolve(process.cwd(), 'public', 'downloads');
    const safeRef = path.basename(file.ref || '');
    const safeFilename = path.basename(file.filename || '');

    const candidatePaths = [
      path.join(downloadsDir, safeRef, safeFilename),
      path.join(downloadsDir, safeFilename),
      path.join(downloadsDir, safeRef),
    ];

    let foundPath: string | null = null;
    for (const candidate of candidatePaths) {
      const normalized = path.normalize(candidate);
      if (normalized.startsWith(downloadsDir)) {
        try {
          const stat = await fs.stat(/*turbopackIgnore: true*/ normalized);
          if (stat.isFile()) {
            foundPath = normalized;
            break;
          }
        } catch {
          // Continue to next candidate path
        }
      }
    }

    if (!foundPath) {
      return NextResponse.json(
        {
          error: {
            code: 'FILE_UNAVAILABLE',
            message: 'The requested file is not currently staged in local storage. In production, this would serve from verified object storage.',
            details: { filename: safeFilename },
          },
        },
        { status: 404 }
      );
    }

    // Increment download counter (async, don't block response)
    incrementDownloadCount(resource.id).catch(console.error);

    // Serve file
    const stat = await fs.stat(/*turbopackIgnore: true*/ foundPath);
    const fileBuffer = await fs.readFile(/*turbopackIgnore: true*/ foundPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'private, no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[API] /api/download/[id] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Download failed' } },
      { status: 500 }
    );
  }
}