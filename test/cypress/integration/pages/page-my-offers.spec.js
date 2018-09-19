'use strict'
describe('My Offers Test', () => {
  beforeEach(() => {
    cy.loginQA()
  })

  describe('Without Offers', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[2])
        cy.goTo('offers')
      })
    })

    it('greets user with placeholder when there are no orders', () => {
      cy.contains('h3', 'My Offers')
        .should('be.visible')
      cy.contains('div', 'Your Offer Details Will Show Here')
        .should('be.visible')
    })

    it('user can cycle through offer tabs', () => {
      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .get('[data-cy=switch-sell]')
        .should('have.attr', 'on:click', "switchMode('SELL')")

      cy.get('[data-cy=no-sell-placeholder]')
        .should('be.visible')
        .should('contain', 'No Sell Offers Found')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
      cy.get('[data-cy=buy-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-buy-placeholder]')
        .should('be.visible')
        .should('contain', 'No Buy Offers Found')

      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
      cy.get('[data-cy=archived-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-archived-placeholder]')
        .should('be.visible')
        .should('contain', 'No Archived Offers Found')
    })
  })
})
