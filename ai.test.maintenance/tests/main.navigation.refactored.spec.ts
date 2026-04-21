import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

// TC001 – Main page should display navigation buttons: Docs, API, Community
//
// Note: on the current site Docs and API are top-nav links; Community is a
// footer section heading (not a clickable nav button). Tests reflect this.

test.describe('TC001 - Main page navigation buttons', () => {
  let playwrightDev: PlaywrightDevPage;

  // Shared POM instance: created once per test in beforeEach so all tests
  // reuse the same object instead of each test constructing its own copy.
  test.beforeEach(async ({ page }) => {
    playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
  });

  // Steps 2-5: all three elements are visible on the page
  test('Docs and API links are visible in the top navigation bar', async ({ page }) => {
    await test.step('Verify Docs link is visible in the navigation bar', async () => {
      // Role-based locator replaces the brittle #docs CSS ID selector
      await expect(
        page.getByRole('navigation').getByRole('link', { name: 'Docs' })
      ).toBeVisible();
    });

    await test.step('Verify API link is visible in the navigation bar', async () => {
      await expect(playwrightDev.navAPI).toBeVisible();
    });
  });

  test('Community section heading is visible in the page footer', async ({ page }) => {
    await test.step('Verify Community heading is present in the footer', async () => {
      await expect(
        page.locator('footer').getByText('Community', { exact: true })
      ).toBeVisible();
    });
  });

  // Steps 6-7: Docs link navigates correctly
  test('Docs link navigates to the documentation section', async ({ page }) => {
    await test.step('Click the Docs link in the navigation bar', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Docs' }).click();
    });

    await test.step('Verify the URL contains /docs/', async () => {
      await expect(page).toHaveURL(/\/docs\//);
    });

    await test.step('Verify a top-level heading is visible on the destination page', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  // Steps 8-9: API link navigates correctly
  test('API link navigates to the API reference section', async ({ page }) => {
    await test.step('Click the API link in the navigation bar', async () => {
      await playwrightDev.navAPI.click();
    });

    await test.step('Verify the URL contains /docs/api/', async () => {
      await expect(page).toHaveURL(/\/docs\/api\//);
    });

    await test.step('Verify a top-level heading is visible on the destination page', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  // Step 10: Community footer section exposes reachable community links
  test('Community footer section contains accessible community links', async ({ page }) => {
    await test.step('Verify Stack Overflow link is visible in the footer', async () => {
      await expect(
        page.locator('footer').getByRole('link', { name: 'Stack Overflow' })
      ).toBeVisible();
    });

    await test.step('Verify Discord link is visible in the footer', async () => {
      await expect(
        page.locator('footer').getByRole('link', { name: 'Discord' })
      ).toBeVisible();
    });
  });
});
