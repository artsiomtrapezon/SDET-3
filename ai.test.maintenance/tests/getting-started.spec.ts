import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

test.describe('TC-GS-001 - Getting Started guide', () => {
  let homePage: PlaywrightDevPage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightDevPage(page);
    await homePage.goto();
  });

  test('TC-GS-001-T1: installation page should be reachable via Get Started link', async ({ page }) => {
    await test.step('[TC-GS-001 Step 1] Click the Get Started link', async () => {
      await homePage.getStarted();
    });

    await test.step('[TC-GS-001 Step 2] Verify the URL resolves to the /docs/intro path', async () => {
      await expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\/intro/);
    });

    await test.step('[TC-GS-001 Step 3] Verify the Installation heading is visible', async () => {
      await expect(homePage.installationHeader).toBeVisible();
    });
  });
});
