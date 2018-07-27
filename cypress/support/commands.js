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
/*eslint-disable */
// Custom Login command
Cypress.Commands.add('login', (users) => {
    
    cy.visit('/')

    cy.get('input[type="email"]')
    .type(users[0].email)
    .get('input[type="password"]')
    .type(users[0].password)
    .get('button[type="submit"]').click()
    
    cy.url().should('contain', '/portfolio')
})
/*eslint-enable */
