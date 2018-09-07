'use strict'

describe('Verify Email Test', () => {
  let user

  beforeEach(function () {
    cy.loginQA()
    cy
      .fixture('users')
      .as('users')
      .then((users) => {
        user = users.validUsers[0]
        cy.login(user)
      })
  })

  it('', function () {
    
  })
})