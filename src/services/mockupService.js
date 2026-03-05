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
      
      promptBase = `REAL NEON TUBES - NO BACKING PANEL

Construction:
- Individual REAL glass neon tubes, 10-12mm diameter
- ${colorDesc} gas-filled tubes, ${colorLuz} glow
- 3D cylindrical glass with visible thickness
- NO acrylic/glass backing panel
- NO frame or substrate
- Individual tubes forming letters "${textoCompleto}"

Mounting Hardware Visible:
- Small metal electrode housings at tube ends
- Silicone cable connections between letter sections
- ${estiloVisual} style

PURE BLACK BACKGROUND, studio lighting,
product photography, isolated individual tubes,
8k resolution, hyper-realistic glass material`;

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
    const promptText = `ULTRA-REALISTIC NEON SIGN - MOUNTED ON WALL

CRITICAL: INDIVIDUAL LETTER MOUNTING - NO SUPPORT PANEL
- Each letter/bend is mounted DIRECTLY to ${fachadaDesc} with individual metal brackets
- NO glass/acrylic backing panel holding the entire sign
- NO frame or box around the sign
- Each tube section has its own mounting hardware

PHYSICAL NEON SPECIFICATIONS:
- REAL glass neon tubes, 10-12mm diameter
- Individual chrome/stainless steel brackets at each letter mounting point
- Brackets bolted DIRECTLY into wall surface
- Tubes protrude 5-8cm from wall on spacers
- Black silicone-coated cables connect letter sections
- Visible wire runs between letters along wall surface
- Metal transformer box mounted on wall near sign

MOUNTING DETAILS (CRITICAL):
- Individual "L" brackets or circular mounts at tube bends and straight sections
- Visible screws/bolts securing each bracket to ${fachadaDesc}
- NO continuous backing plate or substrate
- Letters appear to "float" slightly but each has physical connection to wall
- Gaps between letters show wall texture behind

PHYSICAL PROPERTIES:
- Tubes cast DISTINCT SHADOWS on wall (one per tube section)
- Brackets cast small sharp shadows
- Glow reflects subtly on wall surface around tubes
- Weather-appropriate installation (sealed penetrations, outdoor-rated)

STOREFRONT:
${fachadaDesc}
${contextoDesc}

COMPOSITION: Sign is architectural element, not applied graphic

OUTPUT: Professional architectural photography, 8k, dusk/evening lighting`; 

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
    const promptText = `ULTRA-REALISTIC NEON SIGN - INTERIOR WALL MOUNTED

CRITICAL: NO BACKING PANEL - INDIVIDUAL MOUNTING ONLY
- Each neon letter mounted INDIVIDUALLY to interior wall
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
