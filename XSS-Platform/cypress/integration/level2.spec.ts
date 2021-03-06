describe('Level 2', () => {
  beforeEach(() => {
    mockEndpointsLevel2();
    cy.visit('/level2');
  });

  it('check if all items loaded', () => {
    cy.get('.nav-header').should('contain', 'Choose Level');
    cy.get('app-nav-item').should('have.length', 2);
    cy.get('.score-text').should('contain', 'Current score: 3');
    cy.get('.hint-container').should('exist');
    cy.get('#iframe').should('exist');
    cy.get('#hint-button').should('exist');
    cy.get('.hint-box').children().should('have.length', 0);
  });

  it('should solve level', () => {
    cy.get('.ng-untouched').clear({force: true});
    cy.get('.ng-untouched').type('http://localhost:3002/#//localhost:4500/README.md', {force: true});
    cy.get('.frame button').click();
    level2Completed();
    cy.window() // get a reference to application's `window`
    .then($window => {
      const message = 'success'
      $window.postMessage(message, '*')
    })
    .then(() => {
      cy.get('.stars-container').contains('COMPLETED')
      cy.get('.btn-primary').contains('Download files');
      cy.get('.btn-light').contains('Go to next level');
      cy.get('.score-text').should('contain', 'Current score: 6');
    });
  });
});

function mockEndpointsLevel2() {
  cy.intercept('http://localhost:5000/files/2', { result: 'success'}).as('files');


  cy.intercept('http://localhost:5000/users/me', {
    id: 'id',
    name: 'name',
    levels: [
      {
        number: 1,
        completed: true,
        token: 'string',
        usedHints: []
      },
      {
        number: 2,
        completed: false,
        token: 'string',
        usedHints: []
      }
    ],
    challengeCompleted: false,
  }).as('me');
}

function level2Completed(): void {
  cy.intercept('http://localhost:5000/users/me', {
    id: 'id',
    name: 'name',
    levels: [
      {
        number: 1,
        completed: true,
        token: 'string',
        usedHints: []
      },
      {
        number: 2,
        completed: true,
        token: 'string',
        usedHints: []
      },
      {
        number: 3,
        completed: false,
        token: 'string',
        usedHints: []
      }
    ],
    challengeCompleted: false,
  }).as('me');
}
