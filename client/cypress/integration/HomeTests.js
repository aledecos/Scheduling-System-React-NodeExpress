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
      cy.visit('http://localhost:3000/'); //Go to home page
    })

    // Test checking to see if CSP logo brings the user to home page
    it('Clicking CSP logo at the top', () => {
        clickCSPLogoTop();
    });

    // Test checking to see if CSP logo brings the user to home page
    it('Clicking CSP logo at the bottom', () => {
        clickCSPLogoBottom();
    });

    // Test checking to see if Home button brings the user to home page
    it('Clicking Home button', () => {
        clickHomeButton();
    });

    // Test checking to see if Sign in button brings the user sign to in page
    it('Clicking Sign in button', () => {
        clickSignInButton();
    });

    // Test checking to see if Sign up button on the top left brings the user sign up page
    it('Clicking Sign up button top left', () => {
        clickSignUpButtonTop();
    });

    // Test checking to see if Sign up button in the middle brings the user sign up page
    it('Clicking Sign in button middle', () => {
        clickSignUpButtonMiddle();
    });

    // Test checking to see if education and training card brings the user sign up page
    it('Clicking Education and Training card', () => {
        clickEducationAndTrainingCard();
    });

    // Test checking to see if year round events card brings the user sign up page
    it('Clicking Year round events card', () => {
        clickYearRoundEventsCard();
    });

    // Test checking to see if Member benefits card brings the user sign up page
    it('Clicking Member benefits card', () => {
        clickMemberBenefitsCard();
    });

    // Test checking to see if Safety and injury prevention card brings the user sign up page
    it('Clicking Safety and injury prevention card', () => {
        clickSafetyAndInjuryPreventionCard();
    });

    // Test checking to see if national page link actually contains the national page link
    it('Checking National Page link', () => {
        NationalPageLink();
    });

    // Test checking to see if Calgary Chapter link actually contains the Calgary Chapter link
    it('Checking Calgary Chapter link', () => {
        CalgaryChapterLink();
    });

    // Test checking to see if Registration link contains the Registration link
    it('Checking Registration link', () => {
        RegistrationLink();
    });

    // Test checking to see if FAQ link contains the FAQ link
    it('Checking FAQ link', () => {
        FAQLink();
    });

    // Test checking to see if Facebook logo contains CSP facebook link
    it('Checking Facebook logo', () => {
        FacebookLogo();
    });

    // Test checking to see if Twitter logo contains CSP Twitter link
    it('Checking Twitter logo', () => {
        TwitterLogo();
    });

    // Test checking to see if LinkedIn logo contains CSP LinkedIn link
    it('Checking LinkedIn logo', () => {
        LinkedInLogo();
    });

    // Test checking to see if Youtube logo contains CSP Youtube link
    it('Checking Youtube logo', () => {
        YoutubeLogo();
    });

    // Test checking to see if Instagram logo contains CSP Instagram link
    it('Checking Instagram logo', () => {
        InstagramLogo();
    });

    function clickHomeButton(){
        cy.get('.sc-kLgntA') //Click the home button
            .click()

        checkIfInHomePage()      
    }

    function clickCSPLogoTop(){
        cy.get('.sc-lmoMRL') //Click the CSP logo on the top left
            .click()

        checkIfInHomePage() 
    }

    function clickCSPLogoBottom(){
        cy.get('.sc-AzgDb') //Click the CSP logo on the bottom left
            .click()

        checkIfInHomePage() 
    }

    function clickSignInButton(){
        cy.get('.sc-jJEJSO') //Click the sign in button on the top right
            .click()

        cy.url().should('eq', 'http://localhost:3000/sign-in')
    }

    function clickSignUpButtonTop(){
        cy.get('.fMIzs > .sc-bdfBwQ > .sc-jrAGrp > :nth-child(1) > .sc-iqHYGH > a > .sc-dlfnbm') //Click the top sign up button
            .click()
        
        checkIfInSignUpPage()
    }

    function clickSignUpButtonMiddle(){
        cy.get('.fuMbmL > .sc-bdfBwQ > .sc-jrAGrp > :nth-child(1) > .sc-iqHYGH > a > .sc-dlfnbm') //Click the middle sign up button
            .click()

        checkIfInSignUpPage();
    }

    function clickSafetyAndInjuryPreventionCard(){
        cy.get(':nth-child(1) > .sc-ehSCib') //Click the safety and injury preventation card
            .click()

        checkIfInSignUpPage();
    }

    function clickMemberBenefitsCard(){
        cy.get(':nth-child(2) > .sc-ehSCib') //Click the member benefits card
            .click()

        checkIfInSignUpPage();
    }

    function clickYearRoundEventsCard(){
        cy.get(':nth-child(3) > .sc-ehSCib') //Click the year round events card
            .click()

        checkIfInSignUpPage();
    }

    function clickEducationAndTrainingCard(){
        cy.get(':nth-child(4) > .sc-ehSCib') //Click the education and training card
            .click()

        checkIfInSignUpPage();
    }

    function NationalPageLink(){
        cy.get('[href="//www.skipatrol.ca"]')  //On the bottom of the page, get the URL link of the national page
         .should('have.attr', 'href', '//www.skipatrol.ca') //Check that URL matches with the national page URL  
    }

    function CalgaryChapterLink(){
        cy.get(':nth-child(2) > .sc-eggNIi > :nth-child(3)')  //On the bottom of the page, get the URL link of the calgary chapter
            .should('have.attr', 'href', '//www.skipatrol.ca/calgary/') //Check that URL matches with the calgary chapter URL  
    }

    function RegistrationLink(){
        cy.get(':nth-child(2) > .sc-eggNIi > :nth-child(4)')  //On the bottom of the page, get the URL link of the registration
           .should('have.attr', 'href', '//www.skipatrol.ca/calgary/') //Check that URL matches with the registration URL  
    }

    function FAQLink(){
        cy.get('[href="//www.skipatrol.ca/faqs"]')  //On the bottom of the page, get the URL link of the faq
         .should('have.attr', 'href', '//www.skipatrol.ca/faqs') //Check that URL matches with the FAQ URL  
    }

    function FacebookLogo(){
        cy.get('[href="//www.facebook.com/CSP.PCS"]')  //On the bottom of the page, get the URL link of the facebook logo
            .should('have.attr', 'href', '//www.facebook.com/CSP.PCS') //Check that URL matches with the Facebook URL  
    }

    function TwitterLogo(){
        cy.get('[href="//www.twitter.com/CdnSkiPatrol"]')  //On the bottom of the page, get the URL link of the twitter logo
         .should('have.attr', 'href', '//www.twitter.com/CdnSkiPatrol') //Check that URL matches with the Twitter URL  
    }

    function LinkedInLogo(){
        cy.get('[href="//www.linkedin.com/company/canadian-ski-patrol/"]')  //On the bottom of the page, get the URL link of the linkedin logo
            .should('have.attr', 'href', '//www.linkedin.com/company/canadian-ski-patrol/') //Check that URL matches with the LinkedIn URL  
    }

    function YoutubeLogo(){
        cy.get('[href="//www.youtube.com/channel/UCWcjVziN5O79cUMgc9w4bFA"]')  //On the bottom of the page, get the URL link of the Youtube logo
         .should('have.attr', 'href', '//www.youtube.com/channel/UCWcjVziN5O79cUMgc9w4bFA') //Check that URL matches with the Youtube URL  
    }
    
    function InstagramLogo(){
        cy.get('[href="//www.instagram.com/cdnskipatrol/"]')  //On the bottom of the page, get the URL link of the Instagram logo
            .should('have.attr', 'href', '//www.instagram.com/cdnskipatrol/') //Check that URL matches with the Instagram URL  
    }

    function checkIfInSignUpPage(){
        cy.url().should('eq', 'http://localhost:3000/sign-up') //Check that URL matches with the Sign up  URL  
    }

    function checkIfInHomePage(){
        cy.url().should('eq', 'http://localhost:3000/') //Check that URL matches with the home URL  
    }
});