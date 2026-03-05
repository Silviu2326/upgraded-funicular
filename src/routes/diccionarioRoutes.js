const express = require('express');
const router = express.Router();
const diccionario = require('../config/diccionarioPrompts');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Obtener diccionario completo de prompts
// @route   GET /api/v1/diccionario
// @access  Public
exports.getDiccionario = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      categoriasProducto: Object.values(diccionario.categoriasProducto),
      tipografias: Object.values(diccionario.tipografias),
      colores: Object.values(diccionario.colores),
      estilosVisuales: Object.values(diccionario.estilosVisuales),
      materiales: Object.values(diccionario.materiales),
      tiposNegocio: Object.values(diccionario.tiposNegocio),
      fachadas: Object.values(diccionario.fachadas),
    },
    meta: {
      totalCategorias: Object.keys(diccionario.categoriasProducto).length,
      totalTipografias: Object.keys(diccionario.tipografias).length,
      totalColores: Object.keys(diccionario.colores).length,
      totalEstilos: Object.keys(diccionario.estilosVisuales).length,
      version: '2.0.0',
      tipo: 'diccionario-prompts-profesional',
      lastUpdated: '2026-03-04'
    }
  });
});

// @desc    Obtener categorías con descripciones para prompts
// @route   GET /api/v1/diccionario/categorias
// @access  Public
exports.getCategorias = asyncHandler(async (req, res, next) => {
  const categorias = Object.values(diccionario.categoriasProducto).map(cat => ({
    id: cat.id,
    nombre: cat.nombre,
    descripcion: cat.descripcion,
    keywords: cat.keywords,
    promptTemplate: cat.promptTemplate,
    atributos: cat.atributos,
    parametrosPrompt: cat.parametrosPrompt
  }));

  res.status(200).json({
    success: true,
    count: categorias.length,
    data: categorias,
  });
});

// @desc    Obtener una categoría con ejemplos de prompts
// @route   GET /api/v1/diccionario/categorias/:id
// @access  Public
exports.getCategoria = asyncHandler(async (req, res, next) => {
  const categoria = diccionario.categoriasProducto[req.params.id];
  
  if (!categoria) {
    return next(new ErrorResponse(`Categoría no encontrada: ${req.params.id}`, 404));
  }

  // Generar ejemplos de prompts
  const ejemplosPrompts = [
    diccionario.construirPrompt({
      categoria: req.params.id,
      nombreNegocio: 'EJEMPLO NEGOCIO',
      estiloVisual: 'moderno',
      colores: [{ hex: '#DA291C', nombre: 'rojo' }]
    }),
    diccionario.construirPrompt({
      categoria: req.params.id,
      nombreNegocio: 'CAFÉ CENTRAL',
      estiloVisual: 'elegante',
      colores: [{ hex: '#FFD100', nombre: 'dorado' }, { hex: '#1D1D1D', nombre: 'negro' }]
    })
  ];

  res.status(200).json({
    success: true,
    data: {
      ...categoria,
      ejemplosPrompts
    },
  });
});

// @desc    Obtener tipografías con descripciones para prompts
// @route   GET /api/v1/diccionario/tipografias
// @access  Public
exports.getTipografias = asyncHandler(async (req, res, next) => {
  const { categoria } = req.query;
  
  let tipografias = Object.values(diccionario.tipografias);
  
  if (categoria) {
    tipografias = tipografias.filter(t => t.categoria === categoria);
  }

  res.status(200).json({
    success: true,
    count: tipografias.length,
    data: tipografias,
  });
});

// @desc    Obtener colores con descripciones para prompts
// @route   GET /api/v1/diccionario/colores
// @access  Public
exports.getColores = asyncHandler(async (req, res, next) => {
  const { categoria, uso } = req.query;
  
  let colores = Object.values(diccionario.colores);
  
  if (categoria) {
    colores = colores.filter(c => c.categoria === categoria);
  }

  res.status(200).json({
    success: true,
    count: colores.length,
    data: colores,
  });
});

// @desc    Obtener estilos visuales con descripciones completas
// @route   GET /api/v1/diccionario/estilos-visuales
// @access  Public
exports.getEstilosVisuales = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: Object.keys(diccionario.estilosVisuales).length,
    data: Object.values(diccionario.estilosVisuales),
  });
});

// @desc    Obtener materiales con descripciones
// @route   GET /api/v1/diccionario/materiales
// @access  Public
exports.getMateriales = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: Object.keys(diccionario.materiales).length,
    data: Object.values(diccionario.materiales),
  });
});

