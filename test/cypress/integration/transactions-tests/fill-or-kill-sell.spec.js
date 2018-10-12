'use strict'
import * as helper from '../../support/utils/trade-helpers'

// NOTE: These tests only create FOK orders and complete FOK trades.
// This means that once in a while when the tests fail, the btc/eqb blocks will
// need to be mined otherwise mempool error will occur.
describe('Fill or Kill Sell Order Test', () => {
  describe('Atomic Trade Test', () => {
    beforeEach(() => {
      cy.clearNotifications()
      cy.clearOrdersAndOffers()
      cy.loginQA()
      cy.fixture('users').as('users')
    })

    it('Fill or Kill sell order', function () {
      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()

      // 1. Place Sell Order
      helper.placeOrder('sell')
      helper.addOrder('.0001', '1000000', 'sell', true)
      cy.logout()

      // 2. Place Buy Offer & Send Payment - check message
      cy.login(this.users.validUsers[1])
      helper.checkFunds()
      helper.goToEquibitPage()

      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'Buy')
      cy.contains('Buy')
        .should('have.attr', 'on:click', 'buySell(row)')
        .click()
      // Send Offer modal
      cy.get('[data-cy=offer-modal-title]')
        .should('contain', 'Send Offer Payment')
      cy.get('[data-cy=fillkill]')
        .should('be.visible')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
      helper.confirmOffer('Payment')
      // Confirm order appears/exists
      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
      cy.logout()

      // 3. Accept & Send Securities - check message
      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      // Confirm notification
      helper.firstNotification('Buy', '0.0001')
      // Confirm order appears/exists
      helper.goToEquibitPage()

      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
      cy.contains('View')
        .click()
      cy.contains('View Details')
        .click()
      // Confirm order details & accept offer
      helper.confirmOrderAndAcceptOffer()
      // Accept offer and send modal
      helper.sendMoney('Equibits')
      cy.logout()

      // 4. Collect Securities - check message
      cy.login(this.users.validUsers[1])
      helper.checkFunds()
      helper.secondNotification('Buy')
      // Confirm modal
      helper.collectEQB()
      cy.logout()

      // 5. Collect Payment & Close Deal
      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()
      helper.closeDeal('sell')
      // Confirm modal
      helper.collectPayment()
      cy.logout()

      // Confirm deal closed
      cy.login(this.users.validUsers[1])
      helper.checkDealClosed()
    })
  })
})
