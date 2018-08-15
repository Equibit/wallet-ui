/*eslint-disable */
describe('Atomic Swap Test', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.resetOrdersAndOffers()
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  describe('Sell Orders', () => {
      beforeEach(() => {
          cy.fixture('users').then(users => {
              cy.login(users.validUsers[0])
          })
          cy.get('[data-cy=equibit-link]').click()
          cy.url().should('contain', 'equibit')
      })

      it('Fill or Kill sell order', () => {
        cy
          .get('[data-cy=sell-order-row]')
          .should('not.exist')
        cy
          .contains('Add Sell Order')
          .should('have.attr', 'on:click', 'showModal(\'SELL\')')
          .click()
        cy
          .get('[data-cy=order-modal-title]')
          .should('contain', 'Place Sell Order')
        cy
          .get('[data-cy=order-button-sell]')
          .should('have.class', 'btn-selected')
        cy
          .get('[data-cy=input-quantity]')
          .type('.0001')
        cy
          .get('[data-cy=input-price]')
          .type('{backspace}1000000')
        cy
          .get('[data-cy=total-price]')
          .click()
          .should('have.value', '100')
        cy
          .get('input[type="checkbox"]')
          .check()
        cy
          .get('[data-cy=button-1]')
          .click()
        cy
          .contains('Next')
          .should('have.attr', 'on:click', '../next()')
          .click()
        cy
          .contains('Please review and confirm your order.')
          .should('exist')
          .get('[data-cy=confirm-quantity]')
          .should('contain', '0.0001')
          .get('[data-cy=confirm-price')
          .should('contain', '1000000.00')
          .get('[data-cy=confirm-total]')
          .should('contain', '100.00')
          .get('[data-cy=place-order-button]')
          .click()
        cy
          .get('.alert-message')
          .should('contain', 'Your order was created')
        cy
          .get('[data-cy=sell-order-row]')
          .should('exist')
          .should('contain', '0.0001')
          .should('contain', '1000000')
    })
  })
    
  describe('Buy Orders', () => {
    beforeEach(() => {
      cy.fixture('users').then(users => {
          cy.login(users.validUsers[2])
      })
      cy.get('[data-cy=equibit-link]').click()
      cy.url().should('contain', 'equibit')
    })

    it('Fill or Kill buy order', () => {
      cy
        .get('[data-cy=buy-order-row]')
        .should('not.exist')
      cy
        .contains('Add Buy Order')
        .should('have.attr', 'on:click', 'showModal(\'BUY\')')
        .click()
      cy
        .get('[data-cy=order-modal-title]')
        .should('contain', 'Place Buy Order')
      cy
        .get('[data-cy=order-button-buy]')
        .should('have.class', 'btn-selected')
      cy
        .get('[data-cy=input-quantity]')
        .type('.0001')
      cy
        .get('[data-cy=input-price]')
        .type('{backspace}1000000')
      cy
        .get('[data-cy=total-price]')
        .click()
        .should('have.value', '100')
      cy
        .get('input[type="checkbox"]')
        .check()
      cy
        .get('[data-cy=button-1]')
        .click()
      cy
        .contains('Next')
        .should('have.attr', 'on:click', '../next()')
        .click()
      cy
        .contains('Please review and confirm your order.')
        .should('exist')
        .get('[data-cy=confirm-quantity]')
        .should('contain', '0.0001')
        .get('[data-cy=confirm-price')
        .should('contain', '1000000.00')
        .get('[data-cy=confirm-total]')
        .should('contain', '100.00')
        .get('[data-cy=place-order-button]')
        .click()
      cy
        .get('.alert-message')
        .should('contain', 'Your order was created')
      cy
        .get('[data-cy=buy-order-row]')
        .should('exist')
        .should('contain', '0.0001')
        .should('contain', '1000000')
    })
  })
})
/*eslint-enable */