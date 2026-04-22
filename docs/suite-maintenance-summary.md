# Suite Maintenance Summary

**Reviewer:** Senior QA Automation Engineer  
**Date:** 2026-04-22  
**Reference (gold standard):** `ai.test.maintenance/tests/main.navigation.professional.spec.ts`

---

## 1. Files Reviewed

| File | Status |
|------|--------|
| `main.navigation.professional.spec.ts` | ✅ Reference – do not modify |
| `main.navigation.spec.ts` | ❌ Superseded – retire |
| `main.navigation.refactored.spec.ts` | ⚠️ Partially improved – retire (professional already covers this scope) |
| `getting-started.spec.ts` | ⚠️ Structurally weak – upgrade |
| `page-object-model.spec.ts` | ⚠️ Structurally weak – upgrade |

---

## 2. Key Findings

### Flaky Anti-Patterns
- `main.navigation.spec.ts` contains `await page.waitForTimeout(2000)` — hard-coded sleep that masks real timing issues and inflates execution time.

### POM Over-Instantiation
- `main.navigation.spec.ts`: every test creates its own `new PlaywrightDevPage(page)` despite a `beforeEach` hook that already does so. The `beforeEach`-created instance is silently discarded.
- `getting-started.spec.ts` and `page-object-model.spec.ts`: POM instantiated inline with no `beforeEach`.

### Inline Selector Bypass
- `main.navigation.refactored.spec.ts` T1 uses `page.getByRole('navigation').getByRole('link', { name: 'Docs' })` directly instead of `playwrightDev.navDocs` from the POM. This duplicates locator logic already in `PlaywrightDevPage`.
- Same file constructs the Community locator inline (`page.locator('footer').getByText('Community', { exact: true })`) instead of using `playwrightDev.navCommunity`.

### Weak / Loose Assertions
- `main.navigation.spec.ts` and `main.navigation.refactored.spec.ts` use unanchored URL regex (`/\/docs\//`) instead of the anchored form (`/^https:\/\/playwright\.dev\/docs\//`) used in the reference, allowing false positives from any URL that happens to contain `/docs/`.
- Heading assertions in both legacy files use `toBeVisible()` only — no content check. The reference uses `toContainText(/Installation|Introduction|Getting started/i)` to confirm the correct page loaded.

### Missing Link-Attribute Validation
- `main.navigation.spec.ts` and `main.navigation.refactored.spec.ts`: footer community links are only checked for visibility, with no `href` destination check and no `rel="noopener noreferrer"` security attribute check. The reference validates both.

### No `test.step()` Structure
- `main.navigation.spec.ts`, `getting-started.spec.ts`, and `page-object-model.spec.ts` contain flat assertions with no `test.step()` wrappers. This reduces traceability in reports and makes step-level failures harder to diagnose.

### Missing TC Traceability
- Test names in `main.navigation.spec.ts` and both ancillary files carry no structured test-case IDs (e.g., `TC-NAV-001-T1`). The reference maps every test and step back to a manual TC ID, enabling direct traceability between automation and the test plan.

### Missing POM Action Methods
- `main.navigation.refactored.spec.ts` directly calls `playwrightDev.navAPI.click()` and inline-locator `.click()` instead of the `clickDocs()` / `clickAPI()` action methods defined on `PlaywrightDevPage`. This couples navigation logic to test code rather than the page layer.

### No Edge or Negative Coverage
- Only `main.navigation.professional.spec.ts` covers mobile viewport, back-navigation href integrity, degenerate href detection, and the 404 negative path. All other files skip these scenarios entirely.

---

## 3. Issues by Type

