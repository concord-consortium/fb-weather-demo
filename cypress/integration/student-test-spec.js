
context('Student Weather App', () => {

  before(() => {
    cy.visit('branch/master/index.html#/simulations/no-portal_72e1d6ea-a100-4697-a934-ec81e1a5aa5c/show/student')
    cy.url().should('include', 'student')
    cy.wait(3000);
  })

//  describe('Default Conditions', () => {

//    Only for new instance of token

//    it('student can not choose a location before a group', () => {
//      cy.get('#App').find('button').contains('Group')
//      cy.contains('Team Name').should('have.css', 'opacity', '1');
//      cy.root().contains('grid').should('not.be.visible');
//    })

//  })

  describe('Student actions', () => {

    it('chooses group and location', () => {
      cy.contains('Team Name')
        .parent().find('button').click({force:true});
      cy.root();
      cy.get('div [role="menu"]').find('div').first().click();
      cy.contains('Choose Location').click();
      cy.contains('grid');
      cy.root();
      cy.contains('Group').first().click({force:true})
      cy.root();
      cy.contains('Current Conditions').should('not.be.visible')
      cy.contains('Choose Location').click();

      cy.contains('Current Conditions').should('be.visible')

      //verify that current conditions is not currently available
    })

    it('changes between groups and location', () => {
      //check that all group options are available
      //choose one group and verify that it is now in red
      //choose group button appears for switching tab
      //click choose group button
      //check that choose location tab is now active / visible
      //check that grid is visible and no body has a teacher selected
      //hover over grid, verify that coord displays while hovering
      //click and select grid
      //check that selected grid now contains an occupied identifier
    })

    it('verifies handling network connectivity issues', () => {

    })

  })

})
