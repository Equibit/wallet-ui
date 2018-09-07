'use strict'

describe('Change Password Test', () => {
  let user
  const weakPassword = 'abc123'
  const strongPassword = 'th3_Str0ngesT_p4SSword'
  const goToPreferences = function () {
    cy
      .get('[data-cy=userDropdown]')
      .should('have.attr', 'href', '#')
      .click()
    cy
      .get('[data-cy=userPreferences]')
      .should('have.attr', 'href', '/preferences')
      .click()
  }
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

  beforeEach(function () {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        user = users.validUsers[0]
        cy.login(Object.assign(
          user,
          { password: this.currentTest.title === 'allows log in with new credentials' ? strongPassword : user.password }
        ))
        // cy.login({ ...user, password: this.currentTest.title === 'allows log in with new credentials' ? strongPassword : user.password })
      })
  })

  // We need to reset the password to the previous one so that subsequent tests can run with this user.
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      goToPreferences()
      openDialog()
      enterPasswords(strongPassword, user.password)
    }
  })

  it('password dialog is openable', function () {
    goToPreferences()
    openDialog()
    cy
      .get('[data-cy=edit-password-dialog]')
      .should('be.visible')
  })

  it('has no passwords populated', function () {
    goToPreferences()
    openDialog()
    cy
      .get('#passwordCurrent')
      .should('be.empty')
    cy
      .get('#passwordNew')
      .should('be.empty')
  })

  it('unallows invalid current password', function () {
    goToPreferences()
    openDialog()
    enterPasswords(user.password + Math.random().toString(36).substring(5), strongPassword)
    attemptSave()
    cy
      .get('[data-cy=old-password-validation]')
      .should('not.be.empty')
  })

  it('unallows weak new password', function () {
    goToPreferences()
    openDialog()
    enterPasswords(user.password, weakPassword)
    cy
      .get('[data-cy=new-password-validation]')
      .should('not.be.empty')
  })

  it('unallows the same password to be entered twice', function () {
    goToPreferences()
    openDialog()
    enterPasswords(user.password, user.password)
    attemptSave()
    cy
      .get('[data-cy=general-password-validation]')
      .should('not.be.visible')
  })

  it('allows valid password entry and save', function () {
    goToPreferences()
    openDialog()
    enterPasswords(user.password, strongPassword)
    attemptSave()
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
})
