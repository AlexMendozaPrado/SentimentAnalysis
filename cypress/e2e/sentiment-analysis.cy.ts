/**
 * E2E Tests for Sentiment Analysis Flow
 *
 * These tests cover the complete user journey from uploading a PDF
 * to viewing the sentiment analysis results.
 */

const analyzeButton = () => cy.get('[data-testid="analyze-button"]');

describe('Sentiment Analysis - Complete Flow', () => {
  beforeEach(() => {
    // Mock the API response to avoid calling OpenAI during tests
    cy.mockAnalyzeAPI();

    // Visit the home page
    cy.visit('/');
  });

  it('should display the landing page correctly', () => {
    // Verify main elements are visible
    cy.contains('Banorte').should('be.visible');
    cy.contains('Análisis de Sentimiento').should('be.visible');

    // Verify upload area is present
    cy.get('[data-testid="upload-zone"]').should('exist');
  });

  it('should allow file upload and show form', () => {
    const fileName = 'test-document.pdf';

    cy.uploadFile(fileName);

    // Verify file name is displayed
    cy.contains(fileName).should('be.visible');

    // Verify form fields are visible
    cy.get('input[name="clientName"]').should('be.visible');
    cy.get('[data-testid="channel-select"]').should('be.visible');
  });

  it('should keep the analyze button disabled until required fields are filled', () => {
    analyzeButton().should('be.disabled');

    cy.uploadFile('test.pdf');
    analyzeButton().should('be.disabled');

    cy.get('input[name="clientName"]').type('Test Client');
    analyzeButton().should('be.disabled');

    cy.selectChannel('Correo Electrónico');
    analyzeButton().should('be.enabled');
  });

  it('should successfully analyze a PDF and display results', () => {
    cy.fillAnalysisForm('Cliente de Prueba', 'Correo Electrónico', 'test-document.pdf');

    // Submit for analysis
    analyzeButton().click();

    // Verify loading indicator appears while the request is in flight
    cy.get('[data-testid="loading"]').should('be.visible');

    cy.wait('@analyzeAPI');

    // Verify results are displayed
    cy.get('[data-testid="analysis-results"]', { timeout: 10000 }).within(() => {
      cy.contains('Resultados del Análisis').should('be.visible');

      // Verify sentiment is shown
      cy.contains(/positivo/i).should('be.visible');

      // Verify confidence score is displayed
      cy.contains(/confianza/i).should('be.visible');
      cy.contains('92.0%').should('be.visible');

      // Verify emotions chart is rendered
      cy.get('.recharts-wrapper').should('be.visible');
    });
  });

  it('should display analysis metrics correctly', () => {
    cy.fillAnalysisForm('Test Client', 'Chat en Línea');
    analyzeButton().click();
    cy.wait('@analyzeAPI');

    // Verify metrics are shown
    cy.get('[data-testid="text-metrics"]').within(() => {
      cy.contains(/palabras/i).should('be.visible');
      cy.contains('250').should('be.visible'); // wordCount from fixture

      cy.contains(/oraciones/i).should('be.visible');
      cy.contains('15').should('be.visible'); // sentenceCount from fixture
    });
  });

  it('should show emotions breakdown', () => {
    cy.fillAnalysisForm('Test Client', 'Call Center');
    analyzeButton().click();
    cy.wait('@analyzeAPI');

    // Verify emotions are displayed
    cy.get('[data-testid="analysis-results"]').within(() => {
      cy.contains(/alegr[ií]a/i).should('be.visible');
      cy.contains(/tristeza/i).should('be.visible');
      cy.contains(/enojo/i).should('be.visible');
      cy.contains(/miedo/i).should('be.visible');
    });
  });
});

describe('Sentiment Analysis - Error Handling', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show error when API fails', () => {
    // Mock API error
    cy.mockAnalyzeAPIError(500, 'Error al procesar el documento');

    cy.fillAnalysisForm();
    analyzeButton().click();

    // Wait for error
    cy.wait('@analyzeAPIError');

    // Verify error message is shown
    cy.contains('[role="alert"]', /error al procesar el documento/i).should('be.visible');
  });

  it('should reject non-PDF files', () => {
    cy.uploadFile('test.txt', 'text/plain', 'test content');

    // Should show validation error
    cy.contains(/solo.*pdf/i).should('be.visible');
  });

  it('should reject files that are too large', () => {
    // Create a large file (> 10MB)
    const largeContent = Cypress.Buffer.alloc(11 * 1024 * 1024, 'x');

    cy.uploadFile('large.pdf', 'application/pdf', largeContent);

    // Should show size error
    cy.contains(/demasiado grande/i).should('be.visible');
  });
});

describe('Sentiment Analysis - Navigation', () => {
  it('should navigate to history tab', () => {
    cy.visit('/');

    cy.contains('[role="tab"]', /historial de análisis/i).click();

    // History panel should be shown
    cy.contains('[role="tab"]', /historial de análisis/i).should('have.attr', 'aria-selected', 'true');
    cy.contains('h2', /historial de análisis/i).should('be.visible');
  });

  it('should allow clearing results to start a new analysis', () => {
    cy.mockAnalyzeAPI();
    cy.visit('/');

    cy.fillAnalysisForm();
    analyzeButton().click();
    cy.wait('@analyzeAPI');

    cy.get('[data-testid="analysis-results"]').should('be.visible');

    // Should have a way to start over
    cy.contains(/nuevo.*análisis/i).should('be.visible');
    cy.contains('button', /limpiar/i).click();
    cy.get('[data-testid="analysis-results"]').should('not.exist');
  });
});

describe('Sentiment Analysis - Responsiveness', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ device, width, height }) => {
    it(`should display correctly on ${device}`, () => {
      cy.viewport(width, height);
      cy.visit('/');

      // Main elements should be visible
      cy.contains('Banorte').should('be.visible');
      cy.get('[data-testid="upload-zone"]').should('exist');
    });
  });
});
