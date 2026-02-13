import { test, expect } from '@playwright/test';

test('top toolbar actions toggle and download controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Tidslinje')).toBeVisible();

  const playPause = page.getByRole('button', { name: /Start animasjonen|Pause animasjonen/i });
  await expect(playPause).toBeVisible();
  await playPause.click();
  await playPause.click();

  const traceToggle = page.getByLabel('Traces');
  await expect(traceToggle).toBeVisible();
  const traceChecked = await traceToggle.isChecked();
  await traceToggle.click();
  await expect(traceToggle).toHaveJSProperty('checked', !traceChecked);
  await traceToggle.click();

  await expect(page.getByText(/Interpolering:/)).toBeVisible();
  await page.getByRole('button', { name: 'Lin', exact: true }).click();
  await page.getByRole('button', { name: 'Sm', exact: true }).click();

  await expect(page.getByText(/Trace-kurve/)).toBeVisible();
  await expect(page.getByText(/px$/)).toBeVisible();
  await expect(page.getByTestId('playback-speed-value')).toBeVisible();
});
