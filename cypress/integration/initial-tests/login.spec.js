/*eslint-disable */
describe('Login Test', () => {

  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.visit('/')
    cy.get('input[type="password"]').type('bullish{enter}')
  })

  it.skip('greets user with Log In', () => {
    cy.contains('h2', 'Log In', { timeout: 20000 })
  })

  it.skip('links to Sign Up flow', () => {
    cy
    .contains('Sign Up', { timeout: 20000 })
    .should('have.attr', 'href', '/signup')
  })

  it.skip('links to Forget Password flow', () => {
    cy
    .contains('Forgot Password?', { timeout: 20000 })
    .should('have.attr', 'href', '/forgot-password')
  })

  it.skip('requires email', () => {
    cy
    .get('input[type="password"]', { timeout: 20000 })
    .type('password{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Email is missing')
  })

  it.skip('requires password', () => {
    cy
    .get('input[type="email"]', { timeout: 20000 })
    .type('test@evenset.com{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Password is missing')
  })

  it.skip('requires valid email', () => {
    cy
    .get('input[type="email"]', { timeout: 20000 })
    .type('test')
    .get('input[type="password"]')
    .type('password{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Enter a valid email address')
  })

  it.skip('requires valid email and password', () => {
    cy
    .get('input[type="email"]', { timeout: 20000 })
    .type('test@evenset.com')
    .get('input[type="password"]')
    .type('password')

    cy
    .get('button[type="submit"]').click()

    cy
    .get('.alert', { timeout: 10000 })
    .should('contain', 'Invalid login.')
  })

  it('successfully log in using UI', function () {

    cy.get('input[type="email"]', { timeout: 20000 })
    .type(this.users[0].email)
    .get('input[type="password"]')
    .type(this.users[0].password)
    .get('button[type="submit"]').click()
    
    cy.url().should('contain', '/portfolio')
  })

  it.skip('successfully log in programmatically', function () {
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        email: this.users[0].email,
        password: this.users[0].password
      }
    })

    cy.url().should('include', '/portfolio')
  })
})
/*eslint-enable */