| Type | Count | Files Affected |
|------|-------|----------------|
| Flaky anti-pattern (`waitForTimeout`) | 1 | `main.navigation.spec.ts` |
| POM over-instantiation | 3 | `main.navigation.spec.ts`, `getting-started.spec.ts`, `page-object-model.spec.ts` |
| Inline selector bypass | 4 | `main.navigation.refactored.spec.ts` |
| Loose URL assertion | 2 | `main.navigation.spec.ts`, `main.navigation.refactored.spec.ts` |
| Weak heading assertion (no content) | 2 | `main.navigation.spec.ts`, `main.navigation.refactored.spec.ts` |
| Missing `href` / `rel` validation | 2 | `main.navigation.spec.ts`, `main.navigation.refactored.spec.ts` |
| No `test.step()` structure | 3 | `main.navigation.spec.ts`, `getting-started.spec.ts`, `page-object-model.spec.ts` |
| Missing TC ID traceability | 4 | all non-reference files |
| No edge / negative tests | 4 | all non-reference files |

---

## 4. Comparison vs. Reference File

| Practice | `main.navigation.professional.spec.ts` | `main.navigation.spec.ts` | `main.navigation.refactored.spec.ts` |
|---|:---:|:---:|:---:|
| Shared POM via `beforeEach` | ✅ | ⚠️ (unused) | ✅ |
| `test.step()` wrappers | ✅ | ❌ | ✅ |
| TC ID in every test name | ✅ | ❌ | ❌ |
| POM action methods (`clickDocs`, `clickAPI`) | ✅ | ❌ | ❌ |
| Anchored URL regex | ✅ | ❌ | ❌ |
| Heading content assertion | ✅ | ❌ | ❌ |
| `href` + `rel` on community links | ✅ | ❌ | ❌ |
| No `waitForTimeout` | ✅ | ❌ | ✅ |
| Mobile viewport edge case | ✅ | ❌ | ❌ |
| Back-navigation integrity test | ✅ | ❌ | ❌ |
| 404 negative test | ✅ | ❌ | ❌ |

---

## 5. Estimated Impact

| Dimension | Current State | After Consolidation |
|-----------|--------------|---------------------|
| **Stability** | Medium — `waitForTimeout` introduces flakiness; loose URL regexes can yield false positives | High — deterministic waits via Playwright auto-waiting; anchored assertions |
| **Execution time** | ~+2 s per run from `waitForTimeout` | Eliminated |
| **Maintainability** | Low-medium — selector logic scattered across test files and POM | High — all locators centralised in `PlaywrightDevPage`; tests use action methods |
| **Traceability** | Low — no link from test name to manual TC | High — every test maps to a TC-NAV-xxx step |
| **Coverage** | Low — 5 tests cover happy path only; 0 edge, 0 negative | High — reference adds 3 edge + 1 negative; ancillary specs add `getting-started` and `pom` paths |
| **Report readability** | Low — flat assertions produce anonymous failures | High — `test.step()` labels each assertion in the HTML report |

---

## 6. Consolidation Strategy

1. **Retire `main.navigation.spec.ts`** — every test it contains is either a direct duplicate of the professional spec or an inferior version of it. Delete the file.
2. **Retire `main.navigation.refactored.spec.ts`** — it was an intermediate step toward the professional spec. Now that the professional spec exists this file adds noise and duplicated execution.
3. **Upgrade `getting-started.spec.ts`**:
   - Add `let` POM variable + `beforeEach`.
   - Wrap assertions in `test.step()`.
   - Add TC ID to the test name (e.g., `TC-GS-001-T1`).
   - Tighten URL regex to anchored form.
4. **Upgrade `page-object-model.spec.ts`**:
   - Same structural upgrades as `getting-started.spec.ts`.
   - Replace `page.locator('article')` with a role-based selector.
5. **Centralise any leftover inline locators** into `PlaywrightDevPage` if `getting-started` or `pom` tests need them.
6. **Net test count after consolidation**: 2 navigation files → 1 (`professional`); 2 ancillary files retained and upgraded. Total file count: 3 (down from 5).

---

## 7. Representative Refactor: `main.navigation.spec.ts`

This file has the highest density of issues: `waitForTimeout`, duplicate POM construction, no steps, no TC IDs, loose assertions, and missing attribute checks. It best represents the patterns to eliminate.

