/**
 * ============================================================================
 * DICCIONARIO DE PROMPTS PROFESIONAL - Rotulemos
 * ============================================================================
 * Diccionario completo para construcción de prompts de alta calidad
 * para generación de imágenes con IA (Gemini, Midjourney, DALL-E, Stable Diffusion)
 * 
 * Cada entrada incluye:
 * - Descripciones técnicas detalladas
 * - Keywords para prompts
 * - Términos en inglés y español
 * - Templates de texto
 * - Parámetros visuales
 */

const DiccionarioPrompts = {

  // ============================================================================
  // SECCIÓN 1: CATEGORÍAS DE PRODUCTO CON PROMPTS DETALLADOS
  // ============================================================================
  
  categoriasProducto: {
    
    'letras-neon': {
      id: 'letras-neon',
      nombre: { es: 'Neón LED', en: 'LED Neon Sign' },
      descripcion: {
        es: 'Letras luminosas con tubos de neón LED flexibles que emiten una luz brillante y uniforme. Efecto glow característico de neón clásico pero con tecnología LED moderna.',
        en: 'Luminous letters with flexible LED neon tubes emitting bright, uniform light. Classic neon glow effect with modern LED technology.'
      },
      keywords: [
        'neon sign', 'LED neon', 'glowing tubes', 'electric glow', 'fluorescent light',
        'neon light effect', 'glass tubes', 'gas illumination', 'retro neon', 'modern neon',
        'light emission', 'glowing text', 'illuminated signage', 'night glow', 'vibrant colors'
      ],
      promptTemplate: {
        base: 'Professional {color} LED neon sign with "{text}" text, glowing {intensity} neon tubes, {style} design, mounted on {surface}, {lighting} lighting',
        detalles: '{glowEffect} glow effect, {tubeType} tube style, {mounting} mounting',
        calidad: 'photorealistic, 8k, highly detailed, professional photography, sharp focus'
      },
      atributos: {
        materiales: ['flexible LED silicone tubes', 'glass neon tubes', 'LED strip neon', 'electroluminescent wire'],
        efectosLuz: ['uniform glow', 'gradient glow', 'pulsing glow', 'flickering neon', 'steady illumination'],
        montaje: ['wall mounted', 'hanging', 'standalone', 'window mounted', 'suspended'],
        estilos: ['classic neon', 'modern minimalist neon', 'retro vintage neon', 'cyberpunk neon', 'art deco neon']
      },
      parametrosPrompt: {
        relacionAspecto: '16:9 horizontal for single line text',
        iluminacion: 'nighttime, dark background to enhance glow',
        angulo: 'frontal view with slight elevation, eye level',
        textura: 'smooth glossy tubes with soft light diffusion'
      }
    },

    'letras-corporeas': {
      id: 'letras-corporeas',
      nombre: { es: 'Letras Corpóreas 3D', en: '3D Channel Letters' },
      descripcion: {
        es: 'Letras tridimensionales con profundidad real, fabricadas en materiales sólidos como aluminio, PVC o metacrilato. Acabados profesionales con cantos perfectos y opciones de iluminación frontal o trasera.',
        en: 'Three-dimensional letters with real depth, manufactured in solid materials like aluminum, PVC or acrylic. Professional finishes with perfect edges and front or back lighting options.'
      },
      keywords: [
        '3D channel letters', 'dimensional signage', 'depth letters', 'raised letters',
        'fabricated letters', 'architectural signage', 'building letters', 'depth 3D',
        'solid letters', 'professional signage', 'corporate signage', 'mounted letters'
      ],
      promptTemplate: {
        base: 'Professional 3D channel letters spelling "{text}", {material} construction, {depth}cm depth/thickness, {finish} finish, mounted on {surface}',
        detalles: '{bevel} edges, {surface} surface texture, {mounting} mounting style',
        iluminacion: '{lightType} lighting, {brightness} brightness',
        calidad: 'photorealistic architectural visualization, commercial photography, 8k detail'
      },
      atributos: {
        materiales: {
          'aluminio': {
            nombre: 'brushed aluminum',
            descripcion: 'Aluminio cepillado con acabado metálico satinado',
            keywords: ['brushed aluminum', 'metallic finish', 'silver metal', 'anodized aluminum']
          },
          'pvc': {
            nombre: 'PVC foam',
            descripcion: 'PVC expandido de alta densidad, ligero y durable',
            keywords: ['PVC foam', 'forex', 'rigid PVC', 'plastic letters']
          },
          'metacrilato': {
            nombre: 'acrylic',
            descripcion: 'Metacrilato transparente o translúcido con brillo cristalino',
            keywords: ['acrylic', 'plexiglass', 'crystal clear', 'translucent', 'lucite']
          },
          'acero': {
            nombre: 'stainless steel',
            descripcion: 'Acero inoxidable con acabado espejo o cepillado',
            keywords: ['stainless steel', 'mirror finish', 'brushed steel', 'metallic']
          },
          'laton': {
            nombre: 'brass',
            descripcion: 'Latón dorado con acabado brillante o envejecido',
            keywords: ['brass', 'gold metal', 'bronze', 'metallic gold', 'polished brass']
          }
        },
        acabados: {
          'lacado-brillo': { en: 'glossy painted', keywords: ['glossy', 'shiny paint', 'high gloss'] },
          'lacado-mate': { en: 'matte painted', keywords: ['matte', 'flat paint', 'satin finish'] },
          'cepillado': { en: 'brushed', keywords: ['brushed metal', 'satin metal', 'hairline finish'] },
          'espejo': { en: 'mirror polished', keywords: ['mirror finish', 'polished', 'reflective'] },
          'anodizado': { en: 'anodized', keywords: ['anodized', 'electrochemical', 'colored metal'] },
          'oxidado': { en: 'rusted/oxidized', keywords: ['rusted', 'oxidized', 'aged metal', 'patina'] }
        },
        tiposLuz: {
          'frontal': { en: 'face lit', descripcion: 'Iluminación LED en la cara frontal' },
          'trasera': { en: 'halo/back lit', descripcion: 'Halo de luz detrás de las letras' },
          'lateral': { en: 'side lit', descripcion: 'Luz en los cantos laterales' },
          'sin-luz': { en: 'non-illuminated', descripcion: 'Sin iluminación integrada' }
        }
      },
      parametrosPrompt: {
        profundidad: 'depth ranging from 3cm to 20cm depending on material',
        iluminacion: 'professional architectural lighting, soft shadows',
        angulo: 'three-quarter view to show depth and dimension',
        textura: 'material-specific surface texture, realistic reflections'
      }
    },

    'rotulos': {
      id: 'rotulos',
      nombre: { es: 'Rótulos Luminosos', en: 'Lightbox Signs' },
      descripcion: {
        es: 'Cajas de luz con estructura integrada, panel frontal iluminado uniformemente. Solución profesional completa para fachadas comerciales.',
        en: 'Lightboxes with integrated structure, uniformly illuminated front panel. Complete professional solution for commercial facades.'
      },
      keywords: [
        'lightbox sign', 'cabinet sign', 'illuminated sign box', 'backlit sign',
        'storefront sign', 'fascia sign', 'panel sign', 'led lightbox',
        'commercial signage', 'business sign', 'store sign'
      ],
      promptTemplate: {
        base: 'Professional {size} lightbox sign for "{text}", {shape} shape, {frame} frame, {face} face panel',
        iluminacion: 'even LED illumination, {brightness} brightness, {colorTemp} color temperature',
        instalacion: 'mounted on {building} facade, {height} height placement',
        calidad: 'architectural photography, twilight lighting, professional commercial photo'
      },
      atributos: {
        formas: ['rectangular', 'circular', 'oval', 'custom shape', 'rounded corners'],
        marcos: ['aluminum frame', 'stainless steel frame', 'frameless', 'slim profile', 'extruded aluminum'],
        caras: ['acrylic face', 'polycarbonate', 'flex face', 'rigid panel', 'translucent vinyl'],
        tiposMontaje: ['wall mounted', 'hanging bracket', 'pole mounted', 'projecting', 'monument']
      }
    },

    'lonas-pancartas': {
      id: 'lonas-pancartas',
      nombre: { es: 'Lonas y Pancartas', en: 'Banners and Signs' },
      descripcion: {
        es: 'Lonas de gran formato impresas en alta resolución. Sistema híbrido: IA genera fondo decorativo temático, texto se superpone con perfección tipográfica.',
        en: 'Large format printed banners in high resolution. Hybrid system: AI generates decorative themed background, text is overlaid with typographic perfection.'
      },
      keywords: [
        'vinyl banner', 'pvc banner', 'printed banner', 'large format print',
        'advertising banner', 'promotional banner', 'outdoor banner', 'mesh banner',
        'backdrop', 'step and repeat', 'billboard', 'signage banner'
      ],
      promptTemplate: {
        fondo: 'Professional {style} background design for {businessType}, {theme} theme, {colors} color scheme, {pattern} decorative pattern',
        composicion: 'empty center area for text overlay, balanced composition, {orientation} orientation',
        estilo: '{mood} atmosphere, {detail} detail level, print-ready quality',
        calidad: 'high resolution print design, 300dpi quality, large format ready'
      },
      sistemaHibrido: {
        descripcion: 'La IA genera SOLO el fondo decorativo sin texto. El texto se renderiza con Canvas/HTML5 para máxima calidad tipográfica.',
        ventajas: ['Texto siempre perfecto y legible', 'Control total de tipografía', 'Logo nunca distorsionado', 'Fondos artísticos únicos']
      }
    },

    'vinilos': {
      id: 'vinilos',
      nombre: { es: 'Vinilos', en: 'Vinyl Graphics' },
      descripcion: {
        es: 'Vinilos adhesivos de corte e impresión para escaparates, cristales y superficies lisas.',
        en: 'Cut and printed vinyl adhesives for shop windows, glass and smooth surfaces.'
      },
      keywords: [
        'vinyl decal', 'window graphic', 'glass decal', 'adhesive vinyl',
        'window sign', 'frosted vinyl', 'etched glass effect', 'vinyl lettering',
        'transparent decal', 'window display'
      ],
      promptTemplate: {
        base: '{type} vinyl graphic with "{text}" on {surface}, {application} application',
        efectos: ['frosted glass effect', 'transparent with white ink', 'opaque blocking', 'full color print'],
        superficies: ['storefront window', 'glass door', 'interior window', 'mirror', 'smooth wall']
      }
    },

    'rigidos-impresos': {
      id: 'rigidos-impresos',
      nombre: { es: 'Rígidos Impresos', en: 'Rigid Printed Signs' },
      descripcion: {
        es: 'Paneles rígidos de PVC Foam (Forex), Dibond o metacrilato con impresión directa UV.',
        en: 'Rigid panels of PVC Foam (Forex), Dibond or acrylic with direct UV printing.'
      },
      keywords: [
        'pvc sign', 'forex panel', 'dibond sign', 'rigid sign', 'uv printed',
        'flat sign', 'wall sign', 'printed panel', 'foam board', 'composite panel'
      ],
      materiales: {
        'pvc': { en: 'PVC foam board', espesor: '3mm, 5mm, 10mm', peso: 'lightweight' },
        'dibond': { en: 'aluminum composite', espesor: '3mm', peso: 'rigid and flat' },
        'foam': { en: 'foamex', espesor: '5mm', peso: 'ultra lightweight' }
      }
    },

    'banderolas': {
      id: 'banderolas',
      nombre: { es: 'Banderolas', en: 'Blade Signs' },
      descripcion: {
        es: 'Señales proyectadas perpendiculares a la fachada, visibles desde ambos lados de la calle.',
        en: 'Signs projecting perpendicular to the facade, visible from both sides of the street.'
      },
      keywords: [
        'blade sign', 'projecting sign', 'double sided sign', 'swing sign',
        'hanging sign', 'bracket sign', 'street sign', 'pedestrian sign'
      ]
    },

    'rollup': {
      id: 'rollup',
      nombre: { es: 'Roll Up', en: 'Roll Up Banners' },
      descripcion: {
        es: 'Display portátil enrollable con base y estructura incluida. Ideal para eventos y ferias.',
        en: 'Portable roll-up display with base and structure included. Ideal for events and trade shows.'
      },
      keywords: [
        'roll up banner', 'retractable banner', 'pull up display', 'portable sign',
        'trade show display', 'exhibition stand', 'banner stand', 'popup banner'
      ]
    },

    'photocall': {
      id: 'photocall',
      nombre: { es: 'Photocall', en: 'Photo Backdrops' },
      descripcion: {
        es: 'Paneles decorativos para fotos en eventos, con estructura Pop Up o enrollable.',
        en: 'Decorative panels for photos at events, with Pop Up or roll-up structure.'
      },
      keywords: [
        'photo backdrop', 'step and repeat', 'press wall', 'red carpet backdrop',
        'photo booth', 'event backdrop', 'media wall', 'selfie wall'
      ]
    },

    'carteles-inmobiliarios': {
      id: 'carteles-inmobiliarios',
      nombre: { es: 'Carteles Inmobiliarios', en: 'Real Estate Signs' },
      descripcion: {
        es: 'Carteles de SE VENDE, SE ALQUILA, SE ALQUILA CON OPCIÓN A COMPRA. Formatos estandarizados.',
        en: 'FOR SALE, FOR RENT, RENT TO OWN signs. Standardized formats.'
      },
      keywords: [
        'for sale sign', 'for rent sign', 'real estate sign', 'property sign',
        'open house sign', 'yard sign', 'estate agent sign', 'hanging sign'
      ]
    },

    'mupis': {
      id: 'mupis',
      nombre: { es: 'Mupis', en: 'Urban Furniture Ads' },
      descripcion: {
        es: 'Mobiliario urbano publicitario: marquesinas de autobús, cabinas telefónicas, etc.',
        en: 'Urban advertising furniture: bus shelters, telephone booths, etc.'
      },
      keywords: [
        'bus shelter ad', 'street furniture', 'urban advertising', 'mupi',
        'citylight', 'backlit urban', 'street advertisement', 'public space'
      ]
    },

    'flybanner': {
      id: 'flybanner',
      nombre: { es: 'Fly Banner', en: 'Feather Flags' },
      descripcion: {
        es: 'Banderas publicitarias con forma de vela o lágrima que se mueven con el viento.',
        en: 'Advertising flags with sail or teardrop shape that move with the wind.'
      },
      keywords: [
        'feather flag', 'teardrop banner', 'wind flag', 'beach flag',
        'sail banner', 'flutter flag', 'advertising flag', 'bow flag'
      ]
    }
  },

  // ============================================================================
  // SECCIÓN 2: TIPOGRAFÍAS CON DESCRIPCIONES DETALLADAS
  // ============================================================================
  
  tipografias: {
    'archivo': {
      id: 'archivo',
      nombre: 'Archivo Black',
      familia: "'Archivo Black', sans-serif",
      categoria: 'sans-serif',
      peso: 'black',
      descripcion: {
        es: 'Tipografía sans-serif geométrica con peso extra bold. Formas limpias y modernas con gran impacto visual.',
        en: 'Geometric sans-serif typeface with extra bold weight. Clean, modern shapes with high visual impact.'
      },
      keywords: ['bold', 'geometric', 'modern', 'strong', 'powerful', 'architectural', 'blocky'],
      usoRecomendado: 'Títulos cortos, neón, corpóreas con impacto',
      personalidad: 'Moderna, fuerte, corporativa, masculina',
      legibilidad: { corta: 'excelente', larga: 'buena' }
    },

    'oswald': {
      id: 'oswald',
      nombre: 'Oswald',
      familia: "'Oswald', sans-serif",
      categoria: 'sans-serif',
      peso: 'bold',
      descripcion: {
        es: 'Reinterpretación clásica de estilos sans-serif como Alternate Gothic. Formas condensadas y altura uniforme.',
        en: 'Classic reimagining of sans-serif styles like Alternate Gothic. Condensed forms with uniform height.'
      },
      keywords: ['condensed', 'classic', 'newspaper', 'vintage', 'retro', 'tall', 'narrow'],
      usoRecomendado: 'Textos medianos, rótulos verticales',
      personalidad: 'Clásica, periodística, urbana, industrial',
      legibilidad: { corta: 'excelente', larga: 'excelente' }
    },

    'bebas': {
      id: 'bebas',
      nombre: 'Bebas Neue',
      familia: "'Bebas Neue', sans-serif",
      categoria: 'sans-serif',
      peso: 'regular',
      descripcion: {
        es: 'Familia tipográfica condensada con formas limpias y elegantes. Perfecta para display y titulares.',
        en: 'Condensed typeface family with clean, elegant forms. Perfect for display and headlines.'
      },
      keywords: ['condensed', 'elegant', 'display', 'fashion', 'clean', 'minimal', 'premium'],
      usoRecomendado: 'Letras corpóreas elegantes, moda, lujo',
      personalidad: 'Elegante, minimalista, premium, moderna',
      legibilidad: { corta: 'excelente', larga: 'regular' }
    },

    'rajdhani': {
      id: 'rajdhani',
      nombre: 'Rajdhani',
      familia: "'Rajdhani', sans-serif",
      categoria: 'sans-serif',
      peso: 'medium',
      descripcion: {
        es: 'Tipografía con influencias de la tipografía india y geometría técnica. Formas cuadradas con toque único.',
        en: 'Typeface with Indian typography influences and technical geometry. Square forms with unique touch.'
      },
      keywords: ['technical', 'geometric', 'unique', 'industrial', 'digital', 'futuristic', 'square'],
      usoRecomendado: 'Tech, startups, industrial moderno',
      personalidad: 'Técnica, futurista, única, precisa',
      legibilidad: { corta: 'excelente', larga: 'buena' }
    },

    'montserrat': {
      id: 'montserrat',
      nombre: 'Montserrat',
      familia: "'Montserrat', sans-serif",
      categoria: 'sans-serif',
      peso: 'variable',
      descripcion: {
        es: 'Inspirada en la tipografía urbana de Buenos Aires. Versátil con múltiples pesos, excelente legibilidad.',
        en: 'Inspired by urban typography of Buenos Aires. Versatile with multiple weights, excellent legibility.'
      },
      keywords: ['versatile', 'geometric', 'urban', 'friendly', 'modern', 'readable', 'balanced'],
      usoRecomendado: 'Uso universal, cualquier tipo de negocio',
      personalidad: 'Amigable, versátil, urbana, contemporánea',
      legibilidad: { corta: 'excelente', larga: 'excelente' }
    },

    'playfair': {
      id: 'playfair',
      nombre: 'Playfair Display',
      familia: "'Playfair Display', serif",
      categoria: 'serif',
      peso: 'elegant',
      descripcion: {
        es: 'Tipografía serif de transición con alto contraste. Elegante y sofisticada, perfecta para luxury.',
        en: 'Transitional serif typeface with high contrast. Elegant and sophisticated, perfect for luxury.'
      },
      keywords: ['elegant', 'luxury', 'fashion', 'editorial', 'classic', 'sophisticated', 'high-contrast'],
      usoRecomendado: 'Lujo, moda, bodas, restaurantes elegantes',
      personalidad: 'Elegante, sofisticada, clásica, femenina',
      legibilidad: { corta: 'excelente', larga: 'regular' }
    },

    'roboto': {
      id: 'roboto',
      nombre: 'Roboto',
      familia: "'Roboto', sans-serif",
      categoria: 'sans-serif',
      peso: 'neutral',
      descripcion: {
        es: 'Familia tipográfica neo-grotesque con formas geométricas pero amigables. Diseñada para Google.',
        en: 'Neo-grotesque typeface family with geometric yet friendly forms. Designed for Google.'
      },
      keywords: ['neutral', 'modern', 'technical', 'clean', 'google', 'versatile', 'legible'],
      usoRecomendado: 'Tech, apps, corporativo moderno',
      personalidad: 'Neutral, técnica, moderna, universal',
      legibilidad: { corta: 'excelente', larga: 'excelente' }
    },

    'opensans': {
      id: 'opensans',
      nombre: 'Open Sans',
      familia: "'Open Sans', sans-serif",
      categoria: 'sans-serif',
      peso: 'neutral',
      descripcion: {
        es: 'Diseñada para excelente legibilidad en pantalla y print. Formas abiertas y amigables.',
        en: 'Designed for excellent legibility on screen and print. Open and friendly forms.'
      },
      keywords: ['friendly', 'open', 'readable', 'humanist', 'warm', 'approachable', 'clean'],
      usoRecomendado: 'Restaurantes, retail, servicios al cliente',
      personalidad: 'Cálida, accesible, profesional, acogedora',
      legibilidad: { corta: 'excelente', larga: 'excelente' }
    },

    'lobster': {
      id: 'lobster',
      nombre: 'Lobster',
      familia: "'Lobster', cursive",
      categoria: 'script',
      peso: 'decorative',
      descripcion: {
        es: 'Tipografía script con estilo retro caligráfico. Letras conectadas con personalidad fuerte.',
        en: 'Script typeface with retro calligraphic style. Connected letters with strong personality.'
      },
      keywords: ['script', 'decorative', 'retro', 'vintage', 'calligraphic', 'playful', 'cursive'],
      usoRecomendado: 'Restaurantes, cafeterías, negocios con personalidad',
      personalidad: 'Divertida, retro, casual, expresiva',
      legibilidad: { corta: 'buena', larga: 'regular' }
    },

    'poppins': {
      id: 'poppins',
      nombre: 'Poppins',
      familia: "'Poppins', sans-serif",
      categoria: 'sans-serif',
      peso: 'geometric',
      descripcion: {
        es: 'Familia tipográfica geométrica con formas casi puramente circulares y cuadradas. Moderna y amigable.',
        en: 'Geometric typeface family with almost purely circular and square forms. Modern and friendly.'
      },
      keywords: ['geometric', 'modern', 'friendly', 'round', 'contemporary', 'fresh', 'clean'],
      usoRecomendado: 'Startups, tech, marcas jóvenes',
      personalidad: 'Joven, fresca, amigable, geométrica',
      legibilidad: { corta: 'excelente', larga: 'buena' }
    }
  },

  // ============================================================================
  // SECCIÓN 3: COLORES CON DESCRIPCIONES PARA PROMPTS
  // ============================================================================
  
  colores: {
    // Rojos
    'rojo': {
      hex: '#DA291C',
      nombres: { es: 'Rojo', en: 'Red' },
      descripcion: 'Rojo intenso y energético, color de pasión y atención',
      keywords: ['red', 'bold', 'passion', 'energy', 'attention', 'urgency', 'power'],
      emocion: 'Pasión, energía, urgencia, fuerza',
      uso: 'Llamadas a la acción, restaurantes, deportes',
      contraste: 'Blanco, negro, dorado'
    },
    'rojo-intenso': {
      hex: '#E4002B',
      nombres: { es: 'Rojo Intenso', en: 'Intense Red' },
      descripcion: 'Rojo vibrante cercano al neón, muy llamativo',
      keywords: ['bright red', 'neon red', 'vivid', 'intense', 'electric red'],
      emocion: 'Excitación, intensidad, modernidad',
      uso: 'Neón, señales de emergencia, branding joven',
      contraste: 'Blanco, negro, gris'
    },
    'rosa': {
      hex: '#CE0058',
      nombres: { es: 'Rosa', en: 'Pink' },
      descripcion: 'Rosa magenta profundo, sofisticado y moderno',
      keywords: ['magenta', 'deep pink', 'sophisticated', 'feminine', 'modern'],
      emocion: 'Creatividad, feminidad, modernidad, juventud',
      uso: 'Belleza, moda, lifestyle, eventos',
      contraste: 'Blanco, negro, dorado'
    },
    
    // Naranjas y Amarillos
    'naranja': {
      hex: '#FF6900',
      nombres: { es: 'Naranja', en: 'Orange' },
      descripcion: 'Naranja vibrante y amigable, energía creativa',
      keywords: ['orange', 'creative', 'energetic', 'warm', 'friendly', 'youthful'],
      emocion: 'Creatividad, entusiasmo, calidez, juventud',
      uso: 'Creativos, tecnología, comida, infantil',
      contraste: 'Blanco, azul oscuro, gris'
    },
    'amarillo': {
      hex: '#FEDD00',
      nombres: { es: 'Amarillo', en: 'Yellow' },
      descripcion: 'Amarillo brillante y optimista, máxima visibilidad',
      keywords: ['yellow', 'optimistic', 'bright', 'happy', 'visible', 'sunny'],
      emocion: 'Optimismo, felicidad, energía, atención',
      uso: 'Señales, construcción, infantil, verano',
      contraste: 'Negro, azul oscuro, gris oscuro'
    },
    'dorado': {
      hex: '#FFD100',
      nombres: { es: 'Dorado', en: 'Gold' },
      descripcion: 'Amarillo dorado cálido, lujo accesible',
      keywords: ['gold', 'warm gold', 'premium', 'luxury', 'rich', 'valuable'],
      emocion: 'Lujo, calidez, valor, celebración',
      uso: 'Lujo accesible, celebraciones, alimentos',
      contraste: 'Negro, azul marino, burdeos'
    },

    // Verdes
    'verde': {
      hex: '#00A651',
      nombres: { es: 'Verde', en: 'Green' },
      descripcion: 'Verde vivo y natural, equilibrio y crecimiento',
      keywords: ['green', 'nature', 'growth', 'fresh', 'eco-friendly', 'balance'],
      emocion: 'Naturaleza, crecimiento, salud, armonía',
      uso: 'Ecológico, salud, gastronomía, naturaleza',
      contraste: 'Blanco, marrón, beige, crema'
    },
    'verde-menta': {
      hex: '#00B388',
      nombres: { es: 'Verde Menta', en: 'Mint Green' },
      descripcion: 'Verde azulado fresco y moderno, limpieza y frescura',
      keywords: ['mint', 'turquoise', 'fresh', 'clean', 'modern', 'cool'],
      emocion: 'Frescura, limpieza, modernidad, salud',
      uso: 'Belleza, limpieza, médico, tech moderno',
      contraste: 'Blanco, rosa, coral, gris'
    },

    // Azules
    'azul-claro': {
      hex: '#00A3E0',
      nombres: { es: 'Azul Claro', en: 'Light Blue' },
      descripcion: 'Azul cian brillante, tecnología y confianza',
      keywords: ['cyan', 'sky blue', 'tech', 'trust', 'bright', 'digital'],
      emocion: 'Tecnología, confianza, claridad, modernidad',
      uso: 'Tech, startups, salud, corporativo moderno',
      contraste: 'Blanco, gris oscuro, naranja'
    },
    'azul': {
      hex: '#0033A0',
      nombres: { es: 'Azul', en: 'Blue' },
      descripcion: 'Azul corporativo profundo, profesionalismo y seguridad',
      keywords: ['blue', 'corporate', 'professional', 'trustworthy', 'stable', 'classic'],
      emocion: 'Confianza, profesionalismo, seguridad, estabilidad',
      uso: 'Corporativo, financiero, legal, tech',
      contraste: 'Blanco, gris, plata, dorado'
    },
    'azul-oscuro': {
      hex: '#002855',
      nombres: { es: 'Azul Oscuro', en: 'Dark Blue' },
      descripcion: 'Azul marino profundo, elegancia y autoridad',
      keywords: ['navy', 'dark blue', 'elegant', 'authoritative', 'luxury', 'classic'],
      emocion: 'Autoridad, elegancia, tradición, lujo',
      uso: 'Lujo, legal, náutico, tradicional',
      contraste: 'Dorado, plata, blanco, cobre'
    },

    // Púrpuras
    'purpura': {
      hex: '#6D2077',
      nombres: { es: 'Púrpura', en: 'Purple' },
      descripcion: 'Púrpura corporativo, creatividad y sabiduría',
      keywords: ['purple', 'creative', 'wisdom', 'luxury', 'mystery', 'royal'],
      emocion: 'Creatividad, lujo, sabiduría, originalidad',
      uso: 'Creativo, belleza, tech, espiritual',
      contraste: 'Blanco, dorado, plata, rosa'
    },

    // Neutros
    'blanco': {
      hex: '#FFFFFF',
      nombres: { es: 'Blanco', en: 'White' },
      descripcion: 'Blanco puro, limpieza y simplicidad absoluta',
      keywords: ['white', 'clean', 'pure', 'minimal', 'modern', 'simple'],
      emocion: 'Pureza, limpieza, simplicidad, modernidad',
      uso: 'Minimalista, médico, tech, lujo puro',
      contraste: 'Negro, gris, cualquier color'
    },
    'gris-claro': {
      hex: '#F5F5F5',
      nombres: { es: 'Gris Claro', en: 'Light Gray' },
      descripcion: 'Gris muy claro, neutralidad sofisticada',
      keywords: ['light gray', 'subtle', 'neutral', 'sophisticated', 'soft'],
      emocion: 'Neutralidad, calma, sofisticación',
      uso: 'Fondos, espacios minimalistas, tech',
      contraste: 'Negro, azul, rojo, casi cualquiera'
    },
    'gris': {
      hex: '#888B8D',
      nombres: { es: 'Gris', en: 'Gray' },
      descripcion: 'Gris medio, neutralidad profesional',
      keywords: ['gray', 'neutral', 'professional', 'balanced', 'corporate'],
      emocion: 'Neutralidad, profesionalismo, equilibrio',
      uso: 'Corporativo, industrial, tech, neutral',
      contraste: 'Blanco, negro, azul, rojo'
    },
    'negro': {
      hex: '#1D1D1D',
      nombres: { es: 'Negro', en: 'Black' },
      descripcion: 'Negro profundo, elegancia atemporal y poder',
      keywords: ['black', 'elegant', 'powerful', 'luxury', 'timeless', 'bold'],
      emocion: 'Elegancia, poder, misterio, sofisticación',
      uso: 'Lujo, moda, elegancia, contraste máximo',
      contraste: 'Blanco, dorado, plata, rojo'
    },

    // Metálicos
    'dorado-metalico': {
      hex: '#D4AF37',
      nombres: { es: 'Dorado Metálico', en: 'Metallic Gold' },
      descripcion: 'Oro metálico brillante, lujo clásico',
      keywords: ['metallic gold', 'shiny gold', 'luxury', 'premium', 'rich', 'opulent'],
      emocion: 'Lujo supremo, riqueza, tradición, celebración',
      uso: 'Lujo, celebraciones, premium, clásico',
      contraste: 'Negro, azul marino, burdeos, verde oscuro'
    },
    'plateado': {
      hex: '#C0C0C0',
      nombres: { es: 'Plateado', en: 'Silver' },
      descripcion: 'Plata metálica, modernidad tecnológica',
      keywords: ['silver', 'metallic', 'modern', 'tech', 'sleek', 'futuristic'],
      emocion: 'Modernidad, tecnología, elegancia fría',
      uso: 'Tech, moderno, automoción, futurista',
      contraste: 'Negro, azul oscuro, blanco, gris'
    }
  },

  // ============================================================================
  // SECCIÓN 4: ESTILOS VISUALES CON DESCRIPCIONES DETALLADAS
  // ============================================================================
  
  estilosVisuales: {
    'moderno': {
      id: 'moderno',
      nombre: { es: 'Moderno', en: 'Modern' },
      descripcion: {
        es: 'Diseño contemporáneo con líneas limpias, formas geométricas y tipografía sans-serif. Enfocado en la funcionalidad y la estética minimalista.',
        en: 'Contemporary design with clean lines, geometric shapes and sans-serif typography. Focused on functionality and minimalist aesthetics.'
      },
      keywords: ['contemporary', 'clean', 'geometric', 'minimalist', 'sleek', 'streamlined', 'current'],
      elementos: ['straight lines', 'geometric shapes', 'sans-serif fonts', 'white space', 'flat design'],
      paleta: ['monochrome', 'bold accents', 'clean whites', 'grayscale with color pops'],
      iluminacion: 'Even, professional lighting, minimal shadows',
      referencias: 'Apple, Google, Scandinavian design'
    },

    'clasico': {
      id: 'clasico',
      nombre: { es: 'Clásico', en: 'Classic' },
      descripcion: {
        es: 'Estilo tradicional atemporal con serifas elegantes, proporciones equilibradas y acabados nobles. Transmite confianza y tradición.',
        en: 'Timeless traditional style with elegant serifs, balanced proportions and noble finishes. Transmits trust and tradition.'
      },
      keywords: ['traditional', 'timeless', 'elegant', 'serif', 'balanced', 'heritage', 'established'],
      elementos: ['serif typography', 'symmetrical layouts', 'rich materials', 'ornate details', 'proportional design'],
      paleta: ['navy blue', 'burgundy', 'gold', 'cream', 'deep greens'],
      iluminacion: 'Warm, soft lighting, traditional ambiance',
      referencias: 'Law firms, banks, luxury hotels, academic institutions'
    },

    'elegante': {
      id: 'elegante',
      nombre: { es: 'Elegante', en: 'Elegant' },
      descripcion: {
        es: 'Refinamiento sofisticado con materiales premium, detalles cuidados y una estética de alta gama. Exclusividad y distinción.',
        en: 'Sophisticated refinement with premium materials, careful details and high-end aesthetics. Exclusivity and distinction.'
      },
      keywords: ['sophisticated', 'refined', 'premium', 'luxury', 'exclusive', 'high-end', 'polished'],
      elementos: ['premium materials', 'subtle details', 'refined finishes', 'luxury textures', 'understated elegance'],
      paleta: ['black and gold', 'white and silver', 'deep jewel tones', 'metallic accents'],
      iluminacion: 'Dramatic lighting, highlights, luxury ambiance',
      referencias: 'Luxury brands, haute couture, fine dining, premium cosmetics'
    },

    'minimalista': {
      id: 'minimalista',
      nombre: { es: 'Minimalista', en: 'Minimalist' },
      descripcion: {
        es: 'Máxima simplicidad, solo lo esencial. Formas puras, colores neutros y ausencia de ornamentos. Belleza en la sencillez.',
        en: 'Maximum simplicity, only the essential. Pure forms, neutral colors and absence of ornaments. Beauty in simplicity.'
      },
      keywords: ['minimal', 'simple', 'essential', 'pure', 'clean', 'uncluttered', 'zen'],
      elementos: ['lots of white space', 'simple shapes', 'limited palette', 'clean lines', 'functional design'],
      paleta: ['white', 'black', 'gray', 'single accent color', 'monochrome'],
      iluminacion: 'Natural light, soft shadows, airy feel',
      referencias: 'Muji, Dieter Rams, Japanese aesthetics'
    },

    'llamativo': {
      id: 'llamativo',
      nombre: { es: 'Llamativo', en: 'Bold' },
      descripcion: {
        es: 'Colores vivos, contrastes fuertes y elementos impactantes. Diseño que no pasa desapercibido y captura la atención inmediatamente.',
        en: 'Vivid colors, strong contrasts and impactful elements. Design that doesn\'t go unnoticed and captures attention immediately.'
      },
      keywords: ['bold', 'vibrant', 'eye-catching', 'contrasting', 'loud', 'energetic', 'dynamic'],
      elementos: ['bright colors', 'strong contrasts', 'bold typography', 'dynamic compositions', 'visual impact'],
      paleta: ['complementary colors', 'neon accents', 'high contrast', 'saturated hues'],
      iluminacion: 'Bright, dramatic, high contrast lighting',
      referencias: 'Pop art, street art, energy drinks, entertainment'
    },

    'industrial': {
      id: 'industrial',
      nombre: { es: 'Industrial', en: 'Industrial' },
      descripcion: {
        es: 'Estética urbana robusta inspirada en fábricas y espacios industriales. Materiales brutos, acero y hormigón visibles.',
        en: 'Robust urban aesthetic inspired by factories and industrial spaces. Raw materials, visible steel and concrete.'
      },
      keywords: ['industrial', 'urban', 'raw', 'metal', 'grunge', 'mechanical', 'factory'],
      elementos: ['exposed materials', 'metal textures', 'concrete', 'rivets', 'weathered surfaces', 'mechanical elements'],
      paleta: ['rust', 'steel gray', 'concrete', 'black', 'oxide colors'],
      iluminacion: 'Harsh lighting, dramatic shadows, gritty atmosphere',
      referencias: 'Loft spaces, craft breweries, workshops, urban venues'
    },

    'vintage': {
      id: 'vintage',
      nombre: { es: 'Vintage', en: 'Vintage' },
      descripcion: {
        es: 'Aire retro y nostálgico inspirado en décadas pasadas. Tipografía clásica, texturas envejecidas y colores desaturados.',
        en: 'Retro and nostalgic air inspired by past decades. Classic typography, aged textures and desaturated colors.'
      },
      keywords: ['retro', 'nostalgic', 'aged', 'classic', 'old-school', 'heritage', 'throwback'],
      elementos: ['distressed textures', 'classic fonts', 'aged paper', 'vintage ornaments', 'patina effects'],
      paleta: ['sepia', 'faded colors', 'cream', 'browns', 'muted tones'],
      iluminacion: 'Warm, golden hour, nostalgic filter',
      referencias: '1950s diners, retro cafes, antique shops, vinyl records'
    },

    'neon': {
      id: 'neon',
      nombre: { es: 'Neón', en: 'Neon' },
      descripcion: {
        es: 'Estilo luminoso nocturno con efectos de neón brillante, oscuridad dramática y ambiente urbano nocturno.',
        en: 'Luminous nighttime style with bright neon effects, dramatic darkness and urban nighttime atmosphere.'
      },
      keywords: ['neon', 'night', 'glow', 'electric', 'cyberpunk', 'nightlife', 'urban night'],
      elementos: ['neon glow effects', 'dark backgrounds', 'electric colors', 'night city', 'light reflections'],
      paleta: ['hot pink', 'electric blue', 'neon green', 'purple', 'black'],
      iluminacion: 'Night scene, neon glow, dramatic lighting, dark background',
      referencias: 'Night clubs, Tokyo nights, Blade Runner, Las Vegas'
    },

    'luxury': {
      id: 'luxury',
      nombre: { es: 'Lujo', en: 'Luxury' },
      descripcion: {
        es: 'Alta gama y exclusividad absoluta. Materiales nobles, acabados impecables y una estética que transmite riqueza.',
        en: 'High end and absolute exclusivity. Noble materials, impeccable finishes and aesthetics that convey wealth.'
      },
      keywords: ['luxury', 'exclusive', 'prestige', 'opulent', 'refined', 'premium', 'high-end'],
      elementos: ['precious metals', 'marble', 'velvet', 'crystal', 'handcrafted details', 'limited edition feel'],
      paleta: ['gold', 'black', 'white', 'deep purple', 'emerald', 'champagne'],
      iluminacion: 'Dramatic, spotlight, luxurious ambiance, perfect highlights',
      referencias: 'Luxury brands, five-star hotels, exclusive clubs, haute couture'
    }
  },

  // ============================================================================
  // SECCIÓN 5: MATERIALES CON DESCRIPCIONES TÉCNICAS
  // ============================================================================
  
  materiales: {
    'aluminio': {
      nombre: { es: 'Aluminio', en: 'Aluminum' },
      descripcion: 'Metal ligero, durable y versátil. No se oxida y acepta múltiples acabados.',
      acabados: ['brushed', 'polished', 'anodized', 'powder coated', 'mirror'],
      keywords: ['lightweight', 'rust-resistant', 'metallic', 'modern', 'professional'],
      apariencia: 'Metálica, puede ser mate o brillante según acabado',
      peso: 'ligero',
      durabilidad: 'muy alta'
    },
    'pvc': {
      nombre: { es: 'PVC', en: 'PVC' },
      descripcion: 'Plástico rígido y económico. Fácil de mecanizar y pintar.',
      acabados: ['painted matte', 'painted gloss', 'raw white', 'printed UV'],
      keywords: ['plastic', 'lightweight', 'economical', 'versatile', 'paintable'],
      apariencia: 'Plástico sólido, opaco o ligeramente brillante',
      peso: 'muy ligero',
      durabilidad: 'media-alta'
    },
    'metacrilato': {
      nombre: { es: 'Metacrilato', en: 'Acrylic' },
      descripcion: 'Plástico tipo vidrio, transparente o translúcido. Excelente transmisión de luz.',
      acabados: ['crystal clear', 'opal white', 'colored transparent', 'frosted', 'mirror'],
      keywords: ['glass-like', 'transparent', 'crystal', 'light transmission', 'premium plastic'],
      apariencia: 'Cristalino o translúcido, brillante',
      peso: 'ligero',
      durabilidad: 'media'
    },
    'acero': {
      nombre: { es: 'Acero Inoxidable', en: 'Stainless Steel' },
      descripcion: 'Metal pesado con acabado premium. Máxima durabilidad y elegancia.',
      acabados: ['mirror polished', 'brushed', 'satin', 'scotch brite'],
      keywords: ['heavy', 'premium', 'shiny', 'professional', 'high-end', 'durable'],
      apariencia: 'Metal brillante y reflectante',
      peso: 'pesado',
      durabilidad: 'máxima'
    },
    'laton': {
      nombre: { es: 'Latón', en: 'Brass' },
      descripcion: 'Aleación dorada con brillo cálido. Elegancia clásica atemporal.',
      acabados: ['polished', 'brushed', 'antique', 'lacquered'],
      keywords: ['golden', 'warm metal', 'classic', 'elegant', 'traditional', 'premium'],
      apariencia: 'Metal dorado cálido',
      peso: 'pesado',
      durabilidad: 'alta'
    },
    'dibond': {
      nombre: { es: 'Dibond', en: 'Dibond' },
      descripcion: 'Panel composite de aluminio y plástico. Rígido y perfectamente plano.',
      acabados: ['white matte', 'brushed aluminum', 'mirror', 'printed'],
      keywords: ['composite', 'rigid', 'flat', 'professional', 'large format'],
      apariencia: 'Superficie plana y lisa',
      peso: 'medio',
      durabilidad: 'alta'
    }
  },

  // ============================================================================
  // SECCIÓN 6: TIPOS DE NEGOCIO CON CONTEXTOS
  // ============================================================================
  
  tiposNegocio: {
    'restaurante': {
      nombre: { es: 'Restaurante', en: 'Restaurant' },
      categoria: 'gastronomia',
      keywords: ['food', 'dining', 'gastronomy', 'cuisine', 'chef', 'plates', 'gourmet'],
      elementosVisuales: ['cutlery', 'plates', 'wine glasses', 'food illustrations', 'chef hat'],
      estilosSugeridos: ['elegant', 'modern', 'rustic', 'minimalist'],
      coloresSugeridos: ['warm tones', 'reds', 'oranges', 'deep greens', 'creams']
    },
    'cafeteria': {
      nombre: { es: 'Cafetería', en: 'Coffee Shop' },
      categoria: 'gastronomia',
      keywords: ['coffee', 'cafe', 'espresso', 'latte', 'beans', 'brew', 'cozy'],
      elementosVisuales: ['coffee cups', 'beans', 'steam', 'pastries', 'cozy interior'],
      estilosSugeridos: ['vintage', 'modern', 'cozy', 'minimalist'],
      coloresSugeridos: ['browns', 'creams', 'warm whites', 'soft greens']
    },
    'panaderia': {
      nombre: { es: 'Panadería', en: 'Bakery' },
      categoria: 'gastronomia',
      keywords: ['bread', 'pastry', 'baking', 'flour', 'oven', 'croissant', 'fresh'],
      elementosVisuales: ['bread', 'croissants', 'wheat', 'rolling pin', 'basket'],
      estilosSugeridos: ['vintage', 'rustic', 'warm', 'traditional'],
      coloresSugeridos: ['golden browns', 'creams', 'yellows', 'warm whites']
    },
    'peluqueria': {
      nombre: { es: 'Peluquería', en: 'Hair Salon' },
      categoria: 'belleza',
      keywords: ['hair', 'scissors', 'style', 'beauty', 'salon', 'grooming', 'fashion'],
      elementosVisuales: ['scissors', 'comb', 'hair silhouette', 'mirror', 'chair'],
      estilosSugeridos: ['modern', 'elegant', 'bold', 'minimalist'],
      coloresSugeridos: ['black and white', 'gold', 'pink', 'silver']
    },
    'gimnasio': {
      nombre: { es: 'Gimnasio', en: 'Gym' },
      categoria: 'deportes',
      keywords: ['fitness', 'weights', 'muscle', 'energy', 'workout', 'strong', 'power'],
      elementosVisuales: ['dumbbells', 'barbells', 'muscle silhouette', 'energy lines'],
      estilosSugeridos: ['bold', 'industrial', 'modern', 'dynamic'],
      coloresSugeridos: ['neon greens', 'electric blues', 'reds', 'blacks', 'grays']
    },
    'tienda_ropa': {
      nombre: { es: 'Tienda de Ropa', en: 'Clothing Store' },
      categoria: 'retail',
      keywords: ['fashion', 'style', 'clothing', 'trend', 'boutique', 'apparel'],
      elementosVisuales: ['hanger', 'dress', 'shirt', 'mannequin', 'shopping bag'],
      estilosSugeridos: ['elegant', 'modern', 'minimalist', 'luxury'],
      coloresSugeridos: ['black', 'white', 'gold', 'pastels', 'neutrals']
    },
    'inmobiliaria': {
      nombre: { es: 'Inmobiliaria', en: 'Real Estate' },
      categoria: 'servicios',
      keywords: ['home', 'house', 'property', 'keys', 'building', 'architecture'],
      elementosVisuales: ['house silhouette', 'keys', 'roof', 'building outline'],
      estilosSugeridos: ['classic', 'professional', 'modern', 'trustworthy'],
      coloresSugeridos: ['blues', 'greens', 'gold', 'navy', 'white']
    },
    'construccion': {
      nombre: { es: 'Construcción', en: 'Construction' },
      categoria: 'industrial',
      keywords: ['building', 'tools', 'hard hat', 'crane', 'concrete', 'structure'],
      elementosVisuales: ['helmet', 'crane', 'building', 'tools', 'bricks'],
      estilosSugeridos: ['industrial', 'bold', 'strong', 'professional'],
      coloresSugeridos: ['yellows', 'oranges', 'grays', 'blacks', 'oranges']
    },
    'taller_mecanico': {
      nombre: { es: 'Taller Mecánico', en: 'Auto Repair' },
      categoria: 'industrial',
      keywords: ['car', 'wrench', 'engine', 'repair', 'tools', 'mechanic', 'vehicle'],
      elementosVisuales: ['wrench', 'car silhouette', 'gear', 'tools', 'oil'],
      estilosSugeridos: ['industrial', 'vintage', 'bold', 'rugged'],
      coloresSugeridos: ['reds', 'blacks', 'grays', 'blues', 'metallics']
    },
    'clinica_dental': {
      nombre: { es: 'Clínica Dental', en: 'Dental Clinic' },
      categoria: 'salud',
      keywords: ['teeth', 'smile', 'dental', 'health', 'clean', 'medical'],
      elementosVisuales: ['tooth', 'smile', 'medical cross', 'mirror', 'clean lines'],
      estilosSugeridos: ['clean', 'modern', 'minimalist', 'professional'],
      coloresSugeridos: ['blues', 'whites', 'greens', 'light blues', 'silver']
    },
    'veterinaria': {
      nombre: { es: 'Veterinaria', en: 'Veterinary' },
      categoria: 'salud',
      keywords: ['pet', 'animal', 'paw', 'care', 'dog', 'cat', 'love'],
      elementosVisuales: ['paw print', 'heart', 'animal silhouette', 'cross'],
      estilosSugeridos: ['friendly', 'warm', 'modern', 'caring'],
      coloresSugeridos: ['greens', 'blues', 'oranges', 'browns', 'soft colors']
    },
    'floreria': {
      nombre: { es: 'Floristería', en: 'Flower Shop' },
      categoria: 'retail',
      keywords: ['flowers', 'bouquet', 'nature', 'petals', 'garden', 'bloom'],
      elementosVisuales: ['flowers', 'leaves', 'bouquet', 'vase', 'petals'],
      estilosSugeridos: ['elegant', 'natural', 'romantic', 'vintage'],
      coloresSugeridos: ['pinks', 'greens', 'purples', 'yellows', 'pastels']
    },
    'eventos': {
      nombre: { es: 'Eventos', en: 'Events' },
      categoria: 'eventos',
      keywords: ['celebration', 'party', 'confetti', 'balloons', 'fun', 'festive'],
      elementosVisuales: ['confetti', 'balloons', 'stars', 'sparkles', 'ribbons'],
      estilosSugeridos: ['festive', 'colorful', 'bold', 'celebratory'],
      coloresSugeridos: ['rainbow', 'gold', 'silver', 'brights', 'multicolor']
    },
    'deportes': {
      nombre: { es: 'Deportes', en: 'Sports' },
      categoria: 'deportes',
      keywords: ['athlete', 'ball', 'winner', 'team', 'competition', 'energy'],
      elementosVisuales: ['ball', 'trophy', 'motion lines', 'athlete silhouette'],
      estilosSugeridos: ['dynamic', 'bold', 'energetic', 'modern'],
      coloresSugeridos: ['team colors', 'reds', 'blues', 'greens', 'dynamic']
    },
    'tecnologia': {
      nombre: { es: 'Tecnología', en: 'Technology' },
      categoria: 'tecnologia',
      keywords: ['tech', 'digital', 'future', 'innovation', 'code', 'circuit'],
      elementosVisuales: ['circuit lines', 'chip', 'code', 'futuristic shapes'],
      estilosSugeridos: ['modern', 'futuristic', 'minimal', 'clean'],
      coloresSugeridos: ['blues', 'cyans', 'purples', 'blacks', 'neon accents']
    },
    'general': {
      nombre: { es: 'General', en: 'General' },
      categoria: 'general',
      keywords: ['business', 'professional', 'services', 'company', 'general'],
      elementosVisuales: ['abstract shapes', 'geometric', 'professional icons'],
      estilosSugeridos: ['professional', 'modern', 'clean', 'versatile'],
      coloresSugeridos: ['blues', 'grays', 'blacks', 'whites', 'professional']
    }
  },

  // ============================================================================
  // SECCIÓN 7: FACHADAS CON DESCRIPCIONES
  // ============================================================================
  
  fachadas: {
    'madera': {
      nombre: { es: 'Madera', en: 'Wood' },
      material: 'madera natural o sintética',
      textura: 'vetas visibles, cálida, orgánica',
      keywords: ['wood panel', 'natural', 'warm', 'rustic', 'organic', 'texture'],
      tipos: ['natural oak', 'dark walnut', 'painted wood', 'barn wood', 'modern slats'],
      ambiente: 'Cálido, acogedor, natural'
    },
    'blanca': {
      nombre: { es: 'Pared Blanca', en: 'White Wall' },
      material: 'pintura lisa',
      textura: 'superficie lisa y limpia',
      keywords: ['white wall', 'clean', 'minimal', 'modern', 'blank canvas', 'bright'],
      tipos: ['matte white', 'glossy white', 'off-white', 'cream'],
      ambiente: 'Limpio, moderno, versátil'
    },
    'oscura': {
      nombre: { es: 'Pared Oscura', en: 'Dark Wall' },
      material: 'pintura en tonos oscuros',
      textura: 'superficie lisa mate',
      keywords: ['dark wall', 'charcoal', 'moody', 'dramatic', 'sophisticated'],
      tipos: ['charcoal gray', 'deep black', 'navy blue', 'dark green'],
      ambiente: 'Sofisticado, dramático, moderno'
    },
    'ladrillo': {
      nombre: { es: 'Ladrillo', en: 'Brick' },
      material: 'ladrillo visto',
      textura: 'rugosa, clásica, industrial',
      keywords: ['brick wall', 'exposed brick', 'industrial', 'classic', 'urban'],
      tipos: ['red brick', 'painted white brick', 'weathered brick', 'modern brick'],
      ambiente: 'Industrial, clásico, urbano'
    },
    'hormigon': {
      nombre: { es: 'Hormigón', en: 'Concrete' },
      material: 'hormigón visto o pulido',
      textura: 'rugosa o lisa según acabado',
      keywords: ['concrete', 'exposed concrete', 'industrial', 'raw', 'modern'],
      tipos: ['raw concrete', 'polished concrete', 'board-formed concrete'],
      ambiente: 'Industrial, moderno, minimalista'
    },
    'marmol': {
      nombre: { es: 'Mármol', en: 'Marble' },
      material: 'piedra natural mármol',
      textura: 'pulida con vetas características',
      keywords: ['marble', 'luxury stone', 'elegant', 'premium', 'sophisticated'],
      tipos: ['white carrara', 'black marble', 'beige travertine'],
      ambiente: 'Lujoso, elegante, premium'
    }
  },

  // ============================================================================
  // SECCIÓN 8: FUNCIONES DE CONSTRUCCIÓN DE PROMPTS
  // ============================================================================

  /**
   * Construye un prompt completo a partir de los datos del diseño
   */
  construirPrompt(datos) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual,
      colores = [],
      tipografia,
      tipoLetraCorporea,
      material,
      colorLuzLed,
      fachada,
      tipoNegocio
    } = datos;

    const partes = [];

    // 1. Introducción y tipo de producto
    const catInfo = this.categoriasProducto[categoria];
    if (catInfo) {
      partes.push(`Professional ${catInfo.nombre.en.toLowerCase()} with "${nombreNegocio}" text`);
    }

    // 2. Estilo visual
    const estiloInfo = this.estilosVisuales[estiloVisual];
    if (estiloInfo) {
      partes.push(`${estiloInfo.nombre.en.toLowerCase()} style design`);
      partes.push(estiloInfo.keywords.slice(0, 3).join(', '));
    }

    // 3. Colores
    if (colores.length > 0) {
      const colorNames = colores.map(c => {
        const colorInfo = this.colores[Object.keys(this.colores).find(k => this.colores[k].hex === c.hex)];
        return colorInfo ? colorInfo.nombres.en.toLowerCase() : c.nombre;
      }).join(' and ');
      partes.push(`${colorNames} color scheme`);
    }

    // 4. Tipografía
    if (tipografia && this.tipografias[tipografia]) {
      const fontInfo = this.tipografias[tipografia];
      partes.push(`${fontInfo.nombre.toLowerCase()} typography (${fontInfo.categoria}, ${fontInfo.peso})`);
    }

    // 5. Materiales específicos
    if (categoria === 'letras-corporeas' && tipoLetraCorporea) {
      const matKey = tipoLetraCorporea.split('-')[0];
      if (this.materiales[matKey]) {
        partes.push(`${this.materiales[matKey].nombre.en.toLowerCase()} material`);
      }
    }

    // 6. Iluminación
    if (colorLuzLed && categoria === 'letras-neon') {
      partes.push('glowing neon tubes');
    }

    // 7. Superficie/Fachada
    if (fachada && this.fachadas[fachada]) {
      partes.push(`mounted on ${this.fachadas[fachada].nombre.en.toLowerCase()}`);
    }

    // 8. Contexto de negocio
    if (tipoNegocio && this.tiposNegocio[tipoNegocio]) {
      const negInfo = this.tiposNegocio[tipoNegocio];
      partes.push(`${negInfo.nombre.en.toLowerCase()} business aesthetic`);
    }

    // 9. Calidad técnica siempre al final
    partes.push('photorealistic, 8k resolution, professional commercial photography, sharp focus');

    return partes.join(', ');
  },

  /**
   * Obtiene keywords relacionadas para enriquecer el prompt
   */
  getKeywords(categoria, estilo, materiales = []) {
    const keywords = new Set();
    
    // Keywords de categoría
    if (this.categoriasProducto[categoria]) {
      this.categoriasProducto[categoria].keywords.forEach(k => keywords.add(k));
    }
    
    // Keywords de estilo
    if (this.estilosVisuales[estilo]) {
      this.estilosVisuales[estilo].keywords.forEach(k => keywords.add(k));
    }
    
    // Keywords de materiales
    materiales.forEach(mat => {
      if (this.materiales[mat]) {
        this.materiales[mat].keywords.forEach(k => keywords.add(k));
      }
    });
    
    return Array.from(keywords);
  },

  /**
   * Genera descripción detallada de un elemento
   */
  describirElemento(tipo, id) {
    const colecciones = {
      'categoria': this.categoriasProducto,
      'estilo': this.estilosVisuales,
      'color': this.colores,
      'tipografia': this.tipografias,
      'material': this.materiales,
      'negocio': this.tiposNegocio,
      'fachada': this.fachadas
    };

    const elemento = colecciones[tipo]?.[id];
    if (!elemento) return null;

    return {
      id,
      nombre: elemento.nombre || elemento.nombres,
      descripcion: elemento.descripcion,
      keywords: elemento.keywords || [],
      promptText: this._generarTextoPrompt(elemento)
    };
  },

  _generarTextoPrompt(elemento) {
    // Genera texto descriptivo para usar en prompts
    if (elemento.descripcion?.en) {
      return elemento.descripcion.en;
    }
    if (elemento.nombre?.en) {
      return elemento.nombre.en.toLowerCase();
    }
    return '';
  },

  /**
   * Obtiene sugerencias de combinaciones basadas en el tipo de negocio
   */
  getSugerencias(tipoNegocio) {
    const negocio = this.tiposNegocio[tipoNegocio];
    if (!negocio) return null;

    return {
      estilos: negocio.estilosSugeridos,
      colores: negocio.coloresSugeridos,
      elementos: negocio.elementosVisuales,
      ejemplos: negocio.keywords.slice(0, 5)
    };
  }
};

module.exports = DiccionarioPrompts;
