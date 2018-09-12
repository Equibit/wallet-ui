'use strict'

import './support/commands'
import { worker } from 'cluster';

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

  // oh the hoops we have to jump through thanks to cypress's out of order execution
  return new Promise((res, rej) => {
    let words = []
    Promise.all(Array(3).fill().map((_, i) => {
      return new Promise((res, rej) => {
        cy
          .get('[data-cy=recovery-word-group] .word-display')
          .each(($el) => {
            // we only want the word (not the number or any whitespace)
            words.push($el.text().replace(/[^a-zA-Z]/gi, ''))
          })
        cy
          .get('[data-cy=continue-viewing-phrase-button]')
          .click()
          .then(() => res())
      })
    }))
      .then(() => {
        expect(words.length).to.equal(12)
        res(words)
      })
  })
}
const enterRecoveryWords = function (words) {
  return new Promise((res, rej) => {
    let indices = []
    cy.get('[data-cy=recovery-input-group] label[for=phrase-input1]')
      .each(($lb) => {
        indices.push(parseInt($lb.text().replace(/\D/g, '')) - 1)
      })
    cy.get('[data-cy=recovery-input-group] input#phrase-input1')
      .each(($in, i) => {
        cy.wrap($in).type(words[indices[i]])
      })
    cy
      .get('[data-cy=finish-viewing-phrase-button]')
      .click()
      .then(() => res())
  })
}

describe('Recovery Phrase Test', () => {
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

  xit('recovery phrase is not set yet', function () {
    cy.goToPrefs()
    cy
      .get('[data-cy=user-phrase-notset-indicator]')
      .should('exist')
    cy
      .get('[data-cy=user-phrase-set-indicator]')
      .should('not.exist')
  })

  xit('recovery phrase is openable', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('modal-authentication')
      .should('exist')
  })

  xit('incorrect verification code does not allow continuation', function () {
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

  xit('correct verification code allows viewing of the recovery phrase', function () {
    prepDialog()
    viewRecoveryPhrase()
  })

  it('incorrect word entrance does not allow continuation', function () {
    prepDialog()
    viewRecoveryPhrase(true)
      .then((words) => enterRecoveryWords(words.map((word) => word + Math.random().toString(36).substr(2))))
      .then(() => {
        cy
          .get()
          .should()
      })
  })

  it('correct word entrance allows the recovery phrase to be set', function () {
    prepDialog()
    viewRecoveryPhrase(true)
      .then(enterRecoveryWords)
      .then(() => {
        cy
          .get()
          .should()
      })
  })
})