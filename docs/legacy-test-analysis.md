# Legacy Test Analysis – Prioritized Problem Checklist

---

## P1 — Test Reliability (Fix First)

- [ ] **Hard-coded `waitForTimeout(2000)`** in `main.navigation.spec.ts`
  The only test using it shows no reason why it's needed. Hard waits make tests slow and mask real timing issues.
  _Category: Anti-pattern / Flakiness_

- [ ] **`navDocs` uses a brittle CSS ID selector `#docs`** in `PlaywrightDevPage.ts`
  If the site removes or renames that ID, this locator silently breaks. All other locators use role/text — this is inconsistent and fragile.
  _Category: Locator Strategy_

- [ ] **`getStartedLink` requires `.first()` workaround** in `getStarted()`
  The locator `page.locator('a', { hasText: 'Get started' })` matches multiple elements. The workaround in `getStarted()` hides this ambiguity rather than fixing the locator.
  _Category: Locator Strategy_

---

## P2 — Manual/Automated Test Alignment

- [ ] **TC001 manual test is factually wrong about Community** — Steps 4–5 and 10 describe Community as a top-nav button; the actual page places it in the footer. The comment in `main.navigation.spec.ts` acknowledges this but the manual test was never updated.
  _Category: Documentation Sync_

- [ ] **Step 10 of TC001 says "Click the Community button"** but no click is tested in automation, because `navCommunity` is a footer heading, not a link. The pass/fail criteria ("Community button is visible in the navigation bar") is also incorrect.
  _Category: Documentation Sync_

---

## P3 — Page Object Model Design

- [ ] **`beforeEach` creates a `PlaywrightDevPage` that is discarded** — it only calls `goto()`, and each test body then creates another instance. The POM object is not shared, which is the whole point of `beforeEach`.
  _Category: POM Architecture_

- [ ] **Community test in `main.navigation.spec.ts` bypasses POM** (Step 10 test): `page.locator('footer')` is used directly instead of going through `PlaywrightDevPage`. Breaks encapsulation.
  _Category: POM Architecture_

- [ ] **`goto()` uses an absolute URL** (`https://playwright.dev`) instead of a relative path (`/`), ignoring the `baseURL` already set in `playwright.config.ts`.
  _Category: Configuration / DRY_

---

## P4 — Test Coverage Gaps

- [ ] **Only Chromium is configured** in `playwright.config.ts`. The manual test explicitly calls out Chrome, Firefox, and Edge coverage. Firefox/WebKit projects are commented out or missing entirely.
  _Category: Coverage_

- [ ] **No mobile viewport project** despite TC001 notes calling it out ("hamburger menu" scenario).
  _Category: Coverage_

- [ ] **No negative test cases** anywhere (e.g., broken nav, 404 after click, JS disabled).
  _Category: Coverage_

---

## P5 — Minor / Code Quality

- [ ] **`pomLink` locator is over-chained** (`li[hasText=Guides] > a[hasText=POM]`). It is sensitive to sidebar restructuring and does not use ARIA roles.
  _Category: Locator Strategy_

- [ ] **`installationHeader`** uses `h1` + text match; if heading level changes this breaks silently.
  _Category: Locator Strategy_

---

## Recommended Fix Categories (in order)

| Priority | Category             | Scope                                                                          |
|----------|----------------------|--------------------------------------------------------------------------------|
| 1        | Locator Strategy     | Replace fragile CSS/text selectors with role-based or `data-testid` locators   |
| 2        | Documentation Sync   | Align TC001 manual test to reflect actual site structure (Community in footer) |
| 3        | POM Architecture     | Share POM instance via `beforeEach`, enforce POM usage in all tests            |
| 4        | Anti-pattern Removal | Remove `waitForTimeout`, rely on web-first assertions                          |
| 5        | Configuration        | Use relative `baseURL`, add Firefox/WebKit and mobile projects                 |
| 6        | Coverage             | Add negative tests and cross-browser projects                                  |
