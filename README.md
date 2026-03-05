# Rotulemos Backend API

API REST para la aplicación de generación de diseños con IA de Rotulemos.

## 🚀 Características

- **Generación de imágenes con Gemini 3.1 Flash** - Generación nativa de imágenes
- **Diccionario Dinámico Neon Editor** - Todas las opciones de configuración
- **Análisis de legibilidad** con Google Gemini
- **Gestión de presupuestos** con cálculo automático
- **Captura de leads** para clientes potenciales
- **Almacenamiento en Cloudinary** para imágenes
- **Base de datos MongoDB** con Mongoose

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── index.js              # Variables de entorno
│   │   ├── database.js           # Conexión MongoDB
│   │   └── diccionarioNeonEditor.js  # Diccionario dinámico
│   ├── controllers/              # Controladores de lógica
│   ├── middleware/               # Middleware (auth, errores, upload)
│   ├── models/                   # Modelos de Mongoose
│   ├── routes/                   # Definición de rutas
│   ├── services/                 # Servicios (IA, Cloudinary)
│   ├── utils/                    # Utilidades (logger, respuestas)
│   └── server.js                 # Punto de entrada
├── uploads/                      # Archivos temporales
├── logs/                         # Logs de la aplicación
├── .env                          # Variables de entorno
└── package.json
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
```

## 🔐 Variables de Entorno

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rotulemos
JWT_SECRET=tu_jwt_secret_seguro

# Gemini AI (Generación de imágenes)
GEMINI_API_KEY=AIzaSyAcp0Q71kM6kExB89ynBfi3iza9P8JNKB8

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📡 Endpoints API

### Diseños
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/v1/disenos | Listar diseños |
| POST   | /api/v1/disenos | Crear diseño |
| GET    | /api/v1/disenos/:id | Obtener diseño |
| POST   | /api/v1/disenos/:id/generar-imagen | Generar imagen con Gemini |
| POST   | /api/v1/disenos/:id/generar-fondos-lona | Generar fondos para lonas |

### Diccionario (Neon Editor)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/v1/diccionario | Diccionario completo |
| GET    | /api/v1/diccionario/categorias | 12 categorías de producto |
| GET    | /api/v1/diccionario/tipografias | 10 tipografías |
| GET    | /api/v1/diccionario/colores | 18 colores predefinidos |
| GET    | /api/v1/diccionario/tipos-corporeas | 8 tipos de letras corpóreas |
| GET    | /api/v1/diccionario/espesores/:tipo | Espesores disponibles |
| GET    | /api/v1/diccionario/colores-luz | 10 colores LED |
| GET    | /api/v1/diccionario/materiales-laser | 6 materiales láser |
| GET    | /api/v1/diccionario/tipos-negocio | 16 tipos de negocio |
| GET    | /api/v1/diccionario/estilos-lona | 10 estilos de lona |
| GET    | /api/v1/diccionario/estilos-visuales | 9 estilos visuales |
| GET    | /api/v1/diccionario/fachadas | 6 tipos de fachada |
| GET    | /api/v1/diccionario/orientaciones | 3 orientaciones |
| POST   | /api/v1/diccionario/validar | Validar configuración |

### Leads
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/v1/leads | Crear lead |
| GET    | /api/v1/leads | Listar leads (admin) |

### Presupuestos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/v1/presupuestos/calcular | Calcular presupuesto |
| POST   | /api/v1/presupuestos | Crear presupuesto |
| GET    | /api/v1/presupuestos | Listar presupuestos |

## 🎨 Diccionario Neon Editor

El diccionario contiene toda la configuración del editor:

```javascript
// Obtener diccionario completo
const response = await fetch('/api/v1/diccionario');
const { data } = await response.json();

// Usar en el frontend
const categorias = data.categoriasProducto;
const tipografias = data.tipografias;
const colores = data.coloresPredefinidos;
```

### Estructura del Diccionario

| Colección | Elementos | Descripción |
|-----------|-----------|-------------|
| categoriasProducto | 12 | Categorías de rótulos |
| tiposLetrasCorporeas | 8 | Tipos de letras 3D |
| espesoresPorTipo | 8 objetos | Espesores por tipo |
| coloresLuzLed | 10 | Colores de neón/LED |
| materialesLaser | 6 | Materiales corte láser |
| tiposNegocioLonas | 16 | Tipos de negocio |
| estilosLona | 10 | Estilos para lonas |
| acabadosSuperficiales | 4 | Acabados de superficie |
| tipografias | 10 | Fuentes disponibles |
| coloresPredefinidos | 18 | Paleta de colores |
| estilosVisuales | 9 | Estilos de diseño |
| fachadas | 6 | Tipos de fachada |
| orientaciones | 3 | Orientaciones de diseño |
| tabsPreview | 4 | Tabs del preview |
| temas | 5 | Temas de UI |

## 🧪 Tests

```bash
# Ejecutar tests
npm test

# Generar imagen de prueba
node test-generar-imagen.js
```

## 📝 Ejemplo: Generar Imagen

```bash
# 1. Crear diseño
curl -X POST http://localhost:5000/api/v1/disenos \
  -H "Content-Type: application/json" \
  -d '{
    "categoria": "letras-neon",
    "nombreNegocio": "CAFÉ CENTRAL",
    "estiloVisual": "moderno",
    "colores": [{"nombre": "warm white", "hex": "#FFF8E7"}],
    "colorLuzLed": "blanco-calido"
  }'

# 2. Generar imagen
curl -X POST http://localhost:5000/api/v1/disenos/{ID}/generar-imagen
```

## 🔗 Recursos

- [Documentación Diccionario API](./DICCIONARIO_API.md)
- [Gemini Image Generation](./GEMINI_IMAGES_V2.md)

## 📄 Licencia

MIT © Rotulemos
