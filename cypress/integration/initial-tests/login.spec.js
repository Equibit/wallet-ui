/*eslint-disable */
describe('Login Test', () => {
  it('successfully log in', () => {
    cy.visit('/')
    .get('input[type="email"]', { timeout: 20000 })
    .type('elliott@evenset.com')
    .get('input[type="password"]')
    .type('password123')
    .get('button[type="submit"]').click()
      .location().should((loc) => {
        expect(loc.pathname).to.eq('/portfolio')
      })
  })
})
/*eslint-enable */
