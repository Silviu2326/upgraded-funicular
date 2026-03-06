/**
 * Diccionario de Prompts Profesional - Backend
 * 
 * Versión Node.js del diccionario prompts.js del frontend.
 * Se usa para mejorar descripciones y generar prompts de IA.
 */

// ============================================================================
// PROMPTS POR CATEGORÍA
// ============================================================================

const PROMPTS_CATEGORIA = {
  'rotulos': {
    contexto: 'rótulo luminoso comercial premium con iluminación LED integrada',
    caracteristicas: 'caja de luz profesional, difusor uniforme, estructura aluminio',
    materiales: ['aluminio', 'metacrilato', 'composite'],
    estilos: {
      moderno: 'líneas limpias, iluminación LED uniforme, acabado mate profesional',
      clasico: 'marco tradicional, iluminación cálida, acabados clásicos',
      minimalista: 'diseño sin marco visible, luz indirecta, máxima simplicidad',
      vintage: 'efecto retro, bombillas LED estilo filamento, marco metálico envejecido',
      elegante: 'acabados dorados o plateados, iluminación suave, tipografía serif',
      bold: 'colores vibrantes, alto contraste, presencia visual fuerte',
      industrial: 'estructura metálica visible, acabado raw, iluminación direccional',
      artistico: 'formas orgánicas, iluminación creativa, diseño único'
    },
    mejoras: [
      'con iluminación LED de alta eficiencia',
      'con difusor de luz uniforme sin puntos visibles',
      'con acabado anti-reflejos para máxima legibilidad',
      'con estructura reforzada para exterior',
      'con sistema de fijación oculta',
      'con protección IP65 para intemperie',
      'con transformador LED integrado de bajo consumo',
      'con acrílico difusor de alta transmisión lumínica'
    ]
  },
  
  'letras-neon': {
    contexto: 'letras neón LED flexibles de última generación',
    caracteristicas: 'tubos LED neon flex, brillo uniforme, bajo consumo energético',
    estilos: {
      moderno: 'formas geométricas puras, líneas limpias, brillo contemporáneo',
      clasico: 'estética neón tradicional, curvas suaves, glow clásico',
      minimalista: 'solo elementos esenciales, espacio negativo, máxima simplicidad',
      vintage: 'efecto envejecido, colores retro, patrón de iluminación parpadeante opcional',
      elegante: 'trazos finos, colores sofisticados, transiciones suaves',
      bold: 'grosor extra, colores saturados, impacto visual máximo',
      industrial: 'soportes metálicos visibles, cableado aparente estilizado',
      artistico: 'formas orgánicas, colores gradiente, efectos especiales'
    },
    mejoras: [
      'con tecnología LED de bajo consumo y larga duración',
      'con brillo ajustable según horario',
      'con colores RGB programables',
      'con efecto neón tradicional pero eficiencia moderna',
      'con sistema de montaje oculto',
      'con cableado profesional organizado',
      'con transformador certificado CE',
      'con acabado de silicona premium resistente UV'
    ]
  },
  
  'letras-corporeas': {
    contexto: 'letras corpóreas 3D de alta calidad con volumen tridimensional',
    caracteristicas: 'materiales sólidos, cantos perfectamente acabados, relieve profesional',
    tipos: {
      'aluminio-sin-luz': 'aluminio cepillado o lacado sin iluminación',
      'pvc': 'PVC espumado resistente y económico',
      'aluminio-con-luz': 'aluminio con iluminación frontal LED',
      'pvc-retroiluminadas': 'PVC con iluminación trasera difusa',
      'metacrilato': 'acabado metacrilato premium brillante o mate',
      'pvc-impreso-uv': 'PVC con impresión digital UV de alta resolución',
      'aluminio-retroiluminada': 'aluminio dorado o plateado con luz trasera',
      'dibond-sin-relieve': 'composite plano sin volumen'
    },
    estilos: {
      moderno: 'cortes precisos CNC, cantos perfectos, acabados contemporáneos',
      clasico: 'formas tradicionales, serif tipográfico, nobleza clásica',
      minimalista: 'geometría pura, espesores reducidos, máxima elegancia',
      vintage: 'efecto desgastado, patina metálica, carácter retro',
      elegante: 'materiales nobles, acabados pulidos, detalles sofisticados',
      bold: 'volúmenes generosos, presencia dominante, impacto visual',
      industrial: 'soldaduras visibles, acabado raw, estética workshop',
      artistico: 'formas escultóricas, acabados artesanales, pieza única'
    },
    mejoras: [
      'con fresado CNC de precisión milimétrica',
      'con cantos pulidos a mano por expertos',
      'con tratamiento anti-oxidación para exterior',
      'con múltiples capas de lacado para durabilidad',
      'con sistema de fijación invisible',
      'con patas de aluminio de regulación',
      'con acabado anti-huellas en superficies visibles',
      'con certificación ignífuga opcional'
    ]
  },
  
  'vinilos': {
    contexto: 'vinilo adhesivo de alta calidad para escaparates y superficies lisas',
    caracteristicas: 'impresión digital HD, adhesivo de fácil aplicación, removible',
    tipos: {
      'corte-unico': 'corte en formas personalizadas',
      'impresion': 'impresión a todo color',
      'microperforado': 'visibilidad desde dentro',
      'electrostatico': 'sin adhesivo, reutilizable',
      'decorativo': 'motivos decorativos',
      'opaco': 'bloqueo total visibilidad'
    },
    estilos: {
      moderno: 'líneas limpias, aplicación precisa, efecto flotante',
      clasico: 'marcos tradicionales, tipografía clásica',
      minimalista: 'solo información esencial, espacio respiración',
      vintage: 'efecto envejecido, tipografía retro',
      elegante: 'acabados metalizados, detalles dorados',
      bold: 'colores intensos, formas grandes',
      industrial: 'aspecto raw, texturas concretas',
      artistico: 'ilustraciones, elementos gráficos únicos'
    },
    mejoras: [
      'con adhesivo removible sin residuos',
      'con laminado anti-rayas protector',
      'con impresión eco-solvente sin olor',
      'con precisión de corte milimétrica',
      'con resistencia UV 3-5 años',
      'con fácil aplicación sin burbujas',
      'con opción de reposicionable',
      'con acabado mate anti-reflejos'
    ]
  },
  
  'lonas-pancartas': {
    contexto: 'lona publicitaria de gran formato con impresión digital de alta resolución',
    caracteristicas: 'material reforzado PVC, ojetes metálicos, resistente intemperie',
    tiposNegocio: {
      'restaurante': { color: '#8B4513', icono: '🍽️' },
      'bar': { color: '#D2691E', icono: '🍻' },
      'cafeteria': { color: '#6F4E37', icono: '☕' },
      'tienda-ropa': { color: '#FF69B4', icono: '👕' },
      'peluqueria': { color: '#9932CC', icono: '💇' },
      'gimnasio': { color: '#FF6347', icono: '💪' },
      'tienda-alimentacion': { color: '#32CD32', icono: '🥬' },
      'ferreteria': { color: '#696969', icono: '🔧' },
      'tienda-mascotas': { color: '#FF8C00', icono: '🐾' },
      'clinica-dental': { color: '#87CEEB', icono: '🦷' },
      'farmacia': { color: '#00FF7F', icono: '💊' },
      'tienda-moviles': { color: '#4169E1', icono: '📱' },
      'floristeria': { color: '#FF1493', icono: '🌸' },
      'taller-mecanico': { color: '#2F4F4F', icono: '🔧' },
      'inmobiliaria': { color: '#DAA520', icono: '🏠' },
      'general': { color: '#90439e', icono: '🏪' }
    },
    estilos: {
      moderno: 'diseño limpio, mucho espacio en blanco, fotografía de calidad',
      clasico: 'marcos ornamentales, paleta tradicional, serif elegante',
      minimalista: 'solo lo esencial, tipografía cuidada, fondo neutro',
      vintage: 'texturas envejecidas, colores sepia, tipografía retro',
      elegante: 'detalles dorados, serif sofisticada, colores ricos',
      bold: 'colores saturados, tipografía grande, alto impacto',
      industrial: 'concreto, metal, aspecto urbano contemporáneo',
      artistico: 'ilustraciones, elementos dibujados a mano, creativo',
      geometrico: 'formas geométricas, patrones abstractos, moderno',
      tipografico: 'texto como imagen, lettering artístico, expresivo'
    },
    mejoras: [
      'con impresión digital UV de alta resolución',
      'con material reforzado antidesgarro',
      'con ojetes profesionales cada 50cm',
      'con dobladillo reforzado en todo el perímetro',
      'con colores Pantone certificados',
      'con laminado anti-graffiti opcional',
      'con acabado mate o brillante a elegir',
      'con resistencia a 100km/h de viento'
    ]
  },
  
  'banderolas': {
    contexto: 'banderola comercial luminosa de doble cara',
    caracteristicas: 'estructura aluminio, lona doble cara, iluminación LED',
    estilos: {
      moderno: 'formas geométricas, iluminación uniforme',
      clasico: 'formato tradicional banderín',
      minimalista: 'solo logo, máxima simplicidad',
      vintage: 'aspecto retro iluminado',
      elegante: 'acabados premium, iluminación suave'
    },
    mejoras: [
      'con iluminación LED uniforme ambas caras',
      'con estructura de aluminio anodizado',
      'con sistema de fijación reforzado',
      'con lona de alta resistencia',
      'con transformador de bajo consumo'
    ]
  },
  
  'rigidos-impresos': {
    contexto: 'panel rígido PVC/Dibond con impresión directa UV',
    caracteristicas: 'material sólido, impresión de alta definición, durabilidad',
    materiales: ['pvc-5mm', 'pvc-10mm', 'dibond', 'forex', 'policarbonato'],
    estilos: {
      moderno: 'cortes precisos, impresión nítida',
      industrial: 'materiales brutos, aspecto técnico',
      elegante: 'acabados pulidos, detalles premium'
    },
    mejoras: [
      'con impresión UV de última generación',
      'con colores vibrantes y duraderos',
      'con resistencia a la intemperie',
      'con cantos pulidos o en ángulo'
    ]
  },
  
  'rollup': {
    contexto: 'display rollup portátil profesional',
    caracteristicas: 'mecanismo enrollable, base estable, transporte fácil',
    estilos: {
      moderno: 'diseño limpio, fotografía impactante',
      corporativo: 'paleta marca, información estructurada',
      minimalista: 'mensaje único, espacio negativo'
    },
    mejoras: [
      'con mecanismo de calidad profesional',
      'con base estabilizadora reforzada',
      'con bolsa de transporte incluida',
      'con gráfico reemplazable'
    ]
  },
  
  'photocall': {
    contexto: 'photocall / photocall para eventos',
    caracteristicas: 'gran formato, resistente, personalizable totalmente',
    estilos: {
      moderno: 'patrones geométricos, colores vivos',
      elegante: 'motivos sofisticados, tipografía fina',
      tematico: 'adaptado al evento específico'
    },
    mejoras: [
      'con impresión de alta calidad fotográfica',
      'con estructura estable y segura',
      'con montaje rápido sin herramientas',
      'con opción de diferentes tamaños'
    ]
  },
  
  'carteles-inmobiliarios': {
    contexto: 'cartel inmobiliario de alta visibilidad',
    caracteristicas: 'formato optimizado, legible a distancia, profesional',
    estilos: {
      moderno: 'fotografía grande, información clara',
      clasico: 'diseño tradicional, marco visible',
      minimalista: 'solo datos esenciales'
    },
    mejoras: [
      'con código QR integrado',
      'con acabado anti-reflejos',
      'con fijación segura para exterior',
      'con colores de alta visibilidad'
    ]
  },
  
  'mupis': {
    contexto: 'mupi publicitario urbano',
    caracteristicas: 'formato vertical, alto impacto, resistencia máxima',
    estilos: {
      moderno: 'imagen dominante, poco texto',
      bold: 'colores saturados, impacto visual',
      urbano: 'estética street, actual'
    },
    mejoras: [
      'con impresión gran formato HD',
      'con laminado anti-vandalismo',
      'con retroiluminación opcional',
      'con marco de seguridad'
    ]
  },
  
  'flybanner': {
    contexto: 'fly banner / bandera publicitaria',
    caracteristicas: 'forma vela, movimiento con viento, alta visibilidad',
    tipos: {
      'vela': 'forma de vela tradicional',
      'rectangular': 'formato rectangular',
      'gotero': 'forma de gota'
    },
    estilos: {
      moderno: 'diseño dinámico, colores vibrantes',
      deportivo: 'energía, movimiento',
      corporativo: 'profesional, institucional'
    },
    mejoras: [
      'con tejido airflag que permite paso del viento',
      'con mástil de fibra de vidrio flexible',
      'con base rellenable de agua o arena',
      'con impresión por sublimación duradera'
    ]
  }
};

