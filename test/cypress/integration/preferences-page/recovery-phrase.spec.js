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
        user = users.twoStepVerification
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
      .get('')
      
  })

  it('recovery phrase can be read', function () {
    cy.goToPrefs()
    openDialog()
    cy
      .get('[data-cy=continue-recovery-button]')
      .click()
  })
})