'use strict'
import goToEquibitPage from '../../../support/utils/trade-helpers'

describe('Equibit Page Test', () => {
    before(() => {
      cy.clearOrdersAndOffers()        
      cy.addOrders('many', 12)
    })

    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users')
    })
    describe('Logged Out', () => {
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
              .scrollIntoView()
              .click()

            cy.contains('Log in to continue.')
              .should('be.visible')
            
            cy.get('[data-cy=login-popover]')
              .should('be.visible')
              .and('have.attr', 'href', '/login')

            cy.contains('Add Sell Order')
              .scrollIntoView()
              .click()

            cy.contains('Add Buy Order')
              .scrollIntoView()
              .click()

            cy.contains('Log in to continue.')
              .should('be.visible')
            
            cy.get('[data-cy=login-popover]')
              .should('be.visible')
              .and('have.attr', 'href', '/login')
        })

        it('load more button does not show when less than 22 orders', () => {
            cy.get('[data-cy=order-loading-indicator]').should('not.be.visible')
            cy.get('[data-cy=load-more-sell]')
                .should('not.be.visible')
            cy.get('[data-cy=load-more-buy]')
                .should('not.be.visible')
        })

        it('load more button shows when more than 23 orders', () => {
            cy.get('[data-cy=order-loading-indicator]').should('not.be.visible')
            cy.get('[data-cy=load-more-sell]')
                .should('be.visible')
            cy.get('[data-cy=load-more-buy]')
                .should('be.visible')
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
