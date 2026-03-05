const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const diccionarioPrompts = require('../config/diccionarioPrompts');

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
   * Generar imagen de rótulo usando Gemini nativo
   * @param {Object} disenioData - Datos del diseño
   * @returns {Promise<Object>} - Imagen generada en base64
   */
  async generarImagenRotulo(disenioData) {
    try {
      logger.info(`Generando imagen con Gemini para: ${disenioData.nombreNegocio}`);
      
      const prompt = this.construirPromptImagen(disenioData);
      
      // Generar imagen con Gemini
      const result = await this.model.generateContent(prompt);
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
      
      const prompt = `Create a professional decorative background banner for a ${tipoNegocio} business.

STYLE: ${estiloVisual}, professional graphic design
COLORS: ${colores?.join(', ') || 'corporate colors'}
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
    // Usar el constructor de prompts del diccionario
    const promptBase = diccionarioPrompts.construirPrompt(disenioData);
    
    // Añadir detalles adicionales específicos
    const {
      categoria,
      nombreNegocio,
      estiloVisual,
      colores = [],
      tipografia,
      tipoLetraCorporea,
      espesor,
      colorLuzLed,
      materialLaser,
      fachada,
      tipoNegocio,
      variacion = 1,
    } = disenioData;

    // Obtener keywords enriquecidas
    const keywords = diccionarioPrompts.getKeywords(categoria, estiloVisual);
    
    // Construir secciones detalladas
    let seccionDetalles = '';
    let seccionMaterial = '';
    let seccionIluminacion = '';
    
    // Detalles específicos por categoría
    const catInfo = diccionarioPrompts.categoriasProducto[categoria];
    if (catInfo && catInfo.promptTemplate) {
      seccionDetalles = `\n${catInfo.promptTemplate.detalles || ''}`;
      seccionIluminacion = `\n${catInfo.promptTemplate.iluminacion || ''}`;
    }
    
    // Materiales específicos
    if (categoria === 'letras-corporeas' && tipoLetraCorporea) {
      const matBase = tipoLetraCorporea.split('-')[0];
      const matInfo = diccionarioPrompts.materiales[matBase];
      if (matInfo) {
        seccionMaterial = `\nMATERIAL SPECIFICATIONS:
- Primary material: ${matInfo.nombre.en}
- Finish: ${matInfo.acabados.join(', ')}
- Appearance: ${matInfo.apariencia}
${espesor ? `- Thickness: ${espesor}cm depth` : ''}`;
      }
    }
    
    // Iluminación específica
    if (colorLuzLed && (categoria === 'letras-neon' || categoria === 'letras-corporeas')) {
      seccionIluminacion += `\n- LED ${categoria === 'letras-neon' ? 'neon tubes' : 'illumination'} with ${colorLuzLed} light`;
    }

    // Componer prompt final
    return `${promptBase}

${seccionMaterial}
${seccionDetalles}
${seccionIluminacion}

TECHNICAL SPECIFICATIONS:
- Keywords: ${keywords.slice(0, 8).join(', ')}
- Variation: ${variacion}
- Rendering: photorealistic 3D, ray-traced lighting
- Resolution: 8K ultra-detailed
- Focus: sharp focus on "${nombreNegocio}" text
- Quality: professional commercial photography, marketing-ready
- No watermarks, no text errors, perfect typography

Create a visually stunning promotional image perfect for a signage company portfolio.`;
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
