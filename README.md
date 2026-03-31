# Shopping trolley Checkout - Technical Interview Challenge

## Setup

For this task you need to have `Node.js` installed (node 24). Ideally you'd already have it installed using `nvm`.

### Checking versions

**Note: If either of the commands fail to return a version, it might mean that you don't have the package installed.**

To check the version of `node` installed run:
```bash
node -v
```

To check the version of `nvm` installed run:
```bash
nvm -v
```

If `node` is **installed** (and the version is 22 or higher) continue 'Running the application'.

If `node` is **not installed**, but you have `nvm` installed, running the following command will install the latest version
```bash
nvm install lts
```

If neither are installed, start by installing `nvm` buy following the installation instructions on [the `nvm` repository](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). Once installed, you can install the latest version of `node`

### Running the application

To run the application you're going to test you first need to install the dependencies, to do this run:
```bash
npm install
```

To start the application you can then run:
```bash
npm run dev
```

This should build and run the application and it will be accessible on `http://localhost:5173`. 

You can either manually type this in your browser or the `Vite` output should contain a link (if using VS Code holding CTRL + clicking the link will open it in the browser).

## Task

**Please don't spend longer than 30 minutes on this task**

1. Create a branch with your name - e.g. `john-smith`.
2. Write some test cases for the checkout application, it's up to you to decide what tests to write, how many, and
how to structure them. You should put your tests in the `cypress/e2e` folder.
3. Push your changes to the repository and create a pull request to the `main` branch.

### Tips
- A valid promo code is `SAVE10`
- Remember that your test files should have the extension `.cy.ts`
- You don't need to change anything in the application, but you can view the code in `src/components/Checkout.vue` if
  you feel that would be beneficial
- Consider Cypress functionality/configuration *outside* of tests themselves

## Running Cypress Tests

### Open Cypress UI (interactive mode)
```bash
npm run cypress:open
```

This opens the Cypress test runner where you can:
- See all available tests
- Run tests with live preview
- Debug individual tests
- Watch test execution in real-time

try use headless if you can - if you get stuck without it, we can workaround it. *Note: Only applicable for live interview sessions*

### Run tests headlessly
```bash
npm run cypress:run
```

Runs all tests without the interactive UI

## Example Test Pattern

```typescript
describe('Feature Name', () => {
  beforeEach(() => {

  })

  it('should do something specific', () => {
    // Arrange: Set up the state
    cy.get('[data-testid="input"]').type('data')

    // Act: Perform the action
    cy.get('[data-testid="button"]').click()

    // Assert: Verify the result
    cy.get('[data-testid="result"]').should('be.visible')
  })
})
```

## Troubleshooting

### Can't run Cypress UI
- There is a known bug where Cypress tries to launch and the 'Welcome' screen has an embedded image, this sometimes crashes, the workaround is to click the 'Continue' button before the crash happens, this won't happen again. [You can find more info on the Cypress Github if interested](https://github.com/cypress-io/cypress/issues/31072#issuecomment-2813506040)

### Cypress can't find elements
- Verify you're using the correct data-testid

### Payment always fails in tests
- The payment has a 50% random failure rate. This is intentional for testing error handling.

### Tests timing out
- Cypress auto-waits for elements (default 4s timeout), this could be a problem, how could your test work around this?
