class Teacher {

  getTitle() {
    return cy.get('button > :nth-child(1) > div');
  }

  getTeacherTitleCardContents() {
    return cy.get('.teacher-title-card-contents');
  }

  getUsers() {
    return cy.get('.teacher-status-options > :nth-child(1)');
  }

  getStudentLinkButton() {
    return cy.get('.teacher-option-buttons > :nth-child(1)');
  }

  getResetButton() {
    return cy.get(':nth-child(1) > .MuiButton-label-47');
  }

  getPlayButton() {
    return cy.get(':nth-child(2) > .MuiButton-label-47');
  }

  getPauseButton() {
    return cy.get('[tabindex="0"] > .MuiButton-label-47');
  }

  getSkipButton() {
    return cy.get(':nth-child(3) > .MuiButton-label-47');
  }

  checkTime(time) {
    return this.getTeacherTitleCardContents().should('contain', time);
  }

  getGridWithCoord(coord) {

    switch(coord) {
      case('A-1'):
          return cy.get('.grid-cell-label-A-1');
      case('A-2'):
          return cy.get('.grid-cell-label-A-2');
      case('A-3'):
          return cy.get('.grid-cell-label-A-3');
      case('A-4'):
          return cy.get('.grid-cell-label-A-4');
      case('A-5'):
          return cy.get('.grid-cell-label-A-5');
      case('A-6'):
          return cy.get('.grid-cell-label-A-6');
      case('A-7'):
          return cy.get('.grid-cell-label-A-7');

      case('B-1'):
          return cy.get('.grid-cell-label-B-1');
      case('B-2'):
          return cy.get('.grid-cell-label-B-2');
      case('B-3'):
          return cy.get('.grid-cell-label-B-3');
      case('B-4'):
          return cy.get('.grid-cell-label-B-4');
      case('B-5'):
          return cy.get('.grid-cell-label-B-5');
      case('B-6'):
          return cy.get('.grid-cell-label-B-6');
      case('B-7'):
          return cy.get('.grid-cell-label-B-7');

      case('C-1'):
          return cy.get('.grid-cell-label-C-1');
      case('C-2'):
          return cy.get('.grid-cell-label-C-2');
      case('C-3'):
          return cy.get('.grid-cell-label-C-3');
      case('C-4'):
          return cy.get('.grid-cell-label-C-4');
      case('C-5'):
          return cy.get('.grid-cell-label-C-5');
      case('C-6'):
          return cy.get('.grid-cell-label-C-6');
      case('C-7'):
          return cy.get('.grid-cell-label-C-7');

      case('D-1'):
          return cy.get('.grid-cell-label-D-1');
      case('D-2'):
          return cy.get('.grid-cell-label-D-2');
      case('D-3'):
          return cy.get('.grid-cell-label-D-3');
      case('D-4'):
          return cy.get('.grid-cell-label-D-4');
      case('D-5'):
          return cy.get('.grid-cell-label-D-5');
      case('D-6'):
          return cy.get('.grid-cell-label-D-6');
      case('D-7'):
          return cy.get('.grid-cell-label-D-7');

      case('E-1'):
          return cy.get('.grid-cell-label-E-1');
      case('E-2'):
          return cy.get('.grid-cell-label-E-2');
      case('E-3'):
          return cy.get('.grid-cell-label-E-3');
      case('E-4'):
          return cy.get('.grid-cell-label-E-4');
      case('E-5'):
          return cy.get('.grid-cell-label-E-5');
      case('E-6'):
          return cy.get('.grid-cell-label-E-6');
      case('E-7'):
          return cy.get('.grid-cell-label-E-7');

      case('F-1'):
          return cy.get('.grid-cell-label-F-1');
      case('F-2'):
          return cy.get('.grid-cell-label-F-2');
      case('F-3'):
          return cy.get('.grid-cell-label-F-3');
      case('F-4'):
          return cy.get('.grid-cell-label-F-4');
      case('F-5'):
          return cy.get('.grid-cell-label-F-5');
      case('F-6'):
          return cy.get('.grid-cell-label-F-6');
      case('F-7'):
          return cy.get('.grid-cell-label-F-7');

      case('D-1'):
          return cy.get('.grid-cell-label-G-1');
      case('G-2'):
          return cy.get('.grid-cell-label-G-2');
      case('G-3'):
          return cy.get('.grid-cell-label-G-3');
      case('G-4'):
          return cy.get('.grid-cell-label-G-4');
      case('G-5'):
          return cy.get('.grid-cell-label-G-5');
      case('G-6'):
          return cy.get('.grid-cell-label-G-6');
      case('G-7'):
          return cy.get('.grid-cell-label-G-7');
      }
    }

  }
export default Teacher;
