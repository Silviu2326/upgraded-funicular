const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const { 
  generarPromptIA,
  PROMPTS_CATEGORIA,
  PROMPTS_NEGOCIO,
  TIPOS_CORPOREAS,
  COLORES_LED,
  MATERIALES_LASER
} = require('../config/diccionarioPromptsPro');

// Inicializar Gemini con la API key
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || 'AIzaSyAcp0Q71kM6kExB89ynBfi3iza9P8JNKB8');

class GeminiImageService {
  
  constructor() {
    // Usar el modelo Gemini 3.1 Flash Image Preview con generación de imágenes
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-image-preview',
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 0.7,
      }
    });
    
    // Modelo para prompts (fallback)
    this.textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Procesar imagen base64 para Gemini
   */
  procesarImagenParaGemini(imageUrl, tipo = 'imagen') {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('data:')) {
      try {
        const matches = imageUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches) {
          return {
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          };
        }
      } catch (error) {
        logger.warn(`Error procesando ${tipo}:`, error.message);
      }
    } else if (imageUrl.startsWith('http')) {
      logger.info(`${tipo} URL remota: ${imageUrl}`);
    }
    return null;
  }

  /**
   * Generar imagen de rótulo usando Gemini nativo
   * @param {Object} disenioData - Datos del diseño
   * @returns {Promise<Object>} - Imagen generada en base64
   */
  async generarImagenRotulo(disenioData) {
    try {
      logger.info(`Generando imagen con Gemini para: ${disenioData.nombreNegocio || disenioData.texto}`);
      
      const prompt = this.construirPromptImagen(disenioData);
      
      // Preparar contenido para Gemini
      let contentParts = [];
      
      // Si hay fachada personalizada, añadirla primero como contexto
      if (disenioData.fachadaPersonalizada) {
        const fachadaPart = this.procesarImagenParaGemini(disenioData.fachadaPersonalizada, 'fachada');
        if (fachadaPart) {
          contentParts.push(fachadaPart);
          contentParts.push('Use this facade image as the exact background context. The signage should be placed realistically on this specific facade.');
          logger.info('Fachada personalizada añadida al contenido de Gemini');
        }
      }
      
      // Si hay logo, añadirlo como imagen de referencia
      if (disenioData.logo) {
        const logoUrl = disenioData.logo.url || disenioData.logo;
        const logoPart = this.procesarImagenParaGemini(logoUrl, 'logo');
        if (logoPart) {
          contentParts.push(logoPart);
          logger.info('Logo añadido al contenido de Gemini');
        }
      }
      
      // Añadir el prompt como texto
      contentParts.push(prompt);
      
      // Generar imagen con Gemini
      const result = await this.model.generateContent(contentParts);
      const response = await result.response;
      
      // Extraer imagen de la respuesta
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(part => part.inlineData);
      const textPart = parts.find(part => part.text);
      
      if (!imagePart || !imagePart.inlineData) {
        logger.warn('No se generó imagen, devolviendo prompt');
        return {
          success: true,
          tipo: 'prompt',
          prompt: prompt,
          descripcion: textPart?.text || 'Prompt generado',
          logoIncluido: disenioData.logo ? true : false,
        };
      }
      
      // La imagen viene en base64
      const imageBase64 = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      
      logger.info('Imagen generada exitosamente con Gemini');
      
      return {
        success: true,
        tipo: 'imagen',
        imagen: {
          base64: imageBase64,
          mimeType: mimeType,
          dataUrl: `data:${mimeType};base64,${imageBase64}`,
        },
        prompt: prompt,
        logoIncluido: disenioData.logo ? true : false,
        fachadaIncluida: disenioData.fachadaPersonalizada ? true : false,
      };
      
    } catch (error) {
      logger.error('Error generando imagen con Gemini:', error);
      
      // Fallback: devolver el prompt para usar con otra API
      const prompt = this.construirPromptImagen(disenioData);
      return {
        success: true,
        tipo: 'prompt',
        prompt: prompt,
        fallback: true,
        error: error.message,
      };
    }
  }

  /**
   * Generar múltiples variaciones de la imagen
   */
  async generarVariaciones(disenioData, cantidad = 4) {
    const variaciones = [];
    
    for (let i = 0; i < cantidad; i++) {
      try {
        // Añadir variación al prompt
        const dataConVariacion = {
          ...disenioData,
          variacion: i + 1,
          seed: Date.now() + i,
        };
        
        const resultado = await this.generarImagenRotulo(dataConVariacion);
        
        if (resultado.tipo === 'imagen') {
          variaciones.push({
            id: i,
            imagen: resultado.imagen,
            seleccionada: i === 0,
          });
        }
        
        // Pequeña pausa entre llamadas
        if (i < cantidad - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        logger.error(`Error generando variación ${i}:`, error);
      }
    }
    
    return {
      success: variaciones.length > 0,
      variaciones: variaciones,
      totalGeneradas: variaciones.length,
    };
  }

  /**
   * Generar fondo para lona (sin texto)
   */
  async generarFondoLona(config) {
    try {
      const { tipoNegocio, estiloVisual, colores, descripcion } = config;
      
      // Usar el diccionario para enriquecer el prompt
      const catData = PROMPTS_CATEGORIA['lonas-pancartas'];
      const negData = PROMPTS_NEGOCIO[tipoNegocio] || PROMPTS_NEGOCIO['general'];
      const estiloDesc = catData?.estilos?.[estiloVisual] || catData?.estilos?.['moderno'];
      
      const prompt = `Create a professional decorative background banner for a ${tipoNegocio} business.

STYLE: ${estiloVisual} - ${estiloDesc}
COLORS: ${colores?.join(', ') || 'corporate colors'}
KEYWORDS: ${negData?.keywords?.join(', ') || 'professional, commercial'}
ELEMENTS: ${negData?.elementos?.slice(0, 3).join(', ') || 'business themed'}
${descripcion ? `DETAILS: ${descripcion}` : ''}

REQUIREMENTS:
- Decorative background pattern ONLY, NO text, NO letters, NO words
- Empty center area ready for text overlay
- Professional quality for outdoor banner printing
- High resolution, seamless pattern if applicable
- ${estiloVisual} aesthetic with ${tipoNegocio} themed elements subtly integrated
- Aspect ratio 3:1 (wide banner format)

The image should be a beautiful background that will have text added separately.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(part => part.inlineData);
      
      if (imagePart?.inlineData) {
        return {
          success: true,
          tipo: 'imagen',
          imagen: {
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
            dataUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          },
        };
      }
      
      return {
        success: false,
        tipo: 'prompt',
        prompt: prompt,
      };
      
    } catch (error) {
      logger.error('Error generando fondo lona:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Construir prompt detallado usando el Diccionario de Prompts Profesional
   */
  construirPromptImagen(disenioData) {
    const {
      categoria,
      nombreNegocio,
      texto,
      estiloVisual = 'moderno',
      colores = [],
      coloresSeleccionados = [],
      tipografia,
      orientacion = 'horizontal',
      textoAdicional,
      descripcion,
      corporeaTipo,
      corporeaRelieve,
      ledColor,
      laserMaterial,
      lonaBusinessType,
      lonaStyle,
      configEspecifica = {},
      variacion = 1,
      logo,
      modoIntegracionLogo,
      fachadaPersonalizada,
    } = disenioData;

    // Combinar colores
    const todosLosColores = [
      ...colores.map(c => c.hex || c.nombre || c),
      ...coloresSeleccionados
    ].filter(Boolean);

    // Obtener datos del diccionario
    const catData = PROMPTS_CATEGORIA[categoria];
    const estiloDesc = catData?.estilos?.[estiloVisual] || '';
    const negData = lonaBusinessType ? PROMPTS_NEGOCIO[lonaBusinessType] : null;
    
    // Texto principal
    const textoPrincipal = texto || nombreNegocio;
    
    // Construir secciones específicas por categoría
    let seccionEspecifica = '';
    
    if (categoria === 'letras-corporeas' && (corporeaTipo || configEspecifica?.tipoLetraCorporea)) {
      const tipo = corporeaTipo || configEspecifica?.tipoLetraCorporea;
      const tipoInfo = TIPOS_CORPOREAS[tipo];
      const relieve = corporeaRelieve || configEspecifica?.espesor;
      seccionEspecifica = `
LETTER TYPE: ${tipoInfo?.nombre || tipo}
- Material: ${tipoInfo?.descripcion || 'premium material'}
- Thickness: ${relieve || '5cm'} depth
- Finish: ${tipoInfo?.acabados?.join(', ') || 'professional'}`;
    }
    
    if (categoria === 'letras-neon' && (ledColor || configEspecifica?.colorLuzLed)) {
      const color = ledColor || configEspecifica?.colorLuzLed;
      const ledInfo = COLORES_LED[color];
      seccionEspecifica = `
NEON SPECIFICATIONS:
- LED Color: ${ledInfo?.nombre || color}
- Temperature: ${ledInfo?.temp || 'vibrant'}
- Effect: Glowing neon tubes with soft halo`;
    }
    
    if (categoria === 'lonas-pancartas' && (lonaBusinessType || configEspecifica?.tipoNegocioLona)) {
      const negocio = lonaBusinessType || configEspecifica?.tipoNegocioLona;
      const neg = PROMPTS_NEGOCIO[negocio] || PROMPTS_NEGOCIO['general'];
      seccionEspecifica = `
BANNER CONTEXT:
- Business Type: ${negocio}
- Style: ${lonaStyle || configEspecifica?.estiloLona || estiloVisual}
- Keywords: ${neg?.keywords?.join(', ') || 'professional'}
- Visual Elements: ${neg?.elementos?.slice(0, 3).join(', ') || 'commercial'}`;
    }

    // Componer prompt final
    return `Professional commercial signage photography: ${catData?.contexto || 'sign'} 

BUSINESS NAME: "${textoPrincipal}"
${textoAdicional ? `TAGLINE: "${textoAdicional}"` : ''}

SPECIFICATIONS:
- Product: ${categoria}
- Style: ${estiloVisual} - ${estiloDesc}
- Colors: ${todosLosColores.join(', ') || 'professional palette'}
- Typography: ${tipografia?.nombre || tipografia?.familia || 'modern professional font'}
- Orientation: ${orientacion}

${seccionEspecifica}

CONTEXT:
${catData?.contexto || 'Professional commercial signage'}
${negData ? `Business context: ${negData.keywords?.join(', ')}` : ''}
${descripcion?.original ? `Additional details: ${descripcion.original}` : ''}

${logo ? `LOGO REFERENCE (Exact Integration Required):
Use the provided logo image as an exact reference. The logo must be integrated precisely as shown, maintaining all original colors, shapes, and proportions. Position the logo prominently alongside the main text.` : 'LOGO: No logo provided - text only design'}

${fachadaPersonalizada ? `FACADE REFERENCE:
The provided facade image shows the EXACT background where the signage will be installed. Place the signage realistically on this specific facade, matching the perspective, lighting, and architectural style.` : 'FACADE: Standard facade context - professional building exterior'}

TECHNICAL REQUIREMENTS:
- Photorealistic 3D render quality
- 8K resolution, ultra-detailed
- Sharp focus on "${textoPrincipal}"
- Professional commercial photography
- No watermarks, no text errors
- Clean composition for marketing
- Aspect ratio ${orientacion === 'horizontal' ? '16:9' : orientacion === 'vertical' ? '9:16' : '1:1'}
${variacion > 1 ? `- Variation ${variacion}` : ''}

Create a stunning promotional image for a signage company portfolio.`;
  }

  /**
   * Construir prompt detallado según categoría (método legacy)
   */
  construirPromptImagenLegacy(disenioData) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual = 'moderno',
      colores = [],
      tipografia,
      dimensiones,
      variacion = 1,
    } = disenioData;

    // Mapeo de categorías a descripciones
    const categoriasPrompt = {
      'letras-neon': {
        tipo: 'neon LED sign',
        detalles: 'glowing neon tubes, electric glow effect, mounted on dark wall',
        iluminacion: 'nighttime, neon illumination, vibrant glow',
        estilo: 'modern, vibrant, eye-catching',
      },
      'letras-corporeas': {
        tipo: '3D channel letters sign',
        detalles: 'dimensional letters with depth, mounted on building facade, professional installation',
        iluminacion: 'daylight with soft shadows, professional architectural lighting',
        estilo: 'corporate, professional, premium quality',
      },
      'rotulos': {
        tipo: 'illuminated storefront sign',
        detalles: 'lightbox style sign, storefront facade, commercial exterior',
        iluminacion: 'evening golden hour, illuminated sign against building',
        estilo: 'commercial, welcoming, professional',
      },
      'lonas-pancartas': {
        tipo: 'advertising banner',
        detalles: 'large format printed banner, outdoor setting, professional installation',
        iluminacion: 'natural daylight, outdoor commercial setting',
        estilo: 'bold, visible, professional marketing',
      },
      'vinilos': {
        tipo: 'window vinyl sign',
        detalles: 'applied on glass window, storefront window, interior visible through glass',
        iluminacion: 'natural light, reflections on glass, daytime',
        estilo: 'elegant, visible, professional retail',
      },
      'banderolas': {
        tipo: 'blade sign',
        detalles: 'projecting sign perpendicular to building, double-sided, mounted on bracket',
        iluminacion: 'daylight, street view perspective',
        estilo: 'classic, visible from street, professional',
      },
      'rigidos-impresos': {
        tipo: 'rigid panel sign',
        detalles: 'PVC forex panel, wall mounted, flat printed surface',
        iluminacion: 'indoor or outdoor lighting, clear visibility',
        estilo: 'clean, professional, straightforward',
      },
      'rollup': {
        tipo: 'roll up banner display',
        detalles: 'portable banner stand, chrome base, exhibition setting',
        iluminacion: 'indoor exhibition lighting, professional event setting',
        estilo: 'professional, portable, marketing display',
      },
    };

    const cat = categoriasPrompt[categoria] || categoriasPrompt['rotulos'];
    
    const coloresStr = colores.length > 0 
      ? colores.map(c => c.nombre || c.hex).join(', ')
      : 'professional colors';

    return `Create a professional commercial photography of a ${cat.tipo} for a business named "${nombreNegocio}".

SIGN DETAILS:
- Text: "${nombreNegocio}" (must be clearly visible and legible)
- Style: ${estiloVisual}, ${cat.estilo}
- Colors: ${coloresStr}
${tipografia?.nombre ? `- Typography: ${tipografia.nombre}` : ''}
- ${cat.detalles}

LIGHTING & ATMOSPHERE:
- ${cat.iluminacion}
- Professional commercial photography lighting
- Photorealistic quality

TECHNICAL REQUIREMENTS:
- High resolution, photorealistic 3D render quality
- Professional commercial photography style
- Sharp focus on the sign text "${nombreNegocio}"
- No watermarks, no additional text overlays
- Clean background appropriate for the business type
- Aspect ratio ${dimensiones?.ancho >= dimensiones?.alto ? '16:9 horizontal' : '9:16 vertical'}
${variacion > 1 ? `- Variation ${variacion}: slightly different angle or lighting` : ''}

The image should look like a professional promotional photo for a signage company portfolio.`;
  }

  /**
   * Guardar imagen base64 a archivo
   */
  async guardarImagen(base64Data, filename) {
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      const filepath = path.join(__dirname, '../../uploads', filename);
      await fs.writeFile(filepath, buffer);
      return filepath;
    } catch (error) {
      logger.error('Error guardando imagen:', error);
      throw error;
    }
  }

  /**
   * Verificar si el modelo de imagen está disponible
   */
  async verificarDisponibilidad() {
    try {
      const result = await this.model.generateContent('Generate a small test image of a red circle');
      const response = await result.response;
      const hasImage = response.candidates?.[0]?.content?.parts?.some(p => p.inlineData);
      
      return {
        disponible: hasImage,
        modelo: 'gemini-3.1-flash-image-preview',
      };
    } catch (error) {
      logger.warn('Modelo de generación de imágenes no disponible:', error.message);
      return {
        disponible: false,
        error: error.message,
        fallback: 'Se usará generación de prompts',
      };
    }
  }
}

module.exports = new GeminiImageService();
