import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

test.describe('Page Object Model guide', () => {
  test('POM article should be accessible from the Getting Started guide', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await playwrightDev.goto();
    await playwrightDev.navigateToPOM();

    await expect(page).toHaveURL(/.*\/docs\/pom/);
    await expect(page.locator('article')).toContainText('Page object models');
  });
});
