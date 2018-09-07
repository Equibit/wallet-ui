Cypress.Commands.add("goToPrefs", () => {
  cy
    .get('[data-cy=userDropdown]')
    .should('have.attr', 'href', '#')
    .click()
  cy
    .get('[data-cy=userPreferences]')
    .should('have.attr', 'href', '/preferences')
    .click()
})