/**
 * ============================================================================
 * MOCKUP SERVICE - Generación de rótulos y mockups con Gemini
 * ============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class MockupService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Usar modelo experimental de imágenes gemini-3.1-flash-image-preview
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-image-preview',
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40
      }
    });
    
    console.log('✅ MockupService inicializado con Gemini 3.1 Flash Image Preview');
  }

  /**
   * Extrae base64 de una data URL
   */
  _extractBase64(dataUrl) {
    if (!dataUrl) return null;
    if (dataUrl.includes(',')) {
      return dataUrl.split(',')[1];
    }
    return dataUrl;
  }

  /**
   * Genera un rótulo aislado (sin fondo, sin fachada)
   * Si hay logo, lo usa como referencia de estilo/marca
   */
  async generarRotuloAislado(disenioData) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual = 'moderno',
      colores = [],
      tipografia,
      material,
      colorLuzLed,
      ledColor,
      sistemaIluminacion,
      espesor,
      corporeaTipo,
      corporeaRelieve,
      laserMaterial,
      lonaBusinessType,
      lonaStyle,
      descripcion,
      dimensiones,
      textoAdicional,
      logo,
      modoLogo = 'ia'
    } = disenioData;
    
    // Normalizar campos (frontend usa diferentes nombres)
    const finalColorLuzLed = colorLuzLed || ledColor;
    const finalEspesor = espesor || corporeaRelieve;
    const finalMaterial = material || (corporeaTipo ? this._mapCorporeaTipoToMaterial(corporeaTipo) : null) || laserMaterial;
    const finalTipoNegocio = lonaBusinessType;
    const finalEstiloLona = lonaStyle;

    // Construir texto completo (nombre + adicional si existe)
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Prompt específico para rótulo aislado sin fondo
    let promptBase = '';
    let promptConLogo = '';

    // =========================================================================
    // LETRAS NEÓN - ÚNICAMENTE TUBOS DE VIDRIO
    // =========================================================================
    if (categoria === 'letras-neon') {
      const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
      const colorLuz = finalColorLuzLed || 'warm white';
      
      promptBase = `[PRODUCT TYPE: REAL NEON SIGN - LED NEON FLEX TUBES]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: LED neon flex tubes (silicone/flex material, NOT solid letters)
- Construction: Continuous flexible LED tube forming letters
- NO solid materials (no aluminum, no PVC, no acrylic blocks)
- NO 3D channel letters with returns/sides

SPECIFICATIONS:
- Tube type: LED neon flex, 8-10mm diameter
- Color: ${colorDesc} glowing tubes with ${colorLuz} light emission
- Backing: Optional clear acrylic panel OR individual mounting
- Effect: Continuous glow along tube length
- Mounting: Visible clear clips/holders every 15-20cm

TEXT TO CREATE: "${textoCompleto}"
Style: ${estiloVisual}

VISUAL REQUIREMENTS:
- Pure black background (#000000)
- Glowing tubes with visible light halo
- Tube connections/wiring visible between letters
- Professional product photography
- 8k resolution, hyper-realistic

FORBIDDEN:
× Solid block letters
× Metal/PVC/Acrylic dimensional letters
× Channel letter construction
× Non-illuminated materials`;

      if (logo) {
        if (modoLogo === 'exacto') {
          promptConLogo = `[TYPE: LED NEON FLEX SIGN] Convert this logo into glowing LED neon flex tubes. Continuous flexible silicone tubes forming "${textoCompleto}". NO solid letters, NO metal construction. Glowing neon effect only.`;
        } else {
          promptConLogo = `[TYPE: LED NEON FLEX SIGN] Create neon tubes inspired by this logo. Flexible LED tubing with ${colorDesc} glow forming "${textoCompleto}". NO dimensional solid materials.`;
        }
      }

    // =========================================================================
    // LETRAS CORPÓREAS - MATERIAL SÓLIDO CON VOLUMEN
    // =========================================================================
    } else if (categoria === 'letras-corporeas') {
      const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
      const matDesc = finalMaterial || 'aluminum';
      const depth = finalEspesor || 8;
      
      // Determinar tipo específico de iluminación
      let tipoIluminacion = '';
      if (sistemaIluminacion === 'trasera' || corporeaTipo?.includes('retroiluminada')) {
        tipoIluminacion = 'BACKLIT';
      } else if (sistemaIluminacion === 'frontal' || corporeaTipo?.includes('iluminada')) {
        tipoIluminacion = 'FRONT-LIT';
      } else {
        tipoIluminacion = 'NON-LIT';
      }
      
      const contextoDesc = descripcion?.mejorada || descripcion?.original || '';
      const dimsDesc = dimensiones ? `${dimensiones.ancho || '?'}cm x ${dimensiones.alto || '?'}cm` : 'proportional';

      promptBase = `[PRODUCT TYPE: 3D CHANNEL LETTERS - SOLID CONSTRUCTION]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: SOLID 3D channel letters with RETURNS/SIDES
- Material: ${matDesc} (solid, NOT flexible tubes)
- Construction: Front face + side returns + back block
- Depth: ${depth}cm thick visible on all sides
- NO neon tubes, NO LED flex, NO continuous glowing strips

SPECIFICATIONS:
- Material: ${matDesc} with ${colorDesc} finish
- Dimensions: ${dimsDesc}
- Type: ${tipoIluminacion}
${tipoIluminacion === 'BACKLIT' ? '- Lighting: LED halo glow BEHIND letters only, letters themselves are opaque solid' : ''}
${tipoIluminacion === 'FRONT-LIT' ? '- Lighting: LED illuminating front face of solid letters' : ''}
${tipoIluminacion === 'NON-LIT' ? '- NO lighting, completely opaque solid material' : ''}

TEXT TO CREATE: "${textoCompleto}"
Style: ${estiloVisual}

CONSTRUCTION DETAILS (MUST SHOW):
- Visible ${depth}cm side returns on every letter
- Solid front faces (not hollow tubes)
- Individual letter separation
- Mounting spacers/brackets visible
- Material texture: ${matDesc}

VISUAL REQUIREMENTS:
- Pure white or neutral background
- Show dimensional depth clearly
- Side returns visible and well-lit
- NO glass tubes, NO continuous neon effect
- Professional product photography, 8k

FORBIDDEN:
× Neon tubes or flex LED strips
× Continuous glowing lines
× Flat 2D signs without depth
× Hollow tube construction`;

      if (logo) {
        if (modoLogo === 'exacto') {
          promptConLogo = `[TYPE: 3D CHANNEL LETTERS] Convert logo to SOLID ${matDesc} letters with ${depth}cm depth/returns. "${textoCompleto}" with visible dimensional sides. ${tipoIluminacion}. NO neon tubes, flexible strips.`;
        } else {
          promptConLogo = `[TYPE: 3D CHANNEL LETTERS] Create solid ${matDesc} letters (${depth}cm depth) inspired by logo. Dimensional with returns/sides. ${tipoIluminacion}. NO neon tubing.`;
        }
      }

    // =========================================================================
    // LONAS/PANCARTAS - MATERIAL TEXTIL PLANO
    // =========================================================================
    } else if (categoria === 'lonas-pancartas' || categoria === 'lonas') {
      const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
      const negocioContext = finalTipoNegocio || tipoNegocio || 'general';
      const estiloBanner = finalEstiloLona || estiloVisual;
      const contextoDesc = descripcion?.mejorada || descripcion?.original || '';
      
      promptBase = `[PRODUCT TYPE: PRINTED VINYL BANNER - FLEXIBLE FABRIC]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: FLAT printed vinyl banner/lona (flexible fabric)
- Material: PVC vinyl fabric, textile material
- Thickness: Thin flexible sheet (1-2mm max)
- NO rigid structure, NO 3D depth, NO solid materials
- NO lights, NO neon, NO illumination of any kind

SPECIFICATIONS:
- Material: Matte vinyl banner fabric
- Print: Flat ink on fabric surface
- Hardware: Metal grommets (ojales) at corners
- Edges: Hemmed/reinforced with stitching
- Format: Horizontal banner

DESIGN:
- Business: "${textoCompleto}"
- Type: ${negocioContext}
- Style: ${estiloBanner}
- Colors: ${colorDesc}

TEXT REQUIREMENTS:
- "${textoCompleto}" printed FLAT on fabric
- NO 3D effects, NO embossing, NO raised surfaces
- NO glowing, NO lighting, NO neon
- Flat printed typography only

${contextoDesc ? `Additional design: ${contextoDesc}` : ''}

VISUAL REQUIREMENTS (MUST SHOW):
- Flat flexible fabric material
- Natural slight wrinkles/texture
- Metal grommets at corners clearly visible
- Hemmed edges
- Print shop product preview style
- Isolated on neutral gray background
- 8k photorealistic

FORBIDDEN - WILL REJECT:
× Any 3D depth or raised surfaces
× Neon tubes, LED strips, glowing effects
× Solid materials (metal, plastic blocks)
× Channel letters or dimensional signage
× Any illumination or light emission`;

      if (logo) {
        promptConLogo = `[TYPE: VINYL BANNER] Print this logo on FLAT vinyl banner fabric with "${textoCompleto}". Grommets at corners. NO lights, NO 3D, NO neon. Flat printed textile material only.`;
      }
      
    // =========================================================================
    // CORTE LÁSER - PANEL PLANO CON RECORTE
    // =========================================================================
    } else if (categoria === 'corte-laser' || categoria === 'metacrilato') {
      const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
      const materialDesc = finalMaterial || 'acrylic';
      const contextoDesc = descripcion?.mejorada || descripcion?.original || '';
      
      promptBase = `[PRODUCT TYPE: LASER CUT SIGN - FLAT PANEL WITH CUT-OUTS]

⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
- Product: FLAT laser-cut panel (5-10mm thick max)
- Construction: Single flat sheet with letters cut OUT
- Material: ${materialDesc} sheet
- NO dimensional depth beyond panel thickness
- NO separate 3D letters, NO returns/sides

SPECIFICATIONS:
- Material: ${materialDesc} sheet, flat
- Thickness: 5-10mm visible edge
- Design: Letters/text cut OUT of the panel (negative space)
- Edges: Clean laser-cut edges visible

TEXT: "${textoCompleto}" cut out from panel
Style: ${estiloVisual}
Colors: ${colorDesc}

${contextoDesc ? `Design: ${contextoDesc}` : ''}

VISUAL REQUIREMENTS:
- Show flat panel with cut-outs clearly
- Visible material thickness on edges
- Clean laser-cut precision
- Isolated on contrasting background
- NO 3D letters protruding
- NO neon, NO separate dimensional elements
- 8k photorealistic

FORBIDDEN:
× Separate 3D letters
× Channel letter construction
× Neon tubes or LED strips
× Multi-layer dimensional effects`;

      if (logo) {
        promptConLogo = `[TYPE: LASER CUT PANEL] Convert logo to flat ${materialDesc} panel with cut-outs. "${textoCompleto}" laser-cut from single sheet. NO 3D letters, NO neon. Flat construction only.`;
      }

    // =========================================================================
    // DEFAULT - CATEGORÍA GENÉRICA
    // =========================================================================
    } else {
      const colorDesc = colores.map(c => c.nombre || c.hex).join(' and ');
      const materialDesc = finalMaterial || 'acrylic';
      const contextoDesc = descripcion?.mejorada || descripcion?.original || '';
      
      promptBase = `[PRODUCT TYPE: ${categoria.toUpperCase()}]

⚠️ CRITICAL:
- Exact product type: ${categoria}
- Material: ${materialDesc}
- Style: ${estiloVisual}

TEXT: "${textoCompleto}"
Colors: ${colorDesc}

${contextoDesc ? `Design: ${contextoDesc}` : ''}

Generate exactly the product type specified. Professional product photography, isolated, 8k.`;

      if (logo) {
        promptConLogo = `[TYPE: ${categoria}] Create "${textoCompleto}" inspired by this logo. Exact product type as specified.`;
      }
    }

    console.log('Generando rótulo aislado...');
    console.log('Categoría:', categoria);
    if (logo) {
      console.log(`Logo detectado - Modo: ${modoLogo}`);
    }

    let result;
    
    // Si hay logo, usar inlineData para pasar la imagen como referencia
    if (logo) {
      const logoBase64 = this._extractBase64(logo);
      const promptFinal = `${promptConLogo}\n\nBase requirements: ${promptBase}`;
      
      console.log('Usando logo como referencia con inlineData...');
      
      result = await this.model.generateContent([
        {
          inlineData: {
            data: logoBase64,
            mimeType: 'image/png'
          }
        },
        {
          text: promptFinal
        }
      ]);
    } else {
      console.log('Prompt:', promptBase.substring(0, 200) + '...');
      result = await this.model.generateContent(promptBase);
    }

    const candidates = result.response.candidates;
    
    if (!candidates?.length) {
      throw new Error('No se recibió respuesta de imagen');
    }

    let imagenBase64 = null;
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        imagenBase64 = part.inlineData.data;
      }
    }

    if (!imagenBase64) {
      throw new Error('No se encontró imagen en la respuesta');
    }

    return {
      success: true,
      imagenBase64,
      prompt: logo ? promptConLogo : promptBase,
      tipo: 'aislado'
    };
  }

  /**
   * Genera mockups usando el rótulo aislado
   */
  async generarMockups(rotuloBase64, disenioData) {
    const {
      categoria,
      nombreNegocio,
      fachada,
      tipoNegocio
    } = disenioData;

    const resultados = [];

    // Determinar ubicaciones según tipo de negocio
    const negociosExterior = ['bar', 'cafe', 'restaurante', 'tienda', 'pub', 'disco', 'panaderia', 'peluqueria'];
    const negociosInterior = ['spa', 'hotel', 'oficina', 'clinica', 'dentista', 'consulta'];
    
    const esExterior = tipoNegocio && negociosExterior.includes(tipoNegocio.toLowerCase());
    const esInterior = tipoNegocio && negociosInterior.includes(tipoNegocio.toLowerCase());

    // Generar solo mockup EXTERIOR (interior deshabilitado)
    try {
      const mockupExterior = await this._generarMockupExterior(rotuloBase64, disenioData);
      resultados.push({
        tipo: 'exterior',
        ...mockupExterior
      });
    } catch (error) {
      console.error('Error generando mockup exterior:', error);
      resultados.push({
        tipo: 'exterior',
        success: false,
        error: error.message
      });
    }

    return resultados;
  }

  async _generarMockupExterior(rotuloBase64, disenioData, tipoVista = 'fachada-cerrada') {
    const { nombreNegocio, textoAdicional, fachada, tipoNegocio, categoria, fachadaPersonalizada } = disenioData;
    
    // Texto completo para el prompt
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Verificar si hay fachada personalizada
    const tieneFachadaPersonalizada = fachadaPersonalizada && fachadaPersonalizada.startsWith('data:');
    
    // Descripción del tipo de producto para el mockup
    let productoDesc = '';
    if (categoria === 'letras-neon') {
      productoDesc = 'LED neon flex sign with glowing tubes mounted on facade';
    } else if (categoria === 'letras-corporeas') {
      productoDesc = '3D channel letters with solid material depth mounted on building facade';
    } else if (categoria === 'lonas-pancartas' || categoria === 'lonas') {
      productoDesc = 'vinyl banner hanging on storefront (NOT mounted on wall, banner hanging)';
    } else {
      productoDesc = 'sign mounted on building facade';
    }
    
    // Contexto según tipo de vista
    let contextoDesc = '';
    
    if (tipoVista === 'contexto-amplio') {
      contextoDesc = 'wide street view showing full building context, pedestrians walking by';
    } else {
      contextoDesc = 'close-up of building facade showing sign installation';
    }

    // Prompt específico según categoría
    let promptText = '';
    
    if (categoria === 'lonas-pancartas' || categoria === 'lonas') {
      // Lona cuelga, no se monta sobre la pared
      promptText = `PROFESSIONAL PHOTOGRAPHY - VINYL BANNER ON STOREFRONT

CRITICAL: This is a BANNER HANGING from the storefront, NOT mounted flat on the wall.

SCENE:
- Vinyl banner with "${textoCompleto}" hanging from hooks above storefront
- Banner material visible: flexible fabric with grommets
- ${contextoDesc}
- Business type: ${tipoNegocio || 'commercial'}

IMAGE 1: The banner sign
IMAGE 2: The storefront/building

BANNER INSTALLATION:
- Hanging banner, slightly curved due to gravity
- Grommets at top corners with ropes/chains
- Natural fabric drape visible
- NOT flat against wall - it's a hanging banner

PHOTOGRAPHIC STYLE:
- Professional architectural photography
- Realistic lighting matching time of day
- ${tieneFachadaPersonalizada ? 'Use the EXACT facade from Image 2' : `Building style: ${this._getFachadaDescripcion(fachada)}`}
- 8k photorealistic`;
    } else {
      // Letras montadas en fachada
      promptText = `PROFESSIONAL SIGNAGE PHOTOGRAPHY - EXTERIOR INSTALLATION

CRITICAL: Mount the sign EXACTLY as the product type on the building facade.

PRODUCT: ${productoDesc}
TEXT: "${textoCompleto}"

SCENE: ${contextoDesc}
Business type: ${tipoNegocio || 'commercial'}

IMAGE 1: The sign to mount
IMAGE 2: The building facade

INSTALLATION REQUIREMENTS:
${categoria === 'letras-neon' ? '- Mount neon tubes with visible mounting clips' : ''}
${categoria === 'letras-corporeas' ? '- Mount solid letters with visible spacers, show dimensional depth' : ''}
- Position on available wall space between windows/doors
- Realistic mounting hardware visible
- Natural shadows cast on wall

PHOTOGRAPHIC STYLE:
- Professional real estate photography
- ${tieneFachadaPersonalizada ? 'Use EXACT building from Image 2' : `Building: ${this._getFachadaDescripcion(fachada)}`}
- Appropriate lighting for ${categoria}
- 8k photorealistic`;
    }

    // Preparar contenido para Gemini - ORDEN CRÍTICO
    const contentParts = [];
    
    // 1. Primero el prompt explicativo
    contentParts.push({ text: promptText });
    
    // 2. Segundo: EL RÓTULO (la imagen principal a integrar)
    contentParts.push({
      text: 'IMAGE 1 - THE SIGN (Place this exact sign on the facade):'
    });
    contentParts.push({
      inlineData: {
        mimeType: 'image/png',
        data: rotuloBase64
      }
    });
    
    // 3. Tercero: La fachada (el fondo)
    if (tieneFachadaPersonalizada) {
      const fachadaBase64 = this._extractBase64(fachadaPersonalizada);
      contentParts.push({
        text: 'IMAGE 2 - THE FACADE (Mount the sign on this wall):'
      });
      contentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: fachadaBase64
        }
      });
    }
    
    // Enviar a Gemini
    const result = await this.model.generateContent(contentParts);
    
    const candidates = result.response.candidates;
    let imagenBase64 = null;
    
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        imagenBase64 = part.inlineData.data;
      }
    }

    return {
      success: !!imagenBase64,
      imagenBase64,
      prompt: promptText,
      ubicacion: 'exterior'
    };
  }

  async _generarMockupInterior(rotuloBase64, disenioData) {
    const { nombreNegocio, textoAdicional, fachada, tipoNegocio, categoria, fachadaPersonalizada } = disenioData;
    
    // Texto completo para el prompt
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Verificar si hay fachada personalizada
    const tieneFachadaPersonalizada = fachadaPersonalizada && fachadaPersonalizada.startsWith('data:');

    // Contexto interior según tipo de negocio
    let interiorDesc = '';
    if (tieneFachadaPersonalizada) {
      interiorDesc = 'interior space with the EXACT wall shown in the reference image';
    } else if (['spa', 'wellness'].includes(tipoNegocio)) {
      interiorDesc = 'luxury spa reception, calm atmosphere, soft lighting, marble walls, serene environment';
    } else if (['hotel'].includes(tipoNegocio)) {
      interiorDesc = 'hotel lobby, elegant reception desk, warm lighting, premium materials, welcoming ambiance';
    } else if (['oficina', 'clinica', 'dentista'].includes(tipoNegocio)) {
      interiorDesc = 'professional reception area, clean modern design, corporate environment, waiting area visible';
    } else {
      interiorDesc = 'elegant interior space, feature wall, professional reception, ambient lighting';
    }

    // Prompt para integración realista en interior
    const promptText = `ULTRA-REALISTIC SIGN - INTERIOR WALL MOUNTED

${tieneFachadaPersonalizada ? `CRITICAL: USE THE PROVIDED WALL IMAGE AS BACKGROUND
- Place the sign realistically on the EXACT wall shown in the reference image
- Match the perspective, lighting, and wall texture of the provided image` : `CRITICAL: NO BACKING PANEL - INDIVIDUAL MOUNTING ONLY`}

- Each letter mounted INDIVIDUALLY to interior wall
- NO glass/acrylic substrate holding the entire sign
- NO frame, box, or backing plate behind letters
- Individual mounting hardware per letter section

PHYSICAL INSTALLATION:
- Chrome/stainless steel "L" brackets or standoffs at each tube junction
- Brackets bolted/screwed directly into wall surface
- Each bracket holds tube 5-8cm off wall on metal spacer
- Visible fasteners (screws) in each bracket base
- Black silicone cables run along wall connecting letter sections
- Wall-mounted transformer/power supply unit
- Professional cable management along wall to electrical source

TUBE SPECIFICATIONS:
- Real glass neon tubes, 10-12mm diameter
- 3D cylindrical form with reflections and thickness
- Warm glow emanating from within glass (not projected)
- Individual tubes per letter, not continuous backing

SHADOWS & DEPTH:
- Each tube casts individual shadow on wall behind it
- Brackets cast small defined shadows
- Wall texture visible BETWEEN letters (no continuous backing)
- Subtle glow reflection on wall around tubes

SCENE:
${interiorDesc}

CRITICAL RULES:
- Letters mounted as independent architectural elements
- Wall surface visible between and around letters
- No substrate panel - tubes attach directly to wall via hardware
- Professional commercial installation appearance

OUTPUT: Interior design photography, 8k, professional lighting showing depth`; 

    // Preparar contenido para Gemini
    const contentParts = [];
    
    // Si hay fachada personalizada, agregarla primero como referencia
    if (tieneFachadaPersonalizada) {
      const fachadaBase64 = this._extractBase64(fachadaPersonalizada);
      contentParts.push({
        text: 'This is the EXACT interior wall where the sign should be placed. Use this image as the background:'
      });
      contentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: fachadaBase64
        }
      });
    }
    
    // Agregar prompt y rótulo
    contentParts.push({ text: promptText });
    contentParts.push({
      inlineData: {
        mimeType: 'image/png',
        data: rotuloBase64
      }
    });
    
    // Enviar a Gemini
    const result = await this.model.generateContent(contentParts);
    
    const candidates = result.response.candidates;
    let imagenBase64 = null;
    
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        imagenBase64 = part.inlineData.data;
      }
    }

    return {
      success: !!imagenBase64,
      imagenBase64,
      prompt: promptText,
      ubicacion: 'interior'
    };
  }

  _getFachadaDescripcion(fachada) {
    const fachadas = {
      'ladrillo': 'exposed red brick facade, classic urban building',
      'hormigon': 'raw concrete facade, industrial modern architecture',
      'blanca': 'clean white painted facade, minimalist storefront',
      'oscura': 'dark charcoal facade, sophisticated modern design',
      'madera': 'natural wood panel facade, warm inviting storefront',
      'marmol': 'polished marble facade, luxury premium building'
    };
    return fachadas[fachada] || 'modern commercial building facade';
  }

  /**
   * Mapea tipo de letra corpórea a material
   */
  _mapCorporeaTipoToMaterial(tipo) {
    const materiales = {
      'pvc': 'PVC plastic',
      'pvc-pintado': 'painted PVC',
      'aluminio': 'brushed aluminum',
      'aluminio-compuesto': 'composite aluminum',
      'acero': 'stainless steel',
      'acero-inox': 'mirror stainless steel',
      'laton': 'brass',
      'laton-pulido': 'polished brass',
      'acrilico': 'acrylic',
      'metacrilato': 'methacrylate',
      'madera': 'natural wood'
    };
    return materiales[tipo] || 'aluminum';
  }

  /**
   * Guarda una imagen base64 en disco
   */
  async guardarImagen(resultado, carpeta, prefijo) {
    try {
      const baseDir = path.join(__dirname, '../../', carpeta);
      await fs.mkdir(baseDir, { recursive: true });

      const filename = `${prefijo}-${crypto.randomUUID()}.png`;
      const filepath = path.join(baseDir, filename);

      await fs.writeFile(filepath, Buffer.from(resultado.imagenBase64, 'base64'));

      return {
        success: true,
        filename,
        filepath,
        url: `/${carpeta}/${filename}`
      };
    } catch (error) {
      console.error('Error guardando imagen:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MockupService();
