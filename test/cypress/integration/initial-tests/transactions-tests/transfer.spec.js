/*eslint-disable */
describe('Transfer Funds Test', () => {

  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.resetTransactions()
    cy.loginQA()
  })

  describe('With funds', () => {  
    beforeEach(function () {
      // user 0 (sender/seller) and 2 (receiver/buyer) have funds, user 1 does not
      cy.login(this.users.validUsers[0])
      cy.contains('Send').click()
    })

    it('cannot send EQB without address', () => {
      cy.contains('Equibit').click()
      cy.contains('Next').click()
      cy
        .get('[data-cy=form-error-text]')
        .should('contain', 'Address is missing')
    })

    it('cannot send BTC without address', () => {
      cy.contains('Bitcoin').click()
      cy.contains('Next').click()
      cy
        .get('[data-cy=form-error-text]')
        .should('contain', 'Address is missing')
    })

    it('cannot send EQB to invalid address', () => {
      cy.get('input[placeholder="Paste address"]').type('invalidAddress')      
  
      cy.contains('Equibit').click()
      cy.contains('Next').click()
      cy
        .get('[data-cy=form-error-text]')
        .should('contain', 'Invalid address')
    })

    it('cannot send BTC to invalid address', () => {
      cy.get('input[placeholder="Paste address"]').type('invalidAddress')
      cy.contains('Bitcoin').click()
      cy.contains('Next').click()
      cy
        .get('[data-cy=form-error-text]')
        .should('contain', 'Invalid address')
    })

    it('can send EQB to valid address, and checks that the address receives EQB', function () {
      cy.get('input[placeholder="Paste address"]').type(this.users.validUsers[1].plainEQBaddress)
      cy.contains('Equibit').click()
      cy
        .get('input[type="number"]')
        .type('.00001')
      cy.contains('Next').click()

      cy
        .get('[data-cy=send-modal-title]')
        .should('contain', 'Send Funds')
      cy
        .get('[data-cy=to-address]')
        .should('contain', this.users.validUsers[1].plainEQBaddress)
      cy
        .get('[data-cy=send-value]')
        .should('contain', '0.00001')
      cy
        .get('[data-cy=send-button]')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      cy
        .get('[data-cy=userDropdown]')
        .click()
      cy
        .contains('Transactions')
        .should('be.visible')
        .click()

      cy.url().should('contain', '/transactions')

      cy
        .get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy
        .get('[data-cy=selected-row]')
        .should('contain', 'Transfer Out')
        .should('contain', 'Equibit')
        .get('[data-cy=column-cash-EQB]')
        .should('contain', '0.000025') // Could vary depending on txn fee
      
      cy.logout()
      cy.login(this.users.validUsers[1])

      cy
        .get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Transfer received')
        .get('[data-cy=transfer-amount]')
        .should('contain', '0.00001')
      cy
        .get('[data-cy=userDropdown]')
        .click()
      cy
        .contains('Transactions')
        .should('be.visible')
        .click()

      cy.url().should('contain', '/transactions')

      cy
        .get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy
        .get('[data-cy=selected-row]')
        .should('contain', 'Transfer In')
        .should('contain', 'Equibit')
        .get('[data-cy=column-cash-EQB]')
        .should('contain', '0.00001')
    })

    it('can send BTC to valid address, and checks that the address receives BTC', function () {
      cy.get('input[placeholder="Paste address"]').type(this.users.validUsers[1].plainEQBaddress)
      cy.contains('Bitcoin').click()
      cy
        .get('input[type="number"]')
        .type('.00001')
      cy.contains('Next').click()

      cy
        .get('[data-cy=send-modal-title]')
        .should('contain', 'Send Funds')
      cy
        .get('[data-cy=to-address]')
        .should('contain', this.users.validUsers[1].plainEQBaddress)
      cy
        .get('[data-cy=send-value]')
        .should('contain', '0.00001')
      cy
        .get('[data-cy=send-button]')
        .should('have.attr', 'on:click', 'send(@close)')
        .click()
      cy
        .get('[data-cy=userDropdown]')
        .click()
      cy
        .contains('Transactions')
        .should('be.visible')
        .click()

      cy.url().should('contain', '/transactions')

      cy
        .get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy
        .get('[data-cy=selected-row]')
        .should('contain', 'Transfer Out')
        .should('contain', 'Bitcoin')
        .get('[data-cy=column-cash-BTC]')
        .should('contain', '0.000021') // Could vary depending on txn fee

      cy.logout()
      cy.login(this.users.validUsers[1])

      cy
        .get('[data-cy=notification-icon]')
        .click()
        .contains('Notifications')
        .should('be.visible')
        .get('[data-cy=notification-title]')
        .should('contain', 'Transfer received')
        .get('[data-cy=transfer-amount]')
        .should('contain', '0.00001')
      cy
        .get('[data-cy=userDropdown]')
        .click()
      cy
        .contains('Transactions')
        .should('be.visible')
        .click()

      cy.url().should('contain', '/transactions')

      cy
        .get('[data-cy=transaction-panel-title]')
        .should('contain', 'All Transactions')
      cy
        .get('[data-cy=selected-row]')
        .should('contain', 'Transfer In')
        .should('contain', 'Bitcoin')
        .get('[data-cy=column-cash-BTC]')
        .should('contain', '0.00001')
    })
  })

  describe('Without funds', () => {  
    beforeEach(function () {
      cy.login(this.users.validUsers[2])
      cy.contains('Send').click()
    })

    it('cannot send to valid address without funds', function () {
      cy.get('input[placeholder="Paste address"]').type(this.users.validUsers[1].plainEQBaddress)
      cy
        .get('[data-cy=not-enough-funds-alert]')
        .should('contain', 'You don\'t have Equibits to send funds')
      cy.contains('Bitcoin').click()
      cy
        .get('[data-cy=not-enough-funds-alert]')
        .should('contain', 'You don\'t have Bitcoins to send funds')
    })
  })
})
/*eslint-enable */
