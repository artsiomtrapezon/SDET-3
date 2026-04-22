import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

/**
 * TC-NAV-001 – Main page navigation buttons: Docs, API, Community
 *
 * Manual test reference: TC001-navigation-buttons.md
 * Priority: High | Type: Functional – UI Navigation
 *
 * Site reality vs. TC-NAV-001 deviations:
 *   - Steps 5/10: Community is a footer section heading, NOT a top-nav button.
 *     Tests validate footer presence and reachable community links instead.
 *     Accepted deviation; no defect filed.
 *   - Steps 7/9 (return to home page): handled implicitly by beforeEach.
 *   - All nav elements and footer community links are encapsulated in PlaywrightDevPage.
 */

test.describe('TC-NAV-001 - Main page navigation buttons', () => {
  let homePage: PlaywrightDevPage;

  // beforeEach: TC-NAV-001 Step 1 (navigate to https://playwright.dev/)
  // Also implicitly handles Steps 7/9 (return to home page) before each test.
  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightDevPage(page);
    await homePage.goto();
  });

  // TC-NAV-001 Steps 2–5: all three navigation elements are visible
  test('TC-NAV-001-T1: Docs and API links are visible in the top navigation bar', async () => {
    await test.step('[TC-NAV-001 Step 3] Verify Docs link is visible in the navigation bar', async () => {
      await expect(homePage.navDocs).toBeVisible();
    });

    await test.step('[TC-NAV-001 Step 4] Verify API link is visible in the navigation bar', async () => {
      await expect(homePage.navAPI).toBeVisible();
    });
  });

  // TC-NAV-001 Step 5 – deviation: Community is in the footer, not the top nav
  test('TC-NAV-001-T2: Community section heading is visible in the page footer', async () => {
    await test.step('[TC-NAV-001 Step 5 - deviation] Verify Community heading is present in the footer', async () => {
      await expect(homePage.navCommunity).toBeVisible();
    });
  });

  // TC-NAV-001 Steps 6–7: Docs link navigates correctly
  test('TC-NAV-001-T3: Docs link navigates to the documentation section', async ({ page }) => {
    await test.step('[TC-NAV-001 Step 6] Click the Docs link in the navigation bar', async () => {
      await homePage.clickDocs();
    });

    await test.step('[TC-NAV-001 Step 6] Verify the URL resolves to the /docs/ path prefix', async () => {
      await expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\//);
    });

    await test.step('[TC-NAV-001 Step 6] Verify the Docs page has a recognisable heading', async () => {
      await expect(homePage.pageHeading).toContainText(/Installation|Introduction|Getting started/i);
    });
  });

  // TC-NAV-001 Steps 8–9: API link navigates correctly
  test('TC-NAV-001-T4: API link navigates to the API reference section', async ({ page }) => {
    await test.step('[TC-NAV-001 Step 8] Click the API link in the navigation bar', async () => {
      await homePage.clickAPI();
    });

    await test.step('[TC-NAV-001 Step 8] Verify the URL resolves to the /docs/api/ path prefix', async () => {
      await expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\/api\//);
    });

    await test.step('[TC-NAV-001 Step 8] Verify the API page has a recognisable heading', async () => {
      await expect(homePage.pageHeading).toContainText(/Playwright|API|Library/i);
    });
  });

  // TC-NAV-001 Step 10 – deviation: validates footer community links
  test('TC-NAV-001-T5: Community footer section contains accessible community links with valid destinations', async () => {
    await test.step('[TC-NAV-001 Step 10] Verify Stack Overflow link is visible and points to stackoverflow.com', async () => {
      await expect(homePage.footerStackOverflow).toBeVisible();
      await expect(homePage.footerStackOverflow).toHaveAttribute('href', /stackoverflow\.com/);
    });

    await test.step('[TC-NAV-001 Step 10] Verify Discord link is visible and points to a Discord destination', async () => {
      await expect(homePage.footerDiscord).toBeVisible();
      await expect(homePage.footerDiscord).toHaveAttribute('href', /discord/);
    });

    await test.step('[TC-NAV-001 Step 10] Verify external community links carry rel="noopener noreferrer"', async () => {
      await expect(homePage.footerStackOverflow).toHaveAttribute('rel', /noopener/);
      await expect(homePage.footerDiscord).toHaveAttribute('rel', /noopener/);
    });
  });

  // TC-NAV-001 Edge case: nav links remain accessible at mobile viewport width.
  // At 375 px the site collapses nav links behind a hamburger toggle button.
  // The flow is: open toggle → links become visible → assert each one.
  test('TC-NAV-001-T6 [edge]: Docs and API links are accessible at mobile viewport width', async () => {
    await test.step('Resize to iPhone SE viewport (375 × 667) and reload', async () => {
      await homePage.setMobileViewport();
      await homePage.goto();
    });

    await test.step('[TC-NAV-001 edge] Verify a hamburger/menu toggle button is visible on mobile', async () => {
      // The site replaces the top-nav links with a toggle button at narrow widths.
      await expect(homePage.menuToggle).toBeVisible();
      await homePage.openMobileMenu();
    });

    await test.step('[TC-NAV-001 edge] Verify Docs link is visible after opening the mobile menu', async () => {
      await expect(homePage.navDocs).toBeVisible();
    });

    await test.step('[TC-NAV-001 edge] Verify API link is visible after opening the mobile menu', async () => {
      await expect(homePage.navAPI).toBeVisible();
    });
  });

  test('TC-NAV-001-T7 [edge]: nav link hrefs remain correct after back-navigation from Docs', async ({ page }) => {
    await test.step('[TC-NAV-001 edge] Record the Docs link href on the home page', async () => {
      await expect(homePage.navDocs).toBeVisible();
      await expect(homePage.navDocs).toHaveAttribute('href', /\/docs\//);
    });

    await test.step('[TC-NAV-001 edge] Navigate to Docs and then go back', async () => {
      await homePage.clickDocs();
      await expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\//);
      await homePage.goBack();
      await expect(page).toHaveURL('https://playwright.dev/');
    });

    await test.step('[TC-NAV-001 edge] Verify Docs link href is unchanged after back-navigation', async () => {
      await expect(homePage.navDocs).toBeVisible();
      await expect(homePage.navDocs).toHaveAttribute('href', /\/docs\//);
    });

    await test.step('[TC-NAV-001 edge] Verify API link href is unchanged after back-navigation', async () => {
      await expect(homePage.navAPI).toBeVisible();
      await expect(homePage.navAPI).toHaveAttribute('href', /\/docs\/api\//);
    });

    await test.step('[TC-NAV-001 edge] Verify no nav link points to an empty, hash-only, or javascript: href', async () => {
      const hrefs = await homePage.getNavLinkHrefs();
      hrefs.forEach((href, i) => {
        // A link with href="#", "", or "javascript:void(0)" is either broken or
        // non-functional and should not appear in the primary navigation.
        expect(href, `Nav link ${i} has a degenerate href`).toMatch(/^(?!javascript:|#$|$).+/);
      });
    });
  });

  // TC-NAV-001 Negative: an invalid route returns HTTP 404 and renders a not-found page
  test('TC-NAV-001-T8 [negative]: navigating to an invalid route returns 404 and renders a not-found page', async () => {
    await test.step('[TC-NAV-001 negative] Navigate to a non-existent route and capture the HTTP status', async () => {
      const status = await homePage.gotoInvalidRoute();
      expect(status).toBe(404);
    });

    await test.step('[TC-NAV-001 negative] Verify the page displays a not-found heading', async () => {
      await expect(homePage.notFoundHeading).toBeVisible();
    });
  });
});
