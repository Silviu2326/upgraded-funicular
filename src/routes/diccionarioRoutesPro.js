/**
 * ============================================================================
 * DICCIONARIO ROUTES PRO v3.0
 * API endpoints para el diccionario de prompts mejorado
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const diccionarioPro = require('../config/diccionarioPromptsPro');
const geminiServicePro = require('../services/geminiImageServicePro');

// ============================================================================
// ENDPOINTS DE CONSULTA DEL DICCIONARIO
// ============================================================================

// Info general del diccionario
router.get('/info', (req, res) => {
  res.json(geminiServicePro.getDiccionarioInfo());
});

// Obtener todas las categorías
router.get('/categorias', (req, res) => {
  const categorias = Object.entries(diccionarioPro.categoriasProducto).map(([key, value]) => ({
    id: key,
    nombre: value.nombre,
    descripcion: value.descripcionPrompt.corta
  }));
  res.json(categorias);
});

// Obtener detalle de una categoría
router.get('/categorias/:id', (req, res) => {
  const categoria = diccionarioPro.categoriasProducto[req.params.id];
  if (!categoria) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }
  res.json(categoria);
});

// Obtener estilos visuales
router.get('/estilos', (req, res) => {
  const estilos = Object.entries(diccionarioPro.estilosVisuales).map(([key, value]) => ({
    id: key,
    descripcion: value.descripcionPrompt,
    caracteristicas: value.caracteristicas,
    paleta: value.paleta,
    keywords: value.keywords
  }));
  res.json(estilos);
});

// Obtener tipografías
router.get('/tipografias', (req, res) => {
  const tipografias = Object.entries(diccionarioPro.tipografias).map(([key, value]) => ({
    id: key,
    nombre: value.nombre,
    instruccionPrompt: value.instruccionPrompt,
    caracteristicas: value.caracteristicas
  }));
  res.json(tipografias);
});

// Obtener colores
router.get('/colores', (req, res) => {
  const colores = Object.entries(diccionarioPro.colores).map(([key, value]) => ({
    id: key,
    hex: value.hex,
    nombre: value.nombres,
    especificacion: value.especificacionPrompt,
    combinaciones: value.combinaciones
  }));
  res.json(colores);
});

// Obtener materiales (para corpóreas)
router.get('/materiales', (req, res) => {
  const materiales = diccionarioPro.categoriasProducto['letras-corporeas']?.materiales;
  if (!materiales) {
    return res.status(404).json({ error: 'Materiales no disponibles' });
  }
  
  const lista = Object.entries(materiales).map(([key, value]) => ({
    id: key,
    nombre: value.nombre,
    propiedades: value.propiedades,
    acabados: value.acabados,
    reflectancia: value.reflectancia,
    peso: value.peso
  }));
  
  res.json(lista);
});

// Obtener sistemas de iluminación
router.get('/iluminacion', (req, res) => {
  const sistemas = diccionarioPro.categoriasProducto['letras-corporeas']?.sistemasIluminacion;
  if (!sistemas) {
    return res.status(404).json({ error: 'Sistemas no disponibles' });
  }
  
  const lista = Object.entries(sistemas).map(([key, value]) => ({
    id: key,
    nombre: value.nombre,
    descripcion: value.descripcion,
    efecto: value.efecto,
    mejorPara: value.mejorPara,
    prompt: value.prompt
  }));
  
  res.json(lista);
});

// ============================================================================
// ENDPOINTS DE GENERACIÓN DE PROMPTS
// ============================================================================

// Generar prompt completo
router.post('/generar-prompt', (req, res) => {
  const { 
    categoria, 
    nombreNegocio, 
    estiloVisual, 
    colores, 
    tipografia,
    material,
    sistemaIluminacion,
    colorLuzLed,
    fachada,
    formato = 'gemini',
    enfasisEn
  } = req.body;

  if (!categoria || !nombreNegocio) {
    return res.status(400).json({ 
      error: 'categoria y nombreNegocio son requeridos' 
    });
  }

  try {
    const disenioData = {
      categoria,
      nombreNegocio,
      estiloVisual: estiloVisual || 'moderno',
      colores: colores || [],
      tipografia,
      material,
      sistemaIluminacion,
      colorLuzLed,
      fachada
    };

    const prompt = geminiServicePro.construirPromptImagen(disenioData, {
      formato,
      enfasisEn
    });

    // Obtener keywords
    const keywords = diccionarioPro.getKeywordsPro(disenioData);

    res.json({
      success: true,
      prompt,
      formato,
      longitud: prompt.length,
      keywords: keywords.slice(0, 10),
      metadata: {
        categoria,
        estiloVisual,
        caracteres: prompt.length,
        palabras: prompt.split(' ').length
      }
    });

  } catch (error) {
    console.error('Error generando prompt:', error);
    res.status(500).json({ 
      error: 'Error generando prompt',
      message: error.message 
    });
  }
});

// Generar variaciones de prompt
router.post('/generar-variaciones', (req, res) => {
  const { datos, cantidad = 3 } = req.body;

  if (!datos || !datos.categoria || !datos.nombreNegocio) {
    return res.status(400).json({ 
      error: 'datos con categoria y nombreNegocio son requeridos' 
    });
  }

  try {
    const variaciones = diccionarioPro.generarVariaciones(datos, cantidad);
    
    res.json({
      success: true,
      cantidad: variaciones.length,
      variaciones: variaciones.map(v => ({
        id: v.variacion,
        angulo: v.angulo,
        iluminacion: v.iluminacion,
        promptPreview: v.prompt.substring(0, 100) + '...',
        longitud: v.prompt.length
      }))
    });

  } catch (error) {
    console.error('Error generando variaciones:', error);
    res.status(500).json({ 
      error: 'Error generando variaciones',
      message: error.message 
    });
  }
});

// Analizar y mejorar prompt básico
router.post('/analizar-prompt', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt es requerido' });
  }

  try {
    const analisis = geminiServicePro.analizarPrompt(prompt);
    
    res.json({
      success: true,
      promptOriginal: prompt,
      analisis: analisis.elementosDetectados,
      sugerencias: analisis.sugerencias,
      promptMejorado: analisis.promptMejorado
    });

  } catch (error) {
    console.error('Error analizando prompt:', error);
    res.status(500).json({ 
      error: 'Error analizando prompt',
      message: error.message 
    });
  }
});

// ============================================================================
// ENDPOINTS DE GENERACIÓN DE IMÁGENES
// ============================================================================

// Generar imagen con prompt PRO
router.post('/generar-imagen', async (req, res) => {
  const {
    categoria,
    nombreNegocio,
    estiloVisual,
    colores,
    tipografia,
    material,
    sistemaIluminacion,
    colorLuzLed,
    fachada,
    tipoNegocio,
    enfasisEn,
    guardar = true
  } = req.body;

  if (!categoria || !nombreNegocio) {
    return res.status(400).json({
      error: 'categoria y nombreNegocio son requeridos'
    });
  }

  try {
    const disenioData = {
      categoria,
      nombreNegocio,
      estiloVisual: estiloVisual || 'moderno',
      colores: colores || [],
      tipografia,
      material,
      sistemaIluminacion,
      colorLuzLed,
      fachada,
      tipoNegocio
    };

    console.log('Generando imagen con datos:', disenioData);

    const resultado = await geminiServicePro.generarImagenRotulo(disenioData, {
      formato: 'gemini',
      enfasisEn
    });

    if (!resultado.success) {
      return res.status(500).json({
        error: 'Error generando imagen',
        message: resultado.error
      });
    }

    let guardado = null;
    if (guardar) {
      guardado = await geminiServicePro.guardarImagen(resultado, 'uploads');
    }

    res.json({
      success: true,
      imagen: {
        base64: resultado.imagenBase64,
        formato: 'png',
        tamanoKB: (resultado.imagenBase64.length * 0.75 / 1024).toFixed(1)
      },
      prompt: resultado.prompt,
      guardado: guardado ? {
        imagen: guardado.imagen,
        prompt: guardado.prompt
      } : null,
      metadata: resultado.metadata
    });

  } catch (error) {
    console.error('Error en generar-imagen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: error.message
    });
  }
});

// Generar múltiples variaciones de imagen
router.post('/generar-variaciones-imagen', async (req, res) => {
  const {
    datos,
    cantidad = 3,
    guardar = true
  } = req.body;

  if (!datos || !datos.categoria || !datos.nombreNegocio) {
    return res.status(400).json({
      error: 'datos con categoria y nombreNegocio son requeridos'
    });
  }

  try {
    console.log(`Generando ${cantidad} variaciones...`);

    const resultados = await geminiServicePro.generarVariaciones(datos, cantidad, {
      formato: 'gemini'
    });

    // Guardar todas las imágenes exitosas
    if (guardar) {
      for (const resultado of resultados) {
        if (resultado.success) {
          resultado.guardado = await geminiServicePro.guardarImagen(resultado, 'uploads/variaciones');
        }
      }
    }

    res.json({
      success: true,
      cantidad: resultados.length,
      exitosos: resultados.filter(r => r.success).length,
      resultados: resultados.map(r => ({
        variacion: r.variacion,
        angulo: r.angulo,
        iluminacion: r.iluminacion,
        success: r.success,
        error: r.error || null,
        imagen: r.success ? {
          base64: r.imagenBase64,
          tamanoKB: (r.imagenBase64.length * 0.75 / 1024).toFixed(1)
        } : null,
        guardado: r.guardado || null
      }))
    });

  } catch (error) {
    console.error('Error en generar-variaciones-imagen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: error.message
    });
  }
});

// ============================================================================
// ENDPOINT DE VALIDACIÓN
// ============================================================================

router.post('/validar', (req, res) => {
  const { 
    categoria, 
    estiloVisual, 
    tipografia, 
    colores,
    material,
    sistemaIluminacion
  } = req.body;

  const errores = [];
  const sugerencias = [];

  // Validar categoría
  if (categoria && !diccionarioPro.categoriasProducto[categoria]) {
    errores.push(`Categoría "${categoria}" no existe. Disponibles: ${Object.keys(diccionarioPro.categoriasProducto).join(', ')}`);
  }

  // Validar estilo
  if (estiloVisual && !diccionarioPro.estilosVisuales[estiloVisual]) {
    errores.push(`Estilo "${estiloVisual}" no existe. Disponibles: ${Object.keys(diccionarioPro.estilosVisuales).join(', ')}`);
  }

  // Validar tipografía
  if (tipografia && !diccionarioPro.tipografias[tipografia]) {
    errores.push(`Tipografía "${tipografia}" no existe. Disponibles: ${Object.keys(diccionarioPro.tipografias).join(', ')}`);
  }

  // Validar materiales (solo para corpóreas)
  if (categoria === 'letras-corporeas' && material) {
    const materiales = diccionarioPro.categoriasProducto['letras-corporeas']?.materiales;
    if (materiales && !materiales[material]) {
      errores.push(`Material "${material}" no disponible. Opciones: ${Object.keys(materiales).join(', ')}`);
    }
  }

  // Sugerencias de combinación
  if (categoria === 'letras-neon' && estiloVisual === 'vintage') {
    sugerencias.push('Para neón vintage, considere colores como rojo, azul, o rosa caliente');
  }

  if (categoria === 'letras-corporeas' && estiloVisual === 'elegante' && !material) {
    sugerencias.push('Para corpóreas elegantes, recomendamos materiales: latón o acero con acabado espejo');
  }

  res.json({
    valido: errores.length === 0,
    errores,
    sugerencias,
    datosRecibidos: req.body
  });
});

module.exports = router;
