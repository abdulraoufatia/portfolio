import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigation should be visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Menu items should be visible
    await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('Articles')).toBeVisible();
    await expect(page.getByText('Experience')).toBeVisible();
  });

  test('mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Hamburger menu should be visible
    const menuButton = page.getByRole('button', { name: 'Open menu' });
    await expect(menuButton).toBeVisible();
    
    // Menu items should be hidden initially
    await expect(page.getByText('Projects')).not.toBeVisible();
    
    // Click menu button to show items
    await menuButton.click();
    await expect(page.getByText('Projects')).toBeVisible();
  });
});