'use strict'

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
  })

  it('password dialog is openable', function () {
    cy.goTo('preferences')
    openDialog()
    cy
      .get('[data-cy=edit-password-dialog]')
      .should('be.visible')
  })

  it('has no passwords populated', function () {
    cy.goTo('preferences')
    openDialog()
    cy
      .get('#passwordCurrent')
      .should('be.empty')
    cy
      .get('#passwordNew')
      .should('be.empty')
  })

  it('unallows invalid current password', function () {
    cy.goTo('preferences')
    openDialog()
    enterPasswords(user.password + Math.random().toString(36).substring(5), user.secondPassword)
    attemptSave()
    cy
      .get('[data-cy=old-password-validation]')
      .should('not.be.empty')
  })

  it('unallows weak new password', function () {
    cy.goTo('preferences')
    openDialog()
    enterPasswords(user.password, weakPassword)
    cy
      .get('[data-cy=new-password-validation]')
      .should('not.be.empty')
  })

  it('unallows the same password to be entered twice', function () {
    cy.goTo('preferences')
    openDialog()
    enterPasswords(user.password, user.password)
    attemptSave()
    cy
      .get('[data-cy=general-password-validation]')
      .should('not.be.visible')
  })

  it('allows valid password entry and unallows a recent password to be entered', function () {
    cy.goTo('preferences')
    openDialog()
    enterPasswords(user.password, user.secondPassword)
    attemptSave()
    cy
      .get('[data-cy=edit-password-dialog]')
      .should('not.be.visible')

    cy.logout()
    cy.login({ ...user, password: user.secondPassword })

    cy.goTo('preferences')
    openDialog()
    enterPasswords(user.secondPassword, user.password)
    attemptSave()
    cy
      .get('[data-cy=new-password-validation]')
      .should('contain', 'last 3 passwords')
  })
})
