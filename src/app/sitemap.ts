import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notixnode.com';
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/resources/configs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources/graphics`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources/maps`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources/packs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources/discord`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/motd`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/prefix`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/properties`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/luckperms-planner`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/compatibility-helper`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tutorials`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/premium`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/status`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/licensing`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/affiliate-disclosure`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic resource routes from resources.json
  const resourceRoutes: MetadataRoute.Sitemap = [];
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'resources.json');
    if (fs.existsSync(dataPath)) {
      const resources = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      for (const r of resources) {
        if (r.slug && r.status === 'published') {
          resourceRoutes.push({
            url: `${baseUrl}/resources/${r.slug}`,
            lastModified: r.updatedAt ? new Date(r.updatedAt) : now,
            changeFrequency: 'weekly',
            priority: r.isFeatured ? 0.85 : 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('[Sitemap] Failed to load dynamic resources:', error);
  }

  // Tutorial routes
  const tutorialRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tutorials/paper-optimization-crash-course`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tutorials/luckperms-rank-ladder-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tutorials/velocity-proxy-setup-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  return [...staticRoutes, ...resourceRoutes, ...tutorialRoutes];
}
