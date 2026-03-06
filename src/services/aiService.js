const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const { PROMPTS_CATEGORIA, PROMPTS_NEGOCIO } = require('../config/diccionarioPromptsPro');

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

class AIService {
  
  // ============================================================================
  // GENERACIÓN DE PROMPTS CON DICCIONARIO
  // ============================================================================
  
  /**
   * Generar descripción mejorada usando el diccionario de prompts
   */
  generarDescripcionMejorada(descripcionOriginal, categoria, estilo, tipoNegocio = null) {
    try {
      const catData = PROMPTS_CATEGORIA[categoria];
      const negData = tipoNegocio ? PROMPTS_NEGOCIO[tipoNegocio] : null;
      
      if (!catData) return descripcionOriginal;
      
      const mejoras = catData.mejoras;
      const mejoraAleatoria = mejoras[Math.floor(Math.random() * mejoras.length)];
      
      let descripcionMejorada = `${descripcionOriginal}. ${mejoraAleatoria}`;
      
      // Añadir elementos de negocio si existe
      if (negData) {
        const elemento = negData.elementos[Math.floor(Math.random() * negData.elementos.length)];
        descripcionMejorada += `, destacando ${elemento}`;
      }
      
      // Añadir descripción del estilo
      if (catData.estilos[estilo]) {
        descripcionMejorada += `. Estilo ${estilo}: ${catData.estilos[estilo]}`;
      }
      
      logger.info('Descripción mejorada generada con diccionario');
      return descripcionMejorada;
      
    } catch (error) {
      logger.error('Error generando descripción mejorada:', error);
      return descripcionOriginal;
    }
  }
  
  /**
   * Obtener contexto de categoría
   */
  getContextoCategoria(categoria) {
    return PROMPTS_CATEGORIA[categoria]?.contexto || 'rótulo publicitario';
  }
  
  /**
   * Obtener descripción de estilo
   */
  getDescripcionEstilo(categoria, estilo) {
    return PROMPTS_CATEGORIA[categoria]?.estilos?.[estilo] || '';
  }
  
  /**
   * Generar prompt completo para IA usando todos los campos
   */
  async generarPromptCompleto(disenioData) {
    try {
      const {
        categoria,
        nombreNegocio,
        texto,
        estiloVisual = 'moderno',
        colores = [],
        coloresSeleccionados = [],
        tipografia,
        dimensiones,
        descripcion,
        material,
        iluminacion,
        orientacion,
        textoAdicional,
        configEspecifica = {},
        lonaBusinessType,
        lonaStyle,
        logo,
        modoIntegracionLogo,
      } = disenioData;
      
      // Combinar colores
      const todosLosColores = [
        ...colores.map(c => c.hex || c.nombre),
        ...coloresSeleccionados
      ].filter(Boolean);
      
      // Obtener datos del diccionario
      const catData = PROMPTS_CATEGORIA[categoria];
      const estiloDesc = catData?.estilos?.[estiloVisual] || '';
      const negData = lonaBusinessType ? PROMPTS_NEGOCIO[lonaBusinessType] : null;
      
      // Construir prompt detallado
      const prompt = `Professional commercial signage: ${catData?.contexto || 'sign'} 

BUSINESS NAME: "${texto || nombreNegocio}"
${textoAdicional ? `TAGLINE: "${textoAdicional}"` : ''}

SPECIFICATIONS:
- Product Type: ${categoria}
- Material: ${material || 'premium quality'}
- Style: ${estiloVisual} - ${estiloDesc}
- Colors: ${todosLosColores.join(', ') || 'professional color scheme'}
- Typography: ${tipografia?.nombre || tipografia?.familia || 'modern professional font'}
- Orientation: ${orientacion || 'horizontal'}
- Dimensions: ${dimensiones?.ancho || 100}cm x ${dimensiones?.alto || 50}cm
${iluminacion ? '- Lighting: LED integrated illumination' : ''}

SPECIFIC CONFIGURATION:
${configEspecifica.tipoLetraCorporea ? `- Letter Type: ${configEspecifica.tipoLetraCorporea}` : ''}
${configEspecifica.espesor ? `- Thickness: ${configEspecifica.espesor}` : ''}
${configEspecifica.colorLuzLed ? `- LED Color: ${configEspecifica.colorLuzLed}` : ''}
${configEspecifica.materialLaser ? `- Laser Material: ${configEspecifica.materialLaser}` : ''}
${lonaBusinessType ? `- Business Type: ${lonaBusinessType}` : ''}
${lonaStyle ? `- Banner Style: ${lonaStyle}` : ''}

CONTEXT:
${catData?.contexto || 'Professional commercial signage'}
${negData ? `Keywords: ${negData.keywords?.join(', ')}` : ''}
${negData ? `Visual Elements: ${negData.elementos?.join(', ')}` : ''}

${descripcion?.original ? `Additional Details: ${descripcion.original}` : ''}

${logo ? `LOGO REFERENCE (Exact Integration Required):
Use the provided logo image as an exact reference. The logo must be integrated precisely as shown, maintaining all original colors, shapes, and proportions.` : 'LOGO: No logo provided - text only design'}

TECHNICAL REQUIREMENTS:
- Photorealistic 3D render quality
- 8K resolution, ultra-detailed
- Sharp focus on the business name
- Professional commercial photography
- No watermarks, no text overlays
- Clean composition for marketing
n- Aspect ratio ${orientacion === 'horizontal' ? '16:9 landscape' : orientacion === 'vertical' ? '9:16 portrait' : '1:1 square'}`;

      logger.info('Prompt completo generado');
      return prompt.trim();
      
    } catch (error) {
      logger.error('Error generando prompt completo:', error);
      return this.generarPromptBasico(disenioData);
    }
  }

