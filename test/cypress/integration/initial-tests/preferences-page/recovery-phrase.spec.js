'use strict'

import { expect } from 'chai'

let user
const openDialog = function () {
  cy
    .get('[data-cy=view-recovery-phrase-button]')
    .click()
}
const prepDialog = function () {
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
  return new Promise((resolve, reject) => {
    let words = []
    Promise.all(Array(3).fill().map((_, i) => {
      return new Promise((resolve, reject) => {
        cy
          .get('[data-cy=recovery-word-group] .word-display')
          .each(($el) => {
            // we only want the word (not the number or any whitespace)
            words.push($el.text().replace(/[^a-zA-Z]/gi, ''))
          })
        cy
          .get('[data-cy=continue-viewing-phrase-button]')
          .click()
          .then(() => resolve())
      })
    }))
      .then(() => {
        expect(words.length).to.equal(12)
        resolve(words)
      })
  })
}
const enterRecoveryWords = function (words, mutateIndices = []) {
  return new Promise((resolve, reject) => {
    let indices = []
    cy.get('[data-cy=recovery-input-group] label[for=phrase-input1]')
      .each(($lb) => {
        indices.push(parseInt($lb.text().replace(/\D/g, '')) - 1)
      })
    cy.get('[data-cy=recovery-input-group] input#phrase-input1')
      .each(($in, i) => {
        cy
          .wrap($in)
          .type(words[indices[i]] + (mutateIndices.indexOf(i) < 0 ? '' : Math.random().toString(36).substr(-2)))
      })
    cy
      .get('[data-cy=finish-viewing-phrase-button]')
      .click()
      .then(() => resolve(mutateIndices))
  })
}

describe('Recovery Phrase Test', () => {
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
      .then((words) => enterRecoveryWords(
        words,
        Array.from({ length: 4 }, (_, i) => i)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
      )).then((indices) => {
        cy.get('[data-cy=recovery-input-group] .word-display')
          .each(($dv, d) => {
            cy
              .wrap($dv)
              .within(() => {
                cy
                  .get('validation-message')
                  .should((indices.indexOf(d) < 0 ? 'not.' : '') + 'be.visible')
              })
          })
      })
  })

  it('correct word entrance allows the recovery phrase to be set', function () {
    prepDialog()
    viewRecoveryPhrase(true)
      .then(enterRecoveryWords)
      .then(() => {
        cy
          .get('[data-cy=gotit-recovery-button')
          .should('exist')
          .click()
      })
  })

  it('recovery phrase is set', function () {
    cy.goToPrefs()
    cy
      .get('[data-cy=user-phrase-notset-indicator]')
      .should('not.exist')
    cy
      .get('[data-cy=user-phrase-set-indicator]')
      .should('exist')
  })
})
