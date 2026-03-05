# Generación de Imágenes con Gemini 3.1 Flash - Rotulemos

Este backend utiliza **Google Gemini 3.1 Flash Image Preview** con capacidad nativa de generación de imágenes.

## 🆕 Características Nuevas

### ✅ Generación Nativa de Imágenes
- Modelo: `gemini-3.1-flash-image-preview`
- Genera imágenes directamente sin necesidad de APIs externas
- Soporta múltiples variaciones
- Optimizado para rótulos publicitarios

### 🎨 Categorías Soportadas
- **Letras neón LED** - Efecto glow, iluminación nocturna
- **Letras corpóreas 3D** - Profundidad realista, materiales
- **Rótulos luminosos** - Cajas de luz, fachadas
- **Lonas/Pancartas** - Fondos decorativos sin texto
- **Vinilos** - Cristales, escaparates
- **Banderolas** - Señales perpendiculares
- **Paneles rígidos** - PVC, Forex
- **Roll up** - Displays portátiles

## 📡 Endpoints

### 1. Generar Imagen del Rótulo
```http
POST /api/v1/disenos/:id/generar-imagen
Content-Type: application/json
Authorization: Bearer <token> (opcional)

{
  "cantidad": 4  // Opcional: genera 4 variaciones
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "tipo": "imagen",
    "imagen": {
      "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "mimeType": "image/png",
      "dataUrl": "data:image/png;base64,iVBORw0...",
      "url": "https://res.cloudinary.com/...",
      "publicId": "rotulemos/disenos/..."
    },
    "prompt": "Professional commercial signage photography..."
  },
  "message": "Imagen generada exitosamente con Gemini"
}
```

### 2. Generar Fondos para Lonas
```http
POST /api/v1/disenos/:id/generar-fondos-lona
Content-Type: application/json

{
  "tipoNegocio": "restaurante",
  "estiloVisual": "moderno",
  "cantidad": 4
}
```

### 3. Verificar Disponibilidad del Servicio
```http
GET /api/v1/disenos/check/imagen-service
```

## 🔧 Configuración

### 1. Clonar y configurar
```bash
cd mi-proyecto-react/backend
cp .env.example .env
```

### 2. Editar .env
```env
# La API key ya está configurada en el servicio
# Pero puedes usar tu propia key:
GEMINI_API_KEY=AIzaSyAcp0Q71kM6kExB89ynBfi3iza9P8JNKB8
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar servidor
```bash
npm run dev
```

## 🧪 Probar la API

### Test rápido con curl:
```bash
# Crear un diseño primero
curl -X POST http://localhost:5000/api/v1/disenos \
  -H "Content-Type: application/json" \
  -d '{
    "categoria": "letras-neon",
    "nombreNegocio": "CAFÉ CENTRAL",
    "estiloVisual": "moderno",
    "colores": [{"nombre": "warm white", "hex": "#FFF8E7"}]
  }'

# Usar el ID devuelto para generar imagen
curl -X POST http://localhost:5000/api/v1/disenos/{ID}/generar-imagen
```

### Test con variaciones:
```bash
curl -X POST http://localhost:5000/api/v1/disenos/{ID}/generar-imagen \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 4}'
```

## 📝 Ejemplos de Prompts Generados

### Letras Neón:
```
Create a professional commercial photography of a neon LED sign 
for a business named "CAFÉ CENTRAL".

SIGN DETAILS:
- Text: "CAFÉ CENTRAL" (must be clearly visible and legible)
- Style: moderno, modern, vibrant, eye-catching
- Colors: warm white
- Typography: Montserrat Bold
- glowing neon tubes, electric glow effect, mounted on dark wall

LIGHTING & ATMOSPHERE:
- nighttime, neon illumination, vibrant glow
- Professional commercial photography lighting
- Photorealistic quality
...
```

## 🔄 Flujo de Trabajo

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Cliente   │────▶│   Backend    │────▶│  Gemini Flash   │
│  (Frontend) │     │  (Node.js)   │     │  (Genera IMG)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                            │                       │
                            ▼                       ▼
                     ┌──────────────┐     ┌─────────────────┐
                     │   MongoDB    │     │   Cloudinary    │
                     │ (Guarda ref) │     │  (Almacena IMG) │
                     └──────────────┘     └─────────────────┘
```

## ⚠️ Limitaciones

1. **Modelo Preview**: `gemini-3.1-flash-image-preview` está en preview
2. **Rate Limits**: Google impone límites de uso en la API gratuita
3. **Tamaño**: Imágenes generadas son de resolución media (ajustable)
4. **Texto**: A veces el texto puede tener pequeños errores (característico de IA)

## 🔮 Futuras Mejoras

- [ ] Upscaling automático con Real-ESRGAN
- [ ] Quitar fondo automático (Remove.bg)
- [ ] Editor de imágenes integrado
- [ ] Historial de versiones
- [ ] Comparador side-by-side

## 📚 Recursos

- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Modelos Gemini](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Obtener API Key](https://makersuite.google.com/app/apikey)
