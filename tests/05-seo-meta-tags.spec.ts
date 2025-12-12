import { test, expect } from '@playwright/test';

/**
 * Test Suite: SEO & Meta Tags
 * Tests all SEO improvements from Quick Wins
 */

test.describe('SEO & Meta Tags', () => {

  test('should have proper title tag', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toContain('Creastilo');
    expect(title.length).toBeGreaterThan(10);
    console.log('Page title:', title);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto('/');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description).toContain('IA');
    console.log('Meta description:', description);
  });

  test('should have Open Graph tags for social sharing', async ({ page }) => {
    await page.goto('/');

    // OG Title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    console.log('OG Title:', ogTitle);

    // OG Description
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
    console.log('OG Description:', ogDescription);

    // OG Image
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toContain('.png');
    console.log('OG Image:', ogImage);

    // OG Type
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');

    // OG URL
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBeTruthy();
  });

  test('should have Twitter Card tags', async ({ page }) => {
    await page.goto('/');

    // Twitter Card Type
    const twitterCard = await page.locator('meta[property="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    // Twitter Title
    const twitterTitle = await page.locator('meta[property="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toBeTruthy();
    console.log('Twitter Title:', twitterTitle);

    // Twitter Description
    const twitterDescription = await page.locator('meta[property="twitter:description"]').getAttribute('content');
    expect(twitterDescription).toBeTruthy();

    // Twitter Image
    const twitterImage = await page.locator('meta[property="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBeTruthy();
  });

  test('should have keywords meta tag', async ({ page }) => {
    await page.goto('/');

    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(keywords).toBeTruthy();
    expect(keywords).toContain('AI');
    expect(keywords).toContain('Gemini');
    console.log('Keywords:', keywords);
  });

  test('should have theme-color meta tag', async ({ page }) => {
    await page.goto('/');

    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBeTruthy();
    expect(themeColor).toMatch(/#[0-9a-f]{6}/i);
    console.log('Theme color:', themeColor);
  });

  test('should have robots meta tag', async ({ page }) => {
    await page.goto('/');

    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toBeTruthy();
    expect(robots).toContain('index');
    expect(robots).toContain('follow');
  });

  test('should serve robots.txt file', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain('User-agent');
    expect(content).toContain('Sitemap');
    console.log('robots.txt found and valid');
  });

  test('should serve sitemap.xml file', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain('<?xml');
    expect(content).toContain('urlset');
    expect(content).toContain('creastilo.com');
    console.log('sitemap.xml found and valid');
  });

  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/');

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toBe('es');
    console.log('HTML lang attribute:', htmlLang);
  });
});
