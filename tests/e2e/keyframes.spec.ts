import { test, expect } from '@playwright/test';

test('keyframe add and timeline count update', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText(/Frame 1\/1/)).toBeVisible();

  await page.getByRole('button', { name: /Ny keyframe/i }).click();

  await expect(page.getByText(/Frame 2\/2/)).toBeVisible();

  const timelineToggle = page.getByRole('button', { name: /Vis eller skjul tidslinje/i });
  await expect(timelineToggle).toBeVisible();
  await expect(page.getByText('Timeline')).toBeVisible();
});
