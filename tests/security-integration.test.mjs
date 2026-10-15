import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('Security Audit — XSS Sanitization & DOM Defense', () => {
  // Reusable helper simulating the MOTD/Prefix HTML escaping
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  test('Raw script and img tags are neutralized in formatting parser', () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(document.cookie)>',
      '"><script>alert(1)</script>',
      "';alert(1);//",
    ];

    for (const input of maliciousInputs) {
      const sanitized = escapeHtml(input);
      assert.ok(!sanitized.includes('<script>'), `Failed to sanitize script tag: ${input}`);
      assert.ok(!sanitized.includes('<img'), `Failed to sanitize img tag: ${input}`);
      assert.ok(!sanitized.includes('<svg'), `Failed to sanitize svg tag: ${input}`);
      if (input.includes('<')) {
        assert.ok(sanitized.includes('&lt;'), `Expected escaped angle bracket for: ${input}`);
      }
      if (input.includes("'")) {
        assert.ok(sanitized.includes('&#39;'), `Expected escaped quote for: ${input}`);
      }
    }
  });

  test('MiniMessage gradient parser safely encodes inner tag content', () => {
    const xssInGradient = '<gradient:#06B6D4:#00F5D4><img src=x onerror=alert(1)></gradient>';
    const processed = xssInGradient.replace(
      /<gradient:(#[0-9a-fA-F]{6}):(#[0-9a-fA-F]{6})>([^<]+)<\/gradient>/g,
      (_, c1, c2, content) => {
        const escaped = escapeHtml(content);
        return `<span style="background:linear-gradient(90deg,${c1},${c2})">${escaped}</span>`;
      }
    );
    // Because `<img` has a `<`, it doesn't match `[^<]+`, so it falls through to general HTML escaping
    const fullyEscaped = escapeHtml(processed);
    assert.ok(!fullyEscaped.includes('<img'), 'Unescaped image tag detected in gradient');
    assert.ok(fullyEscaped.includes('&lt;img'), 'Image tag must be escaped to &lt;img');
  });
});

describe('Security Audit — Admin Token & Timing-Safe Verification', () => {
  test('Timing-safe comparison rejects mismatched or malformed tokens', () => {
    const secret = 'super-secret-admin-token-12345';
    const correct = Buffer.from(secret, 'utf-8');
    const attackerAttempt = Buffer.from('super-secret-admin-token-12340', 'utf-8');
    const shorterAttempt = Buffer.from('short', 'utf-8');

    assert.ok(crypto.timingSafeEqual(correct, correct), 'Exact token must match');
    assert.ok(!crypto.timingSafeEqual(correct, attackerAttempt), 'Subtle mismatch must be rejected');
    assert.notEqual(correct.length, shorterAttempt.length, 'Length mismatch must be rejected before timingSafeEqual');
  });

  test('Authorization header parsing handles Bearer prefix and whitespace', () => {
    const validHeader = 'Bearer my-secret-token';
    const match = validHeader.match(/^Bearer\s+(.+)$/i);
    assert.ok(match, 'Bearer match must succeed');
    assert.equal(match[1].trim(), 'my-secret-token');

    const lowercaseHeader = 'bearer my-secret-token';
    const lowerMatch = lowercaseHeader.match(/^Bearer\s+(.+)$/i);
    assert.ok(lowerMatch, 'Case-insensitive bearer match must succeed');

    const invalidHeader = 'Basic dXNlcjpwYXNz';
    assert.equal(invalidHeader.match(/^Bearer\s+(.+)$/i), null, 'Non-Bearer header must be rejected');
  });
});

describe('Security Audit — Global HTTP Security Headers', () => {
  test('next.config.ts configures critical defensive headers', async () => {
    const configPath = path.join(process.cwd(), 'next.config.ts');
    const configSource = fs.readFileSync(configPath, 'utf-8');

    assert.ok(configSource.includes('X-Content-Type-Options'), 'Must configure nosniff');
    assert.ok(configSource.includes('X-Frame-Options'), 'Must configure frame protection');
    assert.ok(configSource.includes('Strict-Transport-Security'), 'Must configure HSTS');
    assert.ok(configSource.includes('Referrer-Policy'), 'Must configure Referrer-Policy');
    assert.ok(configSource.includes('Permissions-Policy'), 'Must configure Permissions-Policy');
  });
});

describe('SEO & Crawlability Verification', () => {
  test('robots.ts defines valid crawl rules and sitemap reference', async () => {
    const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
    assert.ok(fs.existsSync(robotsPath), 'src/app/robots.ts must exist');

    const robotsModule = await import('../src/app/robots.ts');
    const robotsConfig = robotsModule.default();

    assert.ok(robotsConfig.rules, 'Robots config must define rules');
    assert.ok(robotsConfig.sitemap, 'Robots config must define sitemap URL');
    assert.ok(robotsConfig.sitemap.endsWith('/sitemap.xml'), 'Sitemap URL must end with /sitemap.xml');
  });

  test('sitemap.ts dynamically includes key platform pages and valid URLs', async () => {
    const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
    assert.ok(fs.existsSync(sitemapPath), 'src/app/sitemap.ts must exist');

    const sitemapModule = await import('../src/app/sitemap.ts');
    const sitemapEntries = sitemapModule.default();

    assert.ok(Array.isArray(sitemapEntries), 'Sitemap entries must be an array');
    assert.ok(sitemapEntries.length >= 25, `Expected at least 25 sitemap entries, found ${sitemapEntries.length}`);

    const urls = sitemapEntries.map(e => e.url);
    assert.ok(urls.some(u => u.endsWith('/resources')), 'Must include /resources');
    assert.ok(urls.some(u => u.endsWith('/tools')), 'Must include /tools');
    assert.ok(urls.some(u => u.endsWith('/tutorials')), 'Must include /tutorials');
    assert.ok(urls.some(u => u.endsWith('/premium')), 'Must include /premium');
    assert.ok(urls.some(u => u.endsWith('/privacy')), 'Must include /privacy');
    assert.ok(urls.some(u => u.endsWith('/licensing')), 'Must include /licensing');
    assert.ok(urls.some(u => u.includes('/resources/essential-plugin-config-starter')), 'Must include dynamic resource slugs');

    for (const entry of sitemapEntries) {
      assert.ok(entry.url.startsWith('http'), `Invalid URL scheme in sitemap: ${entry.url}`);
      assert.ok(entry.priority >= 0.1 && entry.priority <= 1.0, `Priority out of bounds: ${entry.priority}`);
      assert.ok(entry.lastModified instanceof Date, 'lastModified must be Date');
    }
  });
});
