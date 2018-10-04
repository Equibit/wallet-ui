'use strict'
import goToEquibitPage from '../../../support/utils/trade-helpers'

describe('Equibit Page Test', () => {
    beforeEach(() => {
      cy.clearOrdersAndOffers()
      cy.loginQA()
      cy.fixture('users').as('users')
    })
    describe('Without Logging In', () => {
        beforeEach(() => {
            cy.visit('/equibit')
        })

        it('has login and signup button', () => {
            cy.get('[data-cy=login-equibit]')
              .should('contain', 'Log In')
              .and('be.visible')
              .and('have.attr', 'href', '/')

            cy.get('[data-cy=signup-equibit]')
              .should('contain', 'Sign Up')
              .and('be.visible')
              .and('have.attr', 'href', '/signup')
        })

        it('cannot add sell or buy order', () => {
            cy.contains('Add Sell Order')
              .click()

            cy.contains('Log in to continue.')
              .should('be.visible')
            
            cy.get('[data-cy=login-popover]')
              .should('be.visible')
              .and('have.attr', 'href', '/login')

            cy.contains('Add Sell Order')
              .click()

            cy.contains('Add Buy Order')
              .click()

            cy.contains('Log in to continue.')
              .should('be.visible')
            
            cy.get('[data-cy=login-popover]')
              .should('be.visible')
              .and('have.attr', 'href', '/login')
        })

        describe('With Orders', () => {
            beforeEach(() => {
                cy.addOrders('many')
            })
        })
    })
    describe('Logged In', () => {
        describe('With Funds', () => {
            beforeEach(function () {
                cy.login(this.users.validUsers[0])
                goToEquibitPage()
            })
    
            describe('With Orders', () => {
                
            })
        })
        describe('Without Funds', () => {
            beforeEach(function () {
                cy.login(this.users.validUsers[2])
                goToEquibitPage()
            })

            describe('With Orders', () => {
                
            })
        })
    })
})
