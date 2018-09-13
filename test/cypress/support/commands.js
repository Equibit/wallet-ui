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

  cy.exec(
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
