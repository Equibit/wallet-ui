// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Custom Login command
Cypress.Commands.add('login', (user) => {
  Cypress.log({
    name: 'login'
  })

  cy.visit('/')

  cy.get('input[type="email"]')
    .type(user.email)
    .get('input[type="password"]')
    .type(user.password)
    .get('button[type="submit"]').click()
})

Cypress.Commands.add('logout', () => {
  Cypress.log({
    name: 'logout'
  })

  cy.get('[data-cy=userDropdown]')
    .click()
  cy.contains('Log Out')
    .click()
})

Cypress.Commands.add('clearNotifications', () => {
  Cypress.log({
    name: 'clearNotifications'
  })

  cy.exec('mongo wallet_api-testing --eval \'db.notifications.remove({})\'')
})

Cypress.Commands.add('clearOrdersAndOffers', () => {
  Cypress.log({
    name: 'clearOrdersAndOffers'
  })

  cy.exec('mongo wallet_api-testing --eval \'db.orders.remove({assetType: "EQUIBIT"})\'')
  cy.exec('mongo wallet_api-testing --eval \'db.offers.remove({assetType: "EQUIBIT"})\'')
})

Cypress.Commands.add('loginQA', () => {
  Cypress.log({
    name: 'loginQA'
  })

  cy.visit('/')

  cy
    .get('input[type="password"]')
    .type(Cypress.env('HTTP_PASSWORD'))
  cy
    .get('button[type="submit"]')
    .click()
})

Cypress.Commands.add('goTo', (page) => {
  Cypress.log({
    name: 'goTo'
  })

  cy.get('[data-cy=userDropdown]')
    .click()
  cy.get(`[data-cy=${page}]`)
    .should('have.attr', 'href', `/${page}`)
    .click()

  cy.url().should('contain', `${page}`)
})

// Utility command to log eqb and btc addresses of users
Cypress.Commands.add('logAddresses', () => {
  Cypress.log({
    name: 'logAddresses'
  })

  cy.url().should('contain', 'portfolio')

  cy.contains('Receive')
    .click()

  cy.get('[data-cy=eqb-value]').then(address => {
    cy.log('EQB: ' + address[0].value)
  })
  cy.get('[data-cy=btc-value]').then(address => {
    cy.log('BTC: ' + address[0].value)
  })

  // Force failure to be able to see the logs
  cy.contains('FAIL', {timeout: 10000})
})
