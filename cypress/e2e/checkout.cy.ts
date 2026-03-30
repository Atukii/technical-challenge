describe('Shopping trolley Checkout', () => {
  beforeEach(() => {
    // This won't work at the moment, `baseUrl: 'http://localhost:5173'` has been removed from cy config
    // for the purpose of the interview. To make this test work, we can either hardcode the above address in the visit
    // or update the config. 
    cy.visit('/') 
  })

  describe('Happy Path', () => {
    it('should complete successful checkout with valid address', () => {
      // Fill in form
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Doe')
      cy.get('[data-testid="address"]').type('123 La La Land')
      cy.get('[data-testid="city"]').type('Real Place')
      cy.get('[data-testid="country"]').select('GB')
      cy.get('[data-testid="postcode"]').type('NO11 11ON')
      

      // Submit
      cy.get('[data-testid="pay-button"]').click()

      // Verify success
      cy.get('[data-testid="order-number"]').should('be.visible')
      cy.get('[data-testid="continue-shopping"]').should('be.visible')
    })
  })

  describe('Coupon', () => {
    it('should apply coupon and show discount', () => {
      cy.get('[data-testid="coupon-input"]').type('SAVE10')
      cy.get('[data-testid="apply-coupon-btn"]').click()

      cy.get('[data-testid="coupon-success"]').should('contain', 'Coupon applied')
      // Total should be reduced
    })

    it('should show error for invalid coupon', () => {
      cy.get('[data-testid="coupon-input"]').type('INVALID')
      cy.get('[data-testid="apply-coupon-btn"]').click()

      cy.get('[data-testid="coupon-error"]').should('be.visible')
    })
  })

  describe('Validation', () => {
    it('should show error for missing first name', () => {
      cy.get('[data-testid="address"]').type('123 La La Land')
      cy.get('[data-testid="city"]').type('Real Place')
      cy.get('[data-testid="country"]').select('GB')
      cy.get('[data-testid="postcode"]').type('NO11 11ON')

      cy.get('[data-testid="pay-button"]').click()

      cy.get('[data-testid="first-name-error"]').should('be.visible')
    })

    it('should show error for invalid postcode', () => {
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Doe')
      cy.get('[data-testid="address"]').type('123 La La Land')
      cy.get('[data-testid="city"]').type('Real Place')
      cy.get('[data-testid="country"]').select('GB')
      cy.get('[data-testid="postcode"]').type('123') // Too short

      cy.get('[data-testid="pay-button"]').click()

      cy.get('[data-testid="postcode-error"]').should('be.visible')
    })
  })

  // Note: Payment randomly fails ~50% of the time
  // You may need to retry this test or handle flakiness
  describe('Network Error Handling', () => {
    it('should show error message when payment fails', () => {
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Doe')
      cy.get('[data-testid="address"]').type('123 La La Land')
      cy.get('[data-testid="city"]').type('Real Place')
      cy.get('[data-testid="country"]').select('GB')
      cy.get('[data-testid="postcode"]').type('NO11 11ON')

      cy.get('[data-testid="pay-button"]').click()

      // If it fails, error should show
      cy.get('[data-testid="error-alert"]').should('exist')
    })
  })
})