import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly installationHeader: Locator;
  readonly pomLink: Locator;
  readonly navDocs: Locator;
  readonly navAPI: Locator;
  readonly navCommunity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.installationHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page
      .locator('li', { hasText: 'Guides' })
      .locator('a', { hasText: 'Page Object Model' });
    this.navDocs = page.getByRole('navigation').locator('#docs');
    this.navAPI = page.getByRole('navigation').getByRole('link', { name: 'API' });
    // Community is a footer section heading, not a top-nav link on the current site
    this.navCommunity = page.locator('footer').getByText('Community', { exact: true });
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.installationHeader).toBeVisible();
  }

  async navigateToPOM() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
