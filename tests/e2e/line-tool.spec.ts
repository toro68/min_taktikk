import { test, expect } from '@playwright/test';

test('draw a line, adjust curve and endpoints', async ({ page }) => {
  await page.goto('/');

  const board = page.getByLabel('Fotball taktikktavle');
  await expect(board).toBeVisible();

  await page.getByRole('button', { name: /Tegn linje/i }).click();

  const bounds = await board.boundingBox();
  if (!bounds) throw new Error('Board bounding box not found');
  const start = { x: bounds.x + 120, y: bounds.y + 120 };
  const end = { x: bounds.x + 420, y: bounds.y + 320 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y);
  await page.mouse.up();

  const lineElement = page.getByTestId('line-element');
  const lineHitTarget = page.getByTestId('line-hit-target');
  await expect(lineElement).toHaveCount(1, { timeout: 15000 });
  await lineHitTarget.first().click();

  await expect(page.getByLabel('Hel rett linje')).toBeVisible();
  await page.getByLabel('Hel rett linje').click();

  const curveSlider = page.locator('#curve-slider');
  await expect(curveSlider).toBeVisible();
  await curveSlider.fill('50');

  await expect(page.getByLabel('Pil').first()).toBeVisible();
  await page.getByLabel('Pil').first().click();

  await expect(page.getByTestId('line-endpoint-start')).toBeVisible();
  await page.getByTestId('line-endpoint-start').dragTo(board, { targetPosition: { x: 160, y: 140 } });
  await expect(page.getByTestId('line-endpoint-end')).toBeVisible();
  await page.getByTestId('line-endpoint-end').dragTo(board, { targetPosition: { x: 280, y: 200 } });
});

test('shift while drawing snaps line to fixed angles', async ({ page }) => {
  await page.goto('/');

  const board = page.getByLabel('Fotball taktikktavle');
  await expect(board).toBeVisible();

  await page.getByRole('button', { name: /Tegn linje/i }).click();

  const bounds = await board.boundingBox();
  if (!bounds) throw new Error('Board bounding box not found');

  const start = { x: bounds.x + 120, y: bounds.y + 140 };
  const end = { x: bounds.x + 420, y: bounds.y + 220 };

  await page.keyboard.down('Shift');
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y);
  await page.mouse.up();
  await page.keyboard.up('Shift');

  const linePath = await page.getByTestId('line-element').first().getAttribute('d');
  expect(linePath).toBeTruthy();

  const parsed = linePath?.match(/M\s*([\d.-]+)\s+([\d.-]+)\s+L\s*([\d.-]+)\s+([\d.-]+)/);
  expect(parsed).toBeTruthy();

  const startY = Number(parsed?.[2]);
  const endY = Number(parsed?.[4]);
  expect(Math.abs(endY - startY)).toBeLessThan(2);
});

test('drag copied horizontal dashed line to new Y in next keyframe', async ({ page }) => {
  await page.goto('/');

  const board = page.getByLabel('Fotball taktikktavle');
  await expect(board).toBeVisible();

  await page.getByRole('button', { name: /Tegn linje/i }).click();
  await page.getByLabel('Stiplet').first().click();

  const bounds = await board.boundingBox();
  if (!bounds) throw new Error('Board bounding box not found');

  const start = { x: bounds.x + 140, y: bounds.y + 180 };
  const end = { x: bounds.x + 430, y: bounds.y + 220 };

  await page.keyboard.down('Shift');
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y);
  await page.mouse.up();
  await page.keyboard.up('Shift');

  const boardLines = board.locator('[data-testid="line-element"]');
  await expect(boardLines.first()).toBeAttached();

  const drawnLine = boardLines.first();

  const beforePath = await drawnLine.getAttribute('d');
  expect(beforePath).toBeTruthy();

  const beforeParsed = beforePath?.match(/M\s*([\d.-]+)\s+([\d.-]+)\s+L\s*([\d.-]+)\s+([\d.-]+)/);
  expect(beforeParsed).toBeTruthy();
  const beforeStartX = Number(beforeParsed?.[1]);
  const beforeY = Number(beforeParsed?.[2]);
  const beforeEndX = Number(beforeParsed?.[3]);

  await page.getByRole('button', { name: /Ny keyframe/i }).click();
  await expect(page.getByText(/Frame 2\/2/)).toBeVisible();

  await page.getByRole('button', { name: /Velg og flytt/i }).click();
  const line = board.locator('[data-testid="line-hit-target"]').first();
  const dragX = bounds.x + (beforeStartX + beforeEndX) / 2;
  const dragY = bounds.y + beforeY;
  await line.dispatchEvent('mousedown', {
    clientX: dragX,
    clientY: dragY,
    bubbles: true,
  });
  await page.mouse.move(dragX + 1, dragY + 70);
  await page.mouse.up();

  const afterPath = await line.getAttribute('d');
  expect(afterPath).toBeTruthy();

  const afterParsed = afterPath?.match(/M\s*([\d.-]+)\s+([\d.-]+)\s+L\s*([\d.-]+)\s+([\d.-]+)/);
  expect(afterParsed).toBeTruthy();
  const afterStartY = Number(afterParsed?.[2]);
  const afterEndY = Number(afterParsed?.[4]);

  expect(afterStartY).toBeGreaterThan(beforeY + 40);
  expect(Math.abs(afterEndY - afterStartY)).toBeLessThan(2);
});
