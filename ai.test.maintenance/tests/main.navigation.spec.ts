import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

// TC001 – Main page should display navigation buttons: Docs, API, Community
//
// Note: on the current site Docs and API are top-nav links; Community is a
// footer section heading (not a clickable nav button). Tests reflect this.

test.describe('TC001 – Main page navigation buttons', () => {
  test.beforeEach(async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
  });

  // Steps 2-5: all three elements are visible on the page
  test('Docs and API links are visible in the top navigation bar', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await expect(playwrightDev.navDocs).toBeVisible();
    await expect(playwrightDev.navAPI).toBeVisible();
  });

  test('Community section is visible on the page', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await expect(playwrightDev.navCommunity).toBeVisible();
  });

  // Step 6-7: Docs button navigates correctly
  test('Docs button navigates to the documentation section', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await playwrightDev.navDocs.click();

    await expect(page).toHaveURL(/\/docs\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  // Step 8-9: API button navigates correctly
  test('API button navigates to the API reference section', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);

    await playwrightDev.navAPI.click();

    await expect(page).toHaveURL(/\/docs\/api\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  // Step 10: Community section exposes reachable community links
  test('Community section contains accessible community links', async ({ page }) => {
    const footer = page.locator('footer');

    await expect(footer.getByRole('link', { name: 'Stack Overflow' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Discord' })).toBeVisible();
  });
});
