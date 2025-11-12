# Guía de Modelos de Ollama

Esta aplicación de análisis de sentimientos de Banorte soporta múltiples modelos de IA locales a través de Ollama.

## Modelos Instalados

### 1. Llama 3.2 (2.0 GB)
- **Tamaño**: 2.0 GB
- **Modelo**: `llama3.2:latest`
- **Características**: Modelo compacto y rápido, ideal para análisis de sentimientos básicos
- **Velocidad**: Alta
- **Archivo de configuración**: `.env.ollama`

### 2. Qwen 2.5 (4.7 GB)
- **Tamaño**: 4.7 GB
- **Modelo**: `qwen2.5:latest`
- **Características**: Modelo más grande y potente, mejor comprensión contextual y análisis más detallado
- **Velocidad**: Moderada (más lento que Llama 3.2 pero más preciso)
- **Archivo de configuración**: `.env.qwen`

## Cómo Cambiar entre Modelos

### Opción 1: Usar archivos .env predefinidos

Hemos creado archivos de configuración específicos para cada modelo:

**Para usar Llama 3.2:**
```bash
cp .env.ollama .env.local
```

**Para usar Qwen 2.5:**
```bash
cp .env.qwen .env.local
```

Luego reinicia el servidor de desarrollo:
```bash
npm run dev
```

### Opción 2: Modificar directamente .env.local

Edita tu archivo `.env.local` y cambia la variable `OLLAMA_MODEL`:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:latest  # o llama3.2:latest
```

## Comparación de Modelos

| Característica | Llama 3.2 | Qwen 2.5 |
|----------------|-----------|----------|
| Tamaño | 2.0 GB | 4.7 GB |
| Velocidad | Muy rápida | Moderada |
| Precisión | Buena | Excelente |
| Contexto | Bueno | Muy bueno |
| Uso recomendado | Análisis rápido en tiempo real | Análisis detallado y preciso |

## Comandos Útiles de Ollama

### Listar modelos instalados:
```bash
/c/Users/fluid/AppData/Local/Programs/Ollama/ollama.exe list
```

### Descargar un nuevo modelo:
```bash
/c/Users/fluid/AppData/Local/Programs/Ollama/ollama.exe pull <nombre_modelo>
```

### Eliminar un modelo:
```bash
/c/Users/fluid/AppData/Local/Programs/Ollama/ollama.exe rm <nombre_modelo>
```

### Ejecutar un modelo en modo interactivo:
```bash
/c/Users/fluid/AppData/Local/Programs/Ollama/ollama.exe run qwen2.5:latest
```

## Pruebas de Rendimiento

Para comparar el rendimiento de ambos modelos:

1. Asegúrate de que Ollama esté corriendo
2. Cambia el modelo en `.env.local`
3. Reinicia el servidor
4. Analiza el mismo texto con ambos modelos
5. Compara:
   - Tiempo de respuesta
   - Precisión del análisis
   - Calidad del razonamiento

## Recomendaciones

- **Desarrollo/Pruebas**: Usa Llama 3.2 para desarrollo rápido
- **Producción/Análisis Crítico**: Usa Qwen 2.5 para mejor precisión
- **Hardware limitado**: Usa Llama 3.2 (menos consumo de RAM)
- **Hardware potente**: Usa Qwen 2.5 para aprovechar mejor capacidad

## Otros Modelos Disponibles

Puedes descargar otros modelos desde la biblioteca de Ollama:

- `llama3.1` - Versión anterior de Llama
- `mistral` - Modelo francés muy eficiente
- `codellama` - Especializado en código
- `gemma` - Modelo de Google
- `phi3` - Modelo compacto de Microsoft

Para ver todos los modelos disponibles: https://ollama.com/library
