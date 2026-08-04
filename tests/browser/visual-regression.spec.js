import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const skins = ['apple', 'flat', 'organic', 'brutal', 'editorial', 'neu'];

for (const skin of skins) {
  test(`@visual schedule ${skin} light desktop`, async ({ page }) => {
    const { pageErrors } = await loadUrpFixture(page, {
      values: {
        urppp_skin_v1: skin,
        urppp_theme_v3: 'default',
      },
    });
    await expect(page.locator('html')).toHaveAttribute('data-urppp-skin', skin);
    await expect(page.locator('#mycoursetable')).toHaveScreenshot(`schedule-${skin}-light-desktop.png`, {
      animations: 'disabled',
      maxDiffPixels: 120,
    });
    expect(pageErrors).toEqual([]);
  });
}

test('@visual schedule apple dark desktop', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    values: {
      urppp_skin_v1: 'apple',
      urppp_theme_v3: 'dark',
    },
  });
  await expect(page.locator('html')).toHaveClass(/urppp-theme-dark/);
  await expect(page.locator('#page-content-template')).toHaveScreenshot('schedule-apple-dark-desktop.png', {
    animations: 'disabled',
    maxDiffPixels: 160,
  });
  expect(pageErrors).toEqual([]);
});

test('@visual schedule apple light mobile', async ({ page }) => {
  const { pageErrors } = await loadUrpFixture(page, {
    viewport: { width: 390, height: 844 },
    values: {
      urppp_skin_v1: 'apple',
      urppp_theme_v3: 'default',
    },
  });
  await expect(page.locator('#page-content-template')).toHaveScreenshot('schedule-apple-light-mobile.png', {
    animations: 'disabled',
    maxDiffPixels: 160,
  });
  expect(pageErrors).toEqual([]);
});
