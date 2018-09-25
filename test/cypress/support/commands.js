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

/* Utility Commands */
// Log eqb and btc addresses of users
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

// Send funds to user's addresses
Cypress.Commands.add('addFunds', (user, type) => {
  cy.login(user)
  cy.url().should('contain', 'portfolio')
  cy.wait(5000)
  cy.screenshot(`${user.email}-portfolio`)

  cy.contains('Receive')
    .click()

  if (type === 'eqb') {
    cy.get('[data-cy=eqb-value]').then(address => {
      const eqbAddress = address[0].value
      cy.contains('Done').click()
      cy.logout()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[3])
        cy.contains('Send')
          .click()
        cy.get('input[placeholder="Paste address"]').type(eqbAddress)
        cy.contains('Equibit').click()
        cy.get('input[type="number"]')
          .type('.0003')
        cy.contains('Next').click()
        cy.get('[data-cy=send-button]')
          .click()
        cy.wait(1000)
        cy.screenshot('transactions-portfolio')
      })
    })
  } else {
    cy.get('[data-cy=btc-value]').then(address => {
      const btcAddress = address[0].value
      cy.contains('Done').click()
      cy.logout()
      cy.fixture('users').as('users').then(users => {
        cy.login(users.validUsers[3])
        cy.contains('Send')
          .click()
        cy.get('input[placeholder="Paste address"]').type(btcAddress)
        cy.contains('Bitcoin').click()
        cy.get('input[type="number"]')
          .type('.0003')
        cy.contains('Next').click()
        cy.get('[data-cy=send-button]')
          .click()
        cy.wait(1000)
        cy.screenshot('transactions-portfolio')
      })
    })
  }
  cy.logout()
})
