'use strict'
describe('Transactions Page Test', () => {
  describe('Without Transactions', () => {
    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[2])
        cy.goToTransactions()
      })
    })

    it('user sees transactions landing page', () => {
      cy.get('[data-cy=transaction-message]')
        .should('be.visible')
        .and('contain', 'Transaction History')
      cy.get('[data-cy=transaction-cause]')
        .should('be.visible')
        .and('contain', 'Transactions will show when you trade, or send and receive funds to your portfolios.')
    })
  })

  describe('With Transactions', () => {
    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[0])
        cy.goToTransactions()
      })
    })

    it.skip('user can go to different transactions page using the paginator', () => {
      // Paginator doesn't work yet
    })

    it.skip('user can edit transaction note', () => {
      // Edit button on additional details does nothing
    })

    it('user sees transactions page', () => {
      cy.get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy.get('[data-cy=selected-row]')
        .should('be.visible')

      cy.contains('h2', 'Additional Details')
        .should('be.visible')
      cy.get('[data-cy=txid-link]')
        .should('be.visible')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'href')
    })
  })
})
