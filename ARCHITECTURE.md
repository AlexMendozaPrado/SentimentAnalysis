# Arquitectura - Banorte Sentiment Analysis POC

## Visión General

Este proyecto implementa **Clean Architecture (Arquitectura Hexagonal)** para crear una aplicación de análisis de sentimientos escalable, mantenible y testeable.

## Principios de Clean Architecture

### 1. Independencia de Frameworks
- La lógica de negocio no depende de Next.js, React, o Material-UI
- Los frameworks son herramientas, no arquitectura

### 2. Testeable
- Las reglas de negocio se pueden probar sin UI, base de datos, o servicios externos
- Los casos de uso son independientes de la infraestructura

### 3. Independiente de la UI
- La UI puede cambiar sin afectar la lógica de negocio
- React podría ser reemplazado por Vue, Angular, etc.

### 4. Independiente de la Base de Datos
- Las reglas de negocio no están vinculadas a una base de datos específica
- Actualmente usa repositorio en memoria, fácilmente reemplazable

### 5. Independiente de Servicios Externos
- OpenAI es un detalle de implementación
- Podría ser reemplazado por otro proveedor de IA

## Estructura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│                  (src/app/, UI Components)                  │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│                 (src/core/application/)                     │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                           │
│                   (src/core/domain/)                        │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│                 (src/infrastructure/)                       │
└─────────────────────────────────────────────────────────────┘
```

### Domain Layer (Núcleo)

**Ubicación**: `src/core/domain/`

**Responsabilidades**:
- Contiene las reglas de negocio más importantes
- Define entidades, objetos de valor, y puertos
- No depende de ninguna otra capa

**Componentes**:

#### Entidades (`entities/`)
- `SentimentAnalysis`: Representa un análisis de sentimientos completo
- `Conversation`: Representa una conversación con un cliente

#### Objetos de Valor (`value-objects/`)
- `EmotionScore`: Puntuaciones de emociones (alegría, tristeza, etc.)
- `SentimentType`: Tipo de sentimiento (positivo, neutral, negativo)
- `AnalysisMetrics`: Métricas del texto analizado

#### Puertos (`ports/`)
- `SentimentAnalyzerPort`: Interface para analizadores de sentimientos
- `TextExtractorPort`: Interface para extractores de texto
- `SentimentAnalysisRepositoryPort`: Interface para repositorios
- `ExportServicePort`: Interface para servicios de exportación

### Application Layer (Casos de Uso)

**Ubicación**: `src/core/application/`

**Responsabilidades**:
- Orquesta el flujo de datos hacia y desde las entidades
- Implementa casos de uso específicos de la aplicación
- Coordina entre el dominio y la infraestructura

**Casos de Uso**:
- `AnalyzeSentimentUseCase`: Analiza documentos PDF
- `GetHistoricalAnalysisUseCase`: Obtiene análisis históricos
- `FilterAnalysisUseCase`: Filtra análisis por criterios
- `ExportAnalysisUseCase`: Exporta análisis a diferentes formatos

### Infrastructure Layer (Adaptadores)

**Ubicación**: `src/infrastructure/`

**Responsabilidades**:
- Implementa los puertos definidos en el dominio
- Maneja detalles técnicos (APIs, bases de datos, archivos)
- Convierte datos externos al formato del dominio

**Adaptadores**:

#### Sentiment Analysis (`sentiment/`)
- `OpenAISentimentAnalyzer`: Implementación usando OpenAI GPT-4

#### Text Extraction (`text-extraction/`)
- `PDFTextExtractor`: Extrae texto de archivos PDF

#### Repositories (`repositories/`)
- `InMemorySentimentAnalysisRepository`: Repositorio en memoria para POC

#### Export (`export/`)
- `CSVExportService`: Exporta datos a CSV y JSON

#### Dependency Injection (`di/`)
- `DIContainer`: Contenedor de inyección de dependencias

### Presentation Layer (Interfaz)

**Ubicación**: `src/app/`

**Responsabilidades**:
- Maneja la interacción con el usuario
- Presenta datos del dominio
- Convierte entrada del usuario a comandos de casos de uso

**Componentes**:

#### Pages
- `page.tsx`: Página principal con navegación por tabs
- `layout.tsx`: Layout base con tema y navegación

#### Components (`components/`)
- `AnalyzePage`: Página de análisis de documentos
- `HistoryPage`: Página de historial con filtros
- `FileUploadZone`: Componente de carga de archivos
- `AnalysisResults`: Visualización de resultados
- `AnalysisTable`: Tabla de análisis históricos

#### API Routes (`api/`)
- `/api/analyze`: Endpoint para analizar documentos
- `/api/analyses/history`: Endpoint para historial
- `/api/analyses/recent`: Endpoint para análisis recientes
- `/api/analyses/export`: Endpoint para exportación

## Flujo de Datos

### Análisis de Documento

```
1. Usuario sube PDF → FileUploadZone
2. AnalyzePage → POST /api/analyze
3. API Route → AnalyzeSentimentUseCase
4. Use Case → TextExtractorPort (PDFTextExtractor)
5. Use Case → SentimentAnalyzerPort (OpenAISentimentAnalyzer)
6. Use Case → RepositoryPort (InMemoryRepository)
7. Resultado → AnalysisResults Component
```

### Consulta de Historial

```
1. Usuario aplica filtros → AnalysisFilters
2. HistoryPage → GET /api/analyses/history
3. API Route → GetHistoricalAnalysisUseCase
4. Use Case → RepositoryPort
5. Datos → AnalysisTable Component
```

## Inyección de Dependencias

El `DIContainer` maneja todas las dependencias:

```typescript
// Configuración
const container = DIContainer.getInstance({
  openaiApiKey: process.env.OPENAI_API_KEY,
  // ... otras configuraciones
});