// ============================================================================
// PROMPTS POR TIPO DE NEGOCIO (para lonas y otros)
// ============================================================================

const PROMPTS_NEGOCIO = {
  'restaurante': {
    keywords: ['culinario', 'gastronomía', 'ambiente cálido', 'elegancia'],
    elementos: ['cubiertos', 'plato principal', 'chef', 'ambiente acogedor'],
    colores: ['rojo', 'naranja', 'marrón', 'dorado'],
    adjetivos: ['delicioso', 'exquisito', 'artesanal', 'gourmet']
  },
  'bar': {
    keywords: ['coctelería', 'ambientación', 'social', 'nocturno'],
    elementos: ['cócteles', 'copas', 'barra', 'luces cálidas'],
    colores: ['ámbar', 'negro', 'dorado', 'rojo'],
    adjetivos: ['trendy', 'cosmopolita', 'animado', 'sofisticado']
  },
  'cafeteria': {
    keywords: ['café', 'desayunos', 'ambiente relajado', 'trabajo'],
    elementos: ['taza de café', 'croissant', 'portátil', 'sofá'],
    colores: ['marrón', 'crema', 'verde', 'blanco'],
    adjetivos: ['acogedor', 'tranquilo', 'productivo', 'aromático']
  },
  'tienda-ropa': {
    keywords: ['moda', 'tendencias', 'estilo', 'vanguardia'],
    elementos: ['percha', 'modelo', 'accesorios', 'espejo'],
    colores: ['negro', 'rosa', 'dorado', 'blanco'],
    adjetivos: ['elegante', 'moderno', 'exclusivo', 'urbano']
  },
  'peluqueria': {
    keywords: ['belleza', 'cuidado', 'transformación', 'estilo'],
    elementos: ['tijeras', 'secador', 'peine', 'espejo'],
    colores: ['morado', 'negro', 'plata', 'rosa'],
    adjetivos: ['profesional', 'vanguardista', 'creativo', 'cuidado']
  },
  'gimnasio': {
    keywords: ['fitness', 'energía', 'salud', 'motivación'],
    elementos: ['pesas', 'mancuernas', 'corredor', 'músculos'],
    colores: ['negro', 'rojo', 'gris', 'naranja'],
    adjetivos: ['potente', 'dinámico', 'intenso', 'saludable']
  },
  'tienda-alimentacion': {
    keywords: ['fresco', 'natural', 'saludable', 'local'],
    elementos: ['verduras', 'frutas', 'cesta', 'campo'],
    colores: ['verde', 'naranja', 'marrón', 'amarillo'],
    adjetivos: ['natural', 'fresco', 'artesanal', 'saludable']
  },
  'ferreteria': {
    keywords: ['herramientas', 'bricolaje', 'construcción', 'soluciones'],
    elementos: ['martillo', 'destornillador', 'caja de herramientas', 'obra'],
    colores: ['naranja', 'negro', 'gris', 'rojo'],
    adjetivos: ['robusto', 'práctico', 'resistente', 'funcional']
  },
  'tienda-mascotas': {
    keywords: ['animales', 'cuidado', 'amor', 'familia'],
    elementos: ['huella', 'hueso', 'mascota feliz', 'corazón'],
    colores: ['naranja', 'marrón', 'verde', 'azul'],
    adjetivos: ['adorable', 'cariñoso', 'saludable', 'divertido']
  },
  'clinica-dental': {
    keywords: ['salud bucal', 'sonrisa', 'higiene', 'cuidado'],
    elementos: ['sonrisa perfecta', 'dientes', 'instrumental', 'clínica moderna'],
    colores: ['blanco', 'azul', 'verde', 'plata'],
    adjetivos: ['profesional', 'cuidadoso', 'moderno', 'saludable']
  },
  'farmacia': {
    keywords: ['salud', 'bienestar', 'medicina', 'cuidado'],
    elementos: ['cruz verde', 'medicamentos', 'bata blanca', 'consulta'],
    colores: ['verde', 'blanco', 'azul', 'naranja'],
    adjetivos: ['confiable', 'profesional', 'cercano', 'sanitario']
  },
  'tienda-moviles': {
    keywords: ['tecnología', 'conectividad', 'modernidad', 'digital'],
    elementos: ['smartphone', 'pantalla', 'apps', 'redes'],
    colores: ['azul', 'negro', 'blanco', 'cian'],
    adjetivos: ['innovador', 'conectado', 'rápido', 'digital']
  },
  'floristeria': {
    keywords: ['naturaleza', 'belleza', 'emociones', 'regalo'],
    elementos: ['ramo', 'flores', 'maceta', 'jardín'],
    colores: ['rosa', 'verde', 'rojo', 'amarillo'],
    adjetivos: ['delicado', 'romántico', 'natural', 'fresco']
  },
  'taller-mecanico': {
    keywords: ['motor', 'reparación', 'potencia', 'confianza'],
    elementos: ['herramientas', 'coche', 'neumático', 'motor'],
    colores: ['rojo', 'negro', 'gris', 'azul'],
    adjetivos: ['potente', 'eficiente', 'rápido', 'profesional']
  },
  'inmobiliaria': {
    keywords: ['hogar', 'inversión', 'futuro', 'espacios'],
    elementos: ['casa', 'llaves', 'familia', 'jardín'],
    colores: ['dorado', 'azul', 'blanco', 'verde'],
    adjetivos: ['confiable', 'exclusivo', 'acogedor', 'seguro']
  },
  'general': {
    keywords: ['profesional', 'calidad', 'servicio', 'confianza'],
    elementos: ['check', 'estrella', 'sello', 'apretón de manos'],
    colores: ['azul', 'gris', 'naranja', 'verde'],
    adjetivos: ['profesional', 'confiable', 'experto', 'calidad']
  }
};

