import Teacher from './elements/teacher'

context('Teacher Weather App', () => {

  let teacher = new Teacher;

  before(() => {
    cy.visit('#/simulations/no-portal_72e1d6ea-a100-4697-a934-ec81e1a5aa5c/show/teacher')
    cy.url().should('include', 'teacher')
  })

  context('Teacher Card', () => {
    it('checks default teacher card', () => {
      teacher.checkTime('7:00')
      teacher.getTeacherTitleCardContents()
        .contains('user')
      teacher.getUsers().should('be.visible')
      teacher.getStudentLinkButton()
        .should('be.visible')
        .trigger('mouseover')
        .should('contain', 'Copy Student Link')
    })
    it('checks grid defaults', () => {
      teacher.getGridWithCoord('A-1').click({force:true});
      cy.get('.station-id').should('be.visible')
      cy.get('.temperature').should('be.visible')
      cy.get('.precipitation').should('be.visible')
      cy.get('.moisture').should('be.visible')
      cy.reload();
      cy.root();
      cy.get('.teacher-card-media-map').find('i')
        .should('be.visible')
    })
    it('checks model toolbar default', () => {
      cy.get('.teacher-card-media-wrapper').find('button').eq(0)
        .should('have.attr', 'tabindex', '-1') //reset is disabled
      cy.get('.teacher-card-media-wrapper').find('button').eq(1)
        .click({force:true})
      cy.get('.teacher-title-card-contents')
        .should('not.contain', '7:00 AM')
    })
    it('clicks play/reset, verify changes', () => {
      cy.get('.teacher-card-media-wrapper').find('button').eq(1)
        .click({force:true})
      cy.get('.teacher-card-media-wrapper').find('button').eq(0)
        .should('have.attr', 'tabindex', '0')
        .click({force:true})
      cy.get('.teacher-title-card-contents')
        .should('contain', '7:00 AM')
    })
  })

})
