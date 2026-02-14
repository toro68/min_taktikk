import { test, expect } from '@playwright/test';

test('top toolbar actions toggle and download controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /Vis eller skjul tidslinje/i })).toBeVisible();

  const playPause = page.getByRole('button', { name: /Start animasjonen|Pause animasjonen/i });
  await expect(playPause).toBeVisible();
  await playPause.click();
  await playPause.click();

  const advancedToggle = page.getByRole('button', { name: 'Avansert' });
  await expect(advancedToggle).toBeVisible();
  await advancedToggle.click();

  await expect(page.getByRole('button', { name: 'Angre' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Gjør om' })).toBeVisible();

  const traceToggle = page.getByLabel('Bevegelseslinjer');
  await expect(traceToggle).toBeVisible();
  const traceChecked = await traceToggle.isChecked();
  await traceToggle.click();
  await expect(traceToggle).toHaveJSProperty('checked', !traceChecked);
  await traceToggle.click();

  await expect(page.getByText(/Interpolering:/)).toBeVisible();
  await page.getByRole('button', { name: 'Lineær', exact: true }).click();
  await page.getByRole('button', { name: 'Jevn', exact: true }).click();

  await expect(page.getByText(/Bevegelseskurve/)).toBeVisible();
  await expect(page.getByText(/px$/)).toBeVisible();
  await expect(page.getByTestId('playback-speed-value')).toBeVisible();
});