// ============================================================================
// TIPOS DE CORPÓREAS
// ============================================================================

const TIPOS_CORPOREAS = {
  'aluminio-sin-luz': {
    nombre: 'Aluminio sin luz',
    descripcion: 'Letras metálicas sin iluminación',
    materiales: ['Aluminio cepillado', 'Aluminio lacado'],
    acabados: ['Cepillado', 'Mate', 'Brillo'],
    relieve: ['3cm', '5cm', '8cm']
  },
  'pvc': {
    nombre: 'PVC sin luz',
    descripcion: 'PVC espumado económico',
    materiales: ['PVC 10mm', 'PVC 19mm'],
    acabados: ['Pintado', 'Laminado'],
    relieve: ['1cm', '2cm']
  },
  'aluminio-con-luz': {
    nombre: 'Aluminio con luz frontal',
    descripcion: 'Letras metálicas iluminadas frontalmente',
    materiales: ['Aluminio con LEDs frontales'],
    acabados: ['Cepillado', 'Mate'],
    relieve: ['5cm', '8cm']
  },
  'pvc-retroiluminadas': {
    nombre: 'PVC retroiluminado',
    descripcion: 'PVC con iluminación trasera',
    materiales: ['PVC translúcido'],
    acabados: ['Pintado', 'Metacrilato frontal'],
    relieve: ['5cm', '8cm']
  },
  'metacrilato': {
    nombre: 'Metacrilato premium',
    descripcion: 'Acabado brillante de alta calidad',
    materiales: ['Metacrilato colado'],
    acabados: ['Brillo', 'Mate', 'Transparente'],
    relieve: ['2cm', '3cm', '5cm']
  },
  'pvc-impreso-uv': {
    nombre: 'PVC impreso UV',
    descripcion: 'Con impresión digital directa',
    materiales: ['PVC 10mm'],
    acabados: ['Impresión UV', 'Protección UV'],
    relieve: ['1cm', '2cm']
  },
  'aluminio-retroiluminada': {
    nombre: 'Aluminio retroiluminado',
    descripcion: 'Efecto halo de luz trasera',
    materiales: ['Aluminio + difusor'],
    acabados: ['Dorado', 'Plateado', 'Negro'],
    relieve: ['5cm', '8cm']
  },
  'dibond-sin-relieve': {
    nombre: 'Dibond plano',
    descripcion: 'Composite plano sin volumen',
    materiales: ['Composite aluminio'],
    acabados: ['Mate', 'Brillo'],
    relieve: ['3mm', '5mm']
  }
};

