'use strict'
import * as helper from '../../../support/utils/trade-helpers'

describe('Equibit Page Test', () => {
    before(() => {
      cy.clearOrdersAndOffers()        
      cy.addOrders('many', 20)
    })

    beforeEach(() => {
      cy.loginQA()
      cy.fixture('users').as('users')
    })
    describe('Load More Button', () => {
        it('load more button does not show when less than or equal to 20 orders', () => {
            cy.get('[data-cy=sell-order-row]')
              .should('exist')
            cy.get('[data-cy=load-more-sell]')
              .should('not.exist')
            cy.get('[data-cy=load-more-buy]')
              .should('not.exist')
        }) 
        describe('More Orders', () => {
            before(() => {
                cy.addOrders('many', 101)
            })

            beforeEach(() => {
                cy.visit('/equibit')
            })
            it('load more button shows when more than 20 orders', () => {
                cy.get('[data-cy=sell-order-row]')
                .should('exist')
                cy.get('[data-cy=load-more-sell]')
                .should('be.visible')
                .and('have.attr', 'on:click', 'loadMoreSell()')
    
                cy.get('[data-cy=buy-order-row]')
                .should('exist')
                cy.get('[data-cy=load-more-buy]')
                .should('be.visible')
                .and('have.attr', 'on:click', 'loadMoreBuy()')
            })
            it('load more button disappears if there are no more orders to load', () => {
                cy.get('[data-cy=sell-order-row]')
                .should('be.visible')
    
                cy.get('[data-cy=load-more-sell]')
                .scrollIntoView()
                .click()
                cy.get('[data-cy=load-more-sell]')
                .scrollIntoView()
                .should('be.visible')
                .click()
                cy.get('[data-cy=load-more-sell]')
                .should('not.exist')
    
                cy.get('[data-cy=buy-order-row]')
                .should('be.visible')
    
                cy.get('[data-cy=load-more-buy]')
                .scrollIntoView()
                .click()
                cy.get('[data-cy=load-more-buy]')
                .scrollIntoView()
                .should('be.visible')
                .click()
                cy.get('[data-cy=load-more-buy]')
                .should('not.exist')
            })
        })
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
        it('cannot make offer for orders', () => {
            cy.get('[data-cy=logged-out-buy]')
              .first()
              .should('be.visible')
              .click()
            
            cy.contains('Log in to continue.')
              .should('exist')
              .contains('Log in')
              .should('have.attr', 'href', '/login')

            cy.get('[data-cy=logged-out-buy]')
              .first()              
              .click()

            cy.get('[data-cy=logged-out-sell]')
              .first()
              .scrollIntoView()
              .should('be.visible')
              .click()
            cy.contains('Log in to continue.')
              .should('exist')
              .contains('Log in')
              .should('have.attr', 'href', '/login')
        })
    })
    describe('Logged In', () => {
        beforeEach(() => {
            cy.clearOrdersAndOffers()
        })
        describe.only('With Funds', () => {
            beforeEach(function () {
                cy.login(this.users.validUsers[0])
            })
            it('does not have login and signup button', () => {
              helper.goToEquibitPage()
              
                cy.get('[data-cy=login-equibit]')
                  .should('not.exist')
    
                cy.get('[data-cy=signup-equibit]')
                 .should('not.exist')
            })
            it('can add sell or buy order', () => {
                helper.checkFunds()
                helper.goToEquibitPage()

                cy.contains('Add Sell Order')
                  .should('exist')
                  .and('have.attr', 'on:click', 'showModal(\'SELL\')')
                  .click()
                
                helper.addOrder(true, '0.0001', '1000000', 'sell')
                cy.get('[data-cy=sell-order-row]')
                  .should('exist')
                  .should('contain', 'View')
                cy.contains('View')
                  .click()
                cy.contains('View Details').should('be.visible')

                cy.contains('Add Buy Order')
                  .should('exist')
                  .and('have.attr', 'on:click', 'showModal(\'BUY\')')
                  .click()
                
                  helper.addOrder(true, '0.0001', '1000000', 'buy')
                cy.get('[data-cy=buy-order-row]')
                  .should('exist')
                  .should('contain', 'View')
                cy.contains('View')
                  .click()
                cy.contains('View Details').should('be.visible')
            })
            it('can make offer for orders', () => {
              cy.addOrders('sell')
              cy.addOrders('buy')

              helper.checkFunds()
              helper.goToEquibitPage()
            })
        })
        describe('Without Funds', () => {
            beforeEach(function () {
                cy.login(this.users.validUsers[2])
                helper.goToEquibitPage()
            })
            it('cannot add sell or buy order', () => {
            
            })
            it('cannot make offer for orders', () => {

            })
        })
    })
})
