/*eslint-disable */
describe('Portfolio Test', () => {

  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.visit('/')
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  it('user has portfolio', function () {
    cy.login(this.users.validUser)
    cy
      .get('.panel-title')
      .should('contain', 'My Portfolio')
  })

  it('portfolio has send function which opens modal', function () {
    cy.login(this.users.validUser)
    cy
      .contains('Send')
      .should('have.attr', 'on:click', 'sendFunds()')
      .click({timeout:10000})
    
    cy
      .get('.modal-title')
      .should('contain', 'Send')
  })

  it('portfolio has receive function which opens modal', function () {
    cy.login(this.users.validUser)
    cy
      .contains('Receive')
      .should('have.id', 'receiveFunds')
      .click({timeout:10000})
    
    cy
      .get('.modal-title')
      .should('contain', 'Receive')
  })

})
/*eslint-enable */
