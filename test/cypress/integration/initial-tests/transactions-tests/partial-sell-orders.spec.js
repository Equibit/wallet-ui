'use strict'
import * as helper from '../../../support/utils/trade-helpers'

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
    helper.addOrder(false, '.0001', '1000000', 'sell')
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
    cy.wait(1500)
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click()
    // TODO: Error should appear here
  })

  it.only('filled by one user', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    cy.get('[data-cy=sell-order-row]')
      .should('not.exist')
    cy.contains('Add Sell Order')
      .should('have.attr', 'on:click', 'showModal(\'SELL\')')
      .click()
      // Add Sell Order modal
    cy.get('[data-cy=order-modal-title]')
      .should('contain', 'Place Sell Order')
    cy.get('[data-cy=order-button-sell]')
      .should('have.class', 'btn-selected')

    helper.addOrder(false, '.0001', '1000000', 'sell')
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
    cy.get('[data-cy=input-offer]')
      .clear()
      .type('.0001')
    cy.wait(1500)
    cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
    helper.createOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
      // Confirm notification
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Received')
        .get('[data-cy=quantity-link]')
        .should('contain', '0.0001@1000000')
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
    helper.confirmOrderAndAcceptOffer()

      // Accept offer and send modal
    cy.get('[data-cy=accept-offer-title]')
        .should('contain', 'Accept Offer and Send Equibits')
    cy.contains('Please review and confirm your transaction.')
        .should('exist')
    cy.contains('Accept & Send')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      // Confirm alert
    cy.get('.alert-message')
        .should('contain', 'Trade was updated')
    cy.get('[data-cy=list-status]')
        .should('contain', 'Trading')

    cy.logout()

      // 4. Collect Securities - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Accepted')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Collect Securities')
        .click()
      // Confirm modal
    helper.collectEQB()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Collect Payment')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Close Deal')
        .click()
      // Confirm modal
    helper.collectPayment()
    cy.logout()

      // Confirm deal closed
    cy.login(this.users.validUsers[1])
    helper.checkDealClosed()
  })

  it.skip('overfilled by one user', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.contains('Add Sell Order')
        .should('have.attr', 'on:click', 'showModal(\'SELL\')')
        .click()
      // Add Sell Order modal
    cy.get('[data-cy=order-modal-title]')
        .should('contain', 'Place Sell Order')
    cy.get('[data-cy=order-button-sell]')
        .should('have.class', 'btn-selected')

    helper.addOrder(false, '.0001', '1000000', 'sell')
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
    cy.wait(1500)
    cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
    helper.createOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
      // Confirm notification
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Received')
        .get('[data-cy=quantity-link]')
        .should('contain', '0.0001@1000000')
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
    helper.confirmOrderAndAcceptOffer()

      // Accept offer and send modal
    cy.get('[data-cy=accept-offer-title]')
        .should('contain', 'Accept Offer and Send Equibits')
    cy.contains('Please review and confirm your transaction.')
        .should('exist')
    cy.contains('Accept & Send')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      // Confirm alert
    cy.get('.alert-message')
        .should('contain', 'Trade was updated')
    cy.get('[data-cy=list-status]')
        .should('contain', 'Trading')

    cy.logout()

      // 4. Collect Securities - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Accepted')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Collect Securities')
        .click()
      // Confirm modal
    helper.collectEQB()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Collect Payment')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Close Deal')
        .click()
      // Confirm modal
    helper.collectPayment()
    cy.logout()

      // Confirm deal closed
    cy.login(this.users.validUsers[1])
    helper.checkDealClosed()
  })

  it.skip('filled by multiple users', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.contains('Add Sell Order')
        .should('have.attr', 'on:click', 'showModal(\'SELL\')')
        .click()
      // Add Sell Order modal
    cy.get('[data-cy=order-modal-title]')
        .should('contain', 'Place Sell Order')
    cy.get('[data-cy=order-button-sell]')
        .should('have.class', 'btn-selected')

    helper.addOrder(false, '.0001', '1000000', 'sell')
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
    cy.wait(1500)
    cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
    helper.createOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
      // Confirm notification
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Received')
        .get('[data-cy=quantity-link]')
        .should('contain', '0.0001@1000000')
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
    helper.confirmOrderAndAcceptOffer()

      // Accept offer and send modal
    cy.get('[data-cy=accept-offer-title]')
        .should('contain', 'Accept Offer and Send Equibits')
    cy.contains('Please review and confirm your transaction.')
        .should('exist')
    cy.contains('Accept & Send')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      // Confirm alert
    cy.get('.alert-message')
        .should('contain', 'Trade was updated')
    cy.get('[data-cy=list-status]')
        .should('contain', 'Trading')

    cy.logout()

      // 4. Collect Securities - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Accepted')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Collect Securities')
        .click()
      // Confirm modal
    helper.collectEQB()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Collect Payment')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Close Deal')
        .click()
      // Confirm modal
    helper.collectPayment()
    cy.logout()

      // Confirm deal closed
    cy.login(this.users.validUsers[1])
    helper.checkDealClosed()
  })

  it.skip('overfilled by many users', function () {
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

      // 1. Place Sell Order
    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.contains('Add Sell Order')
        .should('have.attr', 'on:click', 'showModal(\'SELL\')')
        .click()
      // Add Sell Order modal
    cy.get('[data-cy=order-modal-title]')
        .should('contain', 'Place Sell Order')
    cy.get('[data-cy=order-button-sell]')
        .should('have.class', 'btn-selected')

    helper.addOrder(false, '.0001', '1000000', 'sell')
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
    cy.wait(1500)
    cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
    helper.createOffer('Payment')
      // Confirm order appears/exists
    cy.get('[data-cy=sell-order-row]')
        .should('exist')
        .should('contain', 'View')
    cy.logout()

      // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
      // Confirm notification
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Received')
        .get('[data-cy=quantity-link]')
        .should('contain', '0.0001@1000000')
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
    helper.confirmOrderAndAcceptOffer()

      // Accept offer and send modal
    cy.get('[data-cy=accept-offer-title]')
        .should('contain', 'Accept Offer and Send Equibits')
    cy.contains('Please review and confirm your transaction.')
        .should('exist')
    cy.contains('Accept & Send')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      // Confirm alert
    cy.get('.alert-message')
        .should('contain', 'Trade was updated')
    cy.get('[data-cy=list-status]')
        .should('contain', 'Trading')

    cy.logout()

      // 4. Collect Securities - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Buy')
        .should('contain', 'Offer Accepted')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Collect Securities')
        .click()
      // Confirm modal
    helper.collectEQB()
    cy.logout()

      // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.goToEquibitPage('portfolio')

    cy.get('[data-cy=sell-order-row]')
        .should('not.exist')
    cy.get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Collect Payment')
        .get('[data-cy=notification-link]')
        .should('have.attr', 'on:click', 'showOfferModal(notification)')
        .should('contain', 'Close Deal')
        .click()
      // Confirm modal
    helper.collectPayment()
    cy.logout()

      // Confirm deal closed
    cy.login(this.users.validUsers[1])
    helper.checkDealClosed()
  })
})
