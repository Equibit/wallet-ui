// This is a helper file for functions related to creating a full trade.

// Notifications
export function firstNotification (type, value) {
  cy.get('[data-cy=notification-icon]')
    .click()
    .contains('Notifications')
    .should('be.visible')
    .get('[data-cy=notification-title]')
    .should('contain', `${type}`)
    .should('contain', 'Offer Received')
    .get('[data-cy=quantity-link]')
    .should('contain', `${value}@1000000`)
}

export function secondNotification (type, pos = 0) {
  let title
  type === 'Sell' ? title = 'Payment' : title = 'Securities'

  cy.get('[data-cy=notification-icon]')
    .click()
    .contains('Notifications')
    .should('be.visible')
    .get('[data-cy=notification-title]')
    .should('contain', `${type}`)
    .should('contain', 'Offer Accepted')
    .get('[data-cy=notification-link]')
    .should('contain', `Collect ${title}`)
    .eq(pos)
    .click()
}

// Functions
export function placeOrder (type) {
  const capitalizeType = type.charAt(0).toUpperCase() + type.slice(1)
  cy.get(`[data-cy=${type}-order-row]`)
    .should('not.exist')
  cy.contains(`Add ${capitalizeType} Order`)
    .should('have.attr', 'on:click', `showModal(\'${type.toUpperCase()}\')`)
    .click()
  // Add Sell Order modal
  cy.get('[data-cy=order-modal-title]')
    .should('contain', `Place ${capitalizeType} Order`)
  cy.get(`[data-cy=order-button-${type}]`)
    .should('have.class', 'btn-selected')
}

export function addOrder (quantity, price, type, fillorkill = false) {
  cy.get('[data-cy=input-quantity]')
    .type(quantity)
  cy.get('[data-cy=input-price]')
    .type(`{backspace}${price}`)
  cy.get('[data-cy=total-price]')
    .click()
    .should('have.value', (quantity * price).toString())
  if (fillorkill) {
    cy.get('input[type="checkbox"]').check()
  }
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
  cy.get('[data-cy=close-update]').click()
}

export function confirmOrder (fillorkill = false) {
  cy.url().should('contain', '/orders/')

  cy.get('[data-cy=order-item]')
    .should('have.attr', 'on:click', 'selectItem(item)')
    .should('have.class', 'active')
    .should('contain', 'Blank EQB')
    .get('[data-cy=list-status]')
    .should('contain', 'Open')

  cy.get('[data-cy=order-quantity]')
    .should('contain', '0.0001')

  if (fillorkill) {
    cy.get('[data-cy=fillkill]')
      .should('be.visible')
  }

  cy.get('[data-cy=order-ask-price]')
    .should('contain', '1000000.00')
    .get('[data-cy=status]')
    .should('contain', 'Open')
    .get('[data-cy=offers-length]')
    .should('contain', '0')
}

export function acceptOffers (fillorkill = false) {
  if (fillorkill) {
    cy.get('[data-cy=offer-length]')
      .should('not.contain', '2')
  }

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
  cy.get('[data-cy=close-update]').click()
}

export function closeDeal (type, pos = 0) {
  let title
  type === 'sell' ? title = 'Payment' : title = 'Securities'

  cy.get(`[data-cy=${type}-order-row]`)
      .should('not.exist')
  cy.get('[data-cy=notification-icon]')
    .click()
    .contains('Notifications')
    .should('be.visible')
    .get('[data-cy=notification-title]')
    .should('contain', `Collect ${title}`)
    .get('[data-cy=notification-link]')
    .should('be.visible')
    .should('contain', 'Close Deal')
    .eq(pos)
    .click()
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

// Send coins to an address
export function sendFunds (address, type, amount) {
  if (type === 'eqb') {
    type = 'Equibit'
  } else if (type === 'btc') {
    type = 'Bitcoin'
  }

  checkFunds()

  cy.contains('Send')
    .click()
  cy.get('input[placeholder="Paste address"]').type(address)
  cy.contains(type).click()
  cy.get('input[type="number"]')
    .type(amount)
  cy.contains('Next').click()
  cy.get('[data-cy=send-button]')
    .click()
}

export function loadFundsFromQA () {
  cy.fixture('users').as('users').then(users => {
    // Visit live QA website and login with existing user who has funds
    cy.visit('https://qa-wallet.equibitgroup.com')
    cy.get('input[type="password"]')
      .type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]')
      .click()
    cy.get('input[type="email"]')
      .type(users.qaBankAccount.email)
      .get('input[type="password"]')
      .type(users.qaBankAccount.password)
      .get('button[type="submit"]')
      .click()
    sendFunds(users.validUsers[0].seededEQBaddress, 'eqb', '.0003')
    cy.wait(2000)
    sendFunds(users.validUsers[1].seededBTCaddress, 'btc', '.0003')
  })
}
