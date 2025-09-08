# Instalación y Configuración - Banorte Sentiment Analysis POC

## Prerrequisitos

- Node.js 18.0.0 o superior
- Yarn 1.22.0 o superior
- Cuenta de OpenAI con API key

## Instalación

### 1. Instalar dependencias

```bash
yarn install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# OpenAI Configuration
OPENAI_API_KEY=tu_api_key_de_openai_aqui

# Application Configuration
NEXT_PUBLIC_APP_NAME=Banorte Sentiment Analysis
NEXT_PUBLIC_APP_VERSION=1.0.0

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB en bytes
ALLOWED_FILE_TYPES=application/pdf

# Analysis Configuration
DEFAULT_MODEL=gpt-4
MAX_TOKENS=4000
TEMPERATURE=0.3
```

### 3. Verificar la instalación

```bash
yarn type-check
```

## Ejecución

### Desarrollo

```bash
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Producción

```bash
yarn build
yarn start
```

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router (Presentation Layer)
│   ├── api/               # API Routes
│   ├── components/        # React Components
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── theme.ts           # Tema de Material-UI
├── core/
│   ├── domain/            # Domain Layer
│   │   ├── entities/      # Entidades de dominio
│   │   ├── value-objects/ # Objetos de valor
│   │   └── ports/         # Interfaces/Puertos
│   └── application/       # Application Layer
│       └── use-cases/     # Casos de uso
├── infrastructure/        # Infrastructure Layer
│   ├── sentiment/         # Analizador OpenAI
│   ├── text-extraction/   # Extractor PDF
│   ├── repositories/      # Repositorios
│   ├── export/           # Servicios de exportación
│   └── di/               # Contenedor DI
└── shared/               # Utilidades compartidas
    ├── types/            # Tipos TypeScript
    └── utils/            # Funciones utilitarias
```

## Funcionalidades

### Análisis de Documentos
- Carga de archivos PDF (máximo 10MB)
- Análisis de sentimientos usando OpenAI GPT-4
- Detección de emociones (alegría, tristeza, enojo, miedo, sorpresa, disgusto)
- Métricas de texto (palabras, oraciones, legibilidad)
- Indicador de confianza del análisis

### Historial y Filtros
- Visualización de análisis previos
- Filtros por cliente, canal, sentimiento, fecha, confianza
- Paginación y ordenamiento
- Estadísticas agregadas

### Exportación
- Exportación a CSV y JSON
- Configuración de campos incluidos
- Filtros aplicables a la exportación

## Arquitectura

El proyecto sigue los principios de **Clean Architecture (Hexagonal Architecture)**:

### Domain Layer
- **Entidades**: `SentimentAnalysis`, `Conversation`
- **Value Objects**: `EmotionScore`, `SentimentType`, `AnalysisMetrics`
- **Ports**: Interfaces para dependencias externas

### Application Layer
- **Use Cases**: Lógica de negocio pura
  - `AnalyzeSentimentUseCase`
  - `GetHistoricalAnalysisUseCase`
  - `FilterAnalysisUseCase`
  - `ExportAnalysisUseCase`

### Infrastructure Layer
- **Adapters**: Implementaciones concretas
  - `OpenAISentimentAnalyzer`
  - `PDFTextExtractor`
  - `InMemorySentimentAnalysisRepository`
  - `CSVExportService`

### Presentation Layer
- **UI Components**: React + Material-UI
- **API Routes**: Next.js API routes
- **Dependency Injection**: Container para loose coupling

## Troubleshooting

### Error: OpenAI API key not configured
- Verifica que `OPENAI_API_KEY` esté configurado en `.env.local`
- Asegúrate de que la API key sea válida y tenga créditos

### Error: File too large
- El límite por defecto es 10MB
- Puedes ajustar `MAX_FILE_SIZE` en las variables de entorno

### Error: Invalid PDF file
- Verifica que el archivo sea un PDF válido
- Algunos PDFs protegidos o corruptos pueden fallar

### Problemas de rendimiento
- El análisis puede tomar tiempo dependiendo del tamaño del documento
- OpenAI tiene límites de rate limiting

## Desarrollo

### Agregar nuevas funcionalidades

1. **Domain Layer**: Define entidades y value objects
2. **Application Layer**: Crea use cases
3. **Infrastructure Layer**: Implementa adapters
4. **Presentation Layer**: Crea componentes UI y API routes

### Testing

```bash
# Verificación de tipos
yarn type-check

# Linting
yarn lint
```

## Consideraciones de Producción

Para un entorno de producción, considera:

1. **Base de datos**: Reemplazar `InMemorySentimentAnalysisRepository` con una implementación persistente
2. **Autenticación**: Agregar autenticación y autorización
3. **Monitoreo**: Implementar logging y métricas
4. **Escalabilidad**: Considerar procesamiento asíncrono para documentos grandes
5. **Seguridad**: Validación adicional de archivos y rate limiting
6. **Backup**: Estrategia de respaldo para datos de análisis
