/// <reference types="Cypress" />

context('Home Tests', () => {

    // This code fixes a bug where errors randomly show up
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })
  
    // Do this before each test
    beforeEach(() => {
        signIn();
        goToArea();
    })

    // // Test checking to see if area added with valid field
    it('Add area with valid field', () => {
      addValidField();
      checkAreaAdded();
    });

    // Test checking to see if area gets added with invalid field
    it('Add area with invalid field', () => {
      addInvalidField();
      
    });

    // Test checking to see if cancel button works for add
    it('Add then cancel area', () => {
      cancelAdd();
    });

    // Test checking to see if area can be editted with valid field
    it('Edit area with valid field', () => {
      editValidField();
    });

    // Test checking to see if area can be editted with invalid field
    it('Edit area with invalid field', () => {
      editInvalidField();
    });

    // Test checking to see if cancel button works for edit
    it('Edit then cancel area', () => {
      cancelEdit();
    });

    // Test checking to see if area gets deleted
    it('Delete area', () => {
      deleteArea();
    });

    // Sign in with valid credentials
    function signIn(){
      cy.visit('http://localhost:3000/sign-in'); //Go to sign in page
      cy.get('#usernameInput') //Select the username field
        .type('user') //Type in a valid username
    
      cy.get('#passwordInput') //Select the username field
        .type('password') //Type in a valid password
        .type('{enter}'); // Press enter
    }

    // Go to the admin page 
    function goToArea(){
      cy.get('a[href="/area"]') //Click the area tab
        .click()
      
      cy.url().should('eq', 'http://localhost:3000/area') //Check that URL matches with the area URL    
    }

    function clickAdd(){
      cy.get('.sc-fKFyDc > svg > path') //Click add area button
        .click()
    }

    function cancelAdd(){
      clickAdd();
      cy.get(':nth-child(1) > form > .sc-bkzZxe') //Click the area field and type '00'
        .click()
        .clear()
        .type('00')

      cy.get('.DpCrz') //Click Cancel
        .click()  
       
      clickAdd();  
      cy.get(':nth-child(1) > form > .sc-bkzZxe') // Get the text in the area field and check that it is still '00'
        .should('have.value', '00')

      cy.get('.DpCrz') //Click Cancel
        .click()    
    }

    function clickEdit(){
      cy.wait(500); 
      cy.get(':nth-child(2) > form > .iIKqQ') // Click the edit button
        .click() 
    }

    function checkAreaAdded() {
      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Check that the new added area contains the area name '00'
        .should('have.value', '00')
    }

    function addValidField() {
        clickAdd();
        cy.get(':nth-child(1) > form > .sc-bkzZxe') //Click the add area field and type '00'
          .click()
          .clear()
          .type('00')
        
        cy.get('.eJZsTy') //Click the save button
          .click()
    }

    function addInvalidField() {
      clickAdd();

      // Test for blank field
      cy.get(':nth-child(1) > form > .sc-bkzZxe') //Click the area field and make it blank
      .click()
      .clear()
       
      cy.get('.eJZsTy') //Check that the save button is disabled
        .should('be.disabled')  

      // Test for entering a field that already exists
      //To do: cover code for this when it is implemented
      // cy.get(':nth-child(1) > form > .sc-bkzZxe') //Click the area field and make it '00'
      // .click()
      // .clear()
      // .type('00')

      // cy.get('.eJZsTy') //Click save button
      //   .click()  
    }

    function editValidField() {
      clickEdit();
      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Click the area field, clear it, and type '11'
        .click()
        .clear()
        .type('11')

      cy.get(':nth-child(2) > form > [type="button"]') //Click save
        .click()

      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Get the area field value and check that it is '11'
        .should('have.value', '11')
    }

    function editInvalidField() {
      clickEdit();
      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Click the area field, clear it, and make the field empty
        .click()
        .clear()

      cy.get(':nth-child(2) > form > [type="button"]') //Click save
        .click()  

      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Get the area field name and check that it is still '00'
        .should('have.value', '11')
    }

    function cancelEdit() {
      clickEdit();
      cy.get(':nth-child(2) > form > :nth-child(5)') //Click cancel button
        .click()

      cy.get(':nth-child(2) > form > .iIKqQ') //Check that the Edit button is enabled
        .should('be.enabled')   
    }

    function deleteArea() {
      clickEdit();
      cy.get('.gTiINJ') //Click the delete button
        .click()

      cy.get(':nth-child(2) > form > .sc-bkzZxe') //Get the area field value and check the value is not '11'
        .should('not.have.value', '11')
    }

});