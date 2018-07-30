/*eslint-disable */
describe('Login Test', () => {

  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.visit('/')
    cy.get('input[type="password"]').type(Cypress.env('HTTP_PASSWORD'))
    cy.get('button[type="submit"]').click()
  })

  it('greets user with Log In', () => {
    cy.contains('h2', 'Log In')
  })

  it('links to Sign Up flow', () => {
    cy
    .contains('Sign Up')
    .should('have.attr', 'href', '/signup')
  })

  it('links to Forget Password flow', () => {
    cy
    .contains('Forgot Password?')
    .should('have.attr', 'href', '/forgot-password')
  })

  it('requires email', () => {
    cy
    .get('input[type="password"]')
    .type('password{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Email is missing')
  })

  it('requires password', () => {
    cy
    .get('input[type="email"]')
    .type('test@evenset.com{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Password is missing')
  })

  it('requires valid email', () => {
    cy
    .get('input[type="email"]')
    .type('test')
    .get('input[type="password"]')
    .type('password{enter}')

    cy
    .get('.form-text')
    .should('contain', 'Enter a valid email address')
  })

  it('requires valid email and password', () => {
    cy
    .get('input[type="email"]')
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
    cy.login(this.users)
    
  })
})
/*eslint-enable */
