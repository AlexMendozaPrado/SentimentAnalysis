// ***********************************************
// Custom commands for reusability
// ***********************************************

/**
 * Mock the analyze API endpoint with a predefined response.
 * The small delay lets tests observe the loading state.
 */
Cypress.Commands.add('mockAnalyzeAPI', (fixture = 'analysis-success.json') => {
  cy.intercept('POST', '/api/analyze', {
    fixture,
    delay: 500,
  }).as('analyzeAPI');
});

/**
 * Mock the analyze API to return an error
 */
Cypress.Commands.add('mockAnalyzeAPIError', (statusCode = 500, message = 'Internal Server Error') => {
  cy.intercept('POST', '/api/analyze', {
    statusCode,
    body: { error: message },
  }).as('analyzeAPIError');
});

/**
 * Select a file in the upload zone (the dropzone input is hidden, so force is required)
 */
Cypress.Commands.add(
  'uploadFile',
  (fileName = 'test.pdf', mimeType = 'application/pdf', contents = 'test PDF content') => {
    cy.get('[data-testid="upload-zone"] input[type="file"]').selectFile(
      {
        contents: typeof contents === 'string' ? Cypress.Buffer.from(contents) : contents,
        fileName,
        mimeType,
      },
      { force: true }
    );
  }
);

/**
 * Pick a channel from the MUI Select
 */
Cypress.Commands.add('selectChannel', (channel: string) => {
  cy.get('[data-testid="channel-select"] [aria-haspopup="listbox"]').click();
  cy.contains('li[role="option"]', channel).click();
});

/**
 * Upload a PDF and fill in the required analysis fields
 */
Cypress.Commands.add(
  'fillAnalysisForm',
  (clientName = 'Test Client', channel = 'Correo Electrónico', fileName = 'test.pdf') => {
    cy.uploadFile(fileName);
    cy.get('input[name="clientName"]').type(clientName);
    cy.selectChannel(channel);
  }
);

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      mockAnalyzeAPI(fixture?: string): Chainable<void>;
      mockAnalyzeAPIError(statusCode?: number, message?: string): Chainable<void>;
      uploadFile(fileName?: string, mimeType?: string, contents?: string | ReturnType<typeof Cypress.Buffer.alloc>): Chainable<void>;
      selectChannel(channel: string): Chainable<void>;
      fillAnalysisForm(clientName?: string, channel?: string, fileName?: string): Chainable<void>;
    }
  }
}

export {};