// @desc    Obtener tipos de negocio con contextos
// @route   GET /api/v1/diccionario/tipos-negocio
// @access  Public
exports.getTiposNegocio = asyncHandler(async (req, res, next) => {
  const { categoria } = req.query;
  
  let tipos = Object.values(diccionario.tiposNegocio);
  
  if (categoria) {
    tipos = tipos.filter(t => t.categoria === categoria);
  }

  res.status(200).json({
    success: true,
    count: tipos.length,
    data: tipos,
  });
});

// @desc    Obtener fachadas con descripciones
// @route   GET /api/v1/diccionario/fachadas
// @access  Public
exports.getFachadas = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: Object.keys(diccionario.fachadas).length,
    data: Object.values(diccionario.fachadas),
  });
});

// @desc    Generar un prompt completo
// @route   POST /api/v1/diccionario/generar-prompt
// @access  Public
exports.generarPrompt = asyncHandler(async (req, res, next) => {
  const datos = req.body;
  
  if (!datos.categoria || !datos.nombreNegocio) {
    return next(new ErrorResponse('Se requiere categoría y nombre del negocio', 400));
  }

  const prompt = diccionario.construirPrompt(datos);
  const keywords = diccionario.getKeywords(datos.categoria, datos.estiloVisual, datos.materiales);
  
  res.status(200).json({
    success: true,
    data: {
      prompt,
      keywords,
      sugerencias: datos.tipoNegocio ? diccionario.getSugerencias(datos.tipoNegocio) : null
    },
  });
});

// @desc    Describir un elemento específico
// @route   GET /api/v1/diccionario/describir/:tipo/:id
// @access  Public
exports.describirElemento = asyncHandler(async (req, res, next) => {
  const { tipo, id } = req.params;
  
  const descripcion = diccionario.describirElemento(tipo, id);
  
  if (!descripcion) {
    return next(new ErrorResponse(`Elemento no encontrado: ${tipo}/${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: descripcion,
  });
});

// @desc    Obtener sugerencias para un tipo de negocio
// @route   GET /api/v1/diccionario/sugerencias/:tipoNegocio
// @access  Public
exports.getSugerencias = asyncHandler(async (req, res, next) => {
  const { tipoNegocio } = req.params;
  
  const sugerencias = diccionario.getSugerencias(tipoNegocio);
  
  if (!sugerencias) {
    return next(new ErrorResponse(`Tipo de negocio no encontrado: ${tipoNegocio}`, 404));
  }

  res.status(200).json({
    success: true,
    data: sugerencias,
  });
});

// @desc    Validar configuración de diseño
// @route   POST /api/v1/diccionario/validar
// @access  Public
exports.validarConfiguracion = asyncHandler(async (req, res, next) => {
  const { categoria, estiloVisual, colores = [] } = req.body;
  
  const errores = [];
  const warnings = [];

  // Validar categoría
  if (categoria && !diccionario.categoriasProducto[categoria]) {
    errores.push(`Categoría inválida: ${categoria}`);
  }

  // Validar estilo
  if (estiloVisual && !diccionario.estilosVisuales[estiloVisual]) {
    errores.push(`Estilo visual inválido: ${estiloVisual}`);
  }

  // Validar colores
  colores.forEach(color => {
    const colorExiste = Object.values(diccionario.colores).some(c => 
      c.hex.toLowerCase() === color.hex?.toLowerCase() || 
      Object.keys(diccionario.colores).includes(color.id)
    );
    if (!colorExiste && color.id) {
      warnings.push(`Color no estándar: ${color.nombre || color.hex}`);
    }
  });

  res.status(200).json({
    success: errores.length === 0,
    valid: errores.length === 0,
    errores,
    warnings,
  });
});

// Configurar rutas
router.get('/', exports.getDiccionario);
router.get('/categorias', exports.getCategorias);
router.get('/categorias/:id', exports.getCategoria);
router.get('/tipografias', exports.getTipografias);
router.get('/colores', exports.getColores);
router.get('/estilos-visuales', exports.getEstilosVisuales);
router.get('/materiales', exports.getMateriales);
router.get('/tipos-negocio', exports.getTiposNegocio);
router.get('/fachadas', exports.getFachadas);
router.get('/describir/:tipo/:id', exports.describirElemento);
router.get('/sugerencias/:tipoNegocio', exports.getSugerencias);
router.post('/generar-prompt', exports.generarPrompt);
router.post('/validar', exports.validarConfiguracion);

module.exports = router;
