'use strict'

describe('Forget Password Test', () => {
    beforeEach(() => {
      cy.fixture('users').as('users')
      cy.visit('/')
      cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
      cy.get('button[type="submit"]').click()
      cy.contains('Forgot Password').click()
      cy.url().should('contain', '/forgot-password')
    })
  
    it('greets user with Forgot Password', () => {
      cy.contains('h2', 'Forgot Password')
      cy.contains('p', 'Enter the email that you used to create your account and we will send you instructions to reset your password.')
    })
    
    it('forget password without portfolio')
    it('forget password without mnemonic')
    it('forget psasword with mnemonic')
  })
  