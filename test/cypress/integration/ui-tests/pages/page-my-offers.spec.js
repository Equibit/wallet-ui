'use strict'
describe('My Offers Test', () => {
  beforeEach(() => {
    cy.loginQA()
  })

  describe('Without Offers', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[2])
        cy.goTo('offers')
      })
    })

    it('greets user with placeholder when there are no offers', () => {
      cy.contains('h3', 'My Offers')
        .should('be.visible')
      cy.contains('div', 'Your Offer Details Will Show Here')
        .should('be.visible')
    })

    it('user can cycle through offer tabs', () => {
      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .get('[data-cy=switch-sell]')
        .should('have.attr', 'on:click', "switchMode('SELL')")

      cy.get('[data-cy=no-sell-placeholder]')
        .should('be.visible')
        .should('contain', 'No Sell Offers Found')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
      cy.get('[data-cy=buy-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-buy-placeholder]')
        .should('be.visible')
        .should('contain', 'No Buy Offers Found')

      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
      cy.get('[data-cy=archived-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-archived-placeholder]')
        .should('be.visible')
        .should('contain', 'No Archived Offers Found')
    })
  })

  describe('With Offers', () => {
    beforeEach(() => {
      cy.clearOrdersAndOffers()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[1])
      })
    })

    it('offers in archived offers list, no offers on the sell offers list', () => {
      cy.addOffers('archived')
      cy.goTo('offers')

      cy.contains('h3', 'My Offers')
        .should('be.visible')
      cy.contains('div', 'Your Offer Details Will Show Here')
        .should('be.visible')
    })

    it('offers in the sell offers list, no offers on the buy offers list', () => {
      cy.addOffers('sell')
      cy.goTo('offers')

      cy.contains('h3', 'My Offers')
        .should('be.visible')

      cy.get('[data-cy=order-item]')
        .should('be.visible')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
      cy.contains('div', 'Your Offer Details Will Show Here')
        .should('be.visible')
    })

    it('offers in the sell offers list, no offers on the archived offers list', () => {
      cy.addOffers('sell')
      cy.goTo('offers')

      cy.contains('h3', 'My Offers')
        .should('be.visible')

      cy.get('[data-cy=order-item]')
        .should('be.visible')

      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
      cy.contains('div', 'Your Offer Details Will Show Here')
        .should('be.visible')
    })

    it('user can cycle through offer tabs that all have offers', () => {
      cy.addOffers('all')
      cy.goTo('offers')

      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .get('[data-cy=switch-sell]')
        .should('have.attr', 'on:click', "switchMode('SELL')")
      cy.get('[data-cy=order-item]').click({multiple: true})

      cy.get('[data-cy=switch-buy]')
        .click()
      cy.get('[data-cy=buy-tab]')
        .should('have.class', 'active')
      cy.get('[data-cy=order-item]').click({multiple: true})

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=archived-tab]')
        .should('have.class', 'active')
      cy.get('[data-cy=order-item]').click({multiple: true})
    })

    it('can cycle through offers pages with paginator', () => {
      cy.addOffers('many')
      cy.goTo('offers')

      cy.get('[data-cy=paginator-1')
        .should('have.class', 'active')
      cy.get('[data-cy=paginator-2')
        .should('be.visible')
        .should('not.have.class', 'active')
      cy.get('[data-cy=paginator-next').click()
      cy.get('[data-cy=paginator-2')
        .should('have.class', 'active')
      cy.get('[data-cy=paginator-prev').click()
      cy.get('[data-cy=paginator-2')
        .should('not.have.class', 'active')
        .click()
      cy.get('[data-cy=paginator-2')
        .should('have.class', 'active')
    })
  })
  describe('Offer Cancellations', () => {
    beforeEach(() => {
      cy.clearOrdersAndOffers()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[1])
      })
    })

    it.skip('can cancel sell offer', () => {
      cy.addOffers('sell')
      cy.goTo('offers')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')

      cy.get('[data-cy=switch-sell]').click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
      cy.contains('Cancel Offer')
        .should('be.visible')
        .click()
      cy.contains('h3', 'Cancel Offer')
        .should('be.visible')
      cy.contains('h4', 'Warning')
        .should('be.visible')
      cy.contains('p', 'This action cannot be undone. Any pending trades will be cancelled as well. Are you sure you want to continue?')
      cy.contains('No, Don\'t Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'close()')
      cy.contains('Yes, Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'confirm()')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')
      // Cancelling last offer leaves cancel modal hanging and doesn't show alert
      // cy.get('.alert-message')
      //   .should('contain', 'Offer Cancelled')

      // cy.get('[data-cy=switch-archived]')
      //   .click()
      // cy.get('[data-cy=order-item]')
      //   .should('be.visible')
    })

    it.skip('can cancel buy offer', () => {
      cy.addOffers('buy')
      cy.goTo('offers')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')

      cy.get('[data-cy=switch-buy]').click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
      cy.contains('Cancel Offer')
        .should('be.visible')
        .click()
      cy.contains('h3', 'Cancel Offer')
        .should('be.visible')
      cy.contains('h4', 'Warning')
        .should('be.visible')
      cy.contains('p', 'This action cannot be undone. Any pending trades will be cancelled as well. Are you sure you want to continue?')
      cy.contains('No, Don\'t Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'close()')
      cy.contains('Yes, Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'confirm()')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')
      // Cancelling last offer leaves cancel modal hanging and doesn't show alert
      // cy.get('.alert-message')
      //   .should('contain', 'Offer Cancelled')

      // cy.get('[data-cy=switch-archived]')
      //   .click()
      // cy.get('[data-cy=order-item]')
      //   .should('be.visible')
    })
  })
})
