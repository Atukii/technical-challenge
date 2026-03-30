# Shopping trolley Checkout - Technical Interview Challenge

## Task
Write some test cases for the checkout application, it's up to you to decide what tests to write, how many, and
how to structure them. You should put your tests in the `cypress/e2e` folder.

### Tips
- A valid promo code is `SAVE10`
- Remember that your test files should have the extension `.cy.ts`
- You don't need to change anything in the application, but you can view the code in `src/components/Checkout.vue` if
  you feel that would be beneficial
- Consider Cypress functionality/configuration *outside* of tests themselves
- You can ignore the `dist` folder

The application will be available at `http://localhost:5173`

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

try use headless if you can - if you get stuck without it, we can workaround it.

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

### Cypress can't find elements
- Verify you're using the correct data-testid

### Payment always fails in tests
- The payment has a 50% random failure rate. This is intentional for testing error handling.

### Tests timing out
- Cypress auto-waits for elements (default 4s timeout)
- Extend with `cy.get(..., { timeout: 10000 })`