  // ============================================================================
  // GENERACIÓN DE IMÁGENES CON GEMINI
  // ============================================================================
  
  /**
   * Generar imagen de rótulo usando Gemini
   */
  async generarImagenRotulo(disenioData) {
    try {
      logger.info(`Generando imagen para: ${disenioData.nombreNegocio}`);
      
      const promptOptimizado = await this.generarPromptCompleto(disenioData);
      
      if (config.GOOGLE_CLOUD_PROJECT_ID) {
        return await this.generarConVertexAI(promptOptimizado, disenioData);
      }
      
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
    return this.generarPromptCompleto(disenioData);
  }
  
  /**
   * Generar imagen usando Vertex AI
   */
  async generarConVertexAI(prompt, disenioData) {
    try {
      logger.info('Generando con Vertex AI...');
      
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
    const { orientacion } = this;
    const ar = orientacion === 'horizontal' ? '16:9' : orientacion === 'vertical' ? '9:16' : '1:1';
    return `${promptBase} --ar ${ar} --v 6.0 --style raw --s 250 --q 2`;
  }
  
  /**
   * Adaptar prompt para DALL-E 3
   */
  adaptarParaDalle(promptBase) {
    return promptBase;
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
   * Traducir prompt
   */
  async traducirPrompt(prompt, idiomaDestino = 'es') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const resultado = await model.generateContent(
        `Traduce al ${idiomaDestino === 'es' ? 'español' : 'inglés'}: ${prompt}`
      );
      
      return resultado.response.text().trim();
    } catch (error) {
      return prompt;
    }
  }

  // ============================================================================
  // GENERACIÓN DE FONDOS PARA LONAS
  // ============================================================================
  
  /**
   * Generar fondos decorativos para lonas (sistema híbrido)
   */
  async generarFondosLona(configuracion) {
    try {
      const { 
        tipoNegocio = 'general',
        estiloVisual = 'moderno',
        colores = ['#90439e', '#667eea'],
        cantidad = 4,
        descripcion
      } = configuracion;
      
      // Usar diccionario de prompts
      const catData = PROMPTS_CATEGORIA['lonas-pancartas'];
      const negData = PROMPTS_NEGOCIO[tipoNegocio] || PROMPTS_NEGOCIO['general'];
      const estiloDesc = catData?.estilos?.[estiloVisual] || catData?.estilos?.['moderno'];
      
      const coloresStr = colores.join(' and ');
      const keywords = negData?.keywords?.join(', ') || 'professional, commercial';
      
      const promptBase = `Abstract decorative background for ${tipoNegocio} banner, 
${estiloDesc}, ${coloresStr} color scheme, ${keywords}, 
subtle texture, professional graphic design, empty center area for text overlay, 
high resolution, no text, no letters, no words, no watermarks, 
clean composition suitable for signage background`;

      // Generar variaciones
      const variaciones = [];
      for (let i = 0; i < cantidad; i++) {
        variaciones.push(`${promptBase}, variation ${i + 1}, unique composition`);
      }
      
      logger.info(`Generados ${variaciones.length} prompts de fondo para lona`);
      
      return {
        success: true,
        tipo: 'fondos-lona',
        prompts: variaciones,
        config: {
          tipoNegocio,
          estiloVisual,
          colores,
          descripcion
        }
      };
      
    } catch (error) {
      logger.error('Error generando fondos lona:', error);
      throw error;
    }
  }

  // ============================================================================
  // GENERACIÓN DE PROMPTS Y TEXTO
  // ============================================================================
  
  /**
   * Generar prompt optimizado para el diseño (método legacy)
   */
  async generarPrompt(disenioData) {
    return this.generarPromptCompleto(disenioData);
  }

  /**
   * Generar prompt básico como fallback
   */
  generarPromptBasico(disenioData) {
    const { 
      categoria, 
      nombreNegocio, 
      texto,
      estiloVisual = 'moderno',
      colores = [],
      configEspecifica = {}
    } = disenioData;
    
    const catData = PROMPTS_CATEGORIA[categoria];
    const estiloDesc = catData?.estilos?.[estiloVisual] || '';
    
    const categoriaPrompts = {
      'letras-neon': `professional neon sign "${texto || nombreNegocio}", ${estiloDesc}, ${colores?.map(c => c.nombre || c).join(' and ')}, glowing LED tubes, black background, photorealistic, 4k`,
      
      'letras-corporeas': `professional 3D channel letters "${texto || nombreNegocio}", ${configEspecifica?.tipoLetraCorporea || 'aluminum'}, ${estiloDesc}, mounted on wall, photorealistic, 4k`,
      
      'lonas-pancartas': `professional advertising banner "${texto || nombreNegocio}", ${estiloDesc}, ${colores?.map(c => c.nombre || c).join(' and ')}, outdoor setting, photorealistic`,
      
      'rotulos': `professional illuminated storefront sign "${texto || nombreNegocio}", ${estiloDesc}, ${colores?.map(c => c.nombre || c).join(' and ')}, exterior facade, photorealistic, 4k`,
      
      'vinilos': `professional window vinyl "${texto || nombreNegocio}", ${estiloDesc}, applied on glass, street view, photorealistic`,
      
      'banderolas': `professional storefront banner "${texto || nombreNegocio}", ${estiloDesc}, double-sided, exterior facade, photorealistic`,
    };

    return categoriaPrompts[categoria] || 
           `professional sign "${texto || nombreNegocio}", ${estiloDesc}, photorealistic, 4k`;
  }

  /**
   * Mejorar descripción del usuario
   */
  async mejorarDescripcion(descripcion, categoria, estilo, tipoNegocio) {
    try {
      // Usar el diccionario para mejorar
      const mejorada = this.generarDescripcionMejorada(descripcion, categoria, estilo, tipoNegocio);
      
      // Opcional: Usar Gemini para pulir
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Como experto en diseño de rótulos, pulige esta descripción para hacerla más profesional (máximo 200 caracteres):

"${mejorada}"

Versión pulida:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text().trim() || mejorada;

    } catch (error) {
      logger.error('Error mejorando descripción:', error);
      return this.generarDescripcionMejorada(descripcion, categoria, estilo, tipoNegocio);
    }
  }

  /**
   * Analizar legibilidad del diseño
   */
  async analizarLegibilidad(disenioData) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Analiza la legibilidad de este rótulo:
- Texto: "${disenioData.texto || disenioData.nombreNegocio}"
- Tipografía: ${disenioData.tipografia?.nombre || 'default'}
- Colores: ${disenioData.colores?.map(c => c.hex).join(', ')}
- Tamaño: ${disenioData.dimensiones?.ancho}cm x ${disenioData.dimensiones?.alto}cm
- Estilo: ${disenioData.estiloVisual}

Responde en JSON:
{
  "puntuacion": 0-100,
  "evaluacion5m": "excelente|bueno|regular|malo",
  "evaluacion10m": "excelente|bueno|regular|malo", 
  "evaluacion20m": "excelente|bueno|regular|malo",
  "recomendaciones": ["..."]
}`;

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
  
  /**
   * Análisis de legibilidad básico
   */
  analisisLegibilidadBasico(disenioData) {
    const texto = disenioData.texto || disenioData.nombreNegocio || '';
    const numLetras = texto.length;
    const area = (disenioData.dimensiones?.ancho * disenioData.dimensiones?.alto) || 0;
    const tieneIluminacion = disenioData.iluminacion || disenioData.configEspecifica?.colorLuzLed;
    
    let puntuacion = 85;
    
    if (area < 5000) puntuacion -= 10;
    if (area > 20000) puntuacion += 5;
    if (numLetras > 20) puntuacion -= 10;
    if (numLetras < 10) puntuacion += 5;
    if (tieneIluminacion) puntuacion += 10;

    return {
      puntuacion: Math.max(0, Math.min(100, puntuacion)),
      evaluacion5m: puntuacion > 80 ? 'excelente' : puntuacion > 60 ? 'bueno' : 'regular',
      evaluacion10m: puntuacion > 70 ? 'bueno' : 'regular',
      evaluacion20m: puntuacion > 60 ? 'regular' : 'malo',
      recomendaciones: [
        'Aumentar el contraste entre texto y fondo',
        'Considerar tipografía más legible',
        'Verificar tamaño proporcional al espacio disponible',
        tieneIluminacion ? 'La iluminación LED mejora la visibilidad nocturna' : 'Considerar iluminación LED para mejor visibilidad',
      ],
    };
  }
}

module.exports = new AIService();
