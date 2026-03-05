/**
 * ============================================================================
 * GEMINI IMAGE SERVICE PRO v3.0
 * Servicio de generación de imágenes con prompts mejorados
 * ============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const diccionarioPro = require('../config/diccionarioPromptsPro');
const fs = require('fs');
const path = require('path');

class GeminiImageServicePro {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️  GEMINI_API_KEY no configurada. El servicio no funcionará.');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    // Usar el modelo correcto para generación de imágenes
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-image-preview',
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });
  }

  /**
   * Construye un prompt profesional usando el diccionario avanzado
   */
  construirPromptImagen(disenioData, opciones = {}) {
    const {
      formato = 'gemini', // 'gemini' (natural) o 'estructurado' (con secciones)
      incluirTecnico = true,
      enfasisEn = null // 'color', 'material', 'iluminacion', etc.
    } = opciones;

    if (formato === 'estructurado') {
      return diccionarioPro.construirPromptPro(disenioData);
    }

    const promptNatural = diccionarioPro.construirPromptGemini(disenioData);
    
    // Añadir énfasis si se especifica
    if (enfasisEn) {
      const enfasis = this._getEnfasis(enfasisEn, disenioData);
      return `${promptNatural}. ${enfasis}`;
    }

    return promptNatural;
  }

  _getEnfasis(tipo, datos) {
    const enfasis = {
      color: `Emphasis on vibrant color accuracy and harmonious color relationships in the ${datos.colores?.length > 1 ? 'multi-color' : 'single-color'} design`,
      material: `Special attention to material textures, surface finishes, and physical material properties`,
      iluminacion: `Dramatic lighting effects with emphasis on ${datos.colorLuzLed || 'ambient'} illumination and atmospheric mood`,
      tipografia: `Focus on typography quality, perfect letterforms, and professional font rendering`
    };
    return enfasis[tipo] || '';
  }

  /**
   * Genera una imagen de rótulo profesional
   */
  async generarImagenRotulo(disenioData, opcionesPrompt = {}) {
    try {
      console.log('\n🎨 Generando imagen con diccionario PRO...');
      console.log('─'.repeat(60));

      // Construir el prompt
      const prompt = this.construirPromptImagen(disenioData, opcionesPrompt);
      
      console.log('📝 Prompt generado:');
      console.log(prompt.substring(0, 200) + '...');
      console.log('─'.repeat(60));

      // Generar
      const startTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const generationTime = Date.now() - startTime;

      // Extraer la imagen
      const candidates = result.response.candidates;
      if (!candidates?.length) {
        throw new Error('No se recibieron candidatos de imagen');
      }

      let imagenBase64 = null;
      let textoRespuesta = '';

      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imagenBase64 = part.inlineData.data;
          console.log('✅ Imagen generada correctamente');
        }
        if (part.text) {
          textoRespuesta += part.text + ' ';
        }
      }

      if (!imagenBase64) {
        throw new Error('No se encontró imagen en la respuesta. Texto: ' + textoRespuesta);
      }

      console.log(`⏱️  Tiempo: ${(generationTime/1000).toFixed(1)}s`);
      console.log(`📊 Tamaño imagen: ${(imagenBase64.length * 0.75 / 1024).toFixed(1)} KB`);

      return {
        success: true,
        imagenBase64,
        prompt,
        textoRespuesta: textoRespuesta.trim(),
        metadata: {
          modelo: 'gemini-3.1-flash-image-preview',
          tiempoGeneracion: generationTime,
          tamanoBytes: imagenBase64.length * 0.75,
          fechaGeneracion: new Date().toISOString(),
          opcionesPrompt
        }
      };

    } catch (error) {
      console.error('❌ Error en generarImagenRotulo:', error.message);
      return {
        success: false,
        error: error.message,
        prompt: this.construirPromptImagen(disenioData, opcionesPrompt)
      };
    }
  }

  /**
   * Genera múltiples variaciones de la misma configuración
   */
  async generarVariaciones(disenioData, cantidad = 3, opciones = {}) {
    console.log(`\n🔄 Generando ${cantidad} variaciones...`);
    
    const promptsVariaciones = diccionarioPro.generarVariaciones(disenioData, cantidad);
    const resultados = [];

    for (let i = 0; i < promptsVariaciones.length; i++) {
      const variacion = promptsVariaciones[i];
      console.log(`\n📸 Variación ${i + 1}/${cantidad}: ${variacion.angulo}, ${variacion.iluminacion}`);
      
      const resultado = await this.generarImagenRotulo(
        { ...disenioData, ...variacion },
        { ...opciones, formato: 'gemini' }
      );

      resultados.push({
        variacion: i + 1,
        ...resultado,
        angulo: variacion.angulo,
        iluminacion: variacion.iluminacion
      });

      // Pequeña pausa entre generaciones
      if (i < promptsVariaciones.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return resultados;
  }

  /**
   * Genera fondo de lona (solo background, sin texto)
   */
  async generarFondoLona(tema, estilo, colores, opciones = {}) {
    const promptTemplate = diccionarioPro.categoriasProducto['lonas-pancartas'].templatesFondo[tema] || 
                           diccionarioPro.categoriasProducto['lonas-pancartas'].templatesFondo.retail;
    
    const color1 = colores[0]?.nombre || 'blue';
    const color2 = colores[1]?.nombre || 'white';
    
    const prompt = promptTemplate
      .replace('{color}', color1)
      .replace('{accentColor}', color2)
      .replace('{style}', estilo || 'modern');

    console.log('\n🎨 Generando fondo de lona...');
    console.log('Prompt:', prompt);

    const result = await this.model.generateContent(prompt + ', high resolution 4k, print-ready quality, empty center space for text overlay');

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
      prompt,
      tema,
      estilo
    };
  }

  /**
   * Guarda imagen generada en disco
   */
  async guardarImagen(resultado, directorio = 'uploads') {
    if (!resultado.success || !resultado.imagenBase64) {
      throw new Error('No hay imagen para guardar');
    }

    // Asegurar directorio
    const uploadDir = path.join(process.cwd(), directorio);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generar nombres de archivo
    const timestamp = Date.now();
    const nombreBase = `rotulo-pro-${timestamp}`;
    const imagenPath = path.join(uploadDir, `${nombreBase}.png`);
    const promptPath = path.join(uploadDir, `${nombreBase}-prompt.txt`);

    // Guardar imagen
    fs.writeFileSync(imagenPath, Buffer.from(resultado.imagenBase64, 'base64'));
    
    // Guardar prompt
    fs.writeFileSync(promptPath, resultado.prompt);

    return {
      imagen: imagenPath,
      prompt: promptPath,
      nombreBase
    };
  }

  /**
   * Analiza y mejora un prompt básico
   */
  async analizarPrompt(promptBasico) {
    console.log('\n🔍 Analizando prompt básico...');
    console.log('Prompt original:', promptBasico);
    
    // Extraer elementos
    const categoria = this._detectarCategoria(promptBasico);
    const estilo = this._detectarEstilo(promptBasico);
    const colores = this._detectarColores(promptBasico);
    
    return {
      elementosDetectados: {
        categoria,
        estilo,
        colores
      },
      sugerencias: this._generarSugerencias(categoria, estilo, colores),
      promptMejorado: null // Se generaría con construirPromptImagen
    };
  }

  _detectarCategoria(texto) {
    const categorias = {
      'neon': 'letras-neon',
      'corporea': 'letras-corporeas',
      'caja': 'rotulos',
      'lona': 'lonas-pancartas'
    };
    
    for (const [key, value] of Object.entries(categorias)) {
      if (texto.toLowerCase().includes(key)) return value;
    }
    return 'letras-neon';
  }

  _detectarEstilo(texto) {
    const estilos = ['moderno', 'elegante', 'industrial', 'vintage', 'minimalista', 'neon'];
    return estilos.find(e => texto.toLowerCase().includes(e)) || 'moderno';
  }

  _detectarColores(texto) {
    const colores = Object.keys(diccionarioPro.colores);
    return colores.filter(c => texto.toLowerCase().includes(c));
  }

  _generarSugerencias(categoria, estilo, colores) {
    const sugerencias = [];
    
    if (!categoria) {
      sugerencias.push('Considere especificar el tipo de rótulo (neón, corpórea, caja)');
    }
    
    if (colores.length === 0) {
      sugerencias.push('Agregue especificaciones de color para mejor resultado');
    }
    
    return sugerencias;
  }

  /**
   * Obtiene información del diccionario para debugging
   */
  getDiccionarioInfo() {
    return {
      version: '3.0 PRO',
      categorias: Object.keys(diccionarioPro.categoriasProducto),
      estilos: Object.keys(diccionarioPro.estilosVisuales),
      tipografias: Object.keys(diccionarioPro.tipografias),
      colores: Object.keys(diccionarioPro.colores),
      plantillasDisponibles: Object.keys(diccionarioPro.plantillasBase)
    };
  }
}

module.exports = new GeminiImageServicePro();
