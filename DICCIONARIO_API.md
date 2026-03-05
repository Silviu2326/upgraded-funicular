# Diccionario Neon Editor - API Documentation

Diccionario dinámico con todas las opciones de configuración del editor de rótulos.

## 📚 Endpoints del Diccionario

### Obtener Diccionario Completo
```http
GET /api/v1/diccionario
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "categoriasProducto": [...],
    "tiposLetrasCorporeas": [...],
    "espesoresPorTipo": {...},
    "coloresLuzLed": [...],
    "materialesLaser": [...],
    "tiposNegocioLonas": [...],
    "estilosLona": [...],
    "acabadosSuperficiales": [...],
    "tipografias": [...],
    "coloresPredefinidos": [...],
    "estilosVisuales": [...],
    "fachadas": [...],
    "orientaciones": [...],
    "tabsPreview": [...],
    "temas": [...]
  },
  "meta": {
    "totalCategorias": 12,
    "totalTipografias": 10,
    "totalColores": 18,
    "version": "1.0.0"
  }
}
```

---

## 📦 Categorías de Producto

### `GET /api/v1/diccionario/categorias`
Lista todas las categorías disponibles.

### `GET /api/v1/diccionario/categorias/:id`
Obtiene una categoría específica con información de relaciones.

**Ejemplo:** `/api/v1/diccionario/categorias/letras-neon`

```json
{
  "success": true,
  "data": {
    "id": "letras-neon",
    "nombre": "Neón LED",
    "icono": "Lightbulb",
    "desc": "Neones realistas con tubos de vidrio brillantes...",
    "precioBase": 45,
    "unidad": "letra",
    "tiempoEntrega": "7-10 días",
    "caracteristicas": ["neon", "led", "tubos", "horizontal"],
    "tieneOrientacion": false,
    "tieneTipoCorporea": false
  }
}
```

**Categorías disponibles:**
- `rotulos` - Rótulos luminosos
- `letras-neon` - Neón LED
- `rigidos-impresos` - Rígidos PVC
- `letras-corporeas` - Corpóreas 3D
- `lonas-pancartas` - Lonas
- `banderolas` - Banderolas
- `vinilos` - Vinilos
- `rollup` - Roll Up
- `photocall` - Photocall
- `carteles-inmobiliarios` - Inmobiliario
- `mupis` - Mupis
- `flybanner` - Fly Banner

---

## ✏️ Tipografías

### `GET /api/v1/diccionario/tipografias`
Lista todas las tipografías.

### `GET /api/v1/diccionario/tipografias?categoria=sans-serif`
Filtra por categoría.

**Categorías:** `sans-serif`, `serif`, `script`

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "archivo",
      "nombre": "Archivo Black",
      "familia": "'Archivo Black', sans-serif",
      "sample": "ABC",
      "categoria": "sans-serif",
      "peso": "black"
    }
  ]
}
```

---

## 🎨 Colores

### `GET /api/v1/diccionario/colores`
Lista todos los colores predefinidos.

### `GET /api/v1/diccionario/colores?categoria=rojo`
Filtra por categoría.

**Categorías:** `rojo`, `rosa`, `naranja`, `amarillo`, `verde`, `azul`, `purpura`, `neutro`, `metalico`

---

## 🔠 Letras Corpóreas

### `GET /api/v1/diccionario/tipos-corporeas`
Lista los 8 tipos de letras corpóreas.

```json
{
  "success": true,
  "data": [
    {
      "id": "aluminio-sin-luz",
      "nombre": "Aluminio sin luz",
      "icono": "🔩",
      "desc": "Letras de aluminio sin iluminación",
      "materiales": ["aluminio"],
      "iluminacion": false
    }
  ]
}
```

### `GET /api/v1/diccionario/espesores/:tipo`
Obtiene espesores disponibles para un tipo.

**Ejemplo:** `/api/v1/diccionario/espesores/pvc`

```json
{
  "success": true,
  "tipo": "pvc",
  "data": [
    { "valor": 5, "label": "5 cm" },
    { "valor": 8, "label": "8 cm" },
    { "valor": 10, "label": "10 cm (estándar)" },
    { "valor": 13, "label": "13 cm" },
    { "valor": 16, "label": "16 cm" }
  ]
}
```

---

## 💡 Colores de Luz LED

### `GET /api/v1/diccionario/colores-luz`
Lista los 10 colores de luz LED disponibles.

```json
{
  "success": true,
  "data": [
    {
      "id": "blanco-calido",
      "nombre": "Blanco cálido",
      "temp": "4000K",
      "hex": "#FFF5E6",
      "categoria": "blanco"
    }
  ]
}
```

---

## 🔧 Materiales Láser

### `GET /api/v1/diccionario/materiales-laser`
Lista los 6 materiales para corte láser.

---

## 🏪 Tipos de Negocio (Lonas)

### `GET /api/v1/diccionario/tipos-negocio`
Lista los 16 tipos de negocio.

### `GET /api/v1/diccionario/tipos-negocio?categoria=gastronomia`
Filtra por categoría.

**Categorías:** `gastronomia`, `belleza`, `deportes`, `retail`, `servicios`, `industrial`, `salud`, `eventos`, `tecnologia`, `general`

---

## 🎭 Estilos

### `GET /api/v1/diccionario/estilos-visuales`
9 estilos visuales para el diseño.

### `GET /api/v1/diccionario/estilos-lona`
10 estilos específicos para lonas.

---

## 🏢 Fachadas

### `GET /api/v1/diccionario/fachadas`
6 tipos de fachadas para mockup.

---

## 📐 Orientaciones

### `GET /api/v1/diccionario/orientaciones`
3 orientaciones disponibles.

```json
{
  "success": true,
  "data": [
    { "id": "horizontal", "nombre": "Horizontal", "ratio": "16:9" },
    { "id": "vertical", "nombre": "Vertical", "ratio": "9:16" },
    { "id": "cuadrado", "nombre": "Cuadrado", "ratio": "1:1" }
  ]
}
```

---

## 🎨 Temas

### `GET /api/v1/diccionario/temas`
5 temas de UI disponibles.

---

## ✅ Validación

### `POST /api/v1/diccionario/validar`
Valida una configuración de diseño.

**Body:**
```json
{
  "categoria": "letras-corporeas",
  "tipoLetraCorporea": "pvc",
  "espesor": 10
}
```

**Respuesta:**
```json
{
  "success": true,
  "valid": true,
  "errores": [],
  "warnings": []
}
```

---

## 💻 Uso en Frontend (React)

```javascript
// Obtener diccionario completo
const response = await fetch('/api/v1/diccionario');
const { data } = await response.json();

