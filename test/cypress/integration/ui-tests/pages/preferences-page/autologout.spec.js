'use strict'

let user

describe('Auto Logout Test', () => {
  before(function () {
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        user = users.twoStepVerification
        cy.resetUser(user)
      })
  })

  after(function () {
    cy.resetUser(user)
  })

  beforeEach(function () {
    cy.loginQA()
    cy.login(user)
    cy.goTo('preferences')
  })

  it('auto logout dialog can open', function () {
    cy
      .get('[data-cy=edit-autologout-button]')
      .click()
    cy
      .get('#autoLogoutTime')
      .should('be.visible')
  })

  it('auto logout time can be adjusted', function () {
    cy
      .get('[data-cy=displayed-autologout-time]')
      .then(($fld) => {
        const oldTimeout = parseInt($fld.text())
        const newTimeout = oldTimeout + (oldTimeout >= 25 ? -5 : 5)
        cy
          .get('[data-cy=edit-autologout-button]')
          .click()
        cy
          .get('#autoLogoutTime')
          .clear()
          .type(newTimeout.toString())
        cy
          .get('[data-cy=save-autologout-button]')
          .should('have.class', 'btn-primary')
          .click()
        cy
          .get('[data-cy=displayed-autologout-time]')
          .should('contain', newTimeout.toString())
      })
  })
})
