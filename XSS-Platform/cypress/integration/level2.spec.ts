describe('Level 2', () => {
  beforeEach(() => {
    mockEndpoints();
  });

  it('check if all items loaded', () => {
    cy.visit('/level2');
    cy.get('.nav-header').should('contain', 'Choose Level');
    cy.get('app-nav-item').should('have.length', 2);
    cy.get('.score-text').should('contain', 'Current score: 3');
    cy.get('.hint-container').should('exist');
    cy.get('#iframe').should('exist');
    cy.get('#hint-button').should('exist');
    cy.get('.hint-box').children().should('have.length', 0);
  });
});

function mockEndpoints() {
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
