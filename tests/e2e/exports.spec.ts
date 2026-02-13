import { test, expect } from '@playwright/test';

test('export actions show file pickers or downloads', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /Lagre -/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Last inn -/i })).toBeVisible();

  const moreButton = page.getByRole('button', { name: /Vis flere handlinger/i });
  await expect(moreButton).toBeVisible();
  await moreButton.click();

  await expect(page.getByRole('button', { name: /^PNG$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^SVG$/i })).toHaveCount(2);
  await expect(page.getByRole('button', { name: /^Video$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^GIF$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Eksempel$/i })).toBeVisible();
});
