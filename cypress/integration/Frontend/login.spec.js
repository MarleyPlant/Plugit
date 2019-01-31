/// <reference types="Cypress" />
const credentials = {
  username: "admin",
  password: "admin"
}


describe('Plugit', () => {
  it('Login System', function() {
    cy.visit('http://localhost:5000')

    cy.login('admin', 'admin')
  })
});
