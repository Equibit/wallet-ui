'use strict'

describe('Forget Password Test', () => {

  beforeEach(() => {
    cy.loginQA()
    cy.fixture('users').as('users').then((users) => {
      const {email, temppassword: temp} = users.forgotPassword
    })
    cy.contains('Forgot Password').click()
    cy.url().should('contain', '/forgot-password')
  })

  it('greets user with Forgot Password', () => {
    cy.contains('h2', 'Forgot Password')
    cy.contains('p', 'Enter the email that you used to create your account and we will send you instructions to reset your password.')
  })

  describe('Backup Recovery Phrase Tests', () => {
    beforeEach(() => {
      cy.fixture('users').as('users').then((users) => {
        const {email, temppassword: temp, password: pass, validPhrase, tempPasswordHash: temphash} = users.forgotPassword
        
        cy.get('input[type="email"]')
          .type(email)
        cy.get('button[type="submit"]')
          .should('contain', 'Send Instructions')
          .click()
        cy.contains('p', 'Check your email to continue, and then head to')
        cy.contains('login')
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

    it('prompts user to enter phrase', () => {
      cy.contains('h2', 'Enter Your Backup Recovery Phrase')
      cy.contains('p', 'Enter the 12 words from your backup recovery phrase with spaces.')
    })

    it('has recover funds button', () => {
      cy.get('button[type="submit"]')
        .should('contain', 'Recover Funds')
    })

    it('has button for no backup phrase', () => {
      cy.contains('Don\'t have a backup phrase?')
        .should('have.attr', 'on:click', "switch('warning')")
    })

    it('forget password without backup recovery phrase', () => {
      cy.contains('Don\'t have a backup phrase?')
        .click()
      cy.contains('h2', 'Warning')
      cy.contains('p', 'If you don\'t have a backup recovery phrase, you cannot access your account.' )
      cy.contains('Re-Log In')
        .should('exist')
        .should('have.attr', 'on:click', 'relogin()')
      cy.contains('Back')
        .should('exist')
        .should('have.attr', 'on:click', "switch('prompt')")
    })
    
    it('invalid backup recovery phrases', () => {
      cy.contains('Recover Funds')
        .click()
        .should('have.attr', 'disabled')
      cy.contains('div', 'Phrase is missing.').should('be.visible')

      cy.get('input[type="text"]')
        .type('word{enter}')
      cy.contains('div', 'The mnemonic phrase should contain at least 12 words.')

      cy.get('input[type="text"]')
        .type(' word word word word word word word word word word word{enter}')
      cy.contains('div', 'You entered a wrong mnemonic.')

      cy.get('input[type="text"]')
        .type('word{enter}')
      cy.contains('div', 'Invalid phrase. Make sure to enter all of the words in the correct order and separated with spaces.')
    })

    it.skip('valid backup recovery phrase', () => {
      cy.get('input[type="text"]')
        .type(this.validPhrase)
      cy.get('button[type="submit"]')
        .click()
      cy.url().should('contain', '/change-password')
      cy.contains('h2', 'Reset Password')
      cy.contains('p', 'Create a new password for your account.')
      cy.get('input[type="password"]')
        .type(this.newPassword)
      cy.get('button[type="submit"]')
        .should('contain', 'Change Password')
        .click()
      cy.get('.alert-message')
        .should('contain', 'Password Reset')
    })
  })
})
