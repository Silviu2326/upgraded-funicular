const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

class AIService {
  
  // ============================================================================
  // GENERACIÓN DE IMÁGENES CON GEMINI (NANO/IMAGEN)
  // ============================================================================
  
  /**
   * Generar imagen de rótulo usando Gemini (modelo con capacidad de imagen)
   * @param {Object} disenioData - Datos del diseño
   * @returns {Promise<Object>} - URL o base64 de la imagen generada
   */
  async generarImagenRotulo(disenioData) {
    try {
      logger.info(`Generando imagen para: ${disenioData.nombreNegocio}`);
      
      // Usar Gemini Pro Vision para generación de imágenes
      // Nota: Gemini actualmente no genera imágenes directamente en la API de Node.js
      // pero podemos usar la API de Imagen de Google o crear prompts optimizados
      // para enviar a otra API de generación de imágenes
      
      // Por ahora, generamos un prompt ultra-optimizado que se puede usar con
      // DALL-E, Midjourney, Stable Diffusion, o la API de Imagen de Google
      const promptOptimizado = await this.crearPromptImagen(disenioData);
      
      // Si tenemos configurada la API de Imagen de Google (Vertex AI)
      if (config.GOOGLE_CLOUD_PROJECT_ID) {
        return await this.generarConVertexAI(promptOptimizado, disenioData);
      }
      
      // Fallback: devolver el prompt optimizado para usar con otra API
      return {
        success: true,
        tipo: 'prompt',
        prompt: promptOptimizado,
        promptEs: await this.traducirPrompt(promptOptimizado, 'es'),
        sugerencias: {
          midjourney: this.adaptarParaMidjourney(promptOptimizado),
          dalle: this.adaptarParaDalle(promptOptimizado),
          stableDiffusion: this.adaptarParaStableDiffusion(promptOptimizado),
        }
      };
      
    } catch (error) {
      logger.error('Error generando imagen:', error);
      throw error;
    }
  }
  
  /**
   * Crear prompt optimizado para generación de imágenes
   */
  async crearPromptImagen(disenioData) {
    const {
      categoria,
      nombreNegocio,
      estiloVisual = 'moderno',
      colores = [],
      tipografia,
      dimensiones,
      descripcion,
      configEspecifica = {}
    } = disenioData;
    
    // Mapeo de categorías a descripciones detalladas
    const categoriaDetalles = {
      'letras-neon': {
        nombre: 'letras neón LED profesionales',
        caracteristicas: 'tubos de neón LED flexibles, brillo uniforme, efecto glow suave',
        fondo: 'fondo oscuro para resaltar la iluminación',
        angulo: 'vista frontal ligeramente elevada',
        iluminacion: 'iluminación nocturna ambiental'
      },
      'letras-corporeas': {
        nombre: 'letras corpóreas 3D de alto impacto',
        caracteristicas: `material ${configEspecifica.material || 'aluminio cepillado'}, relieve ${configEspecifica.espesor || '8cm'}, cantos perfectamente acabados`,
        fondo: 'fachada de edificio comercial moderno',
        angulo: 'vista frontal con ligera perspectiva lateral',
        iluminacion: 'iluminación natural de día con sombras suaves'
      },
      'rotulos': {
        nombre: 'rótulo luminoso comercial profesional',
        caracteristicas: 'caja de luz rectangular, iluminación LED interior uniforme',
        fondo: 'fachada de tienda o local comercial',
        angulo: 'vista frontal desde la acera',
        iluminacion: 'iluminación crepuscular, azul hora dorada'
      },
      'lonas-pancartas': {
        nombre: 'lona publicitaria de gran formato',
        caracteristicas: 'impresión digital de alta resolución, tela reforzada, ojetes metálicos',
        fondo: 'exterior urbano, ambiente comercial',
        angulo: 'vista frontal completa',
        iluminacion: 'iluminación natural diurna'
      },
      'vinilos': {
        nombre: 'vinilo adhesivo para escaparate',
        caracteristicas: 'vinilo de corte preciso, aplicación en cristal transparente',
        fondo: 'interior de tienda borroso a través del cristal',
        angulo: 'vista frontal desde la calle',
        iluminacion: 'luz natural mixta, reflejos suaves en el cristal'
      },
      'banderolas': {
        nombre: 'banderola comercial luminosa',
        caracteristicas: 'formato banderín, doble cara impresa, iluminación LED integrada',
        fondo: 'fachada de local comercial, ambiente urbano',
        angulo: 'vista en perspectiva desde la acera',
        iluminacion: 'iluminación diurna natural'
      },
      'rigidos-impresos': {
        nombre: 'panel rígido PVC/Forex impreso',
        caracteristicas: 'material PVC espumado 5mm, impresión UV directa, colores vivos',
        fondo: 'pared lisa de interior o exterior',
        angulo: 'vista frontal directa',
        iluminacion: 'iluminación artificial de interior'
      },
      'rollup': {
        nombre: 'roll up display portátil',
        caracteristicas: 'soporte enrollable, base cromada, gráfico impreso en lona',
        fondo: 'sala de exposiciones, feria o evento',
        angulo: 'vista ligeramente lateral para ver estructura',
        iluminacion: 'iluminación de sala profesional'
      }
    };
    
    const detalle = categoriaDetalles[categoria] || {
      nombre: 'diseño publicitario profesional',
      caracteristicas: 'acabado profesional, materiales de alta calidad',
      fondo: 'entorno comercial apropiado',
      angulo: 'vista frontal',
      iluminacion: 'iluminación profesional de estudio'
    };
    
    // Construir descripción de colores
    const descripcionColores = colores.length > 0 
      ? colores.map(c => c.nombre || c.hex).join(', ')
      : 'colores corporativos profesionales';
    
    // Construir prompt en inglés (mejor para IA generativa)
    const prompt = `Professional commercial signage photography: ${detalle.nombre} with "${nombreNegocio}" text prominently displayed. 

SPECIFICATIONS:
- Product: ${detalle.caracteristicas}
- Style: ${estiloVisual}, corporate, premium quality
- Colors: ${descripcionColores}
- Typography: ${tipografia?.nombre || 'modern sans-serif professional font'}, clean and highly legible
- Background: ${detalle.fondo}
- Angle: ${detalle.angulo}
- Lighting: ${detalle.iluminacion}

TECHNICAL REQUIREMENTS:
- Photorealistic 3D render quality
- 8K resolution, ultra-detailed
- Sharp focus on the sign text "${nombreNegocio}"
- Professional commercial photography style
- No watermarks, no text overlays except the business name
- Clean composition suitable for marketing materials
- Aspect ratio ${dimensiones?.ancho > dimensiones?.alto ? '16:9 landscape' : dimensiones?.ancho < dimensiones?.alto ? '9:16 portrait' : '1:1 square'}

${descripcion?.original ? `Additional details: ${descripcion.original}` : ''}`;

    return prompt.trim();
  }
  
