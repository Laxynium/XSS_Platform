describe('Level 3', () => {
  beforeEach(() => {
    mockEndpointsLevel3();
    cy.visit('/level3');
  });

  it('check if all items loaded', () => {
    cy.get('.nav-header').should('contain', 'Choose Level');
    cy.get('app-nav-item').should('have.length', 3);
    cy.get('.score-text').should('contain', 'Current score: 6');
    cy.get('.hint-container').should('exist');
    cy.get('#iframe').should('exist');
    cy.get('#hint-button').should('exist');
    cy.get('.hint-box').children().should('have.length', 0);
  });

  it('solve level', () => {
    level3Completed();
    cy.window() // get a reference to application's `window`
    .then($window => {
      const message = 'success'
      $window.postMessage(message, '*')
    })
    .then(() => {
      cy.get('.stars-container').contains('COMPLETED')
      cy.get('.btn-primary').contains('Download files');
      cy.get('.score-text').should('contain', 'Current score: 9');
    });
  });
});

function mockEndpointsLevel3() {
  cy.intercept('http://localhost:5000/files/3', { result: 'success'}).as('files');

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
        token: 'string2',
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

function level3Completed(): void {
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
        token: 'string2',
        usedHints: []
      },
      {
        number: 3,
        completed: true,
        token: 'string',
        usedHints: []
      }
    ],
    challengeCompleted: false,
  }).as('me');
}
