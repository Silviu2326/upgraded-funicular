# Diccionario de Prompts Profesional - Rotulemos

Diccionario completo para construcción de prompts de alta calidad para generación de imágenes con IA.

## 🎯 Características

- ✅ **Descripciones detalladas** en español e inglés
- ✅ **Keywords específicas** para cada elemento
- ✅ **Templates de prompts** ensamblables
- ✅ **Ejemplos de uso** para cada categoría
- ✅ **Sugerencias inteligentes** según tipo de negocio
- ✅ **Validación de configuraciones**

## 📚 Endpoints API

### Diccionario Completo
```http
GET /api/v1/diccionario
```

### Categorías con Templates de Prompts
```http
GET /api/v1/diccionario/categorias
GET /api/v1/diccionario/categorias/:id
```

### Generar Prompt
```http
POST /api/v1/diccionario/generar-prompt
Content-Type: application/json

{
  "categoria": "letras-neon",
  "nombreNegocio": "CAFÉ CENTRAL",
  "estiloVisual": "moderno",
  "colores": [{"hex": "#FFF5E6", "nombre": "blanco-calido"}],
  "tipografia": "montserrat",
  "tipoNegocio": "cafeteria"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "prompt": "Professional LED Neon Sign with 'CAFÉ CENTRAL' text, modern style design, clean, geometric, minimalist, sleek, streamlined, current, warm white color scheme, Montserrat typography (sans-serif, variable), cafe business aesthetic, photorealistic, 8k resolution, professional commercial photography, sharp focus...",
    "keywords": ["neon sign", "LED neon", "glowing tubes", "cafe", "coffee", "cozy"],
    "sugerencias": {
      "estilos": ["vintage", "modern", "cozy", "minimalist"],
      "colores": ["browns", "creams", "warm whites", "soft greens"],
      "elementos": ["coffee cups", "beans", "steam", "pastries"]
    }
  }
}
```

### Describir Elemento
```http
GET /api/v1/diccionario/describir/tipografia/montserrat
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "montserrat",
    "nombre": { "es": "Montserrat", "en": "Montserrat" },
    "descripcion": {
      "es": "Inspirada en la tipografía urbana de Buenos Aires...",
      "en": "Inspired by urban typography of Buenos Aires..."
    },
    "keywords": ["versatile", "geometric", "urban", "friendly", "modern"],
    "promptText": "montserrat"
  }
}
```

---

## 📖 Estructura del Diccionario

### Categorías de Producto (11)

Cada categoría incluye:
- Descripción en español e inglés
- Keywords específicas (10-15)
- Template de prompt base
- Atributos (materiales, efectos, estilos)
- Parámetros de prompt (iluminación, ángulo, textura)

```javascript
{
  id: 'letras-neon',
  nombre: { es: 'Neón LED', en: 'LED Neon Sign' },
  descripcion: { es: '...', en: '...' },
  keywords: ['neon sign', 'LED neon', 'glowing tubes', ...],
  promptTemplate: {
    base: 'Professional {color} LED neon sign...',
    detalles: '{glowEffect} glow effect...',
    calidad: 'photorealistic, 8k...'
  },
  atributos: {
    materiales: ['flexible LED silicone tubes', ...],
    efectosLuz: ['uniform glow', 'gradient glow', ...],
    montaje: ['wall mounted', 'hanging', ...]
  },
  parametrosPrompt: {
    relacionAspecto: '16:9 horizontal',
    iluminacion: 'nighttime, dark background',
    angulo: 'frontal view with slight elevation'
  }
}
```

### Tipografías (10)

Incluyen:
- Descripción detallada
- Keywords de personalidad
- Uso recomendado
- Legibilidad por longitud de texto
- Personalidad tipográfica

```javascript
{
  id: 'montserrat',
  nombre: 'Montserrat',
  categoria: 'sans-serif',
  peso: 'variable',
  descripcion: { es: '...', en: '...' },
  keywords: ['versatile', 'geometric', 'urban', ...],
  usoRecomendado: 'Uso universal, cualquier tipo de negocio',
  personalidad: 'Amigable, versátil, urbana, contemporánea',
  legibilidad: { corta: 'excelente', larga: 'excelente' }
}
```

