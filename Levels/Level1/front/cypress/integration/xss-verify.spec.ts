describe('Check if app is secured from XSS attack', () => {

  [
    "<img src=x onerror='alert()'>",
    "<img src=1 href=1 onerror=\"javascript:alert(1)\"></img>",
    "<audio src=1 href=1 onerror=\"javascript:alert(1)\"></audio>",
    "<video src=1 href=1 onerror=\"javascript:alert(1)\"></video>",
    "`\"'><img src='#\x27 onerror=javascript:alert(1)>",
  ].forEach(testCase => {
    it(`alert for ${testCase}`, () => {
      cy.visit('/')
      cy.get('#input-xss').type(testCase);
      cy.get('#verify-button').click();
      cy.wait(100);
      cy.get('.success-container').should('not.exist');
    });
  });
})
