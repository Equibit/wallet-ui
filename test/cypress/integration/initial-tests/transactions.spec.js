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
