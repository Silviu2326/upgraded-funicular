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
      sistemaIluminacion,
      espesor,
      textoAdicional,
      logo,
      modoLogo = 'ia' // 'ia' = inspirado, 'exacto' = integrar directamente
    } = disenioData;

    // Construir texto completo (nombre + adicional si existe)
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Prompt específico para rótulo aislado sin fondo
    let promptBase = '';
    let promptConLogo = '';

    if (categoria === 'letras-neon') {
      const colorDesc = colores.map(c => c.nombre).join(' and ');
      const colorLuz = colorLuzLed || 'warm white';
      
      promptBase = `REALISTIC NEON SIGN - PRODUCT PHOTOGRAPHY

Physical Specifications:
- REAL glass neon tubes, 10-12mm diameter, filled with ${colorDesc} neon gas
- Tubes have 3D cylindrical volume, not flat
- Visible mounting brackets at connection points
- Black power cables connected to letter sections
- ${colorLuz} glow emanating from within glass tubes
- Subtle reflections on glass surface

Text: "${textoCompleto}"
Style: ${estiloVisual}

ISOLATED on pure black background, studio lighting from above and front,
clear glass tube construction, visible hardware, product photography,
8k resolution, hyper-realistic, sharp focus on tube details`;

      if (logo) {
        if (modoLogo === 'exacto') {
          promptConLogo = `Recreate this exact logo as a LED neon sign. Transform the provided logo image into glowing neon tubes style while keeping the same design, colors, and layout. The sign should show "${textoCompleto}" in neon style inspired by this logo.`;
        } else {
          promptConLogo = `Create a LED neon sign inspired by this brand logo. Use similar colors, style, and design elements from the provided logo image. The sign should show "${textoCompleto}" with the brand's visual identity.`;
        }
      }

    } else if (categoria === 'letras-corporeas') {
      const colorDesc = colores.map(c => c.nombre).join(' and ');
      const matDesc = material || 'aluminum';
      const depth = espesor || 8;
      
      let iluminacionDesc = '';
      if (sistemaIluminacion === 'trasera') {
        iluminacionDesc = `with warm white LED halo backlight, soft glow behind letters`;
      } else if (sistemaIluminacion === 'frontal') {
        iluminacionDesc = `with front LED illumination, bright face lighting`;
      }

      promptBase = `Professional 3D channel letters "${textoCompleto}" isolated on pure white background,
${estiloVisual} style, ${matDesc} material, ${colorDesc} finish, ${depth}cm depth/return,
${iluminacionDesc}, dimensional signage, clean typography "${textoCompleto}",
studio photography, isolated product shot, no environment, no context, just the letters,
8k resolution, photorealistic, sharp focus, professional product photography`;

      if (logo) {
        if (modoLogo === 'exacto') {
          promptConLogo = `Recreate this exact logo as 3D channel letters. Transform the provided logo image into dimensional signage while keeping the same design, typography, and brand identity. The letters should show "${textoCompleto}" matching the logo style.`;
        } else {
          promptConLogo = `Create 3D channel letters inspired by this brand logo. Use similar typography style, colors, and design elements from the provided logo image. The letters should show "${textoCompleto}" with the brand's visual identity.`;
        }
      }

    } else {
      // Default para otras categorías
      const colorDesc = colores.map(c => c.nombre).join(' and ');
      promptBase = `Professional ${categoria} sign "${textoCompleto}" isolated on neutral background,
${estiloVisual} style, ${colorDesc} colors, clean typography "${textoCompleto}",
isolated product shot, no environment, studio photography,
8k resolution, photorealistic`;

      if (logo) {
        promptConLogo = `Create a sign showing "${textoCompleto}" inspired by this brand logo. Use similar design elements, colors, and style from the provided logo image.`;
      }
    }

    console.log('Generando rótulo aislado...');
    if (logo) {
      console.log(`Logo detectado - Modo: ${modoLogo}`);
    }

    let result;
    
    // Si hay logo, usar inlineData para pasar la imagen como referencia
    if (logo) {
      const logoBase64 = this._extractBase64(logo);
      const promptFinal = `${promptConLogo}\n\nBase design requirements: ${promptBase}`;
      
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
      console.log('Prompt:', promptBase.substring(0, 150) + '...');
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

    // Generar mockup EXTERIOR
    if (esExterior || !esInterior) {
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
    }

    // Generar mockup INTERIOR
    if (esInterior || !esExterior) {
      try {
        const mockupInterior = await this._generarMockupInterior(rotuloBase64, disenioData);
        resultados.push({
          tipo: 'interior',
          ...mockupInterior
        });
      } catch (error) {
        console.error('Error generando mockup interior:', error);
        resultados.push({
          tipo: 'interior',
          success: false,
          error: error.message
        });
      }
    }

    return resultados;
  }

  async _generarMockupExterior(rotuloBase64, disenioData) {
    const { nombreNegocio, textoAdicional, fachada, tipoNegocio, categoria } = disenioData;
    
    // Texto completo para el prompt
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Descripción de la fachada
    const fachadaDesc = this._getFachadaDescripcion(fachada);
    
    // Contexto según tipo de negocio
    let contextoDesc = '';
    if (['bar', 'pub'].includes(tipoNegocio)) {
      contextoDesc = 'lively bar district, pedestrians walking, evening atmosphere, inviting entrance';
    } else if (['cafe', 'panaderia'].includes(tipoNegocio)) {
      contextoDesc = 'cozy street cafe, outdoor seating, morning light, welcoming atmosphere';
    } else if (['restaurante'].includes(tipoNegocio)) {
      contextoDesc = 'restaurant row, diners entering, evening ambiance, appetizing atmosphere';
    } else {
      contextoDesc = 'commercial street, pedestrian traffic, storefront visibility, urban setting';
    }

    // Prompt para integración realista del rótulo
    const promptText = `ULTRA-REALISTIC NEON SIGN MOCKUP - EXTERIOR

PHYSICAL NEON SIGN SPECIFICATIONS:
- Construction: REAL glass neon tubes, 10-12mm diameter, gas-filled
- Mounting: Heavy-duty chrome/silver metal brackets every 30-40cm
- Tubes stand 5-8cm OFF the wall surface on spacers
- Wiring: Black power cables connected to EACH letter, transformer visible
- Glass tubes show reflections, imperfections, and 3D cylindrical form
- Glow comes FROM within the tubes, not projected onto wall

CRITICAL PHYSICAL REQUIREMENTS:
1. TUBES HAVE 3D VOLUME - cylindrical glass with thickness, not flat light
2. VISIBLE METAL BRACKETS holding tubes to ${fachadaDesc}
3. CABLES physically connected to each letter section
4. HARD SHADOWS cast by tubes and brackets ON the wall surface
5. Sign looks HEAVY, PERMANENT, and SOLIDLY MOUNTED
6. NO FLOATING HALO - illumination comes ONLY from glass tubes
7. Weathering: Slight dust on tubes, minor imperfections in glow

INSTALLATION DETAILS:
- Wall-mounted brackets with visible screws
- Power transformer box mounted nearby
- Cables run from sign to electrical source
- Gap between tubes and wall creates depth shadows

STOREFRONT CONTEXT:
${fachadaDesc}
${contextoDesc}

ENVIRONMENT INTERACTION:
- Neon reflects on sidewalk/wet pavement below
- Glow creates warm pool of light on entrance area
- Building facade shows realistic texture and weathering
- Sign casts subtle colored light on surroundings

LIGHTING: Evening/dusk with natural ambient light + neon illumination

CAMERA: Professional architectural photography, street level perspective

OUTPUT: Hyper-realistic 8k storefront photograph, sharp detail, commercial photography quality`; 

    // Enviar prompt + imagen de referencia como contexto visual
    const result = await this.model.generateContent([
      {
        text: promptText
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: rotuloBase64
        }
      }
    ]);
    
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
    const { nombreNegocio, textoAdicional, fachada, tipoNegocio, categoria } = disenioData;
    
    // Texto completo para el prompt
    const textoCompleto = textoAdicional 
      ? `${nombreNegocio} ${textoAdicional}` 
      : nombreNegocio;

    // Contexto interior según tipo de negocio
    let interiorDesc = '';
    if (['spa', 'wellness'].includes(tipoNegocio)) {
      interiorDesc = 'luxury spa reception, calm atmosphere, soft lighting, marble walls, serene environment';
    } else if (['hotel'].includes(tipoNegocio)) {
      interiorDesc = 'hotel lobby, elegant reception desk, warm lighting, premium materials, welcoming ambiance';
    } else if (['oficina', 'clinica', 'dentista'].includes(tipoNegocio)) {
      interiorDesc = 'professional reception area, clean modern design, corporate environment, waiting area visible';
    } else {
      interiorDesc = 'elegant interior space, feature wall, professional reception, ambient lighting';
    }

    // Prompt para integración realista en interior
    const promptText = `ULTRA-REALISTIC NEON SIGN MOCKUP - INTERIOR

PHYSICAL NEON SIGN SPECIFICATIONS:
- Construction: REAL glass neon tubes, 10-12mm diameter, filled with neon gas
- Mounting: Heavy-duty metal brackets (chrome/silver) every 30-40cm holding tubes to wall
- Tubes have PHYSICAL DEPTH - they stand 5-8cm OFF the wall surface
- Wiring: Black power cables visibly connected to EACH letter, running to transformer
- Transformer: Small black box visible somewhere on wall or floor
- Glass tubes show subtle reflections and slight imperfections
- Color: Warm golden/amber glow from within the tubes themselves

CRITICAL PHYSICAL REQUIREMENTS:
1. TUBES MUST HAVE 3D VOLUME - not flat light, but cylindrical glass tubes
2. METAL BRACKETS visible holding each section to the wall
3. CABLES connected to each letter, not floating freely
4. HARD SHADOWS cast by tubes and brackets onto wall behind
5. The sign is HEAVY and SOLID - shows weight and permanence
6. NO FLOATING GLOW - light comes ONLY from the glass tubes
7. Wall surface shows slight discoloration/warmth from years of light exposure

INSTALLATION DETAILS:
- Spacers/brackets create 5-8cm gap between tubes and wall
- Visible mounting screws in brackets
- Power cable runs from sign to floor or wall socket
- Optional: Chain or wire suspension for larger sections

SCENE CONTEXT:
${interiorDesc}

ENVIRONMENT INTERACTION:
- Light reflects off nearby surfaces (desk, floor, ceiling)
- Wall has realistic texture (paint, concrete, wood, etc.)
- Subtle ambient occlusion where brackets meet wall
- Neon creates pools of warm light on floor below

CAMERA: Professional architectural photography, eye level, slight angle to show depth

OUTPUT: Hyper-realistic 8k photograph, sharp focus, professional lighting`; 

    // Enviar prompt + imagen de referencia como contexto visual
    const result = await this.model.generateContent([
      {
        text: promptText
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: rotuloBase64
        }
      }
    ]);
    
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