// Uso en API Routes
const useCase = container.analyzeSentimentUseCase;
const result = await useCase.execute(command);
```

## Beneficios de esta Arquitectura

### 1. Testabilidad
- Cada capa se puede probar independientemente
- Mocks fáciles de crear usando interfaces
- Lógica de negocio aislada

### 2. Mantenibilidad
- Separación clara de responsabilidades
- Cambios en una capa no afectan otras
- Código más legible y organizado

### 3. Escalabilidad
- Fácil agregar nuevos casos de uso
- Nuevos adaptadores sin cambiar el dominio
- Múltiples interfaces (web, mobile, API)

### 4. Flexibilidad
- Cambiar OpenAI por otro proveedor
- Cambiar repositorio en memoria por base de datos
- Cambiar React por otro framework

## Patrones Implementados

### 1. Repository Pattern
- Abstrae el acceso a datos
- Permite cambiar implementación sin afectar casos de uso

### 2. Adapter Pattern
- Convierte interfaces externas al formato del dominio
- Aisla dependencias externas

### 3. Dependency Injection
- Invierte el control de dependencias
- Facilita testing y configuración

### 4. Command Pattern
- Encapsula requests como objetos
- Facilita logging, undo, queuing

### 5. Value Object Pattern
- Objetos inmutables que representan valores
- Encapsulan validación y comportamiento

## Consideraciones para Producción

### 1. Persistencia
- Reemplazar `InMemoryRepository` con implementación de base de datos
- Considerar PostgreSQL, MongoDB, o similar

### 2. Autenticación
- Agregar capa de autenticación en Presentation Layer
- Implementar autorización en casos de uso

### 3. Logging y Monitoreo
- Agregar logging estructurado
- Implementar métricas y alertas
- Considerar APM (Application Performance Monitoring)

### 4. Caching
- Implementar cache para análisis frecuentes
- Cache de resultados de OpenAI

### 5. Queue System
- Procesamiento asíncrono para documentos grandes
- Sistema de colas (Redis, RabbitMQ)

### 6. Error Handling
- Manejo robusto de errores en cada capa
- Circuit breaker para servicios externos
- Retry logic con backoff exponencial

Esta arquitectura proporciona una base sólida para el crecimiento y evolución del sistema de análisis de sentimientos de Banorte.
