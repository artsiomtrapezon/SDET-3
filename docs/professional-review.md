
## Prioritized Fix Plan

| Priority | # | Finding | Action |
|----------|---|---------|--------|
| P1 | 9 | Inline locator duplication | Fix POM: replace `navDocs` with a role-based locator; use `navCommunity` in the spec instead of re-inlining |
| P1 | 4 | No negative tests | Add at least one test: navigate to an invalid route and assert a 404/error state |
| P1 | 5 | No mobile/edge-case coverage | Add a `test.describe` with `page.setViewportSize` for mobile; verify nav collapses and links remain accessible |
| P2 | 13 | Generic h1 assertion | Replace with `toContainText(/Introduction/i)` (Docs) and `/Playwright Library/i` (API) after verifying real headings |
| P2 | 3 | Community deviation not formally noted | Add `test.fixme` or a structured comment referencing TC001-step-5 deviation |
| P2 | 6 | Dead `navCommunity` POM property | Use it in the spec, or remove it and keep only the inline — not both |
| P2 | 16 | No `<nav>` accessibility check | Add `toHaveAttribute('aria-label', ...)` assertion on the navigation landmark |
| P3 | 10 | Dual `page` / `playwrightDev.page` handles | Refactor tests to use only the POM's page reference |
| P3 | 14 | Loose URL regex | Tighten to `expect(page).toHaveURL(/^https:\/\/playwright\.dev\/docs\//)` |
| P3 | 15 | Link href not validated | Add `toHaveAttribute('href', /stackoverflow/)` and `/discord/` assertions |
| P3 | 17 | `rel="noopener"` not checked | Assert `rel` attribute on external footer links |
| P4 | 1 | Steps 7/9 not acknowledged | Add a comment explaining `beforeEach` handles navigation reset |
| P4 | 11 | Ambiguous variable name | Rename `playwrightDev` → `homePage` or `navPage` |
| P4 | 12 | Loose traceability comment | Annotate which TC001 step each `test.step` maps to |
| P4 | 8 | HTTP 200 not validated | Capture `goto()` response and assert `response.status() === 200` in the POM |


## Summary
The professional version does the job properly. Every single selector — Docs, API, Community, footer links, hamburger toggle, page heading, nav links collection — lives exclusively in PlaywrightDevPage as a typed readonly property, and all interaction patterns (clickDocs(), clickAPI(), setMobileViewport(), openMobileMenu(), goBack(), getNavLinkHrefs()) are encapsulated as action methods. No locator logic appears in the spec file whatsoever. The expect calls were also pushed out of the POM layer entirely — the page object returns data, tests make assertions. Coverage jumped from 5 to 7 tests, adding a mobile viewport edge case that validates the hamburger menu flow, and a back-navigation test that checks href integrity across all nav links with anchored URL regex assertions. A negative test was also added: navigating to an invalid route asserts HTTP 404 and a visible not-found heading, with the navigation logic encapsulated in gotoInvalidRoute(). The suite is cleaner, more maintainable, and actually tests what a real user would do navigating on different devices.