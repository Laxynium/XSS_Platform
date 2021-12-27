describe('Level 1', () => {
  beforeEach(() => {
  });

  it('check if all items loaded', () => {
    cy.visit('/');
    cy.get('.nav-header').should('contain', 'Choose Level');
    cy.get('app-nav-item').should('have.length', 1);
    cy.get('.score-text').should('contain', 'Current score: 0');
    cy.get('.hint-container').should('exist');
    cy.get('#iframe').should('exist');
    cy.get('#hint-button').should('exist');
    cy.get('.hint-box').children().should('have.length', 0);
  });

  it('should show hints', () => {
    cy.visit('/');
    cy.get('.hint-box').children().should('have.length', 0);
    cy.get('#hint-button').click();
    cy.get('.hint-box').children().should('have.length', 1);
    cy.get('#hint-button').click();
    cy.get('.hint-box').children().should('have.length', 2);
    cy.get('#hint-button').click();
    cy.get('.hint-box').children().should('have.length', 3);
    cy.get('#hint-button').click();
    cy.get('.hint-box').children().should('have.length', 3);
  });

  it('should solve level', () => {
    cy.visit('/');
    mockEndpoints();
    cy.get('#iframe')
      .then(($iframe) => {
        const $body = $iframe.contents().find('body')
        const $win = $iframe[0].contentWindow

        cy.stub($win, 'alert').as('windowAlert')

        cy.wrap($body)
          .find('#input-xss')
          .type('<img src=x onerror="alert()">');

        cy.wrap($body)
          .find('#verify-button')
          .click();

        cy.window() // get a reference to application's `window`
          .then($window => {
            const message = 'success'
            $window.postMessage(message, '*')
          })
          .then(() => {
            cy.get('.stars-container').contains('COMPLETED')
            cy.get('.btn-primary').contains('Download files');
            cy.get('.btn-light').contains('Go to next level');
            cy.get('.score-text').should('contain', 'Current score: 3');
          });
        });
  });

  it('should download files', () => {
    cy.visit('/');
    mockEndpoints();
    cy.get('#iframe')
      .then(($iframe) => {
        const $body = $iframe.contents().find('body')
        const $win = $iframe[0].contentWindow

        cy.stub($win, 'alert').as('windowAlert')

        cy.wrap($body)
          .find('#input-xss')
          .type('<img src=x onerror="alert()">');

        cy.wrap($body)
          .find('#verify-button')
          .click();

        cy.window() // get a reference to application's `window`
          .then($window => {
            const message = 'success'
            $window.postMessage(message, '*')
          });
        cy.get('.btn-primary').contains('Download files').click();
        cy.wait('@files');
      });
  });

  it('should navigate to next level', () => {
    cy.visit('/');
    mockEndpoints();
    cy.get('#iframe')
      .then(($iframe) => {
        const $body = $iframe.contents().find('body')
        const $win = $iframe[0].contentWindow

        cy.stub($win, 'alert').as('windowAlert')

        cy.wrap($body)
          .find('#input-xss')
          .type('<img src=x onerror="alert()">');

        cy.wrap($body)
          .find('#verify-button')
          .click();

        cy.window() // get a reference to application's `window`
          .then($window => {
            const message = 'success'
            $window.postMessage(message, '*')
          });
        cy.get('.btn-light').contains('Go to next level').click();
        cy.get('app-nav-item').first().should('contain', 'Level Completed!')
      });
    });
});

function mockEndpoints() {
  cy.intercept('http://localhost:5000/files/1', { result: 'success'}).as('files');

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
