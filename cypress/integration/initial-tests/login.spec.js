describe('Login Test', () => {
    it('successfully log in', () => {
      cy.visit('/')
      .get('input[type="email"]')
      .type('elliott@evenset.com')
      .get('input[type="password"]')
      .type('SpicyTunaMayo')
      .get('button[type="submit"]').click()
        .location().should((loc) => {
          expect(loc.pathname).to.eq('/portfolio')
        })
    })
  })