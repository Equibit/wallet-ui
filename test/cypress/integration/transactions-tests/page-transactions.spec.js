'use strict'

import * as helper from '../../support/utils/trade-helpers'

describe('Transactions Page Test', () => {
  describe('Without Transactions', () => {
    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[2])
        cy.goTo('transactions')
      })
    })

    it('user sees transactions landing page', () => {
      cy.get('[data-cy=transaction-message]')
        .should('be.visible')
        .and('contain', 'Transaction History')
      cy.get('[data-cy=transaction-cause]')
        .should('be.visible')
        .and('contain', 'Transactions will show when you trade, or send and receive funds to your portfolios.')
    })
  })

  describe('With Transactions', () => {
    before(() => {
      // Make a transfer to ensure transaction shows up in transaction page
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[0])
        cy.contains('Send').click()
        cy.get('input[placeholder="Paste address"]').type(users.validUsers[3].plainEQBaddress)
        cy.contains('Equibit').click()
        cy.get('input[type="number"]')
          .type('.00001')
        cy.contains('Next').click()
        cy.get('[data-cy=send-button]')
          .click()
        cy.logout()
      })
    })

    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users').then((users) => {
        cy.login(users.validUsers[3])
        helper.checkFunds()
        cy.goTo('transactions')
      })
    })

    it.skip('user can go to different transactions page using the paginator', () => {
      // Paginator doesn't work yet
    })

    it.skip('user can edit transaction note', () => {
      // Edit button on additional details does nothing
    })

    it('user sees transactions page', () => {
      cy.get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy.get('[data-cy=transaction-table]')
        .should('exist')

      cy.contains('h2', 'Additional Details')
        .should('be.visible')
      cy.get('[data-cy=txid-link]')
        .should('be.visible')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'href')
    })
  })
})
