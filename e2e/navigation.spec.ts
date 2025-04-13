import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates through main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check home page
    await expect(page).toHaveTitle(/Abdulraouf/);
    await expect(page.getByText('Platform Engineering Professional')).toBeVisible();

    // Navigate to Projects
    await page.click('text=Projects');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.getByText('My Projects')).toBeVisible();

    // Navigate to Articles
    await page.click('text=Articles');
    await expect(page).toHaveURL(/.*articles/);
    await expect(page.getByText('Articles')).toBeVisible();

    // Navigate to Experience
    await page.click('text=Experience');
    await expect(page).toHaveURL(/.*experience/);
    await expect(page.getByText('Professional Experience')).toBeVisible();

    // Navigate to Education
    await page.click('text=Education');
    await expect(page).toHaveURL(/.*education/);
    await expect(page.getByText('Education')).toBeVisible();
  });
});