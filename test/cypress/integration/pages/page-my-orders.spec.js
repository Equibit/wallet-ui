'use strict'
describe('My Orders Test', () => {
  beforeEach(() => {
    cy.loginQA()
  })

  describe('Without Orders', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[2])
        cy.goTo('orders')
      })
    })

    it('greets user with placeholder and button to place an order when there are no orders', () => {
      cy.contains('h3', 'My Orders')
        .should('be.visible')
      cy.contains('div', 'Your Order Details Will Show Here')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it('user can cycle through empty order tabs', () => {
      cy.get('[data-cy=sell-tab]')
        .should('have.class', 'active')
        .get('[data-cy=switch-sell]')
        .should('have.attr', 'on:click', "switchMode('SELL')")

      cy.get('[data-cy=no-sell-placeholder]')
        .should('be.visible')
        .should('contain', 'No Sell Orders Found')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()
      cy.get('[data-cy=buy-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-buy-placeholder]')
        .should('be.visible')
        .should('contain', 'No Buy Orders Found')

      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()
      cy.get('[data-cy=archived-tab]')
        .should('have.class', 'active')

      cy.get('[data-cy=no-archived-placeholder]')
        .should('be.visible')
        .should('contain', 'No Archived Orders Found')
    })
  })

  describe('With Orders', () => {
    beforeEach(() => {
      cy.clearOrdersAndOffers()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[1])
      })
    })

    it('orders in archived orders list, no orders on the sell orders list', () => {
      cy.addOrders('archived')
      cy.goTo('orders')

      cy.contains('h3', 'My Orders')
        .should('be.visible')
      cy.contains('div', 'Select an Order to See Details')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it('orders in the sell orders list, no orders on the buy orders list', () => {
      cy.addOrders('sell')
      cy.goTo('orders')

      cy.contains('h3', 'My Orders')
        .should('be.visible')

      cy.get('[data-cy=buy-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-buy]')
        .should('have.attr', 'on:click', "switchMode('BUY')")
        .click()

      cy.contains('div', 'Select an Order to See Details')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it('orders in the sell orders list, no orders on the archived orders list', () => {
      cy.addOrders('sell')
      cy.goTo('orders')

      cy.contains('h3', 'My Orders')
        .should('be.visible')
      
      cy.get('[data-cy=archived-tab]')
        .should('not.have.class', 'active')
        .get('[data-cy=switch-archived]')
        .should('have.attr', 'on:click', "switchMode('ARCHIVE')")
        .click()

      cy.contains('div', 'Select an Order to See Details')
        .should('be.visible')
      cy.contains('p', 'You can place orders from the equibit page.')
        .should('be.visible')
      cy.get('[data-cy=place-order-button]')
        .should('be.visible')
        .should('contain', 'Place an Order')
        .should('have.attr', 'href', '/equibit')
    })

    it('user can cycle through order tabs that all have orders', () => {
      cy.addOrders('all')
      cy.goTo('orders')

        // TODO: check order details - need to create orders
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

    it('can cycle through orders pages with paginator', () => {
      cy.addOrders('many')
      cy.goTo('orders')

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
  describe.only('Order Cancellations', () => {
    beforeEach(() => {
      cy.clearOrdersAndOffers()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[1])
      })
    })

    it('can cancel sell order', () => {
      cy.addOrders('sell')
      cy.goTo('orders')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')

      cy.get('[data-cy=switch-sell]').click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
      cy.contains('Cancel Order')
        .should('be.visible')
        .click()
      cy.contains('h3', 'Cancel Order')
        .should('be.visible')
      cy.contains('h4', 'Warning')
        .should('be.visible')
      cy.contains('p', 'This action cannot be undone. Are you sure you want to continue?')
      cy.contains('No, Don\'t Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'close()')
      cy.contains('Yes, Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'confirm()')
        .click()
      cy.get('.alert-message')
        .should('contain', 'Order Cancelled')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
    })

    it('can cancel buy order', () => {
      cy.addOrders('buy')
      cy.goTo('orders')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('not.exist')

      cy.get('[data-cy=switch-buy]').click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
      cy.contains('Cancel Order')
        .should('be.visible')
        .click()
      cy.contains('h3', 'Cancel Order')
        .should('be.visible')
      cy.contains('h4', 'Warning')
        .should('be.visible')
      cy.contains('p', 'This action cannot be undone. Are you sure you want to continue?')
      cy.contains('No, Don\'t Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'close()')
      cy.contains('Yes, Cancel')
        .should('be.visible')
        .should('have.attr', 'on:click', 'confirm()')
        .click()
      cy.get('.alert-message')
        .should('contain', 'Order Cancelled')

      cy.get('[data-cy=switch-archived]')
        .click()
      cy.get('[data-cy=order-item]')
        .should('be.visible')
    })
  })
})
