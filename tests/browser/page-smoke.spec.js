import { expect, test } from '@playwright/test';
import { loadUrpFixture } from './support/urp-fixture.js';

const cases = [
  { fixture: 'home', selector: '.widget-box', expectedCount: 2, settings: true, cleanEntry: true },
  { fixture: 'grades', selector: '#score-table', settings: true },
  { fixture: 'evaluation', selector: '#evaluation-table', settings: true },
  { fixture: 'free-classroom', selector: '#free-classroom-table', settings: true },
];

for (const fixtureCase of cases) {
  test(`${fixtureCase.fixture} fixture initializes without duplicate global UI or page errors`, async ({ page }) => {
    const { pageErrors } = await loadUrpFixture(page, { fixture: fixtureCase.fixture });
    await expect(page.locator(fixtureCase.selector)).toHaveCount(fixtureCase.expectedCount || 1);
    await expect(page.locator('#urppp-nav-theme')).toHaveCount(fixtureCase.settings ? 1 : 0);
    await expect(page.locator('#urppp-settings-panel')).toHaveCount(fixtureCase.settings ? 1 : 0);
    await expect(page.locator('#urppp-settings-mask')).toHaveCount(fixtureCase.settings ? 1 : 0);
    if (fixtureCase.cleanEntry) await expect(page.locator('#urppp-nav-clean')).toHaveCount(1);
    await expect(page.locator('#urppp-native-schedule-export')).toHaveCount(0);
    await page.waitForTimeout(1_200);
    expect(pageErrors).toEqual([]);
  });
}
