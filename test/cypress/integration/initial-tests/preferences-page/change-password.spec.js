'use strict'

import './support/commands'

let user
const weakPassword = 'abc123'
const openDialog = function () {
  cy
    .get('[data-cy=edit-password-button]')
    .click()
}
const enterPasswords = function (currentPassword, newPassword) {
  cy
    .get('#passwordCurrent')
    .type(currentPassword)
  cy
    .get('#passwordNew')
    .type(newPassword)
}
const attemptSave = function () {
  cy
    .get('[data-cy=save-password-button]')
    .click()
}

describe('Change Password Test', () => {
  after(function () {
    user.password = [user.secondPassword, user.secondPassword = user.password][0]
    cy
      .resetUser(user)
      .then(() => {
        cy.goToPrefs()
        openDialog()
        enterPasswords(user.password, user.secondPassword)
        attemptSave()
      })
  })

  beforeEach(function () {
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
      })
  })

  it('password dialog is openable', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('[data-cy=edit-password-dialog]')
      .should('be.visible')
  })

  it('has no passwords populated', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('#passwordCurrent')
      .should('be.empty')
    cy
      .get('#passwordNew')
      .should('be.empty')
  })

  it('unallows invalid current password', function () {
    cy.goToPrefs()
    openDialog()
    enterPasswords(user.password + Math.random().toString(36).substring(5), user.secondPassword)
    attemptSave()
    cy
      .get('[data-cy=old-password-validation]')
      .should('not.be.empty')
  })

  it('unallows weak new password', function () {
    cy.goToPrefs()
    openDialog()
    enterPasswords(user.password, weakPassword)
    cy
      .get('[data-cy=new-password-validation]')
      .should('not.be.empty')
  })

  it('unallows the same password to be entered twice', function () {
    cy.goToPrefs()
    openDialog()
    enterPasswords(user.password, user.password)
    attemptSave()
    cy
      .get('[data-cy=general-password-validation]')
      .should('not.be.visible')
  })

  it('allows valid password entry and save', function () {
    cy.goToPrefs()
    openDialog()
    enterPasswords(user.password, user.secondPassword)
    attemptSave()
    user.password = [user.secondPassword, user.secondPassword = user.password][0]
    cy
      .get('[data-cy=edit-password-dialog]')
      .should('not.be.visible')
  })

  it('allows log in with new credentials', function () {
    cy
      .get('[data-cy=userDropdown]')
      .should('have.attr', 'href', '#')
      .click()
    cy
      .contains('Log Out')
      .should('have.attr', 'on:click', 'logout()')
  })

  it('unallows a recent password', function () {
    cy.goToPrefs()
    openDialog()
    enterPasswords(user.password, user.secondPassword)
    attemptSave()
    cy
      .get('[data-cy=new-password-validation]')
      .should('contain', 'last 3 passwords')
  })
})
