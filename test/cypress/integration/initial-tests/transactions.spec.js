/*eslint-disable */
describe('Transactions Test', () => {

  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.visit('/')
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  describe('Send Funds', () => {
    
    describe('With funds', () => {  
      beforeEach(function () {
        cy.login(this.users.validUsers[0])
        cy.contains('Send').click()
      })

      it('cannot send funds without address', () => {
        cy.contains('Equibit').click()
        cy.contains('Next').click()
        cy
          .get('.form-text.help-block')
          .should('contain', 'Address is missing')
    
        cy.contains('Bitcoin').click()
        cy.contains('Next').click()
        cy
          .get('.form-text.help-block')
          .should('contain', 'Address is missing')
      })

      it('cannot send funds to invalid address', () => {
        cy.get('input[placeholder="Paste address"]').type('invalidAddress')      
    
        cy.contains('Equibit').click()
        cy.contains('Next').click()
        cy
          .get('.form-text.help-block')
          .should('contain', 'Invalid address')
    
        cy.contains('Bitcoin').click()
        cy.contains('Next').click()
        cy
          .get('.form-text.help-block')
          .should('contain', 'Invalid address')
      })

      it.only('can send EQB to valid address', function () {
        cy.get('input[placeholder="Paste address"]').type(this.users.validUsers[2].plainEQBaddress)
        cy.contains('Equibit').click()
        cy
          .get('input[type="number"]')
          .type('.00001')
        cy.contains('Next').click()

        cy
          .get('.modal-title')
          .should('contain', 'Send Funds')
        cy
          .get('.input-value.break-word')
          .should('contain', this.users.validUsers[2].plainEQBaddress)
        cy
          .get('.column-digital-currency-value')
          .should('contain', '0.00001')
        cy
          .get('.btn.btn-primary')
          .should('contain', 'Send')
          .should('have.attr', 'on:click', 'send(@close)')
          .click()
        cy
          .get('.dropdown-toggle.icon.icon-user')
          .click()
        cy
          .contains('Transactions')
          .should('be.visible')
          .click()
        cy.url().should('contain', '/transactions')
        cy
          .get('.panel-title')
          .should('contain', 'All Transactions')
        cy
          .get('.selected.tx-in')
          .should('contain', 'Transfer Out')
          .should('contain', 'Equibit')
        cy
          .get('#column-cash-EQB')
          .should('contain', '0.00002505')
        
      })

      it('can send BTC to valid address', function () {
        cy.get('input[placeholder="Paste address"]').type(this.users.validUsers[2].plainEQBaddress)
        cy.contains('Bitcoin').click()
        cy.get('input[type="number"]').type(0.00001)
        cy.contains('Next').click()
      })

    })

    describe('Without funds', () => {  
      beforeEach(function () {
        cy.login(this.users.validUsers[1])
        cy.contains('Send').click()
      })
    })

    
  })
})
/*eslint-enable */
