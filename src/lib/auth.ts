/**
 * Simple admin authentication helper
 * In production, integrate with proper auth (NextAuth, Clerk, etc.)
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function verifyAdminToken(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || adminToken.trim().length === 0) {
    // No token configured - deny all admin access in production
    // For development only, allow if explicitly enabled
    return process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_ADMIN === 'true';
  }

  if (!authHeader) return false;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  const providedToken = match[1].trim();
  const configuredToken = adminToken.trim();

  try {
    const a = Buffer.from(providedToken, 'utf-8');
    const b = Buffer.from(configuredToken, 'utf-8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function requireAdmin(request: Request): NextResponse | null {
  if (!verifyAdminToken(request)) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
      { status: 401 }
    );
  }
  return null;
}