describe('Signup Test', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.loginQA()
    cy.contains('Sign Up').click()
    cy.url().should('contain', '/signup')
  })

  it('greets user with Create an Account', () => {
    cy.contains('h2', 'Create an Account')
  })

  it('contains link to T&C', () => {
    cy
      .contains('Terms & Conditions')
      .click()
    cy
      .contains('h3', 'Terms & Conditions')
      .should('be.visible')
  })

  it('contains link to Privacy Policy', () => {
    cy
      .contains('Privacy Policy')
      .click()
    cy
      .contains('h3', 'Privacy Policy')
      .should('be.visible')
  })

  it('signup invalid temp password', function () {
    cy
      .get('input[type="email"]')
      .type(this.users.signup.email)
    cy
      .get('input[type="checkbox"]')
      .check()
    cy
      .get('button[type="submit"]')
      .click()

    cy.contains('p', 'Check your email to continue, and then head to login.')
    cy
      .contains('login')
      .should('have.attr', 'href', '/')
      .click()
    cy.url().should('contain', '/')

    cy
      .get('input[type="email"')
      .should('have.value', this.users.signup.email)
      .get('input[type="password"')
      .type(this.users.signup.invalidpassword)
      .get('button[type="submit"]')
      .click()

    cy
      .get('.alert')
      .should('contain', 'Invalid login.')
  })

  it('signup invalid new password', function () {
    cy
      .get('input[type="email"]')
      .type(this.users.signup.email)
    cy
      .get('input[type="checkbox"]')
      .check()
    cy
      .get('button[type="submit"]')
      .click()

    cy.contains('p', 'Check your email to continue, and then head to login.')
    cy
      .contains('login')
      .should('have.attr', 'href', '/')
      .click()
    cy.url().should('contain', '/')

    cy
      .get('input[type="email"')
      .should('have.value', this.users.signup.email)
      .get('input[type="password"')
      .type(this.users.signup.temppassword)
      .get('button[type="submit"]')
      .click()
    cy.url().should('contain', 'change-password')

    cy
      .contains('h2', 'Create a Password')
      .should('exist')
    cy
      .contains('p', 'Create a password for your account.')
      .should('exist')

    cy
      .get('input[type="password"]')
      .type(this.users.signup.invalidpassword)
      .get('[data-cy=password-strength]')
      .should('have.class', 'strength-indicator-1')
      .get('button[type="submit"]')
      .should('contain', 'Save & Log In')
      .click()

    cy.url().should('contain', 'change-password')
    cy.contains('Password too weak').should('be.visible')
  })

  it('signup flow', function () {
    cy
      .get('input[type="email"]')
      .type(this.users.signup.email)
    cy
      .get('input[type="checkbox"]')
      .check()
    cy
      .get('button[type="submit"]')
      .click()

    cy.contains('p', 'Check your email to continue, and then head to login.')
    cy
      .contains('login')
      .should('have.attr', 'href', '/')
      .click()
    cy.url().should('contain', '/')

    cy
      .get('input[type="email"')
      .should('have.value', this.users.signup.email)
      .get('input[type="password"')
      .type(this.users.signup.temppassword)
      .get('button[type="submit"]')
      .click()
    cy.url().should('contain', 'change-password')

    cy
      .contains('h2', 'Create a Password')
      .should('exist')
    cy
      .contains('p', 'Create a password for your account.')
      .should('exist')

    cy
      .get('input[type="password"]')
      .type(this.users.signup.password)
      .get('[data-cy=password-strength]')
      .should('have.class', 'strength-indicator-4')
      .get('button[type="submit"]')
      .should('contain', 'Save & Log In')
      .click()

    cy.url().should('contain', 'portfolio')
  })
})
