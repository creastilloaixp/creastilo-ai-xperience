import { test, expect } from '@playwright/test';

/**
 * Test Suite: Roulette Functionality
 * Tests the gamified lead capture roulette
 */

test.describe('Roulette Lead Capture', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dismiss onboarding if present
    const onboardingButton = page.locator('button:has-text("Comenzar"), button:has-text("Empezar")');
    if (await onboardingButton.isVisible()) {
      await onboardingButton.click();
      await page.waitForTimeout(500);
    }

    // Clear roulette state
    await page.evaluate(() => {
      localStorage.removeItem('creastilo_roulette_state');
    });
  });

  test('should display roulette component when navigating to tools', async ({ page }) => {
    // Navigate to Herramientas
    const herramientasLink = page.locator('a:has-text("Herramientas"), button:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    // Click Ruleta tab
    const rouletteTab = page.locator('button:has-text("Ruleta")').first();
    await rouletteTab.click();
    await page.waitForTimeout(1000);

    // Verify roulette wheel is visible
    const rouletteWheel = page.locator('.rounded-full').filter({ hasText: '' }).first();
    await expect(rouletteWheel).toBeVisible();

    // Verify form is visible
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="whatsapp"]')).toBeVisible();
  });

  test('should disable spin button until form is complete', async ({ page }) => {
    await page.goto('/');

    // Navigate to roulette
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const rouletteTab = page.locator('button:has-text("Ruleta")').first();
    await rouletteTab.click();
    await page.waitForTimeout(1000);

    const spinButton = page.locator('button:has-text("Girar")').first();

    // Button should be disabled initially
    await expect(spinButton).toBeDisabled();

    // Fill only name
    await page.fill('input[name="name"]', 'Test');
    await expect(spinButton).toBeDisabled();

    // Fill whatsapp
    await page.fill('input[name="whatsapp"]', '+52 55');
    await expect(spinButton).toBeDisabled();

    // Accept terms
    await page.click('input[name="acceptedTerms"]');

    // Now button should be enabled
    await expect(spinButton).toBeEnabled();
  });

  test('should spin roulette and show winner', async ({ page }) => {
    await page.goto('/');

    // Navigate to roulette
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const rouletteTab = page.locator('button:has-text("Ruleta")').first();
    await rouletteTab.click();
    await page.waitForTimeout(1000);

    // Fill form
    await page.fill('input[name="name"]', 'Test User Playwright');
    await page.fill('input[name="whatsapp"]', '+52 55 9999 8888');
    await page.click('input[name="acceptedTerms"]');

    // Spin
    const spinButton = page.locator('button:has-text("Girar")').first();
    await spinButton.click();

    // Wait for spin animation (4 seconds)
    await page.waitForTimeout(5000);

    // Verify winner overlay appears
    const winnerOverlay = page.locator('text=/Felicidades|Has ganado/i').first();
    await expect(winnerOverlay).toBeVisible({ timeout: 10000 });

    // Verify CRM button appears
    const crmButton = page.locator('button:has-text("Ver en Dashboard CRM"), button:has-text("CRM")');
    await expect(crmButton.first()).toBeVisible({ timeout: 5000 });
  });

  test('should save lead to localStorage after spin', async ({ page }) => {
    await page.goto('/');

    // Navigate to roulette
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const rouletteTab = page.locator('button:has-text("Ruleta")').first();
    await rouletteTab.click();
    await page.waitForTimeout(1000);

    // Fill form
    await page.fill('input[name="name"]', 'Storage Test User');
    await page.fill('input[name="whatsapp"]', '+52 55 7777 6666');
    await page.click('input[name="acceptedTerms"]');

    // Spin
    await page.locator('button:has-text("Girar")').first().click();

    // Wait for completion
    await page.waitForTimeout(6000);

    // Check localStorage
    const crmData = await page.evaluate(() => {
      return localStorage.getItem('creastilo_crm_data');
    });

    expect(crmData).toBeTruthy();
    const leads = JSON.parse(crmData!);
    expect(Array.isArray(leads)).toBe(true);
    expect(leads.some((lead: any) => lead.name === 'Storage Test User')).toBe(true);
  });

  test('should prevent spinning twice (anti-fraud)', async ({ page }) => {
    await page.goto('/');

    // Navigate to roulette
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const rouletteTab = page.locator('button:has-text("Ruleta")').first();
    await rouletteTab.click();
    await page.waitForTimeout(1000);

    // Fill form and spin
    await page.fill('input[name="name"]', 'Anti Fraud Test');
    await page.fill('input[name="whatsapp"]', '+52 55 5555 4444');
    await page.click('input[name="acceptedTerms"]');
    await page.locator('button:has-text("Girar")').first().click();

    // Wait for spin to complete
    await page.waitForTimeout(6000);

    // Try to spin again by reloading
    await page.reload();
    await page.waitForTimeout(2000);

    // Navigate back to roulette
    const herramientasLink2 = page.locator('a:has-text("Herramientas")').first();
    if (await herramientasLink2.isVisible()) {
      await herramientasLink2.click();
      await page.waitForTimeout(500);
    }

    const rouletteTab2 = page.locator('button:has-text("Ruleta")').first();
    if (await rouletteTab2.isVisible()) {
      await rouletteTab2.click();
      await page.waitForTimeout(1000);
    }

    // Spin button should be disabled
    const spinButton = page.locator('button:has-text("Girar")').first();
    await expect(spinButton).toBeDisabled();
  });
});
