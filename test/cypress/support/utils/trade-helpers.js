// This is a helper file for functions related to creating a full trade.

export function goToEquibitPage () {
  cy.url().should('contain', '/portfolio')
  cy
    .get('[data-cy=no-funds-alert]')
    .should('not.exist')
  cy.get('[data-cy=equibit-link]').click()
  cy.url().should('contain', 'equibit')
}

export function addOrder (fill, quantity, price, type) {
  cy.get('[data-cy=input-quantity]')
    .type(quantity)
  cy.get('[data-cy=input-price]')
    .type(`{backspace}${price}`)
  cy.get('[data-cy=total-price]')
    .click()
    .should('have.value', (quantity * price).toString())
  if (fill) { cy.get('input[type="checkbox"]').check() }
  cy.get('[data-cy=button-1]')
    .click()
  cy.contains('Next')
    .should('have.attr', 'on:click', '../next()')
    .click()

  // Confirm modal
  cy.contains('Please review and confirm your order.')
    .should('exist')
  cy.get('[data-cy=place-order-button]')
    .click()
  // Confirm alert
  cy.get('.alert-message')
    .should('contain', 'Your order was created')
  // Confirm order appears/exists
  cy.get(`[data-cy=${type}-order-row]`)
    .should('exist')
    .should('contain', 'View')
}

export function createOffer (type) {
  cy.get('[data-cy=offer-modal-title]')
    .should('contain', `Send Offer ${type}`)
  cy.contains('Please review and confirm your offer.')
    .should('exist')
  cy.get('[data-cy=timelock-button]')
    .should('contain', '12 Hours')
    .should('have.value', '72')
    .click()
  cy.get('[data-cy=offer-button]')
    .should('contain', `Send Offer ${type}`)
    .should('have.attr', 'on:click', 'send(@close)')
    .click()
  // Confirm alert
  cy.get('.alert-message')
    .should('contain', 'Your offer was created')
}

export function confirmOrderAndAcceptOffer () {
  cy.url().should('contain', '/orders/')

  cy.get('[data-cy=order-item]')
    .should('have.attr', 'on:click', 'selectItem(item)')
    .should('have.class', 'active')
    .should('contain', 'Blank EQB')
    .get('[data-cy=list-status]')
    .should('contain', 'Open')

  cy.get('[data-cy=order-quantity]')
    .should('contain', '0.0001')
    .get('[data-cy=fillkill]')
    .should('be.visible')
    .get('[data-cy=order-ask-price]')
    .should('contain', '1000000.00')
    .get('[data-cy=status]')
    .should('contain', 'Open')
    .get('[data-cy=offers-length]')
    .should('contain', '0')

  cy.get('[data-cy=offer-quantity]')
    .should('be.visible')
    .should('contain', '0.0001')
    .click()

  cy.get('[data-cy=accept-button]')
    .should('be.visible')
    .should('have.attr', 'on:click', 'acceptOffer(offer)')
    .click()
}

export function collectEQB () {
  cy.get('[data-cy=collect-title]')
    .should('contain', 'Collect EQB')
    .get('[data-cy=confirm-summary]')
    .should('contain', '0.0001')
    .should('contain', 'EQB')
    .get('[data-cy=collect-button]')
    .should('have.attr', 'on:click', 'send(@close)')
    .should('contain', 'Collect EQB')
    .click()

  // Confirm alert & new notification
  cy.get('.alert-message')
    .should('contain', 'Trade was updated')
  cy.get('[data-cy=notification-icon]')
    .click()
    .get('[data-cy=notification-link]')
    .should('contain', 'You collected the securities')
}

export function collectPayment () {
  cy.get('[data-cy=collect-title]')
    .should('contain', 'Collect Payment')
    .get('[data-cy=confirm-summary]')
    .should('contain', '0.0001')
    .should('contain', 'BTC')
    .get('[data-cy=collect-button]')
    .should('have.attr', 'on:click', 'send(@close)')
    .should('contain', 'Collect & Close Deal')
    .click()

  // Confirm alert & new notification
  cy.get('.alert-message')
    .should('contain', 'Trade was updated')
  cy.get('[data-cy=notification-icon]')
    .click()
    .get('[data-cy=notification-link]')
    .should('contain', 'You collected the payment')
}

export function checkDealClosed () {
  cy.get('[data-cy=notification-icon]')
    .click()
    .contains('Notifications')
    .should('be.visible')
    .get('[data-cy=notification-title]')
    .should('contain', 'Deal Closed')
}
