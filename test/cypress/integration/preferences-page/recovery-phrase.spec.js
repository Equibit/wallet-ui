'use strict'

import './support/commands'

describe('Recovery Phrase Test', () => {
  let user
  const openDialog = function () {
    cy
      .get('[data-cy=view-recovery-phrase-button]')
      .click()
  }

  beforeEach(function () {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        user = user || users.twoStepVerification
        cy.login(user)
      })
  })

  it('recovery phrase is openable', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('modal-authentication')
      .should('exist')
  })

  it('incorrect verification code does not allow continuation', function () {
    cy.goToPrefs()
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

  it('correct verification code allows generation of the recovery phrase', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
  })

  it('correct verification code allows viewing of the recovery phrase', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
  })

  it('recovery phrase can be read', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('[data-cy=continue-recovery-button]')
      .click()
  })
})