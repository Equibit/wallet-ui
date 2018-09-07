'use strict'

describe('Verify Email Test', () => {
  let user
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
      .get('[data-cy=edit-email-button]')
      .click()
  }
  const resendVerification = function () {
    cy
      .get('[data-cy=twofactor-tryagain-button]')
      .click({ force: true })
  }

  beforeEach(function () {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        user = users.twoStepVerification
        cy.login(user)
      })
  })

  it('email verification is openable', function () {
    goToPreferences()
    openDialog()
    cy
      .get('modal-authentication')
      .should('exist')
  })

  it('incorrect verification code dos not allow email change', function () {
    goToPreferences()
    openDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.invalidTwoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
    cy
      .get('validation-message')
      .should('not.be.empty')
  })

  it('correct verification code allows email change', function () {
    goToPreferences()
    openDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
  })
})