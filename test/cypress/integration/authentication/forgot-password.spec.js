'use strict'

describe('Forget Password Test', () => {
  beforeEach(() => {
    cy.loginQA()
    cy.contains('Forgot Password').click()
    cy.url().should('contain', '/forgot-password')
  })

  it('greets user with Forgot Password', () => {
    cy.contains('h2', 'Forgot Password')
      .should('be.visible')
    cy.contains('p', 'Enter the email that you used to create your account and we will send you instructions to reset your password.')
      .should('be.visible')
  })

  describe('Backup Recovery Phrase Tests', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then((users) => {
        const {email, temppassword: temp, tempPasswordHash: temphash} = users.forgotPassword

        cy.get('input[type="email"]')
          .type(email)
        cy.get('button[type="submit"]')
          .should('contain', 'Send Instructions')
          .click()
        cy.contains('p', 'Check your email to continue, and then head to')
          .should('be.visible')
        cy.contains('login')
          .should('be.visible')
          .should('have.attr', 'href', '/')
          .click()
        cy.url().should('contain', '/')

        cy.exec(`mongo wallet_api-testing --eval 'db.users.update({"email": "forgotpassword@evenset.com"},{$set: {"tempPassword": "${temphash}"}})'`)

        cy.get('input[type="email"')
          .should('have.value', email)
          .get('input[type="password"')
          .type(temp)
          .get('button[type="submit"]')
          .click()
      })
    })

    it('recovery phrase landing page', () => {
      cy.contains('h2', 'Enter Your Backup Recovery Phrase')
        .should('be.visible')
      cy.contains('p', 'Enter the 12 words from your backup recovery phrase with spaces.')
        .should('be.visible')
      cy.get('button[type="submit"]')
        .should('contain', 'Recover Funds')
      cy.contains('Don\'t have a backup phrase?')
        .should('be.visible')
        .should('have.attr', 'on:click', "switch('warning')")
    })

    it('forget password without backup recovery phrase', () => {
      cy.contains('Don\'t have a backup phrase?')
        .click()
      cy.contains('h2', 'Warning')
        .should('be.visible')
      cy.contains('p', 'If you don\'t have a backup recovery phrase, you cannot access your account.')
        .should('be.visible')
      cy.contains('Re-Log In')
        .should('be.visible')
        .should('have.attr', 'on:click', 'relogin()')
      cy.contains('Back')
        .should('be.visible')
        .should('have.attr', 'on:click', "switch('prompt')")
    })

    it('invalid backup recovery phrases', () => {
      cy.contains('Recover Funds')
        .click()
        .should('have.attr', 'disabled')
      cy.contains('div', 'Phrase is missing.')
        .should('be.visible')

      cy.get('input[type="text"]')
        .type('word{enter}')
      cy.contains('div', 'The mnemonic phrase should contain at least 12 words.')
        .should('be.visible')

      cy.get('input[type="text"]')
        .type(' word word word word word word word word word word word{enter}')
      cy.contains('div', 'You entered a wrong mnemonic.')
        .should('be.visible')

      cy.get('input[type="text"]')
        .type('word{enter}')
      cy.contains('div', 'Invalid phrase. Make sure to enter all of the words in the correct order and separated with spaces.')
        .should('be.visible')
    })

    it('valid backup recovery phrase', function () {
      const {password, newPassword, validPhrase} = this.users.forgotPassword
      cy.get('input[type="text"]')
        .type(validPhrase)
      cy.get('button[type="submit"]')
        .click()
      cy.url().should('contain', '/change-password')
      cy.contains('h2', 'Reset Password')
        .should('be.visible')
      cy.contains('p', 'Create a new password for your account.')
        .should('be.visible')

      // Old Password
      cy.get('input[type="password"]')
        .type(password)
      cy.get('button[type="submit"]')
        .should('contain', 'Change Password')
        .click()
      cy.contains('div', 'You may not use the same password as one of the last 3 passwords.').should('be.visible')

      // New Password
      cy.get('input[type="password"]')
        .clear()
        .type(newPassword)
      cy.get('button[type="submit"]')
        .should('contain', 'Change Password')
        .click()
      cy.get('.alert-message')
        .should('contain', 'Password Reset')

      cy.url().should('contain', '/portfolio')
    })
  })
})
