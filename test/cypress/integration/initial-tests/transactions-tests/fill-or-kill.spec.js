/*eslint-disable */
// NOTE: These tests currently only create FOK orders, and are not completed.
// This means that once in a while, if you run it often, the btc/eqb blocks will
// need to be mined otherwise 'invalid signature' or mempool error will occur.
describe('Fill or Kill Test', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.resetOrdersAndOffers()
    cy.resetTransactions()
    cy.fixture('users').as('users')
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  it('Fill or Kill sell order', function () {
    cy.login(this.users.validUsers[0])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')

    // Place Sell Order
    cy
      .get('[data-cy=sell-order-row]')
      .should('not.exist')
    cy
      .contains('Add Sell Order')
      .should('have.attr', 'on:click', 'showModal(\'SELL\')')
      .click()
    // Add Sell Order modal
    cy
      .get('[data-cy=order-modal-title]')
      .should('contain', 'Place Sell Order')
    cy
      .get('[data-cy=order-button-sell]')
      .should('have.class', 'btn-selected')
    cy
      .get('[data-cy=input-quantity]')
      .type('.0001')
    cy
      .get('[data-cy=input-price]')
      .type('{backspace}1000000')
    cy
      .get('[data-cy=total-price]')
      .click()
      .should('have.value', '100')
    cy
      .get('input[type="checkbox"]')
      .check()
    cy
      .get('[data-cy=button-1]')
      .click()
    cy
      .contains('Next')
      .should('have.attr', 'on:click', '../next()')
      .click()
    // Confirm modal
    cy
      .contains('Please review and confirm your order.')
      .should('exist')
      .get('[data-cy=confirm-quantity]')
      .should('contain', '0.0001')
      .get('[data-cy=confirm-price')
      .should('contain', '1000000.00')
      .get('[data-cy=confirm-total]')
      .should('contain', '100.00')
      .get('[data-cy=place-order-button]')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Your order was created')
    // Confirm order appears/exists
    cy
      .get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'No')
      .should('contain', '0.0001')
      .should('contain', '1000000')
      .should('contain', 'View')
    cy.logout()

    // Place Buy Offer & Send Payment - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    cy
      .get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'No')
      .should('contain', '0.0001')
      .should('contain', '1000000')
      .should('contain', 'Buy')
    cy
      .contains('Buy')
      .should('have.attr', 'on:click', 'buySell(row)')
      .click()
    // Send Offer modal
    cy
      .get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Payment')
    cy
      .get('#inputQuantity')
      .should('have.value', '0.0001')
      .get('#inputAskPrice')
      .should('have.value', '1000000')
    cy
      .get('#inputQuantityOffer')
      .should('have.value', '0.0001')
      .get('[data-cy=total-ask-price]')
      .should('have.value', '100')
    cy
      .get('[data-cy=fillkill]')
      .should('be.visible')
    cy
      .contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click()
    // Confirm modal
    cy
      .get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Payment')
    cy
      .contains('Please review and confirm your offer.')
      .should('exist')
    cy
      .contains('0.0001')
      .should('exist')
      .get('[data-cy=portfolio-name]')
      .should('contain', 'My Test Portfolio 3')
    cy
      .get('[data-cy=timelock-button]')
      .should('contain', '12 Hours')
      .should('have.value', '72')
      .click()
    cy
      .get('[data-cy=offer-button]')
      .should('contain', 'Send Offer Payment')
      .should('have.attr', 'on:click', 'send(@close)')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Your offer was created')
    // Confirm order appears/exists
    cy
      .get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'View')

    cy.logout()

    // Accept & Send Securities - check message
    cy.login(this.users.validUsers[0])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    // Confirm notification
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Buy')
      .should('contain', 'Offer Received')
      .get('[data-cy=quantity-link]')
      .should('contain', '0.0001@1000000')
    // Confirm order appears/exists
    cy
      .get('[data-cy=sell-order-row]')
      .should('exist')
      .should('contain', 'View')
    cy
      .contains('View')
      .click()
    cy
      .contains('View Details')
      .click()
    // Confirm order details & accept offer
    cy.url().should('contain', '/orders/')

    cy
      .get('[data-cy=order-item]')
      .should('have.attr', 'on:click', 'selectItem(item)')
      .should('have.class', 'active')
      .should('contain', 'Blank EQB')
      .get('[data-cy=list-status]')
      .should('contain', 'Open')
    cy
      .get('[data-cy=order-quantity]')
      .should('contain', '0.0001')
      .get('[data-cy=fillkill]')
      .should('be.visible')
      .get('[data-cy=order-ask-price]')
      .should('contain', '1000000.00')
      .get('[data-cy=status]')
      .should('contain', 'Open')
      .get('[data-cy=offers-length]')
      .should('contain', '0')
    cy
      .get('[data-cy=offer-quantity]')
      .should('be.visible')
      .should('contain', '0.0001')
      .click()
    cy
      .get('[data-cy=accept-button]')
      .should('be.visible')
      .should('have.attr', 'on:click', 'acceptOffer(offer)')
      .click()
    // Accept offer and send modal
    cy
      .get('[data-cy=accept-offer-title]')
      .should('contain', 'Accept Offer and Send Equibits')
      .get('[data-cy=timer]')
      .should('contain', '11')
      .get('[data-cy=offer-amount]')
      .should('contain', '0.0001')
    cy
      .contains('Please review and confirm your transaction.')
      .should('exist')
    cy
      .contains('Accept & Send')
      .should('have.attr', 'on:click', 'send(@close)')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=list-status]')
      .should('contain', 'Trading')
    
    cy.logout()
    
    // Collect Securities - check message
    cy.login(this.users.validUsers[1])
    cy
      .get('[data-cy=notification-icon]')
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
    cy
      .get('[data-cy=collect-title]')
      .should('contain', 'Collect EQB')
      .get('[data-cy=confirm-summary]')
      .should('contain', '0.0001')
      .should('contain', 'EQB')
      .get('[data-cy=collect-button]')
      .should('have.attr', 'on:click', 'send(@close)')
      .should('contain', 'Collect EQB')
      .click()
    // Confirm alert & new notification
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .get('[data-cy=notification-link]')
      .should('contain', 'You collected the securities')

    cy.logout()

    // Collect Payment & Close Deal
    cy.login(this.users.validUsers[0])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    cy
      .get('[data-cy=sell-order-row]')
      .should('not.exist')
    cy
      .get('[data-cy=notification-icon]')
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
    cy
      .get('[data-cy=collect-title]')
      .should('contain', 'Collect Payment')
      .get('[data-cy=confirm-summary]')
      .should('contain', '0.0001')
      .should('contain', 'BTC')
      .get('[data-cy=collect-button]')
      .should('have.attr', 'on:click', 'send(@close)')
      .should('contain', 'Collect & Close Deal')
      .click()
    // Confirm alert & new notification
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .get('[data-cy=notification-link]')
      .should('contain', 'You collected the payment')
    
    cy.logout()

    // Confirm deal closed
    cy.login(this.users.validUsers[1])
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Deal Closed')
  })

  it('Fill or Kill buy order', function () {
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')

    // Place Buy Order
    cy
      .get('[data-cy=buy-order-row]')
      .should('not.exist')
    cy
      .contains('Add Buy Order')
      .should('have.attr', 'on:click', 'showModal(\'BUY\')')
      .click()
    // Add Buy Order modal
    cy
      .get('[data-cy=order-modal-title]')
      .should('contain', 'Place Buy Order')
    cy
      .get('[data-cy=order-button-buy]')
      .should('have.class', 'btn-selected')
    cy
      .get('[data-cy=input-quantity]')
      .type('.0001')
    cy
      .get('[data-cy=input-price]')
      .type('{backspace}1000000')
    cy
      .get('[data-cy=total-price]')
      .click()
      .should('have.value', '100')
    cy
      .get('input[type="checkbox"]')
      .check()
    cy
      .get('[data-cy=button-1]')
      .click()
    cy
      .contains('Next')
      .should('have.attr', 'on:click', '../next()')
      .click()
    // Confirm modal
    cy
      .contains('Please review and confirm your order.')
      .should('exist')
      .get('[data-cy=confirm-quantity]')
      .should('contain', '0.0001')
      .get('[data-cy=confirm-price')
      .should('contain', '1000000.00')
      .get('[data-cy=confirm-total]')
      .should('contain', '100.00')
      .get('[data-cy=place-order-button]')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Your order was created')
    // Confirm order appears/exists
    cy
      .get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'No')
      .should('contain', '0.0001')
      .should('contain', '1000000')
      .should('contain', 'View')
    cy.logout()

    // Place Buy Offer & Send Payment - check message
    cy.login(this.users.validUsers[0])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    cy
      .get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'No')
      .should('contain', '0.0001')
      .should('contain', '1000000')
      .should('contain', 'Sell')
    cy
      .get('[data-cy=sell-button]')
      .should('have.attr', 'on:click', 'buySell(row)')
      .click()
    // Send Offer modal
    cy
      .get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Equibits')
    cy
      .get('#inputQuantity')
      .should('have.value', '0.0001')
      .get('#inputAskPrice')
      .should('have.value', '1000000')
    cy
      .get('#inputQuantityOffer')
      .should('have.value', '0.0001')
      .get('[data-cy=total-ask-price]')
      .should('have.value', '100')
    cy
      .get('[data-cy=fillkill]')
      .should('be.visible')
    cy
      .contains('Next')
      .should('have.attr', 'on:click', 'next()')
      .click()
    // Confirm modal
    cy
      .get('[data-cy=offer-modal-title]')
      .should('contain', 'Send Offer Equibits')
    cy
      .contains('Please review and confirm your offer.')
      .should('exist')
    cy
      // .contains('0.0001') // bug here
      // .should('exist')
      .get('[data-cy=portfolio-name]')
      .should('contain', 'My Test Portfolio')
    cy
      .get('[data-cy=timelock-button]')
      .should('contain', '12 Hours')
      .should('have.value', '72')
      .click()
    cy
      .get('[data-cy=offer-button]')
      .should('contain', 'Send Offer Equibits')
      .should('have.attr', 'on:click', 'send(@close)')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Your offer was created')
    // Confirm order appears/exists
    cy
      .get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'View')

    cy.logout()

    // Accept & Send Securities - check message
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    // Confirm notification
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Sell')
      .should('contain', 'Offer Received')
      .get('[data-cy=quantity-link]')
      .should('contain', '0.0001@1000000')
    // Confirm order appears/exists
    cy
      .get('[data-cy=buy-order-row]')
      .should('exist')
      .should('contain', 'View')
    cy
      .contains('View')
      .click()
    cy
      .contains('View Details')
      .click()
    // Confirm order details & accept offer
    cy.url().should('contain', '/orders/')

    cy
      .get('[data-cy=order-item]')
      .should('have.attr', 'on:click', 'selectItem(item)')
      .should('have.class', 'active')
      .should('contain', 'Blank EQB')
      .get('[data-cy=list-status]')
      .should('contain', 'Open')
    cy
      .get('[data-cy=order-quantity]')
      .should('contain', '0.0001')
      .get('[data-cy=fillkill]')
      .should('be.visible')
      .get('[data-cy=order-ask-price]')
      .should('contain', '1000000.00')
      .get('[data-cy=status]')
      .should('contain', 'Open')
      .get('[data-cy=offers-length]')
      .should('contain', '0')
    cy
      .get('[data-cy=offer-quantity]')
      .should('be.visible')
      .should('contain', '0.0001')
      .click()
    cy
      .get('[data-cy=accept-button]')
      .should('be.visible')
      .should('have.attr', 'on:click', 'acceptOffer(offer)')
      .click()
    // Accept offer and send modal
    cy
      .get('[data-cy=accept-offer-title]')
      .should('contain', 'Accept Offer and Send Payment')
      .get('[data-cy=timer]')
      .should('contain', '11')
      .get('[data-cy=offer-amount]')
      .should('contain', '0.0001')
    cy
      .contains('Please review and confirm your transaction.')
      .should('exist')
    cy
      .contains('Accept & Send')
      .should('have.attr', 'on:click', 'send(@close)')
      .click()
    // Confirm alert
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=list-status]')
      .should('contain', 'Trading')
    
    cy.logout()
    
    // Collect Securities - check message
    cy.login(this.users.validUsers[0])
    cy
      .get('[data-cy=notification-icon]')
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
    cy
      .get('[data-cy=collect-title]')
      .should('contain', 'Collect Payment')
      .get('[data-cy=confirm-summary]')
      .should('contain', '0.0001')
      .should('contain', 'BTC')
      .get('[data-cy=collect-button]')
      .should('have.attr', 'on:click', 'send(@close)')
      .should('contain', 'Collect & Close Deal')
      .click()
    // Confirm alert & new notification
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .get('[data-cy=notification-link]')
      .should('contain', 'You collected the payment')

    cy.logout()

    // Collect Payment & Close Deal
    cy.login(this.users.validUsers[1])
    cy.get('[data-cy=equibit-link]').click()
    cy.url().should('contain', 'equibit')
    cy
      .get('[data-cy=buy-order-row]')
      .should('not.exist')
    cy
      .get('[data-cy=notification-icon]')
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
    cy
      .get('[data-cy=collect-title]')
      .should('contain', 'Collect EQB')
      .get('[data-cy=confirm-summary]')
      .should('contain', '0.0001')
      .should('contain', 'EQB')
      .get('[data-cy=collect-button]')
      .should('have.attr', 'on:click', 'send(@close)')
      .should('contain', 'Collect EQB')
      .click()
    // Confirm alert & new notification
    cy
      .get('.alert-message')
      .should('contain', 'Trade was updated')
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .get('[data-cy=notification-link]')
      .should('contain', 'You collected the securities')
    
    cy.logout()

    // Confirm deal closed
    cy.login(this.users.validUsers[0])
    cy
      .get('[data-cy=notification-icon]')
      .click()
      .contains('Notifications')
      .should('be.visible')
      .get('[data-cy=notification-title]')
      .should('contain', 'Deal Closed')
  })
})
/*eslint-enable */
