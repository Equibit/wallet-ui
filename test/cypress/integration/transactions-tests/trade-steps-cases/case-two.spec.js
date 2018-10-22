'use strict'
import * as helper from '../../../support/utils/trade-helpers'

/**
 * Steps for a trade:
 * 1. SELLER places buy order
 * 2. BUYER places sell offer
 * 3. SELLER accepts the BUYER's offer
 * 4. BUYER collects the securities
 * 5. SELLER collects payment and closes the deal
 */

const users = {}

function describeTrades(name, tests) {
  describe(name, () => {
    before(() => {
      cy.clearOrdersAndOffers()
      cy.loginQA()
      cy.fixture('users').as('users').then((us) => Object.assign(users, us))
    })
    tests()
  })
}

describe('Trade steps case 2 test', () => {
  describeTrades('SELLER timelock expired and BUYER has not collected securities', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Place buy order', () => {
      cy.login(users.validUsers[1])
      // helper.checkFunds()
      helper.goToEquibitPage()

      helper.placeOrder('buy')
      helper.addOrder('0.0001', '1000000', 'buy', false)
    })

    it('Place sell offer', () => {
      cy.login(users.validUsers[0])
      helper.checkFunds()
      helper.goToEquibitPage()

      // Order book
      cy.get('[data-cy=buy-order-row]')
        .should('exist')
        .should('contain', 'Sell')
      cy.get('[data-cy=sell-button]')
        .should('have.attr', 'on:click', 'buySell(row)')
        .click()
      // Send Offer modal
      cy.get('[data-cy=offer-modal-title]')
        .should('contain', 'Send Offer Equibits')
      cy.get('[data-cy=input-quantity-ask')
        .then(($quantity) => {
          cy.get('[data-cy=input-quantity]')
            .type($quantity[0].value)
        })
      cy.contains('Next')
        .should('have.attr', 'on:click', 'next()')
        .click()
      // Confirm modal
      helper.confirmOffer('Equibits')
    })

    it('Accept sell offer', () => {
      cy.login(users.validUsers[1])
      cy.goTo('orders')

      // Accept offer
      cy.get('[data-cy=switch-buy]')
        .click()
      helper.acceptOffers()
      cy.get('[data-cy=accept-offer-button]')
        .click()

      // Verify it was accepted
      cy.get('[data-cy=accepted-offers-length]')
        .should('contain', '1')
    })

    xit('Securities collection expires and are recovered', () => {

    })

    xit('Offer expires and funds are recovered', () => {

    })
  })
})
