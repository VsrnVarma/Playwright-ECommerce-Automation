# Playwright BDD Automation Framework

> End-to-end UI & API test automation for [AutomationExercise.com](https://automationexercise.com)  
> Built with **Playwright** · **Cucumber BDD** · **TypeScript** · **Page Object Model**

---

## Overview

A production-grade test automation framework targeting **AutomationExercise.com** - a full-stack e-commerce demo site with both a UI layer and a documented REST API.

### What's Covered

| Domain | Scenarios |
|--------|-----------|
| **Authentication** | Login, Registration, Logout, Account Deletion |
| **Products** | Browse, Search, Filter by Category/Brand, Reviews |
| **Cart** | Add, Remove, Quantity Management |
| **Checkout** | Full E2E Order Placement, Payment, Guest Checkout |
| **Contact** | Form Submission, Validation |
| **API — Products** | GET Products, Search, Method Guards |
| **API — Brands** | GET Brands, Method Guards |
| **API — Users** | Full Lifecycle: Create → Verify → Update → Delete |
| **Edge Cases** | XSS, SQL Injection, Empty Fields, Invalid Formats |

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.58 | Browser automation + API testing |
| [Cucumber BDD](https://cucumber.io) | ^12.7 | Gherkin feature files |
| [TypeScript](https://typescriptlang.org) | ^5.9 | Type-safe test code |
| [ts-node](https://typestrong.org/ts-node/) | ^10.9 | Run TypeScript directly |
| [multiple-cucumber-html-reporter](https://github.com/WasiqB/multiple-cucumber-html-reporter) | ^3.10 | Rich HTML reports |

---

## Project Structure

```
playwright-automation/
│
├── config/
│   └── config.ts                  # Central config driven by .env
│
├── src/
│   ├── api/
│   │   └── ApiClient.ts           # Typed API methods for all endpoints
│   ├── features/
│   │   ├── ui/
│   │   │   ├── auth.feature       # Login, Registration, Logout
│   │   │   ├── product.feature    # Browse, Search, Filter
│   │   │   ├── cart.feature       # Cart management
│   │   │   ├── checkout.feature   # Order placement
│   │   │   └── misc.feature       # Contact, Subscription, Nav
│   │   └── api/
│   │       ├── user.api.feature   # User lifecycle API
│   │       └── product.api.feature# Products & Brands API
│   ├── helpers/
│   │   └── CustomWorld.ts         # Cucumber World — shared context
│   ├── pages/                     # Page Object Model classes
│   │   ├── BasePage.ts            # Abstract base with shared helpers
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── SignupPage.ts
│   │   ├── ProductPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── ContactUsPage.ts
│   ├── setup/
│   │   ├── hooks.ts               # UI Before/After hooks
│   │   └── api-hooks.ts           # API Before/After hooks
│   ├── step-definitions/
│   │   ├── ui/
│   │   │   ├── auth.steps.ts
│   │   │   ├── product.steps.ts
│   │   │   ├── cart.steps.ts
│   │   │   ├── checkout.steps.ts
│   │   │   └── misc.steps.ts
│   │   └── api/
│   │       ├── user.api.steps.ts
│   │       └── product.api.steps.ts
│   └── types/
│       └── index.ts               # Shared TypeScript interfaces
│
├── reports/                       # Generated on test run (gitignored)
│   ├── screenshots/               # PNG screenshots on failure
│   ├── traces/                    # Playwright traces on failure
│   └── videos/                   # Video recordings (if enabled)
│
├── .env.example                   # Environment variable template
├── cucumber.js                    # Cucumber config — UI tests
├── cucumber.api.js                # Cucumber config — API tests
├── cucumber.ui.js                 # Cucumber config — UI only
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A registered account on [AutomationExercise.com](https://automationexercise.com)

```bash
node --version   # v18+
npm --version    # v9+
```

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd playwright-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium
# Or install all browsers:
npx playwright install
```

### 4. Configure Environment

```bash
# Copy the template
cp .env.example .env
```

Edit `.env` with your values:

```env
BASE_URL=https://automationexercise.com
API_BASE_URL=https://automationexercise.com/api

# Pre-registered test account (create once manually on the site)
TEST_USER_EMAIL=your_email@mailinator.com
TEST_USER_PASSWORD=YourPassword@123
TEST_USER_NAME=YourUsername

BROWSER=chromium
HEADLESS=true
SLOW_MO=0
```

### 5. Verify Setup (Dry Run)

```bash
npx cucumber-js --config=cucumber.ui.js --dry-run
```

---

## Configuration

All settings are driven by `.env` via `config/config.ts`:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://automationexercise.com` | Application URL |
| `API_BASE_URL` | `https://automationexercise.com/api` | API base URL |
| `BROWSER` | `chromium` | `chromium` / `firefox` / `webkit` |
| `HEADLESS` | `true` | `true` = headless, `false` = visible browser |
| `SLOW_MO` | `0` | Milliseconds between actions |
| `DEFAULT_TIMEOUT` | `30000` | Element wait timeout (ms) |
| `SCREENSHOT_ON_FAILURE` | `true` | Capture screenshot on test failure |
| `TRACE_ON_FAILURE` | `true` | Capture Playwright trace on failure |
| `VIDEO_ON_FAILURE` | `false` | Record video on test failure |

---

## Running Tests

### Run All UI Tests
```bash
npm test
```

### Run All API Tests
```bash
npm run test:api
```

### Run Specific Feature
```bash
npx cucumber-js --config=cucumber.ui.js src/features/ui/auth.feature
npx cucumber-js --config=cucumber.ui.js src/features/ui/product.feature
npx cucumber-js --config=cucumber.ui.js src/features/ui/cart.feature
npx cucumber-js --config=cucumber.ui.js src/features/ui/checkout.feature
```

### Run by Tag
```bash
# Smoke tests only
npx cucumber-js --config=cucumber.ui.js --tags "@smoke"

# Regression suite
npx cucumber-js --config=cucumber.ui.js --tags "@regression"

# Negative test cases
npx cucumber-js --config=cucumber.ui.js --tags "@negative"

# Auth tests only
npx cucumber-js --config=cucumber.ui.js --tags "@auth"
```

### Run with Visible Browser
```bash
HEADLESS=false npm test
```

### Run with Slow Motion (for debugging)
```bash
HEADLESS=false SLOW_MO=500 npm test
```

### Run a Single Scenario by Line Number
```bash
npx cucumber-js --config=cucumber.ui.js src/features/ui/auth.feature:14
```

---

## Test Tags

### UI Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Critical happy path scenarios |
| `@regression` | Full regression suite |
| `@auth` | Authentication flows |
| `@login` | Login scenarios |
| `@register` | Registration scenarios |
| `@products` | Product browsing |
| `@search` | Search functionality |
| `@cart` | Shopping cart |
| `@checkout` | Checkout & payment |
| `@e2e` | Full end-to-end flows |
| `@negative` | Error & failure cases |
| `@edge-case` | Boundary & edge cases |

### API Tags

| Tag | Description |
|-----|-------------|
| `@api` | All API tests |
| `@verify-login-api` | POST /verifyLogin |
| `@create-account-api` | POST /createAccount |
| `@update-account-api` | PUT /updateAccount |
| `@delete-account-api` | DELETE /deleteAccount |
| `@get-user-api` | GET /getUserDetailByEmail |
| `@search-api` | POST /searchProduct |
| `@api-lifecycle` | Full user lifecycle |

---

## Reports & Artifacts

After running tests, artifacts are saved in `reports/`:

| Artifact | Location | When Generated |
|----------|----------|----------------|
| Screenshots | `reports/screenshots/FAIL_*.png` | Test failure |
| Traces | `reports/traces/FAIL_*.zip` | Test failure |
| Videos | `reports/videos/FAIL_*.webm` | Test failure (if enabled) |
| HTML Report | `reports/cucumber-report.html` | Every run |

### View a Playwright Trace

```bash
npx playwright show-trace "reports/traces/FAIL_scenario_name_123.zip"
```

The Trace Viewer shows:
- Full timeline of every action
- DOM snapshots at each step
- Network requests and responses
- Console logs
- Exact line of code that failed

---

## Design Patterns

### Page Object Model (POM)

Each page has a dedicated class in `src/pages/`. `BasePage` provides shared helpers:

```typescript
// Locator as getter
get loginButton(): Locator {
  return this.page.locator('[data-qa="login-button"]');
}

// Action as method
async login(email: string, password: string): Promise<void> {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
  await this.waitForPageLoad();
}
```

### Cucumber World (Shared Context)

`CustomWorld` extends Cucumber's `World` and holds all shared state per scenario:

```typescript
// In step definitions — access everything via this
When('I login', async function (this: CustomWorld) {
  await this.loginPage.login(email, password);
  this.currentUser = user; // share state between steps
});
```

### API Client Pattern

`ApiClient` wraps Playwright's `APIRequestContext`:

```typescript
const response = await this.apiClient.verifyLogin(email, password);
expect(response.responseCode).toBe(200);
```

---

## CI/CD

### GitHub Actions Example

```yaml
name: Playwright BDD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run API Tests
        run: npm run test:api
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Run UI Smoke Tests
        run: npx cucumber-js --config=cucumber.ui.js --tags "@smoke"
        env:
          HEADLESS: true
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload Failure Artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-failures
          path: |
            reports/screenshots/
            reports/traces/
```
