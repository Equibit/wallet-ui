/* eslint-disable */

describe('Auto Logout Test', () => {

  beforeEach(() => {
    cy.visit('/')
    cy
      .get('input[type="password"]')
      .type(Cypress.env('HTTP_PASSWORD'))
    cy
      .get('button[type="submit"]')
      .click()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        cy.login(users.validUsers[0])
        cy
          .get('nav-bar li.dropdown > a.icon-user')
          .should('have.attr', 'href', '#')
          .click()
        cy
          .get('nav-bar ul.user-nav li:nth-child(6) > a')
          .should('have.attr', 'href', '/preferences')
          .click()
      })
  })
  
  it('auto logout dialog can open', function () {
    cy
      .get('user-autologout button.btn-edit')
      .click()
    cy
      .get('#autoLogoutTime')
      .should('be.visible')
  })

  it('auto logout time can be adjusted', function () {
    cy
      .get('user-autologout button.btn-edit')
      .click()
    cy.get('#autoLogoutTime')
    cy
      .get('#autoLogoutTime')
      .clear()
      .type('20')
    cy
      .get('.modal-footer button:first')
      .should('have.class', 'btn-primary')
      .click()
    cy
      .get('user-autologout span.input-value')
      .should('contain', '20')
  })

})

/* eslint-enable */

