import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

test.describe('TC-POM-001 - Page Object Model guide', () => {
  let homePage: PlaywrightDevPage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightDevPage(page);
    await homePage.goto();
  });

  test('TC-POM-001-T1: POM article should be accessible from the Getting Started guide', async ({ page }) => {
    await test.step('[TC-POM-001 Step 1] Navigate to the Page Object Model article', async () => {
      await homePage.navigateToPOM();
    });

    await test.step('[TC-POM-001 Step 2] Verify the URL resolves to the /docs/pom path', async () => {
      await expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\/pom/);
    });

    await test.step('[TC-POM-001 Step 3] Verify the page heading references Page object models', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Page object models');
    });
  });
});
