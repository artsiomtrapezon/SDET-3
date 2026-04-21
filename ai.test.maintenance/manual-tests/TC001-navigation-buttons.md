# TC001 – Main page should display navigation buttons: Docs, API, Community

| Field        | Value                                             |
|--------------|---------------------------------------------------|
| **ID**       | TC001                                             |
| **Title**    | Main page displays Docs, API, and Community navigation buttons |
| **URL**      | https://playwright.dev/                           |
| **Priority** | High                                              |
| **Type**     | Functional – UI Navigation                        |

## Preconditions

- A modern web browser is open (e.g., Chrome, Firefox, Edge).
- An active internet connection is available.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open a browser and navigate to `https://playwright.dev/` | The Playwright home page loads successfully with a status of 200. |
| 2 | Inspect the top navigation bar visible at the top of the page. | A horizontal navigation bar is present at the top of the page. |
| 3 | Locate the **Docs** navigation button/link in the header. | A clickable "Docs" element is visible in the navigation bar. |
| 4 | Locate the **API** navigation button/link in the header. | A clickable "API" element is visible in the navigation bar. |
| 5 | Locate the **Community** navigation button/link in the header. | A clickable "Community" element is visible in the navigation bar. |
| 6 | Click the **Docs** button. | The browser navigates to the Docs section (URL contains `/docs`). The page title or heading references documentation. |
| 7 | Return to the home page (`https://playwright.dev/`). | The home page reloads correctly. |
| 8 | Click the **API** button. | The browser navigates to the API reference section (URL contains `/api`). |
| 9 | Return to the home page (`https://playwright.dev/`). | The home page reloads correctly. |
| 10 | Click the **Community** button. | The browser navigates to or reveals a Community section (URL contains `/community` or a dropdown with community links is shown). |

## Expected Final State

All three navigation buttons — **Docs**, **API**, and **Community** — are present, visible, and functional on the main page. Each button navigates to the correct destination without errors.

## Pass / Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Docs button is visible in the navigation bar | ✅ Visible | ❌ Missing or hidden |
| API button is visible in the navigation bar | ✅ Visible | ❌ Missing or hidden |
| Community button is visible in the navigation bar | ✅ Visible | ❌ Missing or hidden |
| Each button navigates to the correct page | ✅ Correct URL | ❌ Wrong URL, broken link, or 404 |

## Notes

- Verify the test on Chrome, Firefox, and Edge for cross-browser coverage.
- On mobile viewports the navigation may collapse into a hamburger menu; test that the buttons remain accessible.
