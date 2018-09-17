'use strict'

import './support/commands'

let user

describe('Auto Logout Test', () => {
  after(function () {
    cy.resetUser(user)
  })

  beforeEach(() => {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        if (!user) {
          user = user || users.twoStepVerification
          cy.resetUser(user)
        }
        cy.login(user)
        cy.goToPrefs()
      })
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
