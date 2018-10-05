'use strict'
import * as helper from '../../support/utils/trade-helpers'

describe('Partial Sell Orders Test', () => {
  it('loads test@evenset and test3@evenset from QA', () => {
    helper.loadFundsFromQA()
  })
  describe('Atomic Trade Tests', () => {
    beforeEach(() => {
      cy.clearNotifications()
      cy.clearOrdersAndOffers()
      cy.loginQA()
      cy.fixture('users').as('users')
    })

    it.skip('offer quantity too large', () => {
      // This currently results in an error in the system

      cy.login(this.users.validUsers[0])
      helper.goToEquibitPage('portfolio')

        // 1. Place Sell Order
      helper.placeOrder('sell')
      helper.addOrder('.0001', '1000000', 'sell')
      cy.logout()

      // 2. Place Buy Offer & Send Payment - check message
      cy.login(this.users.validUsers[1])
      helper.goToEquibitPage('portfolio')

      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'Buy')
      cy.contains('Buy')
        .should('have.attr', 'on:click', 'buySell(row)')
        .click()
        // Send Offer modal
      cy.get('[data-cy=offer-modal-title]')
        .should('contain', 'Send Offer Payment')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // TODO: Error should appear here
    })

    it.skip('overfilled by many offers', function () {
      /* This test is blocked by issue #1114 - incomplete partial order is not reverted back to 'OPEN'
      * This means that partial trades cannot be completed in all scenarios
      */
    })

    it('filled with one offer', function () {
      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()

        // 1. Place Sell Order
      helper.placeOrder('sell')
      helper.addOrder('.0001', '1000000', 'sell')
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
      cy.get('[data-cy=input-quantity]')
        .clear()
        .type('.0001')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
        // Confirm modal
      helper.confirmOffer('Payment')
        // Confirm order appears/exists
      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'Buy')
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
      helper.confirmOrder('0.0001')
      helper.acceptOffers()
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

    it.skip('filled with multiple offers', function () {
      /* This test accepts multiple offers at once.
         This test is currently unable to pass. It is giving an error:
         {code: -26, message: "16: mandatory-script-verify-flag-failed (Signature must be zero for failed CHECK(MULTI)SIG operation)"}
      */

      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()

        // 1. Place Sell Order
      helper.placeOrder('sell')
      helper.addOrder('.0002', '1000000', 'sell')
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
      cy.get('[data-cy=input-quantity]')
        .clear()
        .type('.0001')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
        // Confirm modal
      helper.confirmOffer('Payment')
        // Confirm order appears/exists
      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'Buy')

        // Place second offer
      cy.get('[data-cy=loading-overlay]')
        .should('not.be.visible')
      cy.contains('Buy')
        .should('have.attr', 'on:click', 'buySell(row)')
        .click()
        // Send Offer modal
      cy.get('[data-cy=offer-modal-title]')
        .should('contain', 'Send Offer Payment')
      cy.get('[data-cy=input-quantity]')
        .clear()
        .type('.0001')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
        // Confirm modal
      helper.confirmOffer('Payment')
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
      helper.confirmOrder('0.0002')
      helper.acceptOffers()
        // Accept offer and send modal
      helper.sendMoney('Equibits')
        // Repeat
      helper.acceptOffers()
      helper.sendMoney('Equibits')
      cy.get('[data-cy=accepted-offers-length]')
        .should('contain', '2')
      cy.logout()

        // 4. Collect Securities - check message
      cy.login(this.users.validUsers[1])
      helper.checkFunds()
      helper.secondNotification('Buy')
        // Confirm modal
      helper.collectEQB()
        // Repeat
      helper.secondNotification('Buy', 1)
      helper.collectEQB()
      cy.logout()

        // 5. Collect Payment & Close Deal
      cy.login(this.users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()
      helper.closeDeal('sell')
        // Confirm modal
      helper.collectPayment()
        // Repeat
      helper.closeDeal('sell', 1)
      helper.collectPayment()
      cy.logout()

        // Confirm deal closed
      cy.login(this.users.validUsers[1])
      helper.checkDealClosed()
    })
  })
})
