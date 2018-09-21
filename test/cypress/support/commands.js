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

Cypress.Commands.add('resetSecondFactorAuth', (user) => {
  Cypress.log({
    name: 'resetSecondFactorAuth'
  })

  return cy.exec(
    'mongo wallet_api-testing --eval \'db.users.updateOne(' +
    `{ "_id": ObjectId("${user.dbid}") },` +
    `{ $set: { "twoFactorCode": "${user.hashedTwoFactorCode}" } },` +
    '{  })\''
  )
})

Cypress.Commands.add('getSecondFactorHashedAuth', (user) => {
  Cypress.log({
    name: 'getSecondFactorHashedAuth'
  })

  return cy.exec(
    'mongo wallet_api-testing --eval \'db.users.find(' +
    `{ "_id": ObjectId("${user.dbid}") },` +
    '{ "twoFactorCode": 1, "_id": 0 })\' | grep \'"twoFactorCode"\''
  ).then((result) => JSON.parse(
    result.stdout
  ).twoFactorCode)
})

Cypress.Commands.add('resetUser', (user) => {
  Cypress.log({
    name: 'resetUser'
  })

  return cy.exec(
    'mongo wallet_api-testing --eval \'' +
    'var keys = db.users.findOne(); for (var key in keys) { print(key); }' +
    '\''
  )
    .then((result) => result.stdout.split('_id')[1].trim().split('\n'))
    .then((dbfields) => {
      let { dbMapping, ...dbUser } = user
      Object.entries(dbMapping).forEach(([key, value]) => {
        // if the value is null it means we don't want to save it in the database
        if (!value) delete dbUser[key]
        else delete Object.assign(dbUser, { [value]: dbUser[key] })[key]
      })

      const resetFields = { ...Object.keys(dbUser)
        .filter((key) => dbfields.includes(key))
        .reduce((obj, key) => ({
          ...obj,
          [key]: dbUser[key]
        }), {}) }

      return cy.exec(
        'mongo wallet_api-testing --eval \'db.users.updateOne(' +
        `{ "_id": ObjectId("${user.dbid}") },` +
        `{ $set: ${JSON.stringify(resetFields)} },` +
        '{  })\''
      )
    })
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
