'use strict'
import * as helper from '../../support/utils/trade-helpers'

// NOTE: These tests only create FOK orders and complete FOK trades.
// This means that once in a while when the tests fail, the btc/eqb blocks will
// need to be mined otherwise mempool error will occur.
describe('Fill or Kill Test', () => {
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

  it('Fill or Kill sell order', function () {
    cy.login(this.users.validUsers[0])
    helper.goToEquibitPage()

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

    helper.addOrder(true, '.0001', '1000000', 'sell')
    cy.logout()

    // 2. Place Buy Offer & Send Payment - check message
    cy.login(this.users.validUsers[1])
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
    helper.goToEquibitPage()

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

  it('Fill or Kill buy order', function () {
    cy.login(this.users.validUsers[1])
    helper.goToEquibitPage()

    // 1. Place Buy Order
    cy.get('[data-cy=buy-order-row]')
      .should('not.exist')
    cy.contains('Add Buy Order')
      .should('have.attr', 'on:click', 'showModal(\'BUY\')')
      .click()
    // Add Buy Order modal
    cy.get('[data-cy=order-modal-title]')
      .should('contain', 'Place Buy Order')
    cy.get('[data-cy=order-button-buy]')
      .should('have.class', 'btn-selected')

    helper.addOrder(true, '.0001', '1000000', 'buy')
    cy.logout()

    // 2. Place Buy Offer & Send Payment - check message
    cy.login(this.users.validUsers[0])
    helper.goToEquibitPage()

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
    cy.wait(1500)
    cy.contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click()
    // Confirm modal
    helper.createOffer('Equibits')
    // Confirm order appears/exists
    cy.get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'View')
    cy.logout()

    // 3. Accept & Send Securities - check message
    cy.login(this.users.validUsers[1])
    // Confirm notification
    cy.get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Sell')
      .should('contain', 'Offer Received')
      .get('[data-cy=quantity-link]')
      .should('contain', '0.0001@1000000')
    // Confirm order appears/exists
    helper.goToEquibitPage()

    cy.get('[data-cy=buy-order-row]')
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
      .should('contain', 'Accept Offer and Send Payment')
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
    cy.login(this.users.validUsers[0])
    cy.get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Sell')
      .should('contain', 'Offer Accepted')
      .get('[data-cy=notification-link]')
      .should('have.attr', 'on:click', 'showOfferModal(notification)')
      .should('contain', 'Collect Payment')
      .click()
    // Confirm modal
    helper.collectPayment()
    cy.logout()

    // 5. Collect Payment & Close Deal
    cy.login(this.users.validUsers[1])
    helper.goToEquibitPage()

    cy.get('[data-cy=buy-order-row]')
      .should('not.exist')
    cy.get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Collect Securities')
      .get('[data-cy=notification-link]')
      .should('have.attr', 'on:click', 'showOfferModal(notification)')
      .should('contain', 'Close Deal')
      .click()
    // Confirm modal
    helper.collectEQB()
    cy.logout()

    // Confirm deal closed
    cy.login(this.users.validUsers[0])
    helper.checkDealClosed()
  })
})
