'use strict'
describe('My Orders Test', () => {
  beforeEach(() => {
    cy.loginQA()
  })

  describe('Without Orders', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[2])
        cy.goTo('orders')
      })
    })

    it('greets user with placeholder and button to place an order when there are no orders', () => {
      cy.contains('h3', 'My Orders')
        .should('be.visible')
      cy.contains('div', 'Your Order Details Will Show Here')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it.only('user can cycle through order tabs', () => {
      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .get('[data-cy=switch-sell]')
        .should('have.attr', 'on:click', "switchMode('SELL')")

      cy.get('[data-cy=no-sell-placeholder]')
        .should('be.visible')
        .should('contain', 'No Sell Orders Found')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
      cy.get('[data-cy=buy-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-buy-placeholder]')
        .should('be.visible')
        .should('contain', 'No Buy Orders Found')

      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
      cy.get('[data-cy=archived-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-archived-placeholder]')
        .should('be.visible')
        .should('contain', 'No Archived Orders Found')
    })
  })

  describe('With Orders', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[1])
        cy.goTo('orders')
      })
    })

    it('greets user with placeholder and button to place an order when there are orders, but not on this list', () => {
      cy.contains('h3', 'My Orders')
        .should('be.visible')
      cy.contains('div', 'Select an Order to See Details')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it('user can cycle through order tabs', () => {
      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .should('have.attr', 'on:click', "switchMode('SELL')")

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
        .should('have.class', 'active')

      cy.get('[data-cy=archive-tab]')
        .should('not.have.class', 'active')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
        .should('have.class', 'active')
    })
  })
})
