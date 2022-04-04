/// <reference types="Cypress" />

context('Startup', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/sign-in'); //Visit this site before the test is run
    });

    // Run the test
    it('Check entries for username and password', () => {

      // Test psername matches what user entered
      cy.get('input').eq(0) //Select first input field, which is the username
        .type('match_username') //Type in username
        .should('have.value', 'match_username'); //Check if username matches what was type

      // Test password matches what user entered
      cy.get('input').eq(1) //Select second input field, which is the password
        .type('match_password') //Type in password
        .should('have.value', 'match_password'); //Check if password matches what was type

      // Type in empty username and password
      cy.get('input').eq(0) //Select first input field, which is the username
        .clear() //Clear username field
        .type(' ') //Type in empty username
      cy.get('input').eq(1) //Select second input field, which is the password
        .clear() //Clear password field
        .type(' ') //Type in empty password
        .type('{enter}'); // Press enter
      cy.contains("Sign In Un-Successful"); //Check that that the label "Sign In Un-Successful" appeared

      // Type in wrong username and passwords
      cy.get('input').eq(0) //Select first input field, which is the username
        .clear() //Clear username field
        .type('wrong_username') //Type in a wrong username
      cy.get('input').eq(1) //Select second input field, which is the password
        .clear() //Clear password field
        .type('wrong_password') //Type in a wrong password
        .type('{enter}'); // Press enter
      cy.contains("Sign In Un-Successful"); //Check that that the label "Sign In Un-Successful" appeared

    // Type in correct username and passwords
    cy.get('input').eq(0) //Select first input field, which is the username
        .clear() //Clear username field
        .type('user') //Type in a correct username
    cy.get('input').eq(1) //Select second input field, which is the password
        .clear() //Clear password field
        .type('password') //Type in a correct password
        .type('{enter}'); // Press enter
    cy.location('pathname', { timeout: 10000 }).should('eq', '/roster/start'); //Check that that we are in the /Roster URL
    });

  });
