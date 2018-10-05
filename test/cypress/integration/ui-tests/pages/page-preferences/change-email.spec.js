'use strict'

import { expect } from 'chai'

let user
const openDialog = function () {
  cy
    .get('[data-cy=edit-email-button]')
    .click()
}
const prepDialog = function () {
  cy.url().should('contain', '/portfolio')
  cy.get('[data-cy=loading-overlay]').should('not.be.visible')
  cy.goTo('preferences')
  openDialog()
  cy.resetSecondFactorAuth(user)
}
const resetEmailVerification = function () {
  return cy.exec(
    'mongo wallet_api-testing --eval \'db.users.updateOne(' +
    `{ "_id": ObjectId("${user.dbid}") },` +
    `{ $set: { "emailVerificationCode": "${user.hashedEmailVerificationCode}" } },` +
    '{  })\''
  )
}

describe('Change Email Test', () => {
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

  it('email verification is openable', function () {
    cy.goTo('preferences')
    openDialog()
    cy
      .get('modal-authentication')
      .should('exist')
  })

  it('email verification code is sent when the dialog is dialog opened', function () {
    cy.goTo('preferences')
    cy.resetSecondFactorAuth(user)
    openDialog()
    const newHashedCode = cy.getSecondFactorHashedAuth(user)
    expect(user.hashedTwoFactorCode).to.not.equal(newHashedCode)
  })

  it('email verification code is updated when "try again" is clicked', function () {
    cy.goTo('preferences')
    openDialog()
    const currentHashedCode = cy.getSecondFactorHashedAuth(user)
    cy
      .get('[data-cy=twofactor-tryagain-button]')
      .click({ force: true })
    const newHashedCode = cy.getSecondFactorHashedAuth(user)
    expect(currentHashedCode).to.not.equal(newHashedCode)
  })

  it('incorrect verification code dos not allow email change', function () {
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

  it('correct verification code allows email change', function () {
    prepDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
    cy
      .get('input#emailUpdate')
      .should('exist')
  })

  it('does not send a verification code if the new email is the same as the old one', function () {
    prepDialog()
    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
    cy
      .get('input#emailUpdate')
      .type(user.email)
    cy
      .get('button[data-cy=email-continue-button]')
      .click()
    cy
      .get('modal-authentication')
      .should('not.exist')
  })

  it('changes the email when a new email is entered and a valid verification code is entered', function () {
    prepDialog()

    cy
      .get('code-input input[type=password]')
      .type(user.twoFactorCode)
    cy
      .get('[data-cy=verify-auth-button]')
      .click()
    cy
      .get('input#emailUpdate')
      .type(user.secondEmail)
    cy
      .get('button[data-cy=email-continue-button]')
      .click()
    cy
      .get('code-input')
      .should('exist')
    resetEmailVerification(user)
    cy
      .get('code-input input[type=password]')
      .type(user.emailVerificationCode)
    cy
      .get('[data-cy=email-verify-button]')
      .click()
    cy
      .get('[data-cy=displayed-user-email]')
      .should('contain', user.secondEmail)

    cy.logout()
    cy.login({ ...user, email: user.secondEmail })

    cy
      .get('[data-cy=userDropdown]')
      .should('have.attr', 'href', '#')
      .click()
    cy
      .contains('Log Out')
      .should('have.attr', 'on:click', 'logout()')
  })
})
