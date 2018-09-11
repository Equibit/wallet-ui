'use strict'

import './support/commands'

describe('Recovery Phrase Test', () => {
  let user
  const openDialog = function () {
    cy
      .get('[data-cy=view-recovery-phrase-button]')
      .click()
  }
  const prepDialog = function() {
    cy.goToPrefs()
    openDialog()
    cy.resetSecondFactorAuth(user)
  }
  const viewRecoveryPhrase = function (recordWords = false) {
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
    cy
      .get('[data-cy=continue-recovery-button]')
      .click()
    cy
      .get('phrase-display')
      .should('exist')

    if (!recordWords) return

    let words = []
    [...Array(3)].forEach((_, w, words) => {
      cy
      .get('[data-cy=recovery-word-group] > word-display')
      .each(($el) => {
        console.log($el)
      })
      cy
        .get('[data-cy=continue-viewing-phrase-button]')
        .click()
    })

    return words
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

  it('recovery phrase is not set yet', function () {
    cy.goToPrefs()
    cy
      .get('[data-cy=user-phrase-notset-indicator]')
      .should('exist')
    cy
      .get('[data-cy=user-phrase-set-indicator]')
      .should('not.exist')
  })

  it('recovery phrase is openable', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('modal-authentication')
      .should('exist')
  })

  it('incorrect verification code does not allow continuation', function () {
    prepDialog()
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

  it('correct verification code allows viewing of the recovery phrase', function () {
    prepDialog()
    viewRecoveryPhrase()
  })

  it('incorrect word entrance does not allow continuation', function () {
    prepDialog()
    viewRecoveryPhrase(true)

  })

  xit('correct word entrance allows the recovery phrase to be set', function () {
    prepDialog()
    viewRecoveryPhrase(true)

  })
})