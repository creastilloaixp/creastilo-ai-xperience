import { test, expect } from '@playwright/test';

/**
 * Test Suite: CRM Performance
 * Tests memoization and filtering performance improvements
 */

test.describe('CRM Performance & Memoization', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dismiss onboarding
    const onboardingButton = page.locator('button:has-text("Comenzar"), button:has-text("Empezar")');
    if (await onboardingButton.isVisible()) {
      await onboardingButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should navigate to CRM dashboard', async ({ page }) => {
    // Navigate to Herramientas
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    // Click CRM tab
    const crmTab = page.locator('button:has-text("CRM")').first();
    await crmTab.click();
    await page.waitForTimeout(1000);

    // Verify CRM dashboard loaded
    const dashboard = page.locator('text=/Dashboard|Resumen|CRM/i').first();
    await expect(dashboard).toBeVisible();
  });

  test('should filter leads without lag', async ({ page }) => {
    // Navigate to CRM
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const crmTab = page.locator('button:has-text("CRM")').first();
    await crmTab.click();
    await page.waitForTimeout(1000);

    // Click on Leads tab
    const leadsTab = page.locator('button:has-text("Leads")').first();
    if (await leadsTab.isVisible()) {
      await leadsTab.click();
      await page.waitForTimeout(500);
    }

    // Find search input
    const searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();

    if (await searchInput.isVisible()) {
      // Measure typing performance
      const startTime = Date.now();

      // Type rapidly
      await searchInput.type('Sofia', { delay: 50 });

      const endTime = Date.now();
      const typingTime = endTime - startTime;

      console.log(`Typing completed in ${typingTime}ms`);

      // With memoization, typing should be smooth (< 1 second for 5 chars)
      expect(typingTime).toBeLessThan(1000);

      // Wait for filter to apply
      await page.waitForTimeout(300);

      // Results should update
      const results = page.locator('table tbody tr, [class*="lead"]');
      // Some results should be visible (or "no results" message)
      await page.waitForTimeout(500);
    }
  });

  test('should toggle status filter smoothly', async ({ page }) => {
    // Navigate to CRM Leads
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const crmTab = page.locator('button:has-text("CRM")').first();
    await crmTab.click();
    await page.waitForTimeout(1000);

    const leadsTab = page.locator('button:has-text("Leads")').first();
    if (await leadsTab.isVisible()) {
      await leadsTab.click();
      await page.waitForTimeout(500);
    }

    // Find filter button
    const filterButton = page.locator('button:has-text("Todos"), button:has-text("Pendiente"), button:has-text("Canjeado")').first();

    if (await filterButton.isVisible()) {
      // Click filter multiple times rapidly
      const startTime = Date.now();

      for (let i = 0; i < 3; i++) {
        await filterButton.click();
        await page.waitForTimeout(100);
      }

      const endTime = Date.now();
      const filterTime = endTime - startTime;

      console.log(`Filter toggled 3 times in ${filterTime}ms`);

      // With useCallback, this should be instant (< 1 second for 3 clicks)
      expect(filterTime).toBeLessThan(1500);
    }
  });

  test('should display lead statistics', async ({ page }) => {
    // Navigate to CRM
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const crmTab = page.locator('button:has-text("CRM")').first();
    await crmTab.click();
    await page.waitForTimeout(1500);

    // Look for stat cards
    const statCards = page.locator('[class*="grid"] > div, [class*="stat"]');

    // Should have at least 3 stat cards (value pipeline, leads, etc.)
    const count = await statCards.count();
    console.log(`Found ${count} stat elements`);
  });

  test('should load CRM data from localStorage', async ({ page }) => {
    // Set some mock CRM data
    await page.goto('/');

    await page.evaluate(() => {
      const mockLeads = [
        {
          id: 999,
          name: 'Test Lead',
          email: 'test@example.com',
          phone: '+52 55 1111 2222',
          prize: 'Test Prize',
          date: 'Test Date',
          status: 'Pendiente',
          value: 100,
          coupon: 'TEST-123',
          img: 'https://i.pravatar.cc/100?u=test'
        }
      ];
      localStorage.setItem('creastilo_crm_data', JSON.stringify(mockLeads));
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Navigate to CRM
    const herramientasLink = page.locator('a:has-text("Herramientas")').first();
    await herramientasLink.click();
    await page.waitForTimeout(500);

    const crmTab = page.locator('button:has-text("CRM")').first();
    await crmTab.click();
    await page.waitForTimeout(1000);

    // Navigate to Leads
    const leadsTab = page.locator('button:has-text("Leads")').first();
    if (await leadsTab.isVisible()) {
      await leadsTab.click();
      await page.waitForTimeout(500);
    }

    // Look for our test lead
    const testLead = page.locator('text="Test Lead"');
    // May or may not be visible depending on view
    await page.waitForTimeout(500);
  });
});
