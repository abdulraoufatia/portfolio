import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/auth');
    
    await expect(page.getByText('Admin Login')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('validates form inputs', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    await page.click('button:has-text("Sign In")');
    
    // Should show validation messages
    await expect(page.getByText(/required/i)).toBeVisible();
    
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid');
    await page.click('button:has-text("Sign In")');
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*auth/);
  });
});