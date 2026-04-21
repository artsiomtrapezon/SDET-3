import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

test.describe('Getting Started guide', () => {
  test('installation page should be reachable via Get Started link', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await playwrightDev.goto();
    await playwrightDev.getStarted();

    await expect(playwrightDev.installationHeader).toBeVisible();
    await expect(page).toHaveURL(/.*\/docs\/intro/);
  });
});
