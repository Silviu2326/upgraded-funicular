/**
 * Diccionario Dinámico - Neon Editor Page
 * Todas las opciones de configuración del editor de rótulos
 */

const DiccionarioNeonEditor = {
  
  // ==================== CATEGORÍAS DE PRODUCTO ====================
  categoriasProducto: [
    { 
      id: "rotulos", 
      nombre: "Rótulos", 
      icono: "Box", 
      desc: "Rótulos luminosos con estructura", 
      precioBase: 89, 
      unidad: "m²", 
      tiempoEntrega: "5-7 días",
      caracteristicas: ["estructura", "luminoso", "fachada"]
    },
    { 
      id: "letras-neon", 
      nombre: "Neón LED", 
      icono: "Lightbulb", 
      desc: "Neones realistas con tubos de vidrio brillantes. El texto se genera en UNA SOLA LÍNEA horizontal.", 
      precioBase: 45, 
      unidad: "letra", 
      tiempoEntrega: "7-10 días",
      caracteristicas: ["neon", "led", "tubos", "horizontal"]
    },
    { 
      id: "rigidos-impresos", 
      nombre: "Rígidos PVC", 
      icono: "Square", 
      desc: "Paneles rígidos de PVC para señalización", 
      precioBase: 35, 
      unidad: "m²", 
      tiempoEntrega: "3-5 días",
      caracteristicas: ["pvc", "panel", "rigido"]
    },
    { 
      id: "letras-corporeas", 
      nombre: "Corpóreas 3D", 
      icono: "Type", 
      desc: "Letras con volumen real. Usa 'Quitar fondo' para mejor integración en fachadas.", 
      precioBase: 25, 
      unidad: "letra", 
      tiempoEntrega: "7-10 días",
      caracteristicas: ["3d", "volumen", "fachada", "quitar-fondo"]
    },
    { 
      id: "lonas-pancartas", 
      nombre: "Lonas", 
      icono: "Scroll", 
      desc: "Ideal para eventos y promociones. Incluye ojales y refuerzos.", 
      precioBase: 12, 
      unidad: "m²", 
      tiempoEntrega: "2-3 días",
      caracteristicas: ["lona", "eventos", "pancarta", "ojales"],
      sistemaHibrido: true
    },
    { 
      id: "banderolas", 
      nombre: "Banderolas", 
      icono: "Flag", 
      desc: "Banderas publicitarias para farolas", 
      precioBase: 29, 
      unidad: "unidad", 
      tiempoEntrega: "3-5 días",
      caracteristicas: ["bandera", "farola", "doble-cara"]
    },
    { 
      id: "vinilos", 
      nombre: "Vinilos", 
      icono: "MapPin", 
      desc: "Vinilos para escaparates y cristales", 
      precioBase: 18, 
      unidad: "m²", 
      tiempoEntrega: "2-3 días",
      caracteristicas: ["vinilo", "escaparate", "cristal"]
    },
    { 
      id: "rollup", 
      nombre: "Roll Up", 
      icono: "Scroll", 
      desc: "Display enrollable para eventos", 
      precioBase: 49, 
      unidad: "unidad", 
      tiempoEntrega: "2-3 días",
      caracteristicas: ["rollup", "portatil", "eventos"]
    },
    { 
      id: "photocall", 
      nombre: "Photocall", 
      icono: "Camera", 
      desc: "Paneles para fotos en eventos", 
      precioBase: 89, 
      unidad: "unidad", 
      tiempoEntrega: "3-5 días",
      caracteristicas: ["photocall", "fotos", "eventos"]
    },
    { 
      id: "carteles-inmobiliarios", 
      nombre: "Inmobiliario", 
      icono: "Home", 
      desc: "Carteles de SE VENDE / SE ALQUILA", 
      precioBase: 15, 
      unidad: "unidad", 
      tiempoEntrega: "2-3 días",
      caracteristicas: ["inmobiliaria", "cartel", "vende", "alquila"]
    },
    { 
      id: "mupis", 
      nombre: "Mupis", 
      icono: "Monitor", 
      desc: "Mobiliario urbano publicitario", 
      precioBase: 35, 
      unidad: "unidad", 
      tiempoEntrega: "3-5 días",
      caracteristicas: ["mupi", "urbano", "publicidad"]
    },
    { 
      id: "flybanner", 
      nombre: "Fly Banner", 
      icono: "Flag", 
      desc: "Banderas publicitarias con forma de vela", 
      precioBase: 79, 
      unidad: "unidad", 
      tiempoEntrega: "3-5 días",
      caracteristicas: ["fly-banner", "vela", "bandera"]
    },
  ],

  // Categorías que tienen selector de orientación
  categoriasConOrientacion: ["lonas-pancartas", "vinilos", "banderolas", "rollup", "photocall", "mupis", "flybanner"],
  
  // Categorías que tienen selector de tipo corpóreo
  categoriasConTipoCorporea: ["letras-corporeas"],

  // ==================== TIPOS DE LETRAS CORPÓREAS ====================
  tiposLetrasCorporeas: [
    { 
      id: "aluminio-sin-luz", 
      nombre: "Aluminio sin luz", 
      icono: "🔩", 
      desc: "Letras de aluminio sin iluminación",
      materiales: ["aluminio"],
      iluminacion: false
    },
    { 
      id: "pvc", 
      nombre: "PVC fresado", 
      icono: "🎨", 
      desc: "Letras de PVC fresado",
      materiales: ["pvc"],
      iluminacion: false
    },
    { 
      id: "aluminio-con-luz", 
      nombre: "Aluminio con luz", 
      icono: "💡", 
      desc: "Aluminio con iluminación frontal",
      materiales: ["aluminio"],
      iluminacion: true,
      tipoLuz: "frontal"
    },
    { 
      id: "pvc-retroiluminadas", 
      nombre: "PVC retroiluminado", 
      icono: "✨", 
      desc: "PVC con retroiluminación LED",
      materiales: ["pvc"],
      iluminacion: true,
      tipoLuz: "retroiluminada"
    },
    { 
      id: "metacrilato", 
      nombre: "Metacrilato acrílico", 
      icono: "💎", 
      desc: "Letras de metacrilato/acrílico",
      materiales: ["metacrilato", "acrilico"],
      iluminacion: false,
      requiereMaterialLaser: true
    },
    { 
      id: "pvc-impreso-uv", 
      nombre: "PVC impreso UV", 
      icono: "🖨️", 
      desc: "PVC con impresión UV directa",
      materiales: ["pvc"],
      iluminacion: false,
      impresion: "UV"
    },
    { 
      id: "aluminio-retroiluminada", 
      nombre: "Aluminio retroiluminado", 
      icono: "🌟", 
      desc: "Aluminio con halo LED trasero",
      materiales: ["aluminio"],
      iluminacion: true,
      tipoLuz: "halo"
    },
    { 
      id: "dibond-sin-relieve", 
      nombre: "Dibond sin relieve", 
      icono: "📐", 
      desc: "Letras planas de Aluminio/Dibond recortadas",
      materiales: ["dibond", "aluminio"],
      iluminacion: false,
      relieve: false
    },
  ],

  // Tipos de corpóreas que tienen luz
  tiposConLuz: ["aluminio-con-luz", "pvc-retroiluminadas", "aluminio-retroiluminada"],

  // ==================== ESPESORES POR TIPO ====================
  espesoresPorTipo: {
    "aluminio-sin-luz": [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm (estándar)" }, 
      { valor: 10, label: "10 cm" }, 
      { valor: 13, label: "13 cm" }
    ],
    pvc: [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm" }, 
      { valor: 10, label: "10 cm (estándar)" }, 
      { valor: 13, label: "13 cm" }, 
      { valor: 16, label: "16 cm" }
    ],
    "aluminio-con-luz": [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm (estándar)" }, 
      { valor: 10, label: "10 cm" }, 
      { valor: 13, label: "13 cm" }
    ],
    "pvc-retroiluminadas": [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm (estándar)" }, 
      { valor: 10, label: "10 cm" }, 
      { valor: 13, label: "13 cm" }
    ],
    metacrilato: [
      { valor: 3, label: "3 cm (fino)" }, 
      { valor: 5, label: "5 cm (estándar)" }, 
      { valor: 8, label: "8 cm (grueso)" }
    ],
    "pvc-impreso-uv": [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm (estándar)" }, 
      { valor: 10, label: "10 cm" }, 
      { valor: 13, label: "13 cm" }
    ],
    "aluminio-retroiluminada": [
      { valor: 5, label: "5 cm" }, 
      { valor: 8, label: "8 cm (estándar)" }, 
      { valor: 10, label: "10 cm" }, 
      { valor: 13, label: "13 cm" }
    ],
    "dibond-sin-relieve": [
      { valor: 0.3, label: "0.3 cm (plano)" }
    ],
  },

  // ==================== COLORES DE LUZ LED ====================
  coloresLuzLed: [
    { id: "blanco-calido", nombre: "Blanco cálido", temp: "4000K", hex: "#FFF5E6", categoria: "blanco" },
    { id: "blanco-frio", nombre: "Blanco frío", temp: "9000K", hex: "#E6F3FF", categoria: "blanco" },
    { id: "rojo", nombre: "Rojo", hex: "#FF3333", categoria: "color" },
    { id: "verde", nombre: "Verde", hex: "#33FF33", categoria: "color" },
    { id: "azul-celeste", nombre: "Celeste", hex: "#33CCFF", categoria: "color" },
    { id: "azul", nombre: "Azul", hex: "#3333FF", categoria: "color" },
    { id: "naranja", nombre: "Naranja", hex: "#FF9933", categoria: "color" },
    { id: "amarillo", nombre: "Amarillo", hex: "#FFFF33", categoria: "color" },
    { id: "rosa", nombre: "Rosa", hex: "#FF33CC", categoria: "color" },
    { id: "morado", nombre: "Morado", hex: "#9933FF", categoria: "color" },
  ],

  // ==================== MATERIALES LÁSER ====================
  materialesLaser: [
    { 
      id: "transparente", 
      nombre: "Metacrilato Transparente", 
      desc: "Crystal clear, alta claridad óptica",
      acabado: "transparente",
      transparencia: 100
    },
    { 
      id: "blanco", 
      nombre: "Metacrilato Blanco", 
      desc: "Blanco sólido, acabado semi-brillo",
      acabado: "opaco",
      transparencia: 0
    },
    { 
      id: "mdf", 
      nombre: "MDF", 
      desc: "Acabado mate, tabla de fibra de madera",
      acabado: "mate",
      material: "madera"
    },
    { 
      id: "oro-espejo", 
      nombre: "Metacrilato Oro Espejo", 
      desc: "Oro espejo altamente reflectante",
      acabado: "espejo",
      color: "oro"
    },
    { 
      id: "plata-espejo", 
      nombre: "Metacrilato Plata Espejo", 
      desc: "Espejo plata high-gloss",
      acabado: "espejo",
      color: "plata"
    },
    { 
      id: "rosa-espejo", 
      nombre: "Metacrilato Rosa Espejo", 
      desc: "Espejo rosa metálico",
      acabado: "espejo",
      color: "rosa"
    },
  ],

  // ==================== TIPOS DE NEGOCIO PARA LONAS ====================
  tiposNegocioLonas: [
    { id: "restaurante", nombre: "Restaurante", icono: "Utensils", categoria: "gastronomia" },
    { id: "cafeteria", nombre: "Cafetería", icono: "Coffee", categoria: "gastronomia" },
    { id: "panaderia", nombre: "Panadería", icono: "Croissant", categoria: "gastronomia" },
    { id: "peluqueria", nombre: "Peluquería", icono: "Scissors", categoria: "belleza" },
    { id: "gimnasio", nombre: "Gimnasio", icono: "Dumbbell", categoria: "deportes" },
    { id: "tienda_ropa", nombre: "Moda", icono: "Shirt", categoria: "retail" },
    { id: "inmobiliaria", nombre: "Inmobiliaria", icono: "Home", categoria: "servicios" },
    { id: "construccion", nombre: "Construcción", icono: "HardHat", categoria: "industrial" },
    { id: "taller_mecanico", nombre: "Taller", icono: "Wrench", categoria: "industrial" },
    { id: "clinica_dental", nombre: "Dentista", icono: "Stethoscope", categoria: "salud" },
    { id: "veterinaria", nombre: "Veterinaria", icono: "PawPrint", categoria: "salud" },
    { id: "floreria", nombre: "Floristería", icono: "Flower2", categoria: "retail" },
    { id: "fiesta", nombre: "Eventos", icono: "PartyPopper", categoria: "eventos" },
    { id: "deportes", nombre: "Deportes", icono: "Trophy", categoria: "deportes" },
    { id: "tecnologia", nombre: "Tech", icono: "Laptop", categoria: "tecnologia" },
    { id: "general", nombre: "General", icono: "Star", categoria: "general" },
  ],

  // ==================== ESTILOS DE LONA ====================
  estilosLona: [
    { id: "moderno", nombre: "Moderno", colors: ["#3b82f6", "#06b6d4"], desc: "Diseño contemporáneo" },
    { id: "festivo", nombre: "Festivo", colors: ["#f97316", "#eab308"], desc: "Colores vivos y celebración" },
    { id: "elegante", nombre: "Elegante", colors: ["#1f2937", "#d4af37"], desc: "Sofisticado y premium" },
    { id: "dinamico", nombre: "Dinámico", colors: ["#dc2626", "#f97316"], desc: "Energía y movimiento" },
    { id: "natural", nombre: "Natural", colors: ["#15803d", "#84cc16"], desc: "Verdes y tonos tierra" },
    { id: "retro", nombre: "Retro", colors: ["#c2410c", "#fbbf24"], desc: "Estilo vintage clásico" },
    { id: "minimalista", nombre: "Minimal", colors: ["#f5f5f5", "#262626"], desc: "Limpio y simple" },
    { id: "corporativo", nombre: "Corp.", colors: ["#1e3a5f", "#60a5fa"], desc: "Profesional corporativo" },
    { id: "infantil", nombre: "Infantil", colors: ["#ec4899", "#8b5cf6"], desc: "Colores divertidos" },
    { id: "tech", nombre: "Tech", colors: ["#0f172a", "#22d3ee"], desc: "Tecnológico futurista" },
  ],

  // ==================== ACABADOS SUPERFICIALES ====================
  acabadosSuperficiales: [
    { id: "lacado-brillo", nombre: "Lacado brillo", icono: "✨", desc: "Lacado con acabado brillante", reflejo: "alto" },
    { id: "lacado-mate", nombre: "Lacado mate", icono: "🎨", desc: "Lacado con acabado mate", reflejo: "bajo" },
    { id: "cepillado", nombre: "Cepillado", icono: "〰️", desc: "Acabado cepillado metálico", textura: "lineal" },
    { id: "espejo", nombre: "Espejo", icono: "🪞", desc: "Acabado espejo pulido", reflejo: "espejo" },
  ],

  // ==================== TIPOGRAFÍAS ====================
  tipografias: [
    { id: "archivo", nombre: "Archivo Black", familia: "'Archivo Black', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "black" },
    { id: "oswald", nombre: "Oswald", familia: "'Oswald', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "bold" },
    { id: "bebas", nombre: "Bebas Neue", familia: "'Bebas Neue', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "regular" },
    { id: "rajdhani", nombre: "Rajdhani", familia: "'Rajdhani', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "medium" },
    { id: "montserrat", nombre: "Montserrat", familia: "'Montserrat', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "variable" },
    { id: "playfair", nombre: "Playfair", familia: "'Playfair Display', serif", sample: "ABC", categoria: "serif", peso: "elegant" },
    { id: "roboto", nombre: "Roboto", familia: "'Roboto', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "neutral" },
    { id: "opensans", nombre: "Open Sans", familia: "'Open Sans', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "neutral" },
    { id: "lobster", nombre: "Lobster", familia: "'Lobster', cursive", sample: "ABC", categoria: "script", peso: "decorative" },
    { id: "poppins", nombre: "Poppins", familia: "'Poppins', sans-serif", sample: "ABC", categoria: "sans-serif", peso: "geometric" },
  ],

  // ==================== COLORES PREDEFINIDOS ====================
  coloresPredefinidos: [
    { nombre: "Rojo", hex: "#DA291C", categoria: "rojo" },
    { nombre: "Rojo Intenso", hex: "#E4002B", categoria: "rojo" },
    { nombre: "Rosa", hex: "#CE0058", categoria: "rosa" },
    { nombre: "Naranja", hex: "#FF6900", categoria: "naranja" },
    { nombre: "Amarillo", hex: "#FEDD00", categoria: "amarillo" },
    { nombre: "Dorado", hex: "#FFD100", categoria: "amarillo" },
    { nombre: "Verde", hex: "#00A651", categoria: "verde" },
    { nombre: "Verde Menta", hex: "#00B388", categoria: "verde" },
    { nombre: "Azul Claro", hex: "#00A3E0", categoria: "azul" },
    { nombre: "Azul", hex: "#0033A0", categoria: "azul" },
    { nombre: "Azul Oscuro", hex: "#002855", categoria: "azul" },
    { nombre: "Púrpura", hex: "#6D2077", categoria: "purpura" },
    { nombre: "Blanco", hex: "#FFFFFF", categoria: "neutro" },
    { nombre: "Gris Claro", hex: "#F5F5F5", categoria: "neutro" },
    { nombre: "Gris", hex: "#888B8D", categoria: "neutro" },
    { nombre: "Negro", hex: "#1D1D1D", categoria: "neutro" },
    { nombre: "Dorado Metálico", hex: "#D4AF37", categoria: "metalico" },
    { nombre: "Plateado", hex: "#C0C0C0", categoria: "metalico" },
  ],

  // ==================== ESTILOS VISUALES ====================
  estilosVisuales: [
    { id: "moderno", nombre: "Moderno", desc: "Diseño contemporáneo y actual", keywords: ["clean", "minimal", "geometric"] },
    { id: "clasico", nombre: "Clásico", desc: "Estilo tradicional y atemporal", keywords: ["elegant", "traditional", "sophisticated"] },
    { id: "elegante", nombre: "Elegante", desc: "Acabados sofisticados", keywords: ["luxury", "premium", "refined"] },
    { id: "minimalista", nombre: "Minimalista", desc: "Diseño limpio y simple", keywords: ["simple", "clean", "white-space"] },
    { id: "llamativo", nombre: "Llamativo", desc: "Colores vivos y contrastes", keywords: ["bold", "vibrant", "contrasting"] },
    { id: "industrial", nombre: "Industrial", desc: "Estilo urbano y robusto", keywords: ["metal", "raw", "urban"] },
    { id: "vintage", nombre: "Vintage", desc: "Aire retro y nostálgico", keywords: ["retro", "nostalgic", "aged"] },
    { id: "neon", nombre: "Neón", desc: "Estilo luminoso y nocturno", keywords: ["glow", "night", "fluorescent"] },
    { id: "luxury", nombre: "Luxury", desc: "Alta gama y exclusividad", keywords: ["gold", "premium", "exclusive"] },
  ],

  // ==================== FACHADAS ====================
  fachadas: [
    { id: "madera", nombre: "Madera", icono: "Grid3X3", desc: "Panel de madera natural", material: "madera", textura: "natural" },
    { id: "blanca", nombre: "Blanca", icono: "Square", desc: "Pared blanca lisa", material: "pintura", color: "#FFFFFF" },
    { id: "oscura", nombre: "Oscura", icono: "Square", desc: "Pared oscura moderna", material: "pintura", color: "#333333" },
    { id: "ladrillo", nombre: "Ladrillo", icono: "Grid3X3", desc: "Ladrillo visto clásico", material: "ladrillo", textura: "rugosa" },
    { id: "hormigon", nombre: "Hormigón", icono: "Square", desc: "Hormigón industrial", material: "hormigon", textura: "rugosa" },
    { id: "marmol", nombre: "Mármol", icono: "Square", desc: "Mármol elegante", material: "piedra", textura: "pulida" },
  ],

  // ==================== ORIENTACIONES ====================
  orientaciones: [
    { id: "horizontal", nombre: "Horizontal", icono: "Smartphone", ratio: "16:9", desc: "Formato apaisado" },
    { id: "vertical", nombre: "Vertical", icono: "Smartphone", ratio: "9:16", desc: "Formato vertical" },
    { id: "cuadrado", nombre: "Cuadrado", icono: "Square", ratio: "1:1", desc: "Formato cuadrado" },
  ],

  // ==================== TABS DEL PREVIEW ====================
  tabsPreview: [
    { id: "design", nombre: "Diseño", icono: "Palette", desc: "Vista del diseño generado" },
    { id: "mockup", nombre: "Mockup", icono: "Store", desc: "Visualización en fachada" },
    { id: "ar", nombre: "AR", icono: "Glasses", badge: "NUEVO", desc: "Realidad Aumentada" },
    { id: "readability", nombre: "Legibilidad", icono: "Eye", desc: "Análisis de legibilidad" },
  ],

  // ==================== TEMAS ====================
  temas: [
    { 
      id: "industrial", 
      nombre: "Industrial",
      colors: { 
        bg: "#0a0a0a", 
        bgAlt: "#111111", 
        accent: "#ffffff", 
        text: "#e0e0e0", 
        textMuted: "#666666", 
        metal: "#2a2a2a" 
      }
    },
    { 
      id: "minimal", 
      nombre: "Minimal",
      colors: { 
        bg: "#fafafa", 
        bgAlt: "#ffffff", 
        accent: "#1a1a1a", 
        text: "#333333", 
        textMuted: "#888888", 
        metal: "#e5e5e5" 
      }
    },
    { 
      id: "brutalist", 
      nombre: "Brutalist",
      colors: { 
        bg: "#000000", 
        bgAlt: "#000000", 
        accent: "#ffffff", 
        text: "#ffffff", 
        textMuted: "#666666", 
        metal: "#ffffff" 
      }
    },
    { 
      id: "vaporwave", 
      nombre: "Vaporwave",
      colors: { 
        bg: "#0c0518", 
        bgAlt: "#120824", 
        accent: "#ffffff", 
        text: "#e0e0ff", 
        textMuted: "#8a7a9e", 
        metal: "#1a0f2e" 
      }
    },
    { 
      id: "cyberpunk", 
      nombre: "Cyberpunk",
      colors: { 
        bg: "#050810", 
        bgAlt: "#0a1020", 
        accent: "#ffffff", 
        text: "#a0ffe0", 
        textMuted: "#507060", 
        metal: "#102030" 
      }
    },
  ],

  // ==================== MÉTODOS AUXILIARES ====================
  
  /**
   * Obtener categoría por ID
   */
  getCategoria(id) {
    return this.categoriasProducto.find(c => c.id === id);
  },

  /**
   * Verificar si una categoría tiene orientación
   */
  tieneOrientacion(categoriaId) {
    return this.categoriasConOrientacion.includes(categoriaId);
  },

  /**
   * Verificar si una categoría tiene tipo corpóreo
   */
  tieneTipoCorporea(categoriaId) {
    return this.categoriasConTipoCorporea.includes(categoriaId);
  },

  /**
   * Verificar si un tipo de corpórea tiene luz
   */
  tipoTieneLuz(tipoId) {
    return this.tiposConLuz.includes(tipoId);
  },

  /**
   * Obtener espesores disponibles para un tipo
   */
  getEspesores(tipoId) {
    return this.espesoresPorTipo[tipoId] || [];
  },

  /**
   * Obtener tipografía por ID
   */
  getTipografia(id) {
    return this.tipografias.find(t => t.id === id);
  },

  /**
   * Obtener color LED por ID
   */
  getColorLuz(id) {
    return this.coloresLuzLed.find(c => c.id === id);
  },

  /**
   * Obtener estilo visual por ID
   */
  getEstiloVisual(id) {
    return this.estilosVisuales.find(e => e.id === id);
  },

  /**
   * Obtener todos los IDs de categorías
   */
  getIdsCategorias() {
    return this.categoriasProducto.map(c => c.id);
  },

  /**
   * Filtrar tipografías por categoría
   */
  getTipografiasPorCategoria(categoria) {
    return this.tipografias.filter(t => t.categoria === categoria);
  },

  /**
   * Obtener colores por categoría
   */
  getColoresPorCategoria(categoria) {
    return this.coloresPredefinidos.filter(c => c.categoria === categoria);
  },

  /**
   * Obtener tipos de negocio por categoría
   */
  getTiposNegocioPorCategoria(categoria) {
    return this.tiposNegocioLonas.filter(t => t.categoria === categoria);
  }
};

module.exports = DiccionarioNeonEditor;