  /**
   * Generar imagen usando Vertex AI (Google Cloud)
   */
  async generarConVertexAI(prompt, disenioData) {
    try {
      // Aquí iría la implementación de Vertex AI
      // Por ahora es un placeholder
      logger.info('Generando con Vertex AI...');
      
      // Simular respuesta
      return {
        success: true,
        tipo: 'vertex',
        imagenes: [
          { url: 'placeholder', prompt: prompt }
        ]
      };
      
    } catch (error) {
      logger.error('Error con Vertex AI:', error);
      throw error;
    }
  }
  
  /**
   * Adaptar prompt para Midjourney
   */
  adaptarParaMidjourney(promptBase) {
    return `${promptBase} --ar 16:9 --v 6.0 --style raw --s 250 --q 2`;
  }
  
  /**
   * Adaptar prompt para DALL-E 3
   */
  adaptarParaDalle(promptBase) {
    return promptBase; // DALL-E 3 usa prompts naturales
  }
  
  /**
   * Adaptar prompt para Stable Diffusion
   */
  adaptarParaStableDiffusion(promptBase) {
    const negativePrompt = 'blurry, low quality, watermark, text error, misspelled, deformed letters, amateur, sketch, painting';
    return {
      prompt: promptBase,
      negative_prompt: negativePrompt,
      steps: 30,
      cfg_scale: 7.5,
      width: 1024,
      height: 768
    };
  }
  
  /**
   * Traducir prompt usando Gemini
   */
  async traducirPrompt(prompt, idiomaDestino = 'es') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const resultado = await model.generateContent(
        `Traduce el siguiente prompt al ${idiomaDestino === 'es' ? 'español' : 'inglés'} manteniendo todos los términos técnicos: \n\n${prompt}`
      );
      