### Colores (18)

Incluyen:
- Nombres en español e inglés
- Descripción emocional
- Keywords
- Emoción transmitida
- Uso recomendado
- Colores de contraste

```javascript
{
  hex: '#DA291C',
  nombres: { es: 'Rojo', en: 'Red' },
  descripcion: 'Rojo intenso y energético, color de pasión y atención',
  keywords: ['red', 'bold', 'passion', 'energy', 'attention'],
  emocion: 'Pasión, energía, urgencia, fuerza',
  uso: 'Llamadas a la acción, restaurantes, deportes',
  contraste: 'Blanco, negro, dorado'
}
```

### Estilos Visuales (9)

Incluyen:
- Descripción completa
- Keywords (7-10)
- Elementos visuales característicos
- Paleta de colores sugerida
- Tipo de iluminación
- Referencias de diseño

```javascript
{
  id: 'moderno',
  nombre: { es: 'Moderno', en: 'Modern' },
  descripcion: { es: '...', en: '...' },
  keywords: ['contemporary', 'clean', 'geometric', ...],
  elementos: ['straight lines', 'geometric shapes', ...],
  paleta: ['monochrome', 'bold accents', ...],
  iluminacion: 'Even, professional lighting, minimal shadows',
  referencias: 'Apple, Google, Scandinavian design'
}
```

### Materiales (6)

Incluyen:
- Descripción técnica
- Acabados disponibles
- Keywords
- Apariencia visual
- Peso
- Durabilidad

```javascript
{
  nombre: { es: 'Aluminio', en: 'Aluminum' },
  descripcion: 'Metal ligero, durable y versátil...',
  acabados: ['brushed', 'polished', 'anodized', ...],
  keywords: ['lightweight', 'rust-resistant', 'metallic', ...],
  apariencia: 'Metálica, puede ser mate o brillante',
  peso: 'ligero',
  durabilidad: 'muy alta'
}
```

### Tipos de Negocio (16)

Incluyen:
- Categoría
- Keywords de contexto
- Elementos visuales sugeridos
- Estilos recomendados
- Colores sugeridos

```javascript
{
  nombre: { es: 'Cafetería', en: 'Coffee Shop' },
  categoria: 'gastronomia',
  keywords: ['coffee', 'cafe', 'espresso', 'latte', ...],
  elementosVisuales: ['coffee cups', 'beans', 'steam', ...],
  estilosSugeridos: ['vintage', 'modern', 'cozy', 'minimalist'],
  coloresSugeridos: ['browns', 'creams', 'warm whites', ...]
}
```

---

## 🔧 Funciones del Diccionario

### `construirPrompt(datos)`
Construye un prompt completo a partir de los datos del diseño.

```javascript
const prompt = diccionario.construirPrompt({
  categoria: 'letras-neon',
  nombreNegocio: 'CAFÉ CENTRAL',
  estiloVisual: 'moderno',
  colores: [{ hex: '#FFF5E6', nombre: 'blanco-calido' }],
  tipografia: 'montserrat',
  tipoNegocio: 'cafeteria'
});
```

### `getKeywords(categoria, estilo, materiales)`
Obtiene keywords relacionadas para enriquecer el prompt.

```javascript
const keywords = diccionario.getKeywords(
  'letras-neon',
  'moderno',
  ['aluminio']
);
// ['neon sign', 'LED neon', 'glowing tubes', 'clean', 'geometric', ...]
```

### `getSugerencias(tipoNegocio)`
Obtiene sugerencias de estilos, colores y elementos para un tipo de negocio.

```javascript
const sugerencias = diccionario.getSugerencias('cafeteria');
// {
//   estilos: ['vintage', 'modern', 'cozy', 'minimalist'],
//   colores: ['browns', 'creams', 'warm whites', ...],
//   elementos: ['coffee cups', 'beans', 'steam', ...]
// }
```

### `describirElemento(tipo, id)`
Obtiene descripción detallada de un elemento específico.