### Before

```typescript
// main.navigation.spec.ts (before)
import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

test.describe('TC001 - Main page navigation buttons', () => {
  test.beforeEach(async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page); // created but never shared
    await playwrightDev.goto();
  });

  test('Docs and API links are visible in the top navigation bar', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page); // ❌ duplicate construction
    await page.waitForTimeout(2000);                    // ❌ hard-coded sleep
    await expect(playwrightDev.navDocs).toBeVisible();
    await expect(playwrightDev.navAPI).toBeVisible();
  });

  test('Community section is visible on the page', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page); // ❌ duplicate construction
    await expect(playwrightDev.navCommunity).toBeVisible();
  });

  test('Docs button navigates to the documentation section', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page); // ❌ duplicate construction
    await playwrightDev.navDocs.click();               // ❌ bypasses clickDocs() method
    await expect(page).toHaveURL(/\/docs\//);          // ❌ loose, unanchored regex
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); // ❌ no content check
  });

  test('API button navigates to the API reference section', async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page); // ❌ duplicate construction
    await playwrightDev.navAPI.click();                // ❌ bypasses clickAPI() method
    await expect(page).toHaveURL(/\/docs\/api\//);     // ❌ loose regex
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); // ❌ no content check
  });

  test('Community section contains accessible community links', async ({ page }) => {
    const footer = page.locator('footer');             // ❌ inline locator, bypasses POM
    await expect(footer.getByRole('link', { name: 'Stack Overflow' })).toBeVisible(); // ❌ no href check
    await expect(footer.getByRole('link', { name: 'Discord' })).toBeVisible();        // ❌ no rel check
  });
});
```

### After (aligned with `main.navigation.professional.spec.ts`)

```typescript
// main.navigation.spec.ts (after) — RETIRED, replaced by main.navigation.professional.spec.ts
//
// File deleted. All coverage migrated to main.navigation.professional.spec.ts:
//   T1 → TC-NAV-001-T1 (Docs + API visibility)
//   T2 → TC-NAV-001-T2 (Community footer heading)
//   T3 → TC-NAV-001-T3 (Docs navigation + anchored URL + heading content)
//   T4 → TC-NAV-001-T4 (API navigation + anchored URL + heading content)
//   T5 → TC-NAV-001-T5 (community links + href + rel=noopener)
//
// Additionally gained (zero cost after retirement):
//   T6 → mobile viewport edge case
//   T7 → back-navigation href integrity
//   T8 → 404 negative
```

### Diff summary

| Change | Reason |
|--------|---------|
| Removed `waitForTimeout(2000)` | Playwright auto-waits; sleep adds latency with no safety benefit |
| Removed duplicate `new PlaywrightDevPage(page)` inside each test | Single shared instance from `beforeEach` is sufficient |
| Replaced `navDocs.click()` with `homePage.clickDocs()` | Encapsulates navigation logic in the page layer |
| Replaced `navAPI.click()` with `homePage.clickAPI()` | Same as above |
| Changed URL regex to `^https:\/\/playwright\.dev\/docs\/` | Anchored regex prevents false-positive matches |
| Added `toContainText(/Installation|Introduction|Getting started/i)` | Confirms correct page loaded, not just any h1 |
| Added `toHaveAttribute('href', /stackoverflow\.com/)` | Validates link destination |
| Added `toHaveAttribute('rel', /noopener/)` | Validates security attribute on external links |
| Added `test.step()` wrappers | Matches report output to named steps for diagnosis |
| Added TC-NAV-001-Tx prefixes to test names | Bi-directional traceability with manual test plan |

---

## 8. Files to Delete

> ⚠️ Confirm before deleting — these are flagged for removal, not automatically deleted.

- `ai.test.maintenance/tests/main.navigation.spec.ts`
- `ai.test.maintenance/tests/main.navigation.refactored.spec.ts`