      return resultado.response.text().trim();
    } catch (error) {
      return prompt;
    }
  }

  // ============================================================================
  // GENERACIÓN DE FONDOS PARA LONAS (SISTEMA HÍBRIDO)
  // ============================================================================
  
  /**
   * Generar fondos decorativos para lonas (sin texto)
   * El texto se superpone con Canvas en el frontend
   */
  async generarFondosLona(configuracion) {
    try {
      const { 
        tipoNegocio = 'restaurante',
        estiloVisual = 'moderno',
        colores = ['#90439e', '#667eea'],
        cantidad = 4
      } = configuracion;
      
      // Prompts específicos para fondos sin texto
      const promptsFondo = {
        restaurante: {
          moderno: `Abstract food-themed background pattern, elegant culinary motifs, ${colores.join(' and ')} color scheme, subtle texture, professional graphic design for restaurant banner, empty center area for text overlay, high resolution, no text, no letters, no words`,
          clasico: `Vintage restaurant ambiance background, warm tones, subtle food elements, ${colores[0]} accents, textured paper effect, space for logo placement, elegant traditional style, no text`,
          minimalista: `Clean minimal food service background, geometric subtle patterns, ${colores.join(' and ')} gradient, lots of negative space for text, modern professional, no text no letters`
        },
        tienda: {
          moderno: `Modern retail abstract background, shopping motifs, ${colores.join(' and ')} vibrant colors, dynamic composition, space for store name, commercial graphic design, no text`,
          elegante: `Luxury boutique background, refined patterns, ${colores[0]} gold accents, sophisticated texture, high-end retail aesthetic, clean space for branding, no text no letters`
        },
        cafeteria: {
          moderno: `Coffee shop atmosphere background, abstract coffee beans and steam motifs, ${colores.join(' and ')} warm palette, cozy ambiance, space for cafe name, no text`,
          retro: `Vintage coffee house background, classic cafe elements, ${colores[0]} brown tones, nostalgic feel, textured aged paper look, space for logo, no text`
        },
        default: {
          moderno: `Professional commercial banner background, abstract geometric patterns, ${colores.join(' and ')} corporate colors, clean modern design, ample space for text overlay, high quality graphic, no text no letters no words`
        }
      };
      
      const categoriaPrompts = promptsFondo[tipoNegocio] || promptsFondo.default;
      const prompt = categoriaPrompts[estiloVisual] || categoriaPrompts.moderno;
      
      // Generar variaciones del prompt
      const variaciones = [];
      for (let i = 0; i < cantidad; i++) {
        variaciones.push(`${prompt}, variation ${i + 1}, unique composition`);
      }
      
      logger.info(`Generados ${variaciones.length} prompts de fondo para lona`);
      
      return {
        success: true,
        tipo: 'fondos-lona',
        prompts: variaciones,
        nota: 'Estos prompts están optimizados para generar fondos sin texto. El texto se añade mediante Canvas en el frontend.'
      };
      
    } catch (error) {
      logger.error('Error generando fondos lona:', error);
      throw error;
    }
  }

  // ============================================================================
  // GENERACIÓN DE PROMPTS Y TEXTO
  // ============================================================================
  
  // Generar prompt optimizado para el diseño
  async generarPrompt(disenioData) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const categoriaNombres = {
        'rotulos': 'rótulo luminoso',
        'letras-neon': 'letras neón LED',
        'rigidos-impresos': 'panel rígido PVC',
        'letras-corporeas': 'letras corpóreas 3D',
        'lonas-pancartas': 'lona publicitaria',
        'banderolas': 'banderola',
        'vinilos': 'vinilo para escaparate',
        'rollup': 'roll up display',
        'photocall': 'photocall',
        'carteles-inmobiliarios': 'cartel inmobiliario',
        'mupis': 'mupi publicitario',
        'flybanner': 'fly banner',
      };

      const tipoProducto = categoriaNombres[disenioData.categoria] || disenioData.categoria;

      const promptBase = `
Eres un experto diseñador de rótulos y publicidad exterior. 
Crea un prompt detallado para generar una imagen profesional de un ${tipoProducto}.

INFORMACIÓN DEL CLIENTE:
- Nombre del negocio: "${disenioData.nombreNegocio}"
- Estilo deseado: ${disenioData.estiloVisual}
- Colores principales: ${disenioData.colores?.map(c => c.nombre).join(', ') || 'no especificados'}
${disenioData.textoAdicional ? `- Texto adicional a incluir: "${disenioData.textoAdicional}"` : ''}
${disenioData.descripcion?.original ? `- Descripción del cliente: "${disenioData.descripcion.original}"` : ''}

REQUISITOS DEL PROMPT:
1. El texto "${disenioData.nombreNegocio}" debe ser LEGIBLE y estar INTEGRADO en el diseño
2. Estilo fotorealista y profesional
3. Fondo apropiado para el tipo de negocio
4. Iluminación adecuada para el tipo de producto
5. Sin elementos que distraigan del texto principal

Genera un prompt en inglés optimizado para IA generativa de imágenes como Midjourney, DALL-E o Stable Diffusion.
`;

      const result = await model.generateContent(promptBase);
      const response = await result.response;
      const promptMejorado = response.text();

      logger.info('Prompt generado con éxito');
      return promptMejorado;

    } catch (error) {
      logger.error('Error generando prompt:', error);
      return this.generarPromptBasico(disenioData);
    }
  }

  // Generar prompt básico como fallback
  generarPromptBasico(disenioData) {
    const categoriaPrompts = {
      'letras-neon': `professional neon sign with "${disenioData.nombreNegocio}" text, glowing LED tubes, ${disenioData.estiloVisual} style, ${disenioData.colores?.map(c => c.nombre).join(' and ') || 'vibrant'} colors, black background, photorealistic, 4k, highly detailed`,
      
      'letras-corporeas': `professional 3D channel letters "${disenioData.nombreNegocio}", ${disenioData.configEspecifica?.material || 'aluminum'}, mounted on wall, ${disenioData.estiloVisual} style, photorealistic, commercial signage, 4k quality`,
      
      'lonas-pancartas': `professional advertising banner with "${disenioData.nombreNegocio}", ${disenioData.estiloVisual} design, ${disenioData.colores?.map(c => c.nombre).join(' and ') || 'colorful'}, outdoor setting, high quality print mockup, photorealistic`,
      
      'rotulos': `professional illuminated storefront sign "${disenioData.nombreNegocio}", ${disenioData.estiloVisual} style, ${disenioData.colores?.map(c => c.nombre).join(' and ') || 'professional colors'}, exterior facade, night lighting, photorealistic, 4k`,
    };

    return categoriaPrompts[disenioData.categoria] || 
           `professional sign design with "${disenioData.nombreNegocio}", ${disenioData.estiloVisual} style, ${disenioData.colores?.map(c => c.nombre).join(' and ') || 'professional'} colors, photorealistic, high quality, 4k`;
  }

  // Mejorar descripción del usuario
  async mejorarDescripcion(descripcion) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Como experto en diseño de rótulos y señalización, mejora la siguiente descripción 
