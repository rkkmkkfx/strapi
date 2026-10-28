import { expect, test } from '@playwright/test';

for (const width of [320, 375, 768, 1280]) {
  test(`content remains accessible at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByLabel('Article title')).toBeVisible();
    const bounds = await page.getByLabel('Article title').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width
    );
    const table = page.getByRole('region', { name: 'Articles table' });
    expect(
      await table.evaluate((element) =>
        [element, ...Array.from(element.querySelectorAll('*'))].some(
          (node) =>
            node.scrollWidth > node.clientWidth && getComputedStyle(node).overflowX === 'auto'
        )
      )
    ).toBe(true);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Saved' })).toHaveText('Saved');
    await page.screenshot({ path: testInfo.outputPath('content.png'), fullPage: true });
    if (width < 768) {
      await expect(page.getByRole('link', { name: 'Content manager' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Main menu' }).click();
      await expect(page.getByRole('dialog', { name: 'Main menu' })).toBeVisible();
      for (let index = 0; index < 5; index += 1) {
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(
          true
        );
      }
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Main menu' })).toBeFocused();
      await page.getByRole('button', { name: 'Content types' }).click();
      await page.getByRole('link', { name: 'Articles', exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    } else {
      await expect(page.getByRole('button', { name: 'Main menu' })).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Content manager' })).toBeVisible();
    }
  });
}

test('resizing an open menu restores desktop navigation and scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Main menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Content manager' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Articles', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(page.getByRole('link', { name: 'Content manager' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
});

test('capture mobile and desktop layout previews', async ({ page }, testInfo) => {
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/preview');
    await expect(page.getByLabel('Article title')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`admin-${width}.png`), fullPage: true });
    if (width === 375) {
      await page.getByRole('button', { name: 'Main menu' }).click();
      await page.screenshot({ path: testInfo.outputPath('mobile-menu.png'), fullPage: true });
    }
  }
});
