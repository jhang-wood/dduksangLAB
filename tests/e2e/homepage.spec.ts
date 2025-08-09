import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/떡상연구소/);
  });

  test('should have main navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('AI 트렌드')).toBeVisible();
    await expect(page.getByText('강의')).toBeVisible();
  });

  test('should navigate to AI trends page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByText('AI 트렌드').click();
    await expect(page).toHaveURL(/\/ai-trends/);
  });
});