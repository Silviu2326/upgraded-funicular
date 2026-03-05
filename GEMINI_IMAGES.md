# Generación de Imágenes con Gemini - Rotulemos Backend

Este backend utiliza Google Gemini para generar prompts optimizados para la creación de imágenes de rótulos publicitarios.

## 🎨 Características

### 1. Generación de Prompts para Imágenes
- **Endpoint**: `POST /api/v1/disenos/:id/generar-imagen`
- Genera prompts detallados en inglés optimizados para:
  - Midjourney
  - DALL-E 3
  - Stable Diffusion
  - Otras APIs de generación de imágenes

### 2. Sistema Híbrido para Lonas
- **Endpoint**: `POST /api/v1/disenos/:id/generar-fondos-lona`
- Genera fondos decorativos sin texto
- El texto se superpone con Canvas en el frontend
- 16 tipos de negocio soportados
- 10 estilos visuales diferentes

## 📡 Endpoints

### Generar Prompt de Imagen
```http
POST /api/v1/disenos/:id/generar-imagen
Authorization: Bearer <token> (opcional)
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "tipo": "prompt",
    "prompt": "Professional commercial signage photography...",
    "promptEs": "Fotografía profesional de señalización comercial...",
    "sugerencias": {
      "midjourney": "... --ar 16:9 --v 6.0",
      "dalle": "...",
      "stableDiffusion": { "prompt": "...", "negative_prompt": "..." }
    }
  }
}
```

### Generar Fondos para Lonas
```http
POST /api/v1/disenos/:id/generar-fondos-lona
Content-Type: application/json

{
  "tipoNegocio": "restaurante",
  "estiloVisual": "moderno",
  "cantidad": 4
}
```

**Tipos de negocio soportados:**
- `restaurante`, `tienda`, `cafeteria`
- `barberia`, `peluqueria`, `boutique`
- `gimnasio`, `clinica`, `oficina`
- `taller`, `floristeria`, `libreria`
- `pasteleria`, `farmacia`, `vet`

**Estilos visuales:**
- `moderno`, `clasico`, `minimalista`
- `vintage`, `industrial`, `elegante`
- `retro`, `urbano`, `natural`, `tecnologico`

## 🔧 Configuración

### Variables de entorno necesarias:
```env
GOOGLE_AI_API_KEY=tu_api_key_de_gemini
GOOGLE_CLOUD_PROJECT_ID=opcional_para_vertex_ai
```

### Obtener API Key de Gemini:
1. Ir a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crear una nueva API Key
3. Copiarla en el archivo `.env`

## 🖼️ Ejemplo de Uso

### Generar imagen de letras neón:
```bash
curl -X POST http://localhost:5000/api/v1/disenos/123/generar-imagen \
  -H "Content-Type: application/json"
```

**Prompt generado:**
```
Professional commercial signage photography: letras neón LED profesionales 
with "CAFÉ CENTRAL" text prominently displayed.

SPECIFICATIONS:
- Product: tubos de neón LED flexibles, brillo uniforme, efecto glow suave
- Style: moderno, corporate, premium quality
- Colors: warm white, deep purple
- Typography: Montserrat Bold, clean and highly legible
- Background: fondo oscuro para resaltar la iluminación
- Angle: vista frontal ligeramente elevada
- Lighting: iluminación nocturna ambiental

TECHNICAL REQUIREMENTS:
- Photorealistic 3D render quality
- 8K resolution, ultra-detailed
- Sharp focus on the sign text "CAFÉ CENTRAL"
- Professional commercial photography style
- No watermarks, no text overlays except the business name
- Clean composition suitable for marketing materials
- Aspect ratio 16:9 landscape
```

### Usar con DALL-E 3:
```javascript
const prompt = await fetch('/api/v1/disenos/123/generar-imagen');
const data = await prompt.json();

// Enviar a DALL-E 3
const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + OPENAI_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'dall-e-3',
    prompt: data.data.prompt,
    size: '1024x1024',
    quality: 'hd'
  })
});
```

## 📝 Notas

- Gemini actualmente genera prompts de texto optimizados
- Para generación directa de imágenes, usar Vertex AI (Google Cloud)
- Los prompts están optimizados para incluir el nombre del negocio de forma legible
- Se incluyen adaptaciones específicas para diferentes plataformas de IA

## 🚀 Futuras mejoras

1. **Vertex AI Integration**: Generación directa de imágenes usando Google Cloud
2. **WebSocket Streaming**: Progreso de generación en tiempo real
3. **Cache de prompts**: Almacenar prompts generados para reutilización
4. **A/B Testing**: Comparar efectividad de diferentes prompts
