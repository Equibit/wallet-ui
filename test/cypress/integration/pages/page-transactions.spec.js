'use strict'
describe('Transactions Page Test', () => {
  describe('No Transactions', () => {
    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[2])
        cy.goToTransactions()
      })
    })
 
    it('user sees transactions landing page', () => {
      cy.get('[data-cy=transaction-message]').should('be.visible').and('contain', 'Transaction History')
      cy.get('[data-cy=transaction-cause]').should('be.visible').and('contain', 'Transactions will show when you trade, or send and receive funds to your portfolios.')
    })
  })
})
  