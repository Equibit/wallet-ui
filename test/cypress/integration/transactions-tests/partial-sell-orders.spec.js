'use strict'
import * as helper from '../../support/utils/trade-helpers'

describe('Partial Sell Orders Test', () => {
  beforeEach(() => {
    cy.clearNotifications()
    cy.clearOrdersAndOffers()
    cy.fixture('users').as('users')
    cy.loginQA()
  })

  it.skip('offer quantity too large', () => {
    // This currently results in an error in the system
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    helper.placeOrder('sell')
    helper.addOrder('.0001', '1000000', 'sell')
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
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click()
    // TODO: Error should appear here
  })

  it('filled with one offer', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    helper.placeOrder('sell')
    helper.addOrder('.0001', '1000000', 'sell')
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
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.0001')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'Buy')
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
    helper.confirmOrder()
    helper.acceptOffers()
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

  it('filled with multiple offers', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    helper.placeOrder('sell')
    helper.addOrder('.0001', '1000000', 'sell')
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
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.00005')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'Buy')

      // Place second offer
    cy.contains('Buy')
      .should('have.attr', 'on:click', 'buySell(row)')
      .click()
      // Send Offer modal
    cy.get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Payment')
    cy.get('[data-cy=input-quantity]')
      .clear()
      .type('.00005')
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click({force: true})
      // Confirm modal
    helper.confirmOffer('Payment')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
      // Confirm notification
    helper.firstNotification('Buy', '0.00005')
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
    helper.confirmOrder()
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
    helper.secondNotification('Buy')
      // Confirm modal
    helper.collectEQB()
      // Repeat
    helper.secondNotification('Buy', 1)
    helper.collectEQB()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')
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

  it.skip('overfilled by many offers', function () {
  })
})
