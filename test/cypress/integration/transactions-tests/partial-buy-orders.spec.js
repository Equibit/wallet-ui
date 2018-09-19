'use strict'
import * as helper from '../../support/utils/trade-helpers'

describe('Partial Buy Orders Test', () => {
  beforeEach(() => {
    cy.clearNotifications()
    cy.clearOrdersAndOffers()
    cy.loginQA()
    cy.fixture('users').as('users').then(users => {
      cy.login(users.validUsers[0])
      cy.contains('Send').click()
      cy.get('input[placeholder="Paste address"]').type(users.validUsers[1].plainBTCaddress)
      cy.contains('Bitcoin').click()
      cy.get('input[type="number"]')
        .type('0.0003')
      cy.contains('Next').click()
      cy.get('[data-cy=send-button]')
        .click()
    })
  })

  it.skip('offer quantity too large', () => {
    // This currently results in an error in the system
  })

  it.skip('overfilled by many offers', function () {
    /* This test is blocked by issue #1114 - incomplete partial order is not reverted back to 'OPEN'
     * This means that partial trades cannot be completed in all scenarios
     */
  })

  it('filled with one offer', function () {
    cy.login(this.users.validUsers[1])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    helper.placeOrder('buy')
    helper.addOrder('.0001', '1000000', 'buy')
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
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.0001')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Equibits')
      // Confirm order appears/exists
    cy.get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'Sell')
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
    helper.confirmOrder()
    helper.acceptOffers()
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

  it('filled with multiple offers', function () {
    /* This test accepts multiple offers at once, and does not test what happens
     * when a user accepts one offer at a time (this is currently broken) */

    cy.login(this.users.validUsers[1])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    helper.placeOrder('buy')
    helper.addOrder('.0001', '1000000', 'buy')
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
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.00005')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Equibits')
      // Confirm order appears/exists
    cy.get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'Sell')

      // Place second offer
    cy.get('[data-cy=loading-overlay]')
      .should('not.be.visible')
    cy.get('[data-cy=sell-button]')
      .should('have.attr', 'on:click', 'buySell(row)')
      .click()
      // Send Offer modal
    cy.get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Equibits')
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.00005')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Equibits')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[1])
      // Confirm notification
    helper.firstNotification('Sell', '0.00005')
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
    helper.confirmOrder()
    helper.acceptOffers()
      // Accept offer and send modal
    helper.sendMoney('Payment')
    cy.wait(1000)
      // Repeat
    helper.acceptOffers()
    helper.sendMoney('Payment')
    cy.get('[data-cy=accepted-offers-length]')
      .should('contain', '2')
    cy.logout()

      // 4. Collect Securities - check message
    cy.login(this.users.validUsers[0])
    helper.secondNotification('Sell')
      // Confirm modal
    helper.collectPayment()
      // Repeat
    helper.secondNotification('Sell', 1)
    helper.collectPayment()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[1])
    cy.goToEquibitPage('portfolio')
    helper.closeDeal('buy')
      // Confirm modal
    helper.collectEQB()
      // Repeat
    helper.closeDeal('buy', 1)
    helper.collectEQB()
    cy.logout()

      // Confirm deal closed
    cy.login(this.users.validUsers[0])
    helper.checkDealClosed()
  })
})