// Usar en componentes
const categorias = data.categoriasProducto;
const tipografias = data.tipografias;

// Filtrar categorías con orientación
const conOrientacion = categorias.filter(cat => 
  data.categoriasConOrientacion.includes(cat.id)
);
```

---

## 🔗 Integración con Generación de Imágenes

El diccionario se utiliza automáticamente al generar imágenes:

```javascript
// El backend usa el diccionario para construir prompts precisos
const disenoData = {
  categoria: 'letras-neon',
  nombreNegocio: 'CAFÉ CENTRAL',
  estiloVisual: 'moderno',
  colores: [{ nombre: 'warm white', hex: '#FFF8E7' }],
  colorLuzLed: 'blanco-calido', // ← Usa el diccionario
  tipografia: { id: 'montserrat', nombre: 'Montserrat' }
};

const resultado = await fetch('/api/v1/disenos/123/generar-imagen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(disenoData)
});
```

El servicio Gemini usará el diccionario para:
1. Buscar el nombre real del color de luz
2. Obtener la temperatura del LED
3. Generar un prompt más específico y preciso

---

## 📊 Estructura de Datos

```
DiccionarioNeonEditor
├── categoriasProducto[12]
│   ├── id, nombre, icono, desc
│   ├── precioBase, unidad, tiempoEntrega
│   └── caracteristicas[]
├── tiposLetrasCorporeas[8]
│   ├── id, nombre, icono, desc
│   ├── materiales[], iluminacion
│   └── requiereMaterialLaser
├── espesoresPorTipo{}
│   └── [tipo]: [{ valor, label }]
├── coloresLuzLed[10]
│   ├── id, nombre, hex
│   └── temp, categoria
├── materialesLaser[6]
├── tiposNegocioLonas[16]
│   └── id, nombre, icono, categoria
├── estilosLona[10]
│   └── id, nombre, colors[], desc
├── acabadosSuperficiales[4]
├── tipografias[10]
│   ├── id, nombre, familia, sample
│   └── categoria, peso
├── coloresPredefinidos[18]
├── estilosVisuales[9]
├── fachadas[6]
├── orientaciones[3]
├── tabsPreview[4]
└── temas[5]
```

---

## 🔄 Cache y Rendimiento

El diccionario es estático y puede cachearse:

```javascript
// Cache por 1 hora
const response = await fetch('/api/v1/diccionario', {
  headers: {
    'Cache-Control': 'max-age=3600'
  }
});
```

---

## 📱 Ejemplo Completo: Selectores Dinámicos

```jsx
function SelectoresDinamicos({ categoria, onChange }) {
  const [diccionario, setDiccionario] = useState(null);
  
  useEffect(() => {
    fetch('/api/v1/diccionario')
      .then(r => r.json())
      .then(({ data }) => setDiccionario(data));
  }, []);
  
  if (!diccionario) return <Loading />;
  
  // Mostrar orientación solo para ciertas categorías
  const mostrarOrientacion = diccionario.categoriasConOrientacion
    .includes(categoria);
  
  // Mostrar tipo corpóreo solo para letras-corporeas
  const mostrarTipoCorporea = diccionario.categoriasConTipoCorporea
    .includes(categoria);
  
  return (
    <>
      {mostrarOrientacion && (
        <SelectorOrientacion 
          opciones={diccionario.orientaciones}
          onChange={onChange}
        />
      )}
      
      {mostrarTipoCorporea && (
        <SelectorTipoCorporea
          opciones={diccionario.tiposLetrasCorporeas}
          espesores={diccionario.espesoresPorTipo}
          onChange={onChange}
        />
      )}
    </>
  );
}
```
