/// <reference types="Cypress" />

context('Admin Tests', () => {

  let alreadyRegistered = false;
  // This code fixes a bug where errors randomly show up
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  // Do this before each test
  beforeEach(() => {
    signIn();
    goToAdmin();
  })

  // Test for adding a user with valid fields
  it('Add user with valid fields', () => {
    addValidFields();
    checkUserAdded();
  });

  // Test for adding a user with invalid fields
  it('Add user with invalid fields', () => {
    addInvalidFields();
  });

  // Test for clicking add and then cancel
  it('Cancel adding user', () => {
    cancelAdd();
  });

  // Test for visiting a user page
  it('Visit user page', () => {
    goToUserPage();
    goToAdmin();
  });

  // Test for clicking edit and then cancel
  it('Cancel editting user', () => {
    cancelEdit();
  });

  // Test for editting a user with valid fields
  it('Edit user with valid fields', () => {
    editValidFields();
    editCheckFields();
  });

  // Test for editting a user with invalid fields
  it('Edit user with invalid fields', () => {
    editInvalidFields();
  });

  // Test for deleting a user
  it('Delete user', () => {
    deleteUser();
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
  function goToAdmin(){
    cy.get('a[href="/admin"]')  //Click the admin tab
      .click()
    
    cy.url().should('eq', 'http://localhost:3000/admin') //Check that URL matches with the admin URL    
  }

  // Put invalid fields when adding a new user
  function addInvalidFields(){
    clickAddUser()
    addInvalidUsername();
    addInvalidName();
    addInvalidPassword();
    addInvalidPhoneNumber();
    addInvalidEmail();
    cy.get('button').contains('Cancel')
      .click()
  }

  // Add a user with an invalid name entry
  function addInvalidName(){
    addFillFields();

    // Test for blank field
    cy.get('input[name="name"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save")
      .click()

    cy.get('button').contains("Save")
      .should('be.enabled')
  }

  // Add a user with an invalid username entry    
  function addInvalidUsername(){
    addFillFields();

    // Test for blank field
    cy.get('input[name="username"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save")
      .should('be.disabled')      

    // Test for entering an existing field
    cy.get('input[name="username"]')
      .click() 
      .clear()
      .type('0')
    
    cy.get('button').contains("Save").should('be.disabled')   
  }

  // Add a user with an invalid password entry
  function addInvalidPassword(){
    addFillFields();

    // Test for blank field
    cy.get('input[name="password"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save")
      .click()

    cy.get('button').contains("Save")
      .should('be.enabled')
  }

  // Add a user with an phone number entry    
  function addInvalidPhoneNumber(){
    addFillFields();

    // Test for blank field
    cy.get('input[name="phone_number"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save").should('be.disabled')  

    // Test for entering only 1 digit
    cy.get('input[name="phone_number"]')
    .click() 
    .clear()
    .type('0')
  
    cy.get('button').contains("Save").should('be.disabled')  
  }

  // Add a user with an invalid email entry
  function addInvalidEmail(){
    addFillFields();
    
    // Test for blank field
    cy.get('input[name="email"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save")
      .click()

    cy.get('button').contains("Save")
      .should('be.enabled')
  }

  // Check to see if a user was added properly by checking their fields
  function checkUserAdded(){
    cy.get('input[placeholder="Name"]').eq(0).should('have.value', 'name')
    cy.get('input[placeholder="Username"]').eq(0).should('have.value', '0')
    cy.get('input[placeholder="Phone Number"]').eq(0).should('have.value', '+1 (111) 111 1111')
    cy.get('input[placeholder="Email"]').eq(0).should('have.value', '1@gmail.com')
    cy.get('input[placeholder="User Type"]').eq(0).should('have.value', 'Trainee')
    cy.get('input[placeholder="Trainer"]').eq(0).should('have.value', 'Not a Trainer')
  }

  // Click the add user button
  function clickAddUser(){
    // Click the add user button
    cy.get('path[d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"]')
      .click()
  }

  // Click the add button and then cancel button
  function cancelAdd(){
    clickAddUser()
    addFillFields();
    cy.get('button').contains('Cancel')
      .click()
    
    clickAddUser()
    addCheckFieldsEmpty();  
    cy.get('button').contains('Cancel')
      .click()
  }

  // When the cancel button is clicked, and then the add user button is clicked, check to see if that worked by seeing if the fields are empty
  function addCheckFieldsEmpty(){
    cy.get('input[name="name"]').eq(0).should('have.value', '')
    cy.get('input[name="username"]').eq(0).should('have.value', '')
    cy.get('input[name="password"]').eq(0).should('have.value', '')
    cy.get('input[name="phone_number"]').eq(0).should('have.value', '')
    cy.get('input[name="email"]').eq(0).should('have.value', '')
  }

  // Fill the username field based on whether we already registered a user or not 
  function fillUsername(){
    let username = '0'
    if (alreadyRegistered === false)
      alreadyRegistered = true;
    else
      username = '01'

    cy.get('input[name="username"]')
      .click() 
      .clear()
      .type(username)  
  }

  // Fill the fields with valid entries when adding a user
  function addFillFields(){
    // Type name 
    cy.get('input[name="name"]')
      .click() 
      .clear()
      .type('name')

    // Type username 
    fillUsername();

    // Type password 
    cy.get('input[name="password"]')
      .click() 
      .clear()
      .type('0')
  
    // Type phone number 
    cy.get('input[name="phone_number"]')
      .click() 
      .clear()
      .type('11111111111')
    
    // Type email
    cy.get('input[name="email"]')
      .click() 
      .clear()
      .type('1@gmail.com')
    
    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Hill Admin')
      .click()

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('System Admin')
      .click()     

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Patroller')
      .click()

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Trainee')
      .click()  

    // Select Trainer
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(1)
      .click()
      .get('button').contains('Trainer')
      .click()

    // Select Trainer
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(1)
      .click()
      .get('button').contains('Not a Trainer')
      .click()   
  }

  // Add a user with valid entries
  function addValidFields(){
    clickAddUser()
    addFillFields();
    
    cy.get('button').contains("Save")
      .click()
    cy.wait(500);  
  }

  // Go to the user page by clicking the name of that user
  function goToUserPage(){
    cy.get('input[value="name"]')
      .click()

      cy.url().should('eq', 'http://localhost:3000/users/0') //Check that the URL matches the user URL
  }

  // Check to see if info in each field reflects what was editted
  function editCheckFields(){
    cy.get('input[placeholder="Name"]').eq(0).should('have.value', 'newName')
    cy.get('input[placeholder="Phone Number"]').eq(0).should('have.value', '+1 (234) 567 8910')
    cy.get('input[placeholder="Email"]').eq(0).should('have.value', 'test@gmail.com')
    cy.get('input[placeholder="User Type"]').eq(0).should('have.value', 'Trainee')
    cy.get('input[placeholder="Trainer"]').eq(0).should('have.value', 'Not a Trainer')
  }

  // Edit a user with valid entries
  function editValidFields(){
    clickEditUser();

    // Change name
    cy.get('input[name="name"]')
      .click() 
      .clear()
      .type('newName')

    // Change phone number
    cy.get('input[name="phone_number"]')
      .click() 
      .clear()
      .type('12345678910')

    // Change Email
    cy.get('input[name="email"]')
      .click() 
      .clear()
      .type('test@gmail.com') //Type in a valid password

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Hill Admin')
      .click()

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('System Admin')
      .click()     

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Patroller')
      .click()

    // Select User Type         
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(0)
      .click()
      .get('button').contains('Trainee')
      .click()  

    // Select Trainer
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(1)
      .click()
      .get('button').contains('Trainer')
      .click()

    // Select Trainer
    cy.get('button[class="dropdown-toggle btn btn-secondary"]').eq(1)
      .click()
      .get('button').contains('Not a Trainer')
      .click()
    
    .get('button').contains('Save')
      .click()
  }

  // Enter an invalid entries in each field for editting a user
  function editInvalidFields(){
    clickEditUser()
    editInvalidName();
    editInvalidPhoneNumber();
    // editInvalidEmail(); //To do: Comment back in once email field is fixed
    cy.get('button').contains('Cancel')
      .click()
  }

  // Enter an invalid name and check if it allowed the form to be saved    
  function editInvalidName(){

    // Test for blank field
    editFillFields();
    cy.get('input[name="name"]')
      .click() 
      .clear()

    cy.get('button').contains("Save")
      .click()
    cy.wait(500);    

    cy.get('button').contains("Save")
      .should('be.enabled')
    editFillFields();      
  }  

  // Enter an invalid phone number and check if it allowed the form to be saved    
  function editInvalidPhoneNumber(){
    editFillFields();

    // Test for blank field
    cy.get('input[name="phone_number"]')
      .click() 
      .clear()
    cy.get('button').contains("Save").should('be.disabled')        

    // Test for entering only 1 digit
    cy.get('input[name="phone_number"]')
      .click() 
      .clear()
      .type('0')
    cy.get('button').contains("Save").should('be.disabled')  
    editFillFields();
  }

  // Enter an invalid email and check if it allowed the form to be saved
  function editInvalidEmail(){
    editFillFields();

    // Test for blank field
    cy.get('input[name="email"]')
      .click() 
      .clear()
    
    cy.get('button').contains("Save")
      .click()
    cy.wait(500);    

    cy.get('button').contains("Save")
      .should('be.enabled')

  }

  // Click the Edit button under a user
  function clickEditUser(){
    cy.wait(500)
    cy.get('button').contains("Edit")
      .click()
  }

  // Click edit and then cancel
  function cancelEdit(){
    clickEditUser()
    cy.get('button').contains("Cancel")
      .click()

    cy.get('button').contains("Edit")
      .should('be.enabled') //Edit button becomes visible if cancel button is pressed
  }

  // Fill the fields for the edit form
  function editFillFields(){
      // Type name 
      cy.get('input[name="name"]')
        .click() 
        .clear()
        .type('name')
    
      // Type phone number 
      cy.get('input[name="phone_number"]')
        .click() 
        .clear()
        .type('11111111111')
      
      // Type email
      cy.get('input[name="email"]')
        .click() 
        .clear()
        .type('1@gmail.com')
  }

  // Check if the user is no longer in the system
  function checkDeletedUser(){
    cy.get('input[placeholder="Username"]').eq(0).should('not.have.value', '0')
  }

  // Delete the user
  function deleteUser(){
    clickEditUser();
    cy.get('button').contains("Delete")
      .click()

    checkDeletedUser();
  }

});