```javascript
const desc = diccionario.describirElemento('color', 'rojo');
// { id, nombre, descripcion, keywords, promptText }
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Letras Neón para Cafetería

```javascript
const datos = {
  categoria: 'letras-neon',
  nombreNegocio: 'COFFEE LAB',
  estiloVisual: 'moderno',
  colores: [{ hex: '#FEDD00', nombre: 'amarillo' }],
  tipografia: 'montserrat',
  colorLuzLed: 'amarillo',
  tipoNegocio: 'cafeteria'
};

// Prompt generado:
// "Professional LED Neon Sign with 'COFFEE LAB' text, modern style design, 
// clean, geometric, minimalist, sleek, streamlined, current, amarillo color 
// scheme, Montserrat typography (sans-serif, variable), cafe business aesthetic, 
// glowing neon tubes, nighttime neon glow effect, vibrant illumination, 
// dark background, photorealistic, 8k resolution..."
```

### Ejemplo 2: Letras Corpóreas para Restaurant

```javascript
const datos = {
  categoria: 'letras-corporeas',
  nombreNegocio: 'BISTRO ROYAL',
  estiloVisual: 'elegante',
  colores: [{ hex: '#D4AF37', nombre: 'dorado-metalico' }],
  tipografia: 'playfair',
  tipoLetraCorporea: 'aluminio-con-luz',
  espesor: 8,
  colorLuzLed: 'blanco-calido'
};

// Prompt incluirá:
// - "Professional 3D channel letters..."
// - "brushed aluminum material"
// - "Playfair Display typography (serif, elegant)"
// - "front lit LED illumination: Blanco cálido"
// - "elegant style design..."
```

---

## 🎨 Integración con Frontend

```javascript
// Obtener diccionario
const response = await fetch('/api/v1/diccionario');
const { data } = await response.json();

// Generar prompt al crear diseño
const promptResponse = await fetch('/api/v1/diccionario/generar-prompt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    categoria: 'letras-neon',
    nombreNegocio: 'MI NEGOCIO',
    estiloVisual: 'moderno',
    colores: [{ hex: '#DA291C' }]
  })
});

const { data: { prompt, keywords, sugerencias } } = await promptResponse.json();

// Usar el prompt para generar imagen
const imagen = await fetch('/api/v1/disenos/123/generar-imagen', {
  method: 'POST',
  body: JSON.stringify({ prompt })
});
```

---

## 🔄 Flujo de Trabajo

```
1. Frontend → GET /api/v1/diccionario
   ↓
2. Usuario configura diseño en NeonEditor
   ↓
3. Frontend → POST /api/v1/diccionario/generar-prompt
   ↓
4. Backend usa diccionarioPrompts.construirPrompt()
   ↓
5. Retorna prompt enriquecido con keywords
   ↓
6. Frontend → POST /api/v1/disenos/:id/generar-imagen
   ↓
7. Gemini genera imagen con el prompt optimizado
```

---

## 📊 Estadísticas del Diccionario

| Categoría | Elementos | Descripción |
|-----------|-----------|-------------|
| Categorías de Producto | 11 | Con templates de prompts |
| Tipografías | 10 | Con personalidad y uso |
| Colores | 18 | Con emociones y contraste |
| Estilos Visuales | 9 | Con referencias de diseño |
| Materiales | 6 | Con acabados y propiedades |
| Tipos de Negocio | 16 | Con sugerencias contextuales |
| Fachadas | 6 | Con texturas y ambiente |

---

## 🚀 Ventajas del Diccionario de Prompts

1. **Consistencia**: Todos los prompts siguen el mismo formato profesional
2. **Calidad**: Descripciones detalladas generan mejores imágenes
3. **Contexto**: Keywords específicas mejoran la relevancia
4. **Sugerencias**: IA recomienda combinaciones óptimas
5. **Validación**: Evita configuraciones inválidas
6. **Multilingüe**: Descripciones en español e inglés

---

## 📚 Recursos

- [Documentación API](./DICCIONARIO_API.md)
- [Gemini Image Generation](./GEMINI_IMAGES_V2.md)
