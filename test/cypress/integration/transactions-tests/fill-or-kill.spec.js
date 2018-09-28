'use strict'
import * as helper from '../../support/utils/trade-helpers'

// NOTE: These tests only create FOK orders and complete FOK trades.
// This means that once in a while when the tests fail, the btc/eqb blocks will
// need to be mined otherwise mempool error will occur. TODO: Write script
// The trades here are using notifications as the main way to send/accept funds.
// Another way to complete trades would be to go through the orders/offers pages,
// but it is not yet done here.
describe('Fill or Kill Test', () => {
  describe('Load wallet from external QA account', () => {
    it('loads test@evenset and test3@evenset from QA', () => {
      cy.fixture('users').as('users').then(users => {
      // Visit live QA website and login with existing user who has funds
        cy.visit('https://qa-wallet.equibitgroup.com')
        cy.get('input[type="password"]')
          .type(Cypress.env('HTTP_PASSWORD'))
        cy.get('button[type="submit"]')
          .click()
        cy.get('input[type="email"]')
          .type(users.qaBankAccount.email)
          .get('input[type="password"]')
          .type(users.qaBankAccount.password)
          .get('button[type="submit"]')
          .click()
        helper.sendFunds(users.validUsers[0].seededEQBaddress, 'eqb', '.0003')
        cy.wait(2000)
        helper.sendFunds(users.validUsers[1].seededBTCaddress, 'btc', '.0003')
      })
    })
  })
  describe('Atomic Trade Tests', () => {
    beforeEach(() => {
      cy.clearNotifications()
      cy.clearOrdersAndOffers()
      cy.loginQA()
      cy.fixture('users').as('users')
    })

    it('Fill or Kill sell order', function () {
      cy.login(this.users.validUsers[0])
      cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
      helper.placeOrder('sell')
      helper.addOrder('.0001', '1000000', 'sell', true)
      cy.logout()

      // 2. Place Buy Offer & Send Payment - check message
      cy.login(this.users.validUsers[1])
      cy.goToEquibitPage('portfolio')
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
      // Confirm notification
      helper.firstNotification('Buy', '0.0001')
      // Confirm order appears/exists
      cy.goToEquibitPage('portfolio')

      cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
      cy.contains('View')
        .click()
      cy.contains('View Details')
        .click()
      // Confirm order details & accept offer
      helper.confirmOrder('0.0001', true)
      helper.acceptOffers(true)
      // Accept offer and send modal
      helper.sendMoney('Equibits')
      cy.logout()

      // 4. Collect Securities - check message
      cy.login(this.users.validUsers[1])
      helper.secondNotification('Buy')
      // Confirm modal
      helper.collectEQB()
      cy.logout()

      // 5. Collect Payment & Close Deal
      cy.login(this.users.validUsers[0])
      cy.goToEquibitPage('portfolio')
      helper.closeDeal('sell')
      // Confirm modal
      helper.collectPayment()
      cy.logout()

      // Confirm deal closed
      cy.login(this.users.validUsers[1])
      helper.checkDealClosed()
    })

    it('Fill or Kill buy order', function () {
      cy.login(this.users.validUsers[1])
      cy.goToEquibitPage('portfolio')

      // 1. Place Buy Order
      helper.placeOrder('buy')
      helper.addOrder('.0001', '1000000', 'buy', true)
      cy.logout()

      // 2. Place Buy Offer & Send Payment - check message
      cy.login(this.users.validUsers[0])
      cy.goToEquibitPage('portfolio')
      cy.get('[data-cy=buy-order-row]')
        .should('exist')
        .should('contain', 'Sell')
      cy.get('[data-cy=sell-button]')
        .should('have.attr', 'on:click', 'buySell(row)')
        .click()
      // Send Offer modal
      cy.get('[data-cy=offer-modal-title]')
        .should('contain', 'Send Offer Equibits')
      cy.get('[data-cy=fillkill]')
        .should('be.visible')
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
      helper.confirmOffer('Equibits')
      // Confirm order appears/exists
      cy.get('[data-cy=buy-order-row]')
        .should('exist')
        .should('contain', 'View')
      cy.logout()

      // 3. Accept & Send Securities - check message
      cy.login(this.users.validUsers[1])
      // Confirm notification
      helper.firstNotification('Sell', '0.0001')
      // Confirm order appears/exists
      cy.goToEquibitPage('portfolio')

      cy.get('[data-cy=buy-order-row]')
        .should('exist')
        .should('contain', 'View')
      cy.contains('View')
        .click()
      cy.contains('View Details')
        .click()
      // Confirm order details & accept offer
      helper.confirmOrder('0.0001', true)
      helper.acceptOffers(true)
      // Accept offer and send modal
      helper.sendMoney('Payment')
      cy.logout()

      // 4. Collect Securities - check message
      cy.login(this.users.validUsers[0])
      helper.secondNotification('Sell')
      // Confirm modal
      helper.collectPayment()
      cy.logout()

      // 5. Collect Payment & Close Deal
      cy.login(this.users.validUsers[1])
      cy.goToEquibitPage('portfolio')
      helper.closeDeal('buy')
      // Confirm modal
      helper.collectEQB()
      cy.logout()

      // Confirm deal closed
      cy.login(this.users.validUsers[0])
      helper.checkDealClosed()
    })
  })
})
