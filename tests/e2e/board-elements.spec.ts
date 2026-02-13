import { test, expect } from '@playwright/test';

test('place and select elements on the board', async ({ page }) => {
  await page.goto('/');

  const board = page.getByLabel('Football tactics board');
  await expect(board).toBeVisible();

  await page.getByRole('button', { name: /Spiller/i }).click();
  await board.click({ position: { x: 120, y: 120 } });
  await expect(page.getByTestId('player-element')).toHaveCount(1);

  await page.getByRole('button', { name: /Ball/i }).click();
  await board.click({ position: { x: 240, y: 160 } });
  await expect(page.getByTestId('ball-element')).toHaveCount(1);

  await page.getByRole('button', { name: /Velg/i }).click();
  await page.getByTestId('player-element').first().click();
  await expect(page.getByText('Egenskaper')).toBeVisible();
});
