/**
 * ============================================================================
 * DICCIONARIO DE PROMPTS PROFESIONAL v3.0 - Rotulemos
 * ============================================================================
 * Sistema avanzado de generación de prompts para IA de imágenes
 * Técnicas: Few-shot examples, negative prompting, technical specifications,
 * style modifiers, composition rules, lighting setups
 */

const DiccionarioPromptsPro = {

  // ============================================================================
  // SECCIÓN 1: PLANTILLAS BASE DE PROMPTS
  // ============================================================================

  plantillasBase: {
    
    // Plantilla master que combina todas las secciones
    master: `**TYPE**: {tipoProducto}
**SUBJECT**: Commercial signage displaying "{nombreNegocio}" text
**STYLE**: {estiloDescripcion}
**COMPOSITION**: {composicion}
**LIGHTING**: {iluminacion}
**MATERIALS**: {materiales}
**ENVIRONMENT**: {entorno}
**TECHNICAL**: {especificacionesTecnicas}
**QUALITY**: {calidad}
**NEGATIVE**: {promptNegativo}`,

    // Secciones individuales para ensamblar
    secciones: {
      tipoProducto: '{categoria} professional commercial signage',
      calidad: '8k resolution, photorealistic, highly detailed, professional photography, sharp focus, commercial quality, marketing-ready',
      promptNegativo: 'blurry, low quality, watermark, text error, misspelled, deformed letters, amateur, sketch, painting, illustration, cartoon, anime, distorted, cropped text, missing letters, wrong typography'
    }
  },

  // ============================================================================
  // SECCIÓN 2: CATEGORÍAS CON PROMPTS AVANZADOS
  // ============================================================================

  categoriasProducto: {

    'letras-neon': {
      id: 'letras-neon',
      nombre: { es: 'Neón LED', en: 'LED Neon Sign' },
      
      // Descripción enriquecida para prompts
      descripcionPrompt: {
        corta: 'LED neon sign with glowing glass tubes',
        larga: 'Professional LED neon signage with authentic glass tube construction, electric glow effect, gas illumination simulation',
        detallada: `Commercial-grade LED neon sign featuring:
- Authentic glass tube appearance with visible electrode casings
- {color} colored phosphor coating inside tubes
- {intensity} brightness level with soft glow halo
- Clean tube bends and professional joinery
- Dark background for maximum contrast`
      },

      // Keywords organizadas por categoría
      keywords: {
        primarias: ['neon sign', 'LED neon', 'glowing tubes', 'electric sign', 'fluorescent'],
        secundarias: ['glass tubing', 'gas discharge', 'phosphor glow', 'electrode ends', 'vacuum sealed'],
        estilo: ['retro neon', 'modern neon', 'vintage signage', 'urban nightlife', 'downtown aesthetic'],
        tecnica: ['photorealistic neon', 'ray-traced glow', 'subsurface scattering', 'volumetric light']
      },

      // Parámetros específicos de iluminación
      iluminacion: {
        tipo: 'night scene with dark background',
        glow: '{color} neon glow with {intensity} intensity',
        ambiente: 'low-key lighting, dramatic shadows',
        efectos: ['bloom effect', 'light bleed', 'reflection on surfaces', 'atmospheric haze']
      },

      // Modificadores por color de luz
      modificadoresColor: {
        'blanco-calido': 'warm white 3000K glow, cozy ambiance, inviting atmosphere',
        'blanco-frio': 'cool white 6000K glow, crisp modern look, clinical precision',
        'rojo': 'deep red 700nm wavelength, passionate energy, warning sign aesthetic',
        'azul': 'electric blue 450nm wavelength, futuristic vibe, tech aesthetic',
        'rosa': 'hot pink magenta glow, trendy nightlife, instagram-worthy aesthetic',
        'morado': 'purple violet glow, luxury lounge, premium nightclub feel',
        'verde': 'emerald green glow, fresh vibrant energy, nature-tech fusion',
        'amarillo': 'golden yellow glow, vintage 50s diner, nostalgic warmth',
        'naranja': 'amber orange glow, sunset warmth, energetic atmosphere'
      },

      // Ejemplos few-shot para la IA
      ejemplos: [
        'Professional neon sign "THE BLUE NOTE" with deep blue LED tubes, mounted on exposed brick wall, nighttime jazz club ambiance, photorealistic 8k, volumetric glow effects',
        'Pink neon sign "BEAUTY BAR" with bubblegum pink glow, modern minimalist interior, dark concrete wall, professional commercial photography, ray-traced reflections'
      ],

      // Template ensamblable
      template: {
        base: `Commercial LED neon sign displaying "{text}" in {estilo} style
**TUBE SPECIFICATIONS**: {color} phosphor-coated glass tubes, {glowIntensity} glow intensity, visible electrode casings
**MOUNTING**: Professional wall installation on {surface}
**LIGHTING**: Night scene, {colorGlow} illuminating surroundings with soft halo effect
**ATMOSPHERE**: {ambiance}`,
        
        variaciones: {
          moderno: 'Sleek linear design, minimal tube spacing, contemporary font',
          vintage: 'Classic script font, curved tube bends, retro 1950s aesthetic',
          bold: 'Thick tube diameter, maximum brightness, statement piece'
        }
      },

      // Parámetros técnicos para el renderizado
      parametrosTecnicos: {
        relacionAspecto: '16:9 landscape for horizontal text, 9:16 portrait for vertical',
        profundidadCampo: 'f/2.8 shallow depth, focus on neon tubes',
        distancia: '5-8 meters viewing distance',
        angulo: 'eye level, slight elevation 5-15 degrees',
        lente: '35mm equivalent, natural perspective'
      }
    },

    'letras-corporeas': {
      id: 'letras-corporeas',
      nombre: { es: 'Letras Corpóreas 3D', en: '3D Channel Letters' },
      
      descripcionPrompt: {
        corta: 'Dimensional 3D channel letters with depth',
        larga: 'Professional architectural signage with dimensional depth, precision fabrication, solid material construction',
        detallada: `High-end channel letter signage featuring:
- {material} construction with {depth}cm return/depth
- Precision-cut faces with clean edges
- {finish} surface finish with realistic reflections
- Professional mounting system visible
- {lighting} illumination system`
      },

      keywords: {
        primarias: ['3D channel letters', 'dimensional signage', 'fabricated letters', 'architectural signage'],
        secundarias: ['routed faces', 'returns/depth', 'trim cap', 'mounting hardware', 'backer panel'],
        materiales: ['brushed aluminum', 'stainless steel', 'acrylic face', 'PVC foam', 'bronze'],
        iluminacion: ['face lit', 'halo lit', 'back lit', 'combination lit', 'non illuminated']
      },

      // Sistema de materiales detallado
      materiales: {
        'aluminio': {
          nombre: 'Brushed Aluminum',
          propiedades: ' Lightweight, corrosion resistant, metallic luster',
          acabados: {
            'cepillado': 'brushed hairline texture, directional grain, satin sheen',
            'pulido': 'mirror-like reflectivity, high gloss, chrome appearance',
            'anodizado': 'electrochemical color coating, durable matte finish',
            'lacado': 'powder coated smooth finish, solid color opaque'
          },
          reflectancia: 'medium to high depending on finish',
          peso: 'lightweight, easy installation'
        },
        'acero': {
          nombre: 'Stainless Steel',
          propiedades: 'Heavy-duty, premium feel, industrial strength',
          acabados: {
            'espejo': 'mirror polished, perfect reflections, luxury appearance',
            'cepillado': 'fine linear grain, professional look',
            'scotch-brite': 'muted satin, fingerprint resistant'
          },
          reflectancia: 'very high with mirror finish',
          peso: 'heavy, requires substantial mounting'
        },
        'laton': {
          nombre: 'Brass',
          propiedades: 'Warm golden tone, classic elegance, patina potential',
          acabados: {
            'pulido': 'bright gold mirror finish, reflective',
            'envejecido': 'oxidized patina, vintage character, antique look',
            'satinado': 'soft gold glow, understated luxury'
          },
          reflectancia: 'warm golden reflections',
          peso: 'medium-heavy'
        },
        'pvc': {
          nombre: 'PVC Foam (Forex)',
          propiedades: 'Lightweight, paintable, economical, versatile',
          acabados: {
            'lacado-brillo': 'high gloss painted finish, vibrant colors',
            'lacado-mate': 'matte painted finish, modern look',
            'texturizado': 'patterned surface, unique effects'
          },
          reflectancia: 'low, diffuse surface',
          peso: 'very lightweight'
        },
        'metacrilato': {
          nombre: 'Acrylic',
          propiedades: 'Crystal clarity, light transmission, UV stable',
          acabados: {
            'transparente': 'crystal clear, glass-like, maximum light transmission',
            'opal': 'diffused white, even light distribution',
            'coloreado': 'tinted translucent, colored light effect'
          },
          reflectancia: 'transparent/translucent',
          peso: 'lightweight'
        }
      },

      // Sistema de iluminación
      sistemasIluminacion: {
        'frontal': {
          nombre: 'Face Lit',
          descripcion: 'LED modules inside letter illuminating the face',
          efecto: 'Bright, even illumination across letter face',
          mejorPara: 'High visibility, daytime and nighttime',
          prompt: 'internally illuminated with {color} LEDs, bright even face glow'
        },
        'trasera': {
          nombre: 'Halo Lit / Back Lit',
          descripcion: 'LEDs on back create glow behind letter',
          efecto: 'Elegant halo effect, floating appearance',
          mejorPara: 'Premium look, sophisticated ambiance',
          prompt: '{color} LED halo effect behind letters, soft wall glow, floating appearance'
        },
        'lateral': {
          nombre: 'Side Lit',
          descripcion: 'Light emits from letter edges/returns',
          efecto: 'Contoured illumination, dimensional glow',
          mejorPara: 'Unique modern look',
          prompt: 'edge-lit returns glowing {color}, dimensional light effect'
        },
        'combinada': {
          nombre: 'Combination Lit',
          descripcion: 'Face and halo lit simultaneously',
          efecto: 'Maximum impact, dual illumination',
          mejorPara: 'High-end luxury signage',
          prompt: 'face and halo illuminated {faceColor} and {haloColor}, premium dual lighting'
        }
      },

      template: {
        base: `Architectural-grade 3D channel letters spelling "{text}"
**CONSTRUCTION**: {material} faces with {depth}cm returns, {finish} finish
**ILLUMINATION**: {lightingSystem} with {color} LEDs
**INSTALLATION**: Professional wall mounted on {surface}, visible mounting hardware
**DETAILS**: Precision routed edges, clean welds/joins, weatherproof construction
**PERSPECTIVE**: Three-quarter view showing dimensional depth and shadows`,

        conIluminacion: `Professional halo-lit channel letters "{text}", {material} construction with brushed finish, {depth}cm depth creating dimensional shadows, warm white LED backlight creating soft wall glow, mounted on {surface}, architectural photography, golden hour lighting, photorealistic 8k`
      },

      parametrosTecnicos: {
        relacionAspecto: 'Variable based on letter count, typically 3:1 to 5:1',
        profundidadCampo: 'f/5.6-f/8 for sharp detail throughout',
        distancia: '10-15 meters for proper perspective',
        angulo: '30-45 degrees showing depth dimension',
        lente: '50mm standard, avoids distortion'
      }
    },

    'rotulos': {
      id: 'rotulos',
      nombre: { es: 'Rótulos Luminosos', en: 'Lightbox Signs' },
      
      descripcionPrompt: {
        corta: 'Backlit cabinet sign with even illumination',
        larga: 'Professional lightbox sign with internal LED illumination, translucent face, aluminum frame construction',
        detallada: `Commercial lightbox signage:
- {shape} aluminum frame cabinet
- Translucent {faceMaterial} face panel
- Even LED illumination throughout
- {mounting} installation method
- Professional electrical components hidden`
      },

      keywords: {
        primarias: ['lightbox sign', 'cabinet sign', 'illuminated sign box', 'backlit panel'],
        secundarias: ['extruded aluminum frame', 'translucent face', 'internal LEDs', 'even illumination'],
        tipos: ['single face', 'double face', 'pan formed', 'rigid face']
      },

      especificaciones: {
        formas: ['rectangular', 'square', 'circular', 'oval', 'custom shaped'],
        marcos: ['slim profile aluminum', 'heavy duty extruded', 'frameless edge-lit'],
        caras: ['acrylic', 'polycarbonate', 'flex face vinyl', 'backlit fabric'],
        profundidades: ['slim 7cm', 'standard 15cm', 'deep 25cm']
      },

      template: {
        base: `Professional {shape} lightbox sign "{text}"
**CONSTRUCTION**: {frameType} aluminum frame, {depth} deep cabinet
**FACE**: Translucent {faceMaterial} with {transmission} light transmission
**ILLUMINATION**: Even {color} LED lighting, no hot spots
**INSTALLATION**: {mountingStyle} on {surface}
**DETAILS**: Professional trimless edges, weather sealed, UL certified`,

        ejemplo: `Rectangular storefront lightbox sign "GRAND OPENING", slim black aluminum frame, white acrylic face with even LED backlighting, mounted on storefront facade, professional commercial signage, daylight visible, photorealistic 8k`
      }
    },

    'lonas-pancartas': {
      id: 'lonas-pancartas',
      nombre: { es: 'Lonas y Pancartas', en: 'Banners and Signs' },
      
      descripcionPrompt: {
        sistemaHibrido: `HYBRID BANNER SYSTEM:
- AI generates ONLY the decorative background (NO TEXT)
- Background: {tema} themed, {estilo} style, {colores} palette
- Canvas/Text overlay by frontend for perfect typography
- Result: Professional banner with perfect text`,
        
        fondo: 'Large format printed banner background, {businessType} themed decorative elements, {style} aesthetic, {orientation} format'
      },

      keywords: {
        fondo: ['decorative background', 'themed banner', 'large format', 'vinyl banner', 'pvc banner'],
        elementos: ['ornamental border', 'thematic graphics', 'decorative pattern', 'accent elements'],
        tecnicas: ['vector graphics', 'high resolution print', 'seamless pattern', 'gradient background']
      },

      templatesFondo: {
        restaurante: `Elegant restaurant banner background: {color} and {accentColor} palette, subtle food-themed decorative border, {style} aesthetic, empty center space for text overlay, high resolution print-ready, 300dpi quality`,
        
        retail: `Modern retail banner background: {color} gradient, geometric accent patterns, {style} style, clean space for logo placement, professional marketing design`,
        
        eventos: `Festive event banner background: {color} vibrant colors, celebratory {theme} decorations, {style} aesthetic, dynamic composition with text space`
      },

      orientaciones: {
        'horizontal': { ratio: '3:1', uso: ' storefront banners, headers' },
        'vertical': { ratio: '1:3', uso: ' roll-up banners, flags' },
        'cuadrado': { ratio: '1:1', uso: ' social media, square displays' }
      }
    }
  },

  // ============================================================================
  // SECCIÓN 3: ESTILOS VISUALES DETALLADOS
  // ============================================================================

  estilosVisuales: {
    'moderno': {
      id: 'moderno',
      descripcionPrompt: 'Contemporary clean design with geometric precision, sans-serif typography, ample negative space',
      caracteristicas: ['minimal ornamentation', 'clean lines', 'geometric shapes', 'functional design'],
      keywords: ['contemporary', 'minimalist', 'geometric', 'clean lines', 'sleek', 'streamlined'],
      paleta: ['monochrome base', 'single bold accent', 'white space dominance'],
      tipografia: ['sans-serif geometric', 'clean sans', 'modern grotesque'],
      referencias: 'Apple, Google, Scandinavian design, Swiss style',
      iluminacion: 'Even professional lighting, minimal shadows, clean bright environment',
      ambiente: 'Urban contemporary, tech-forward, professional'
    },

    'elegante': {
      id: 'elegante',
      descripcionPrompt: 'Sophisticated refined aesthetic with premium materials, careful attention to detail, luxury feel',
      caracteristicas: ['premium materials', 'refined details', 'subtle sophistication', 'understated luxury'],
      keywords: ['luxury', 'sophisticated', 'premium', 'refined', 'high-end', 'exclusive', 'polished'],
      paleta: ['deep navy', 'champagne gold', 'rich burgundy', 'ivory white'],
      tipografia: ['elegant serif', 'high contrast', 'didone', 'classic roman'],
      referencias: 'Tiffany, Four Seasons, Luxury fashion houses',
      iluminacion: 'Dramatic lighting, highlights, luxurious ambiance, soft shadows',
      ambiente: 'Upscale, exclusive, premium location'
    },

    'industrial': {
      id: 'industrial',
      descripcionPrompt: 'Raw urban aesthetic with exposed materials, utilitarian design, mechanical elements',
      caracteristicas: ['exposed materials', 'raw textures', 'mechanical details', 'utilitarian function'],
      keywords: ['industrial', 'urban', 'raw', 'metal', 'mechanical', 'factory', 'warehouse'],
      paleta: ['rusted orange', 'steel gray', 'concrete gray', 'black iron'],
      tipografia: ['stencil', 'monospaced', 'bold condensed', 'vintage industrial'],
      referencias: 'Brooklyn lofts, Craft breweries, Urban warehouses',
      iluminacion: 'Harsh lighting, dramatic shadows, gritty atmosphere',
      ambiente: 'Converted warehouse, urban gritty, authentic'
    },

    'vintage': {
      id: 'vintage',
      descripcionPrompt: 'Nostalgic retro aesthetic inspired by past decades, aged textures, classic typography',
      caracteristicas: ['distressed textures', 'aged patina', 'classic motifs', 'nostalgic elements'],
      keywords: ['retro', 'vintage', 'nostalgic', 'aged', 'classic', 'heritage', 'old-school'],
      paleta: ['sepia tones', 'muted colors', 'cream', 'browns', 'faded reds'],
      tipografia: ['vintage script', 'retro sans', 'art deco', 'letterpress style'],
      referencias: '1950s diners, Vintage signage, Retro Americana',
      iluminacion: 'Warm golden hour, nostalgic filter, soft warm tones',
      ambiente: 'Timeless, nostalgic, established history'
    },

    'neon': {
      id: 'neon',
      descripcionPrompt: 'Luminous nighttime aesthetic with electric glow, vibrant colors, urban nightlife',
      caracteristicas: ['electric glow', 'vibrant colors', 'night scene', 'light effects'],
      keywords: ['neon', 'glow', 'electric', 'night', 'vibrant', 'fluorescent', 'nightlife'],
      paleta: ['hot pink', 'electric blue', 'neon green', 'purple', 'bright yellow'],
      tipografia: ['neon tube style', 'glowing text', 'retro neon fonts'],
      referencias: 'Tokyo nights, Las Vegas, Blade Runner, Night clubs',
      iluminacion: 'Night scene, neon glow, dark background, dramatic contrast',
      ambiente: 'Nightlife, urban evening, electric atmosphere'
    },

    'minimalista': {
      id: 'minimalista',
      descripcionPrompt: 'Maximum simplicity, essential elements only, pure forms, extreme reduction',
      caracteristicas: ['extreme simplicity', 'essential only', 'pure geometry', 'maximum whitespace'],
      keywords: ['minimal', 'simple', 'essential', 'pure', 'reduction', 'zen', 'clean'],
      paleta: ['white', 'black', 'single gray', 'one accent maximum'],
      tipografia: ['geometric sans', 'minimalist', 'clean linear'],
      referencias: 'Muji, Dieter Rams, Japanese minimalism, Bauhaus',
      iluminacion: 'Natural light, soft shadows, airy feel, bright open',
      ambiente: 'Spacious, calm, uncluttered, peaceful'
    }
  },

  // ============================================================================
  // SECCIÓN 4: TIPOGRAFÍAS CON INSTRUCCIONES DE PROMPT
  // ============================================================================

  tipografias: {
    'archivo': {
      id: 'archivo',
      nombre: 'Archivo Black',
      instruccionPrompt: 'Bold heavy sans-serif font with strong geometric letterforms, extra thick strokes, maximum visual weight, impactful display typeface',
      caracteristicas: ['geometric construction', 'extra bold weight', 'high visibility', 'strong presence'],
      uso: 'Short impactful words, headlines, bold statements',
      keywords: ['bold font', 'heavy weight', 'geometric sans', 'strong typography', 'impact type']
    },

    'bebas': {
      id: 'bebas',
      nombre: 'Bebas Neue',
      instruccionPrompt: 'Condensed sans-serif with tall elegant letterforms, narrow proportions, all uppercase, modern sophisticated display font',
      caracteristicas: ['condensed width', 'tall x-height', 'all caps', 'elegant narrow'],
      uso: 'Elegant headlines, luxury branding, fashion signage',
      keywords: ['condensed font', 'tall letters', 'narrow type', 'elegant sans', 'display typeface']
    },

    'montserrat': {
      id: 'montserrat',
      nombre: 'Montserrat',
      instruccionPrompt: 'Versatile geometric sans-serif with friendly humanist touches, balanced proportions, excellent readability, contemporary urban feel',
      caracteristicas: ['geometric base', 'humanist details', 'balanced proportions', 'versatile weights'],
      uso: 'Universal application, readable at all sizes, friendly professional',
      keywords: ['geometric sans', 'versatile font', 'modern friendly', 'urban typography', 'clean readable']
    },

    'playfair': {
      id: 'playfair',
      nombre: 'Playfair Display',
      instruccionPrompt: 'Elegant high-contrast serif with sharp hairlines and thick strokes, sophisticated editorial feel, classic luxury typography',
      caracteristicas: ['high contrast', 'sharp serifs', 'elegant curves', 'editorial style'],
      uso: 'Luxury brands, elegant establishments, refined businesses',
      keywords: ['elegant serif', 'high contrast', 'luxury font', 'sophisticated type', 'refined typography']
    },

    'lobster': {
      id: 'lobster',
      nombre: 'Lobster',
      instruccionPrompt: 'Bold retro script font with connected flowing letters, thick brush-like strokes, 1950s casual aesthetic, playful personality',
      caracteristicas: ['script style', 'connected letters', 'thick strokes', 'retro casual'],
      uso: 'Casual dining, creative businesses, playful brands, retro themes',
      keywords: ['script font', 'retro script', 'bold brush', 'casual typography', 'playful type']
    }
  },

  // ============================================================================
  // SECCIÓN 5: COLORES CON ESPECIFICACIONES TÉCNICAS
  // ============================================================================

  colores: {
    'rojo': {
      hex: '#DA291C',
      nombres: { es: 'Rojo', en: 'Red' },
      especificacionPrompt: 'Vibrant pure red with high saturation, attention-grabbing, energetic and urgent, Pantone 485C equivalent',
      temperatura: 'warm',
      intensidad: 'high saturation',
      connotaciones: ['passion', 'energy', 'urgency', 'attention', 'appetite'],
      combinaciones: ['white', 'black', 'gold', 'navy blue'],
      usoRecomendado: 'Restaurants, urgent messaging, bold statements'
    },

    'dorado': {
      hex: '#FFD100',
      nombres: { es: 'Dorado', en: 'Gold' },
      especificacionPrompt: 'Rich golden yellow with warm metallic undertones, luxury association, celebratory feel, high perceived value',
      temperatura: 'warm metallic',
      intensidad: 'bright with depth',
      connotaciones: ['luxury', 'wealth', 'celebration', 'premium', 'success'],
      combinaciones: ['black', 'navy', 'deep green', 'burgundy'],
      usoRecomendado: 'Luxury brands, celebrations, premium positioning'
    },

    'azul': {
      hex: '#0033A0',
      nombres: { es: 'Azul', en: 'Blue' },
      especificacionPrompt: 'Deep professional blue with corporate authority, trustworthy and stable, traditional business color, Pantone 287C equivalent',
      temperatura: 'cool',
      intensidad: 'deep saturated',
      connotaciones: ['trust', 'professionalism', 'stability', 'authority', 'confidence'],
      combinaciones: ['white', 'silver', 'gold', 'light blue'],
      usoRecomendado: 'Corporate, financial, professional services, tech'
    },

    'negro': {
      hex: '#1D1D1D',
      nombres: { es: 'Negro', en: 'Black' },
      especificacionPrompt: 'Deep true black with subtle warmth, sophisticated and powerful, timeless elegance, maximum contrast capability',
      temperatura: 'neutral with slight warmth',
      intensidad: 'maximum darkness',
      connotaciones: ['elegance', 'power', 'sophistication', 'luxury', 'authority'],
      combinaciones: ['gold', 'silver', 'white', 'any bright accent'],
      usoRecomendado: 'Luxury, fashion, high contrast designs, elegance'
    }
  },

  // ============================================================================
  // SECCIÓN 6: FUNCIONES DE CONSTRUCCIÓN AVANZADA
  // ============================================================================

  /**
   * Construye un prompt profesional completo
   */
  construirPromptPro(datos) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual = 'moderno',
      colores = [],
      tipografia,
      tipoLetraCorporea,
      material,
      colorLuzLed,
      fachada,
      tipoNegocio,
      orientacion = 'horizontal',
      sistemaIluminacion,
      espesor,
    } = datos;

    const secciones = [];

    // 1. TIPO Y NEGOCIO
    const catInfo = this.categoriasProducto[categoria];
    if (catInfo) {
      secciones.push(`**TYPE**: Professional ${catInfo.nombre.en} displaying "${nombreNegocio}"`);
    }

    // 2. ESTILO VISUAL
    const estiloInfo = this.estilosVisuales[estiloVisual];
    if (estiloInfo) {
      secciones.push(`**STYLE**: ${estiloInfo.descripcionPrompt}. ${estiloInfo.caracteristicas.join(', ')}`);
    }

    // 3. PALETA DE COLORES
    if (colores.length > 0) {
      const colorDesc = colores.map(c => {
        const colorInfo = this.colores[Object.keys(this.colores).find(k => this.colores[k].hex === c.hex)];
        return colorInfo ? `${colorInfo.nombres.en} (${c.hex})` : c.nombre;
      }).join(' and ');
      secciones.push(`**COLOR SCHEME**: ${colorDesc}`);
    }

    // 4. TIPOGRAFÍA
    if (tipografia && this.tipografias[tipografia]) {
      const fontInfo = this.tipografias[tipografia];
      secciones.push(`**TYPOGRAPHY**: ${fontInfo.instruccionPrompt}`);
    }

    // 5. MATERIAL Y CONSTRUCCIÓN (para corpóreas)
    if (categoria === 'letras-corporeas') {
      const matKey = material || (tipoLetraCorporea ? tipoLetraCorporea.split('-')[0] : null);
      if (matKey && this.categoriasProducto[categoria].materiales[matKey]) {
        const matInfo = this.categoriasProducto[categoria].materiales[matKey];
        secciones.push(`**MATERIAL**: ${matInfo.nombre} - ${matInfo.propiedades}`);
        if (espesor) {
          secciones.push(`**DIMENSIONS**: ${espesor}cm depth/return, professional fabrication`);
        }
      }
      
      // Sistema de iluminación
      if (sistemaIluminacion) {
        const luzInfo = this.categoriasProducto[categoria].sistemasIluminacion[sistemaIluminacion];
        if (luzInfo) {
          secciones.push(`**ILLUMINATION**: ${luzInfo.prompt.replace('{color}', colorLuzLed || 'white')}`);
        }
      }
    }

    // 6. ILUMINACIÓN ESPECÍFICA
    if (categoria === 'letras-neon' && colorLuzLed) {
      const modificador = this.categoriasProducto[categoria].modificadoresColor[colorLuzLed];
      if (modificador) {
        secciones.push(`**NEON EFFECT**: ${modificador}`);
      }
    }

    // 7. UBICACIÓN Y ENTORNO (EXTERIOR vs INTERIOR)
    const ubicacionInfo = this._construirUbicacion(tipoNegocio, fachada, categoria);
    if (ubicacionInfo) {
      secciones.push(`**LOCATION**: ${ubicacionInfo}`);
    }

    // 8. CONTEXTO DE NEGOCIO
    if (tipoNegocio) {
      secciones.push(`**BUSINESS CONTEXT**: ${tipoNegocio} establishment aesthetic`);
    }

    // 9. ESPECIFICACIONES TÉCNICAS
    secciones.push(`**TECHNICAL**: 8k resolution, photorealistic 3D render, professional photography, sharp focus, ray-traced lighting, material-specific reflections`);

    // 10. PROMPT NEGATIVO
    secciones.push(`**AVOID**: blurry, low quality, watermark, text errors, misspelled, deformed letters, amateur, sketch, cartoon, distorted text`);

    return secciones.join('\n\n');
  },

  /**
   * Genera un prompt optimizado para Gemini (formato más natural)
   */
  construirPromptGemini(datos) {
    const promptPro = this.construirPromptPro(datos);
    
    // Convertir el formato estructurado a texto natural fluido
    return promptPro
      .replace(/\*\*(.+?)\*\*: /g, '') // Quitar marcadores **TEXT**:
      .replace(/\n\n/g, ', ') // Unir secciones con comas
      .replace(/, ,/g, ',') // Limpiar dobles comas
      .trim() + ', professional commercial signage photography, marketing-ready image';
  },

  /**
   * Genera variaciones del prompt
   */
  generarVariaciones(datos, cantidad = 3) {
    const variaciones = [];
    
    const angulos = ['frontal', 'three-quarter', 'slight elevation'];
    const iluminaciones = ['golden hour', 'twilight', 'overcast daylight', 'night'];
    
    for (let i = 0; i < cantidad; i++) {
      const variacion = {
        ...datos,
        angulo: angulos[i % angulos.length],
        iluminacion: iluminaciones[i % iluminaciones.length],
        variacion: i + 1
      };
      
      variaciones.push({
        id: i + 1,
        prompt: this.construirPromptGemini(variacion),
        angulo: variacion.angulo,
        iluminacion: variacion.iluminacion
      });
    }
    
    return variaciones;
  },

  // ============================================================================
  // SECCIÓN 7: UBICACIONES Y CONTEXTO DE INSTALACIÓN
  // ============================================================================

  ubicaciones: {
    // Ubicaciones EXTERIORES (fachadas de tiendas)
    exterior: {
      'tienda-calle': {
        nombre: { es: 'Fachada de tienda en calle', en: 'storefront on city street' },
        descripcion: 'EXTERIOR storefront facade on busy commercial street, visible from sidewalk, pedestrian perspective',
        elementos: ['storefront', 'shop entrance', 'display window', 'sidewalk', 'street level', 'passersby in background'],
        contexto: 'urban commercial district, street photography, building facade',
        angulo: 'street view from sidewalk, eye level',
        iluminacion: 'natural daylight, urban environment lighting'
      },
      'local-comercial': {
        nombre: { es: 'Local comercial', en: 'commercial shop front' },
        descripcion: 'EXTERIOR commercial storefront signage, mounted on building facade above entrance, street visibility',
        elementos: ['storefront signage', 'building facade', 'entrance door', 'awning', 'street visible'],
        contexto: 'retail storefront, commercial building exterior, shopping area',
        angulo: 'slight angle from street, showing depth of facade',
        iluminacion: 'daylight or evening street lighting'
      },
      'restaurante-fachada': {
        nombre: { es: 'Fachada de restaurante/bar', en: 'restaurant/bar exterior facade' },
        descripcion: 'EXTERIOR restaurant or bar facade signage, visible from street, inviting entrance, night ambiance',
        elementos: ['restaurant facade', 'outdoor seating visible', 'entrance', 'street atmosphere', 'night scene'],
        contexto: 'dining district, nightlife area, entertainment venue exterior',
        angulo: 'from across street or sidewalk, welcoming perspective',
        iluminacion: 'night scene with interior glow, street lamps'
      },
      'centro-comercial': {
        nombre: { es: 'Fachada centro comercial', en: 'mall storefront' },
        descripcion: 'EXTERIOR mall or shopping center storefront, modern commercial architecture, high foot traffic area',
        elementos: ['mall facade', 'glass storefront', 'modern architecture', 'shopping environment'],
        contexto: 'shopping mall exterior, commercial complex, retail park',
        angulo: 'straight-on or three-quarter view of storefront',
        iluminacion: 'even commercial lighting, indoor mall lighting visible'
      }
    },

    // Ubicaciones INTERIORES
    interior: {
      'recepcion': {
        nombre: { es: 'Recepción/lobby', en: 'reception lobby' },
        descripcion: 'INTERIOR reception area or lobby, professional welcoming space, behind desk or on feature wall',
        elementos: ['reception desk', 'lobby area', 'waiting space', 'feature wall', 'interior design'],
        contexto: 'hotel lobby, office reception, spa entrance, professional interior',
        angulo: 'interior perspective, showing reception context',
        iluminacion: 'interior ambient lighting, warm welcoming'
      },
      'pared-interior': {
        nombre: { es: 'Pared interior', en: 'interior wall' },
        descripcion: 'INTERIOR wall installation, feature wall inside establishment, customer viewing area',
        elementos: ['interior wall', 'feature installation', 'customer area', 'indoor setting'],
        contexto: 'indoor commercial space, interior design, customer environment',
        angulo: 'interior room perspective',
        iluminacion: 'indoor lighting, ambient interior'
      },
      'bar-interior': {
        nombre: { es: 'Interior de bar', en: 'bar interior' },
        descripcion: 'INTERIOR bar or lounge setting, behind bar counter, atmosphere of nightlife venue inside',
        elementos: ['bar counter', 'bottles in background', 'interior atmosphere', 'nightlife interior'],
        contexto: 'bar interior, nightclub inside, lounge atmosphere',
        angulo: 'from customer perspective inside venue',
        iluminacion: 'mood lighting, interior night ambiance'
      }
    }
  },

  // Mapeo de tipo de negocio a ubicación recomendada
  ubicacionesPorNegocio: {
    // Negocios que deben ir en EXTERIOR
    'restaurante': 'restaurante-fachada',
    'bar': 'restaurante-fachada',
    'cafe': 'restaurante-fachada',
    'tienda': 'tienda-calle',
    'boutique': 'local-comercial',
    'comercio': 'local-comercial',
    'gimnasio': 'local-comercial',
    'peluqueria': 'local-comercial',
    'panaderia': 'tienda-calle',
    'floreria': 'tienda-calle',
    
    // Negocios que pueden ir en INTERIOR
    'spa': 'recepcion',
    'hotel': 'recepcion',
    'oficina': 'recepcion',
    'clinica': 'recepcion',
    'dentista': 'recepcion',
    'consulta': 'recepcion'
  },

  _getFachadaInfo(fachada) {
    const fachadas = {
      'madera': { 
        nombre: { en: 'wood panel' }, 
        textura: 'natural wood grain texture',
        tipo: 'exterior'
      },
      'blanca': { 
        nombre: { en: 'white painted' }, 
        textura: 'smooth matte white surface',
        tipo: 'exterior'
      },
      'oscura': { 
        nombre: { en: 'dark painted' }, 
        textura: 'deep charcoal matte finish',
        tipo: 'exterior'
      },
      'ladrillo': { 
        nombre: { en: 'exposed brick' }, 
        textura: 'rough brick texture with mortar lines',
        tipo: 'exterior'
      },
      'hormigon': { 
        nombre: { en: 'concrete' }, 
        textura: 'raw concrete with subtle texture',
        tipo: 'exterior'
      },
      'marmol': { 
        nombre: { en: 'white marble' }, 
        textura: 'polished marble with grey veining',
        tipo: 'interior'
      }
    };
    return fachadas[fachada];
  },

  /**
   * Obtiene la ubicación recomendada según tipo de negocio
   */
  getUbicacionPorNegocio(tipoNegocio) {
    const ubicacionKey = this.ubicacionesPorNegocio[tipoNegocio?.toLowerCase()];
    if (!ubicacionKey) return null;
    
    // Buscar en exteriores primero, luego interiores
    return this.ubicaciones.exterior[ubicacionKey] || this.ubicaciones.interior[ubicacionKey];
  },

  /**
   * Construye la descripción de ubicación (EXTERIOR vs INTERIOR)
   */
  _construirUbicacion(tipoNegocio, fachada, categoria) {
    // Determinar si debe ser exterior o interior basado en tipo de negocio
    const negociosExterior = ['restaurante', 'bar', 'cafe', 'tienda', 'boutique', 'comercio', 
                               'gimnasio', 'peluqueria', 'panaderia', 'floreria', 'pub', 'disco'];
    const negociosInterior = ['spa', 'hotel', 'oficina', 'clinica', 'dentista', 'consulta'];
    
    const esExterior = tipoNegocio && negociosExterior.includes(tipoNegocio.toLowerCase());
    const esInterior = tipoNegocio && negociosInterior.includes(tipoNegocio.toLowerCase());
    
    // Obtener info de fachada
    const fachadaInfo = fachada ? this._getFachadaInfo(fachada) : null;
    const texturaFachada = fachadaInfo ? fachadaInfo.textura : null;
    
    // Construir descripción según contexto
    if (esExterior) {
      // Para negocios de exterior: fachada de tienda en calle
      let ubicacion = 'EXTERIOR storefront facade, mounted on ';
      
      if (texturaFachada) {
        ubicacion += `${texturaFachada}, `;
      } else {
        ubicacion += 'building exterior wall, ';
      }
      
      // Agregar contexto de calle/acera según tipo
      if (['restaurante', 'bar', 'cafe', 'pub'].includes(tipoNegocio.toLowerCase())) {
        ubicacion += 'visible from sidewalk, street-level perspective, urban dining district setting, pedestrians passing by, inviting entrance atmosphere';
      } else if (['tienda', 'boutique', 'comercio'].includes(tipoNegocio.toLowerCase())) {
        ubicacion += 'visible from sidewalk, commercial street view, pedestrian perspective, storefront signage, shopping district';
      } else {
        ubicacion += 'visible from street, commercial building exterior, sidewalk perspective, urban environment';
      }
      
      return ubicacion;
      
    } else if (esInterior) {
      // Para negocios de interior: lobby/recepción
      let ubicacion = 'INTERIOR reception/lobby area, mounted on ';
      
      if (texturaFachada) {
        ubicacion += `${texturaFachada}, `;
      } else {
        ubicacion += 'feature wall, ';
      }
      
      if (['spa', 'hotel'].includes(tipoNegocio.toLowerCase())) {
        ubicacion += 'welcoming reception space, luxury interior, ambient lighting, professional environment';
      } else {
        ubicacion += 'professional interior space, reception desk visible, welcoming atmosphere';
      }
      
      return ubicacion;
      
    } else {
      // Sin tipo de negocio específico: default según fachada
      if (texturaFachada) {
        return `Mounted on ${texturaFachada}, exterior building facade visible from street`;
      }
      return 'Mounted on exterior building facade, visible from street, storefront perspective';
    }
  },

  /**
   * Obtiene keywords enriquecidas para embeddings
   */
  getKeywordsPro(datos) {
    const { categoria, estiloVisual, tipografia, colores = [] } = datos;
    
    const keywords = new Set();
    
    // Keywords de categoría
    if (this.categoriasProducto[categoria]) {
      const cat = this.categoriasProducto[categoria];
      cat.keywords.primarias?.forEach(k => keywords.add(k));
      cat.keywords.secundarias?.forEach(k => keywords.add(k));
    }
    
    // Keywords de estilo
    if (this.estilosVisuales[estiloVisual]) {
      this.estilosVisuales[estiloVisual].keywords.forEach(k => keywords.add(k));
    }
    
    // Keywords de tipografía
    if (tipografia && this.tipografias[tipografia]) {
      this.tipografias[tipografia].keywords.forEach(k => keywords.add(k));
    }
    
    return Array.from(keywords);
  }
};

module.exports = DiccionarioPromptsPro;
