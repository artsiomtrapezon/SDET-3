# SDET Test Maintenance — AI-Assisted Playwright Suite

A showcase project demonstrating how to write, analyze, refactor, and maintain a Playwright end-to-end test suite using AI. The project targets the public **[playwright.dev](https://playwright.dev)** website and documents the full lifecycle from a legacy/flawed suite to a professionally written, audited, and CI-ready one.


## Tech Stack

| Tool            | Version                              |
|-----------------|--------------------------------------|
| [Playwright](https://playwright.dev/) | `^1.59.1`      |
| TypeScript      | via `@playwright/test`               |
| Node.js         | compatible with `@types/node ^25.6.0`|
| Package manager | Yarn                                 |
| CI              | GitHub Actions                       |


## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Yarn

### Install dependencies

```bash
yarn install
```

### Install Playwright browsers

```bash
npx playwright install --with-deps
```

---

## Running Tests

| Script        | Command             | Description                    |
|---------------|---------------------|--------------------------------|
| `test`        | `yarn test`         | Run all tests headlessly       |
| `test:headed` | `yarn test:headed`  | Run with browser visible       |
| `test:debug`  | `yarn test:debug`   | Step-through debug mode        |
| `test:ui`     | `yarn test:ui`      | Interactive Playwright UI mode |
| `report`      | `yarn report`       | Open the latest HTML report    |




## CI/CD

GitHub Actions pipeline (`.github/workflows/playwright-tests.yml`):

- Triggers on `push` and `pull_request` to `main`
- Runs on `ubuntu-latest` with a 30-minute timeout
- Uses `yarn --frozen-lockfile` for deterministic installs
- Installs Playwright browsers with `--with-deps`
- Sets `CI=true` (enables 2 retries, 3 workers)
- Concurrency group prevents redundant parallel runs for the same PR/commit
- Minimal `contents: read` permissions
