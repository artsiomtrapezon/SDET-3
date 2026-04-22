import { type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly installationHeader: Locator;
  readonly pomLink: Locator;
  // Role-based locator (replaces brittle CSS-ID #docs)
  readonly navDocs: Locator;
  readonly navAPI: Locator;
  // Community is a footer section heading, not a top-nav link on the current site
  readonly navCommunity: Locator;
  readonly footerStackOverflow: Locator;
  readonly footerDiscord: Locator;
  readonly menuToggle: Locator;
  readonly navLinks: Locator;
  readonly pageHeading: Locator;
  readonly notFoundHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.installationHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page
      .locator('li', { hasText: 'Guides' })
      .locator('a', { hasText: 'Page Object Model' });
    this.navDocs = page.getByRole('navigation').getByRole('link', { name: 'Docs' });
    this.navAPI = page.getByRole('navigation').getByRole('link', { name: 'API' });
    this.navCommunity = page.locator('footer').getByText('Community', { exact: true });
    this.footerStackOverflow = page.locator('footer').getByRole('link', { name: 'Stack Overflow' });
    this.footerDiscord = page.locator('footer').getByRole('link', { name: 'Discord' });
    this.menuToggle = page.getByRole('button', { name: /menu|navigation|toggle/i });
    this.navLinks = page.getByRole('navigation').getByRole('link');
    this.pageHeading = page.getByRole('heading', { level: 1 });
    this.notFoundHeading = page.getByRole('heading', { name: /not available|not found|404/i });
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
  }

  async navigateToPOM() {
    await this.getStarted();
    await this.pomLink.click();
  }

  async clickDocs() {
    await this.navDocs.click();
  }

  async clickAPI() {
    await this.navAPI.click();
  }

  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async openMobileMenu() {
    await this.menuToggle.click();
  }

  async goBack() {
    await this.page.goBack();
  }

  async gotoInvalidRoute(): Promise<number> {
    const response = await this.page.goto('https://playwright.dev/this-page-does-not-exist');
    return response?.status() ?? -1;
  }

  async getNavLinkHrefs(): Promise<(string | null)[]> {
    const count = await this.navLinks.count();
    const hrefs: (string | null)[] = [];
    for (let i = 0; i < count; i++) {
      hrefs.push(await this.navLinks.nth(i).getAttribute('href'));
    }
    return hrefs;
  }
}
