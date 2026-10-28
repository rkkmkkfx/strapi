import { expect, test } from '@playwright/test';

for (const width of [320, 375, 768, 1280]) {
  test(`list and editor remain accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/list');
    await expect(page.getByRole('heading', { name: 'Articles', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width
    );
    if (width < 768) {
      await expect(page.getByRole('banner', { name: 'Application' })).toHaveCount(1);
      await expect(page.getByRole('combobox', { name: 'Content type' })).toBeVisible();
      await expect(page.getByRole('list', { name: 'Entries' })).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Getting started with our product', exact: true })
      ).toBeVisible();
      await page.getByRole('checkbox', { name: 'Select all entries', exact: true }).check();
      await expect(page.getByRole('checkbox', { name: 'Select 1', exact: true })).toBeChecked();
      await page.getByRole('combobox', { name: 'Sort entries' }).selectOption('title:DESC');
      await page.getByRole('button', { name: 'Table view', exact: true }).click();
    } else {
      await expect(page.getByRole('button', { name: 'Main menu' })).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Content manager', exact: true })).toBeVisible();
    }
    const table = page.getByRole('region', { name: 'Articles table' });
    await expect(table).toBeVisible();
    expect(
      await table.evaluate((element) =>
        [element, ...Array.from(element.querySelectorAll('*'))].some(
          (node) =>
            node.scrollWidth > node.clientWidth && getComputedStyle(node).overflowX === 'auto'
        )
      )
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width
    );
    await page.goto('/editor');
    await expect(page.getByRole('region', { name: 'Articles table' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Filters', exact: true })).toHaveCount(0);
    const field = page.getByRole('textbox', { name: 'Article title', exact: true });
    await field.fill('Unsaved mobile title');
    const bounds = await field.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await page.getByRole('textbox', { name: 'Slug', exact: true }).scrollIntoViewIfNeeded();
    const save = page.getByRole('button', { name: 'Save', exact: true });
    if (width < 768) {
      const position = await save.boundingBox();
      expect(position!.y).toBeGreaterThanOrEqual(56);
      expect(position!.y + position!.height).toBeLessThan(900);
      expect(position!.height).toBeGreaterThanOrEqual(44);
    }
    await save.click();
    await expect(page.getByRole('status').filter({ hasText: 'Saved' })).toHaveText('Saved');
  });
}

test('drawer traps focus, dismisses with Escape or backdrop, and restores focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto('/list');
  const trigger = page.getByRole('button', { name: 'Main menu' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Main menu' })).toBeVisible();
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(
      true
    );
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(370, 400);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('resize releases the drawer lock and preserves entered editor values', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/editor');
  await page.getByRole('textbox', { name: 'Article title', exact: true }).fill('Unsaved title');
  await page.getByRole('button', { name: 'Main menu' }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Content manager', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await expect(page.getByRole('textbox', { name: 'Article title', exact: true })).toHaveValue(
    'Unsaved title'
  );
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(page.getByRole('textbox', { name: 'Article title', exact: true })).toHaveValue(
    'Unsaved title'
  );
  await expect(page.getByRole('button', { name: 'Main menu' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
});

test('long titles and pagination reflow on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/stress-list');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.goto('/stress-editor');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('capture separate list, editor, and drawer previews', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const screen of ['list', 'editor']) {
      await page.goto(`/${screen}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`${screen}-${width}.png`),
        fullPage: true,
      });
    }
    if (width === 375) {
      await page.getByRole('button', { name: 'Main menu' }).click();
      await page.screenshot({ path: testInfo.outputPath('drawer-375.png'), fullPage: false });
    }
  }
});

test('text enlargement and reduced motion preserve mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/list');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  const trigger = page.getByRole('button', { name: 'Main menu' });
  const bounds = await trigger.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  await trigger.click();
  expect(
    await page.getByRole('dialog').evaluate((element) => getComputedStyle(element).animationName)
  ).toBe('none');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