de un cliente para hacerla más detallada y profesional, manteniendo la esencia original.

Descripción original: "${descripcion}"

Proporciona una versión mejorada en español de máximo 150 caracteres.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text().trim();

    } catch (error) {
      logger.error('Error mejorando descripción:', error);
      return descripcion;
    }
  }

  // Analizar legibilidad del diseño
  async analizarLegibilidad(disenioData) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Analiza la legibilidad de un rótulo con las siguientes características:
- Nombre: "${disenioData.nombreNegocio}"
- Tipografía: ${disenioData.tipografia?.nombre}
- Colores: ${disenioData.colores?.map(c => c.hex).join(', ')}
- Tamaño: ${disenioData.dimensiones?.ancho}cm x ${disenioData.dimensiones?.alto}cm

Proporciona una evaluación en formato JSON con:
{
  "puntuacion": número entre 0-100,
  "evaluacion5m": "excelente|bueno|regular|malo",
  "evaluacion10m": "excelente|bueno|regular|malo", 
  "evaluacion20m": "excelente|bueno|regular|malo",
  "recomendaciones": ["recomendación 1", "recomendación 2", ...]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonMatch = response.text().match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.analisisLegibilidadBasico(disenioData);

    } catch (error) {
      logger.error('Error analizando legibilidad:', error);
      return this.analisisLegibilidadBasico(disenioData);
    }
  }

  analisisLegibilidadBasico(disenioData) {
    const numLetras = disenioData.nombreNegocio?.length || 0;
    const area = (disenioData.dimensiones?.ancho * disenioData.dimensiones?.alto) || 0;
    
    let puntuacion = 85;
    
    if (area < 5000) puntuacion -= 10;
    if (area > 20000) puntuacion += 5;
    if (numLetras > 20) puntuacion -= 10;
    if (numLetras < 10) puntuacion += 5;

    return {
      puntuacion: Math.max(0, Math.min(100, puntuacion)),
      evaluacion5m: puntuacion > 80 ? 'excelente' : puntuacion > 60 ? 'bueno' : 'regular',
      evaluacion10m: puntuacion > 70 ? 'bueno' : 'regular',
      evaluacion20m: puntuacion > 60 ? 'regular' : 'malo',
      recomendaciones: [
        'Aumentar el contraste entre texto y fondo',
        'Considerar tipografía más legible',
        'Verificar tamaño proporcional al espacio disponible',
      ],
    };
  }
}

module.exports = new AIService();
