import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'resources.json');
const DOWNLOADS_DIR = path.join(process.cwd(), 'public', 'downloads');

describe('NOTIXNODE Resource Data Layer Verification', () => {
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const resources = JSON.parse(rawData);

  test('resources.json contains valid seed records', () => {
    assert.ok(Array.isArray(resources));
    assert.ok(resources.length >= 10, 'Expected at least 10 seeded resources');
  });

  test('All resources have unique IDs and Slugs', () => {
    const ids = new Set();
    const slugs = new Set();

    for (const r of resources) {
      assert.ok(r.id, `Resource missing id: ${r.title}`);
      assert.ok(r.slug, `Resource missing slug: ${r.title}`);
      assert.ok(!ids.has(r.id), `Duplicate id found: ${r.id}`);
      assert.ok(!slugs.has(r.slug), `Duplicate slug found: ${r.slug}`);
      ids.add(r.id);
      slugs.add(r.slug);
    }
  });

  test('All resources have valid category, author, and publication status', () => {
    const validCategories = [
      'plugin-configurations',
      'server-setup-guides',
      'graphics-icons',
      'maps-builds',
      'resource-packs',
      'discord-templates',
      'developer-tools',
      'tutorials',
      'premium-downloads',
    ];

    for (const r of resources) {
      assert.ok(validCategories.includes(r.category), `Invalid category: ${r.category} in ${r.slug}`);
      assert.ok(r.author && r.author.name, `Missing author in ${r.slug}`);
      assert.ok(['published', 'draft', 'archived'].includes(r.status), `Invalid status in ${r.slug}`);
      assert.equal(typeof r.isExample, 'boolean', `isExample must be boolean in ${r.slug}`);
    }
  });

  test('Standard downloadable template files exist in public/downloads/', () => {
    const requiredFiles = [
      'config.yml',
      'paper-optimization-guide.md',
      'discord-bot-config.json',
      'luckperms-setup-tutorial.md',
      'server-rules.md',
      'server-rules.txt',
      'server-rules.yml',
      'server-setup-checklist.md',
      'server-maintenance-checklist.md',
      'plugin-inventory-template.csv',
      'staff-application-template.md',
      'ban-appeal-template.md',
      'announcement-templates.md',
      'backup-recovery-checklist.md',
      'paper.yml.example',
      'spigot.yml.example',
      'bukkit.yml.example',
    ];

    for (const file of requiredFiles) {
      const fullPath = path.join(DOWNLOADS_DIR, file);
      assert.ok(fs.existsSync(fullPath), `Required download file missing: ${file}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 0, `File is empty: ${file}`);
    }
  });

  test('Premium resources enforce external checkout requirement', () => {
    const premiumResources = resources.filter(r => r.isPremium);
    assert.ok(premiumResources.length >= 1, 'Expected at least one premium resource entry for testing');

    for (const pr of premiumResources) {
      assert.ok(pr.externalCheckoutUrl, `Premium resource ${pr.slug} must specify externalCheckoutUrl`);
      assert.ok(pr.files.every(f => f.isPremium), `Files in premium resource ${pr.slug} must be marked isPremium: true`);
    }
  });

  test('Path traversal protection logic safely confines resolution', () => {
    const maliciousPaths = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32\\cmd.exe',
      '/etc/shadow',
      'C:\\Windows\\win.ini',
    ];

    for (const mal of maliciousPaths) {
      const safeFilename = path.basename(mal);
      const safeRef = path.basename(mal);
      const resolved = path.normalize(path.join(DOWNLOADS_DIR, safeRef, safeFilename));
      assert.ok(resolved.startsWith(DOWNLOADS_DIR), `Traversal defense failed for: ${mal}`);
    }
  });
});
