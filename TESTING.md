# Testing Guide - Banorte Sentiment Analysis

Esta guía explica cómo ejecutar y escribir tests para la aplicación de análisis de sentimientos.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Unit Tests con Jest](#unit-tests-con-jest)
- [E2E Tests con Cypress](#e2e-tests-con-cypress)
- [Comandos Disponibles](#comandos-disponibles)
- [Estructura de Archivos](#estructura-de-archivos)
- [Mejores Prácticas](#mejores-prácticas)

---

## Descripción General

El proyecto implementa una estrategia de testing en pirámide:

```
       /\
      /E2E\         ← Cypress (2-3 tests críticos)
     /------\
    /        \
   /Integration\   ← Opcional: API Routes
  /------------\
 /  Unit Tests  \  ← Jest (15-20 tests rápidos)
/________________\
```

**Proporción recomendada:**
- 70% Unit tests (Jest) - Rápidos, aislados, muchos
- 20% Integration tests - Opcional
- 10% E2E tests (Cypress) - Lentos, pocos pero críticos

---

## Unit Tests con Jest

### ¿Qué se prueba?

Los **use cases** de la capa de aplicación (`src/core/application/use-cases/`):
- ✅ `AnalyzeSentimentUseCase` - Análisis de PDF
- ✅ `FilterAnalysisUseCase` - Filtrado y paginación
- ✅ `GetHistoricalAnalysisUseCase` - Historial
- ✅ `ExportAnalysisUseCase` - Exportación

### Ejecutar Tests Unitarios

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar con output detallado
npm run test:verbose
```

### Estructura de Mocks

Los mocks simulan las dependencias externas (ports) sin llamar a servicios reales:

```typescript
// Mocks disponibles en src/__tests__/mocks/

SentimentAnalyzerMock     // Simula OpenAI
TextExtractorMock         // Simula extracción de PDF
RepositoryMock            // Simula base de datos
```

### Ejemplo de Test Unitario

```typescript
import { AnalyzeSentimentUseCase } from '../../../core/application/use-cases/AnalyzeSentimentUseCase';
import { SentimentAnalyzerMock } from '../../mocks/SentimentAnalyzerMock';

describe('AnalyzeSentimentUseCase', () => {
  let useCase: AnalyzeSentimentUseCase;
  let mockAnalyzer: SentimentAnalyzerMock;

  beforeEach(() => {
    // Crear mocks
    mockAnalyzer = new SentimentAnalyzerMock();
    mockExtractor = new TextExtractorMock();
    mockRepository = new RepositoryMock();

    // Inyectar en use case
    useCase = new AnalyzeSentimentUseCase(
      mockAnalyzer,
      mockExtractor,
      mockRepository
    );
  });

  it('should analyze sentiment successfully', async () => {
    // Configurar respuesta del mock
    mockAnalyzer.setMockResponse({
      overallSentiment: SentimentType.POSITIVE,
      confidence: 0.92
    });

    // Ejecutar
    const result = await useCase.execute(command);

    // Verificar
    expect(result.analysis.overallSentiment).toBe(SentimentType.POSITIVE);
  });
});
```

### Ventajas de Unit Tests

- ⚡ **Rápidos**: ~2 segundos para 50+ tests
- 💰 **Gratis**: No consume API de OpenAI
- 🎯 **Aislados**: Cada test es independiente
- 🔄 **Repetibles**: Siempre dan el mismo resultado

---

## E2E Tests con Cypress

### ¿Qué se prueba?

El **flujo completo de usuario** desde la UI hasta la BD:
- ✅ Upload de PDF
- ✅ Validación de formularios
- ✅ Análisis y visualización de resultados
- ✅ Navegación entre páginas
- ✅ Manejo de errores
- ✅ Responsividad

### Ejecutar Tests E2E

```bash
# Abrir interfaz interactiva de Cypress
npm run cypress

# Ejecutar en modo headless (CI)
npm run cypress:headless

# Ejecutar E2E completo (inicia servidor + cypress)
npm run test:e2e

# Ejecutar E2E con interfaz visual
npm run test:e2e:open

# Ejecutar TODOS los tests (unit + e2e)
npm run test:all
```

### Estrategia: Mocks vs OpenAI Real

#### Opción A: Con Mocks (Recomendado para desarrollo)

```typescript
// cypress/e2e/sentiment-analysis.cy.ts

beforeEach(() => {
  // Mock de OpenAI para tests rápidos
  cy.mockAnalyzeAPI();
  cy.visit('/');
});

it('should analyze PDF successfully', () => {
  cy.get('input[type="file"]').attachFile('test.pdf');
  cy.get('input[name="clientName"]').type('Test Client');
  cy.contains('button', /analizar/i).click();

  // Espera respuesta mockeada (instantánea)
  cy.wait('@analyzeAPI');

  cy.contains('Positivo').should('be.visible');
});
```

**Ventajas**:
- ⚡ Rápido (2-3 segundos)
- 💰 Gratis
- 🎯 Predecible

#### Opción B: Con OpenAI Real (Recomendado para staging)

```typescript
// cypress.config.ts - Cambiar flag
env: {
  USE_REAL_OPENAI: true  // Usar API real
}
```

**Ventajas**:
- ✅ Prueba integración real
- 🔍 Detecta problemas reales

**Desventajas**:
- 🐌 Lento (5-10 segundos por test)
- 💸 Costoso (consume tokens)

### Ejemplo de Test E2E

```typescript
describe('Sentiment Analysis Flow', () => {
  it('should complete analysis flow', () => {
    // 1. Visitar app
    cy.visit('/');

    // 2. Upload PDF
    cy.get('input[type="file"]').attachFile('test-document.pdf');

    // 3. Llenar formulario
    cy.get('input[name="clientName"]').type('Juan Pérez');
    cy.get('select[name="channel"]').select('Email');

    // 4. Analizar
    cy.contains('button', /analizar/i).click();

    // 5. Verificar resultados
    cy.contains('Resultado del Análisis').should('be.visible');
    cy.contains(/positivo|negativo|neutral/i).should('be.visible');
    cy.get('.recharts-wrapper').should('be.visible');
  });
});
```

---

## Comandos Disponibles

### Jest (Unit Tests)

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todos los tests con Jest |
| `npm run test:unit` | Solo tests unitarios (use cases) |
| `npm run test:watch` | Modo watch para desarrollo |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run test:verbose` | Output detallado |

### Cypress (E2E Tests)

| Comando | Descripción |
|---------|-------------|
| `npm run cypress` | Interfaz interactiva de Cypress |
| `npm run cypress:headless` | Ejecuta Cypress en headless mode |
| `npm run test:e2e` | E2E completo (inicia servidor automático) |
| `npm run test:e2e:open` | E2E con interfaz visual |
| `npm run test:all` | Ejecuta unit + e2e |

---

## Estructura de Archivos

```
src/
├── __tests__/
│   ├── mocks/                         # Mocks reutilizables
│   │   ├── SentimentAnalyzerMock.ts   # Mock de OpenAI
│   │   ├── TextExtractorMock.ts       # Mock de PDF parser
│   │   ├── RepositoryMock.ts          # Mock de BD
│   │   └── testData.ts                # Datos de prueba
│   │
│   └── unit/
│       └── use-cases/
│           ├── AnalyzeSentimentUseCase.test.ts  # 25 tests
│           ├── FilterAnalysisUseCase.test.ts    # 34 tests
│           ├── GetHistoricalAnalysisUseCase.test.ts
│           └── ExportAnalysisUseCase.test.ts
│
cypress/
├── e2e/
│   └── sentiment-analysis.cy.ts       # Tests E2E principales
│
├── fixtures/
│   └── analysis-success.json          # Respuesta mock de API
│
├── support/
│   ├── commands.ts                    # Comandos personalizados
│   └── e2e.ts                         # Setup global
│
├── cypress.config.ts                  # Configuración de Cypress
├── jest.config.js                     # Configuración de Jest
└── jest.setup.js                      # Setup de Jest
```

---

## Mejores Prácticas

### Para Unit Tests

1. **Usa mocks para todas las dependencias externas**
   ```typescript
   // ✅ Bueno
   const mockAnalyzer = new SentimentAnalyzerMock();

   // ❌ Malo
   const realAnalyzer = new OpenAISentimentAnalyzer(apiKey);
   ```

2. **Tests deben ser independientes**
   ```typescript
   beforeEach(() => {
     // Resetear estado antes de cada test
     mockRepository.reset();
   });
   ```

3. **Usa nombres descriptivos**
   ```typescript
   // ✅ Bueno
   it('should throw error when client name is empty', ...)

   // ❌ Malo
   it('test validation', ...)
   ```

4. **Sigue el patrón AAA (Arrange-Act-Assert)**
   ```typescript
   it('should...', () => {
     // Arrange: Preparar
     const command = createMockCommand();

     // Act: Ejecutar
     const result = await useCase.execute(command);

     // Assert: Verificar
     expect(result).toBeDefined();
   });
   ```

### Para E2E Tests

1. **Usa mocks en desarrollo, OpenAI real en staging**
   ```typescript
   // Desarrollo: cy.mockAnalyzeAPI()
   // Staging: USE_REAL_OPENAI=true
   ```

2. **Usa data-testid para selectores estables**
   ```typescript
   // ✅ Bueno
   cy.getBySel('submit-button').click();

   // ❌ Malo (puede cambiar)
   cy.get('.MuiButton-root').first().click();
   ```

3. **Agrupa tests relacionados**
   ```typescript
   describe('Validation', () => {
     it('should validate required fields', ...);
     it('should validate file size', ...);
   });
   ```

4. **Maneja timeouts apropiadamente**
   ```typescript
   cy.get('[data-testid="results"]', { timeout: 10000 })
     .should('be.visible');
   ```

---

## Troubleshooting

### Tests de Jest fallan

```bash
# Limpiar cache
npm test -- --clearCache

# Ejecutar test específico
npm test -- AnalyzeSentimentUseCase

# Ver errores detallados
npm run test:verbose
```

### Cypress no encuentra elementos

```typescript
// Agregar data-testid a tus componentes
<button data-testid="analyze-button">Analizar</button>

// Usar en tests
cy.getBySel('analyze-button').click();
```

### OpenAI timeout en E2E

```typescript
// Aumentar timeout en cypress.config.ts
defaultCommandTimeout: 15000,
responseTimeout: 20000,
```

---

## Cobertura de Tests

### Objetivo de Cobertura

| Capa | Objetivo | Actual |
|------|----------|--------|
| Use Cases | 80-90% | ~60% |
| Domain Entities | 70-80% | TBD |
| Value Objects | 80-90% | TBD |
| API Routes | 50-60% | E2E |

### Generar Reporte

```bash
npm run test:coverage
```

Esto genera un reporte HTML en `coverage/lcov-report/index.html`

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:e2e
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY_TEST }}
```

---

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/)
- [Clean Architecture Testing](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## Contacto

Para preguntas sobre testing, contacta al equipo de desarrollo.