// ============================================================================
// COLORES LED
// ============================================================================

const COLORES_LED = {
  'blanco-frio': { nombre: 'Blanco frío', hex: '#F0F8FF', temp: '6000K' },
  'blanco-calido': { nombre: 'Blanco cálido', hex: '#FFF8DC', temp: '3000K' },
  'blanco-neutro': { nombre: 'Blanco neutro', hex: '#FFFAF0', temp: '4000K' },
  'rojo': { nombre: 'Rojo', hex: '#FF0000' },
  'azul': { nombre: 'Azul', hex: '#0000FF' },
  'verde': { nombre: 'Verde', hex: '#00FF00' },
  'amarillo': { nombre: 'Amarillo', hex: '#FFFF00' },
  'rosa': { nombre: 'Rosa', hex: '#FF69B4' },
  'morado': { nombre: 'Morado', hex: '#9400D3' },
  'rgb': { nombre: 'RGB Cambiante', hex: 'multicolor' }
};

// ============================================================================
// MATERIALES LÁSER
// ============================================================================

const MATERIALES_LASER = {
  'transparente': { 
    nombre: 'Metacrilato transparente', 
    descripcion: 'Efecto vidrio elegante',
    grosores: ['3mm', '5mm', '8mm']
  },
  'opaco': { 
    nombre: 'Metacrilato opaco', 
    descripcion: 'Colores sólidos vibrantes',
    grosores: ['3mm', '5mm', '8mm']
  },
  'espejo-plata': { 
    nombre: 'Metacrilato espejo plata', 
    descripcion: 'Reflejo tipo espejo',
    grosores: ['3mm', '5mm']
  },
  'espejo-oro': { 
    nombre: 'Metacrilato espejo oro', 
    descripcion: 'Reflejo dorado lujoso',
    grosores: ['3mm', '5mm']
  },
  'madera': { 
    nombre: 'Madera contrachapada', 
    descripcion: 'Apariencia natural cálida',
    grosores: ['4mm', '6mm']
  },
  'mdf': { 
    nombre: 'MDF pintado', 
    descripcion: 'Económico y versátil',
    grosores: ['3mm', '5mm', '10mm']
  }
};

