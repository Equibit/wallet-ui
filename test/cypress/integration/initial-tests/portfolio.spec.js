describe('Portfolio Test', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.visit('/')
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  it('user can create a portfolio', function () {
    cy.login(this.users.noPortfolio)
    cy
      .get('.message-box')
      .should('contain', 'Manage your Portfolio')

    cy
      .contains('Receive')
      .should('have.id', 'createPortfolio')
      .should('have.attr', 'on:click', 'receiveFunds()')
  })

  it('user has portfolio', function () {
    cy.login(this.users.validUsers[0])
    cy
      .get('.panel-title')
      .should('contain', 'My Portfolio')
  })

  it('user has no funds', function () {
    cy.login(this.users.validUsers[1])
    cy.wait(1000)
    cy
      .get('.loading-overlay')
      .should('not.be.visible')

    cy
      .get('.alert.alert-warning')
      .should('be.visible')
  })

  it('user has funds', function () {
    cy.login(this.users.validUsers[0])

    cy.wait(1000)
    cy
      .get('.loading-overlay')
      .should('not.be.visible')

    cy
      .get('.alert.alert-warning')
      .should('not.be.visible')
  })

  it('portfolio has send function which opens modal', function () {
    cy.login(this.users.validUsers[0])
    cy
      .contains('Send')
      .should('have.attr', 'on:click', 'sendFunds()')
      .click()

    cy
      .get('.modal-title')
      .should('contain', 'Send')
  })

  it('portfolio has receive function which opens modal', function () {
    cy.login(this.users.validUsers[0])
    cy
      .contains('Receive')
      .should('have.id', 'receiveFunds')
      .click()

    cy
      .get('.modal-title')
      .should('contain', 'Receive')
  })
})
