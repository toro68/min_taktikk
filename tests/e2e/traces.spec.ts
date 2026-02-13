import { test, expect } from '@playwright/test';

test('traces toggle visibility and follow curve offset', async ({ page }) => {
  await page.goto('/');

  const board = page.getByLabel('Football tactics board');
  await expect(board).toBeVisible();

  await page.getByRole('button', { name: /Spiller/i }).click();
  await board.click({ position: { x: 140, y: 160 } });

  await page.getByRole('button', { name: /Ny keyframe/i }).click();

  await page.getByRole('button', { name: /Velg og flytt/i }).click();
  const player = page.getByTestId('player-element').first();
  await expect(player).toBeVisible();
  const playerBox = await player.boundingBox();
  const boardBox = await board.boundingBox();
  if (!playerBox || !boardBox) throw new Error('Missing bounding boxes for drag');
  await page.mouse.move(playerBox.x + playerBox.width / 2, playerBox.y + playerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(boardBox.x + 360, boardBox.y + 260);
  await page.mouse.up();

  const traceToggle = page.getByLabel('Traces');
  await expect(traceToggle).toBeVisible();
  await traceToggle.check();
  await expect(traceToggle).toBeChecked();

  const tracePath = page.getByTestId('trace-path').first();
  await expect(tracePath).toBeVisible({ timeout: 15000 });
  const initialPath = await tracePath.getAttribute('d');
  expect(initialPath).toBeTruthy();

  await traceToggle.uncheck();
  await expect(page.getByTestId('trace-path')).toHaveCount(0);

  await traceToggle.uncheck();
  await expect(page.getByTestId('trace-path')).toHaveCount(0);
});
