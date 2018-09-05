/* eslint-disable */

describe('Auto Logout Test', () => {

  beforeEach(() => {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        cy.login(users.validUsers[0])
        cy
          .get('[data-cy=userDropdown]')
          .should('have.attr', 'href', '#')
          .click()
        cy
          .get('[data-cy=userPreferences]')
          .should('have.attr', 'href', '/preferences')
          .click()
      })
  })
  
  it('auto logout dialog can open', function () {
    cy
      .get('[data-cy=editAutoLogoutButton]')
      .click()
    cy
      .get('#autoLogoutTime')
      .should('be.visible')
  })

  it('auto logout time can be adjusted', function () {
    cy
      .get('[data-cy=displayedAutoLogoutTime]')
      .then(($fld) => {
        const oldTimeout = parseInt($fld.text())
        const newTimeout = oldTimeout + (oldTimeout >= 25 ? -5 : 5)
        cy
        .get('[data-cy=editAutoLogoutButton]')
        .click()
        cy
        .get('#autoLogoutTime')
        .clear()
        .type(newTimeout.toString())
        cy
        .get('[data-cy=saveAutoLogoutButton]')
        .should('have.class', 'btn-primary')
        .click()
        cy
        .get('[data-cy=displayedAutoLogoutTime]')
        .should('contain', newTimeout.toString())
      })
    })

})

/* eslint-enable */

