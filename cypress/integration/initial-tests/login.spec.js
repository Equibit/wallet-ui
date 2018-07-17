describe('Login Test', function() {
    it('successfully loads', function() {
      // cy.visit('https://qa-wallet.equibitgroup.com')
      cy.visit('/portfolio')
      cy.get('input[name=username]').should('exist')
      // cy.visit('/login')
      // cy.contains('This Page is Password Protected')

      // cy.get('.form-control')
      //   .type('bullish')
      //   .should('have.value', 'bullish')
      
      // cy.contains('Submit').click()
      
      // cy.contains('Login')
    })
  })