// ============================================================================
// ESTILOS VISUALES
// ============================================================================

const ESTILOS_VISUALES = {
  moderno: { icon: '✨', nombre: 'Moderno', color: 'blue' },
  clasico: { icon: '🏛️', nombre: 'Clásico', color: 'amber' },
  minimalista: { icon: '○', nombre: 'Minimalista', color: 'gray' },
  vintage: { icon: '📻', nombre: 'Vintage', color: 'orange' },
  elegante: { icon: '💎', nombre: 'Elegante', color: 'purple' },
  bold: { icon: '⚡', nombre: 'Bold/Impactante', color: 'red' },
  industrial: { icon: '🏭', nombre: 'Industrial', color: 'slate' },
  artistico: { icon: '🎨', nombre: 'Artístico', color: 'pink' },
  tecnologico: { icon: '🔷', nombre: 'Tecnológico', color: 'cyan' }
};

// ============================================================================
// FUENTES TIPOGRÁFICAS
// ============================================================================

const FUENTES = {
  modernas: [
    { nombre: 'Montserrat', familia: 'Montserrat', categoria: 'sans-serif' },
    { nombre: 'Poppins', familia: 'Poppins', categoria: 'sans-serif' },
    { nombre: 'Raleway', familia: 'Raleway', categoria: 'sans-serif' },
  ],
  clasicas: [
    { nombre: 'Playfair Display', familia: 'Playfair Display', categoria: 'serif' },
    { nombre: 'Cormorant Garamond', familia: 'Cormorant Garamond', categoria: 'serif' },
    { nombre: 'Libre Baskerville', familia: 'Libre Baskerville', categoria: 'serif' },
  ],
  decorativas: [
    { nombre: 'Pacifico', familia: 'Pacifico', categoria: 'cursive' },
    { nombre: 'Dancing Script', familia: 'Dancing Script', categoria: 'cursive' },
    { nombre: 'Great Vibes', familia: 'Great Vibes', categoria: 'cursive' },
  ]
};

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Obtener mejora aleatoria para una categoría
 */
