import { test, expect } from '@playwright/test';

test('timeline expand and seek', async ({ page }) => {
  await page.goto('/');

  const timelineToggle = page.getByRole('button', { name: /Vis eller skjul tidslinje/i });
  await expect(timelineToggle).toBeVisible();

  if ((await timelineToggle.getAttribute('aria-expanded')) !== 'true') {
    await timelineToggle.click();
  }

  await expect(page.getByText('Timeline')).toBeVisible();

  const timeline = page.locator('text=Timeline').locator('..').locator('div').nth(1);
  await timeline.click({ position: { x: 40, y: 10 } });
  await expect(page.getByText(/Total:/)).toBeVisible();
});