function getMejoraAleatoria(categoria) {
  const mejoras = PROMPTS_CATEGORIA[categoria]?.mejoras || [];
  if (mejoras.length === 0) return '';
  return mejoras[Math.floor(Math.random() * mejoras.length)];
}

/**
 * Generar prompt para IA con todos los parámetros
 */
function generarPromptIA(categoria, estilo, negocio = null, extras = {}) {
  const catData = PROMPTS_CATEGORIA[categoria];
  const negData = negocio ? PROMPTS_NEGOCIO[negocio] : null;
  
  if (!catData) return '';
  
  let prompt = catData.contexto;
  
  if (catData.estilos[estilo]) {
    prompt += `. Estilo ${estilo}: ${catData.estilos[estilo]}`;
  }
  
  if (negData) {
    prompt += `. Tipo de negocio ${negocio}: ${negData.keywords.join(', ')}`;
    if (negData.elementos.length > 0) {
      prompt += `. Elementos visuales: ${negData.elementos.slice(0, 2).join(', ')}`;
    }
  }
  
  // Añadir mejoras aleatorias
  const mejora = getMejoraAleatoria(categoria);
  if (mejora) {
    prompt += `. ${mejora}`;
  }
  
  // Añadir extras
  if (extras.texto) prompt += `. Texto principal: "${extras.texto}"`;
  if (extras.colores?.length) prompt += `. Paleta de colores: ${extras.colores.join(', ')}`;
  if (extras.orientacion) prompt += `. Orientación: ${extras.orientacion}`;
  
  return prompt;
}

/**
 * Obtener configuración sugerida para un tipo de negocio
 */
function getConfigSugerida(negocio) {
  const negData = PROMPTS_NEGOCIO[negocio];
  if (!negData) return null;
  
  return {
    estilo: 'moderno',
    colores: negData.colores.slice(0, 3),
    elementos: negData.elementos.slice(0, 2)
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  PROMPTS_CATEGORIA,
  PROMPTS_NEGOCIO,
  TIPOS_CORPOREAS,
  COLORES_LED,
  MATERIALES_LASER,
  ESTILOS_VISUALES,
  FUENTES,
  getMejoraAleatoria,
  generarPromptIA,
  getConfigSugerida
};
