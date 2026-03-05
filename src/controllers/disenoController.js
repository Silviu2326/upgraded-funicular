const Diseno = require('../models/Diseno');
const aiService = require('../services/aiService');
const geminiImageService = require('../services/geminiImageService');
const cloudinaryService = require('../services/cloudinaryService');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Crear nuevo diseño
// @route   POST /api/v1/disenos
// @access  Public/Private
exports.crearDiseno = asyncHandler(async (req, res, next) => {
  // Añadir usuario si está autenticado
  if (req.usuario) {
    req.body.usuario = req.usuario.id;
  }

  // Validar categoría
  if (!req.body.categoria) {
    return next(new ErrorResponse('La categoría es obligatoria', 400));
  }

  // Validar nombre del negocio
  if (!req.body.nombreNegocio) {
    return next(new ErrorResponse('El nombre del negocio es obligatorio', 400));
  }

  // Crear diseño
  const diseno = await Diseno.create(req.body);

  // Generar prompt mejorado con IA
  try {
    const promptMejorado = await aiService.generarPrompt(diseno);
    diseno.descripcion = {
      original: req.body.descripcion?.original || '',
      mejorada: promptMejorado,
    };
    await diseno.save();
  } catch (error) {
    logger.error('Error generando prompt con IA:', error);
    // Continuar sin el prompt mejorado
  }

  res.status(201).json({
    success: true,
    data: diseno,
  });
});

// @desc    Obtener todos los diseños
// @route   GET /api/v1/disenos
// @access  Private
exports.getDisenos = asyncHandler(async (req, res, next) => {
  let query;

  // Copiar req.query
  const reqQuery = { ...req.query };

  // Campos a excluir
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Crear query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Crear operadores ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Buscar diseños del usuario o todos si es admin
  if (req.usuario.rol !== 'admin') {
    query = Diseno.find({ usuario: req.usuario.id });
  } else {
    query = Diseno.find(JSON.parse(queryStr));
  }

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Diseno.countDocuments(query.getQuery());

  query = query.skip(startIndex).limit(limit);

  // Populate
  query = query.populate('presupuesto');

  // Ejecutar query
  const disenos = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: disenos.length,
    pagination,
    total,
    data: disenos,
  });
});

// @desc    Obtener un diseño
// @route   GET /api/v1/disenos/:id
// @access  Public/Private
exports.getDiseno = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id).populate('presupuesto');

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar permisos si es privado
  if (diseno.usuario && req.usuario) {
    if (diseno.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return next(new ErrorResponse('No autorizado para ver este diseño', 403));
    }
  }

  res.status(200).json({
    success: true,
    data: diseno,
  });
});

// @desc    Actualizar diseño
// @route   PUT /api/v1/disenos/:id
// @access  Private
exports.updateDiseno = asyncHandler(async (req, res, next) => {
  let diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar propiedad
  if (diseno.usuario && diseno.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado para actualizar este diseño', 403));
  }

  diseno = await Diseno.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: diseno,
  });
});

// @desc    Eliminar diseño
// @route   DELETE /api/v1/disenos/:id
// @access  Private
exports.deleteDiseno = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar propiedad
  if (diseno.usuario && diseno.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado para eliminar este diseño', 403));
  }

  // Eliminar imágenes de Cloudinary
  const imagenesAEliminar = [];
  if (diseno.imagenes?.original?.publicId) imagenesAEliminar.push(diseno.imagenes.original.publicId);
  if (diseno.imagenes?.sinFondo?.publicId) imagenesAEliminar.push(diseno.imagenes.sinFondo.publicId);
  if (diseno.imagenes?.hd?.publicId) imagenesAEliminar.push(diseno.imagenes.hd.publicId);
  if (diseno.imagenes?.variaciones) {
    diseno.imagenes.variaciones.forEach(v => {
      if (v.publicId) imagenesAEliminar.push(v.publicId);
    });
  }

  if (imagenesAEliminar.length > 0) {
    await cloudinaryService.eliminarImagenes(imagenesAEliminar);
  }

  await diseno.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Generar prompt con IA
// @route   POST /api/v1/disenos/:id/generar-prompt
// @access  Public/Private
exports.generarPrompt = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  const prompt = await aiService.generarPrompt(diseno);

  // Guardar prompt mejorado
  diseno.descripcion.mejorada = prompt;
  await diseno.save();

  res.status(200).json({
    success: true,
    data: { prompt },
  });
});

// @desc    Analizar legibilidad
// @route   POST /api/v1/disenos/:id/legibilidad
// @access  Public/Private
exports.analizarLegibilidad = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  const analisis = await aiService.analizarLegibilidad(diseno);

  res.status(200).json({
    success: true,
    data: analisis,
  });
});

// @desc    Generar imagen del rótulo con IA (Gemini Nativo)
// @route   POST /api/v1/disenos/:id/generar-imagen
// @access  Public/Private
exports.generarImagen = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  try {
    const { cantidad = 1 } = req.body;
    
    let resultado;
    
    if (cantidad > 1) {
      // Generar múltiples variaciones
      resultado = await geminiImageService.generarVariaciones(diseno, cantidad);
    } else {
      // Generar imagen única
      resultado = await geminiImageService.generarImagenRotulo(diseno);
    }
    
    // Si se generó imagen, subir a Cloudinary para persistencia
    if (resultado.tipo === 'imagen' && resultado.imagen?.base64) {
      // Guardar imagen temporal
      const filename = `diseno_${diseno._id}_${Date.now()}.png`;
      const filepath = await geminiImageService.guardarImagen(
        resultado.imagen.base64, 
        filename
      );
      
      // Subir a Cloudinary
      const cloudinaryResult = await cloudinaryService.subirImagen(filepath, {
        folder: `rotulemos/disenos/${diseno._id}`,
        publicId: `generado_${Date.now()}`,
      });
      
      // Actualizar resultado con URL de Cloudinary
      resultado.imagen.url = cloudinaryResult.url;
      resultado.imagen.publicId = cloudinaryResult.publicId;
      
      // Guardar referencia en el diseño
      if (!diseno.imagenes) diseno.imagenes = {};
      diseno.imagenes.generada = {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
        fecha: new Date(),
      };
      await diseno.save();
    }
    
    // Guardar el prompt generado
    if (!diseno.descripcion) diseno.descripcion = {};
    diseno.descripcion.promptImagen = resultado.prompt;
    await diseno.save();

    res.status(200).json({
      success: true,
      data: resultado,
      message: resultado.tipo === 'imagen' 
        ? 'Imagen generada exitosamente con Gemini'
        : 'Prompt generado. El modelo de imagen no está disponible, se devolvió el prompt para usar con otra API.',
    });

  } catch (error) {
    logger.error('Error generando imagen:', error);
    return next(new ErrorResponse('Error al generar la imagen del diseño', 500));
  }
});

// @desc    Generar fondos para lonas (sistema híbrido con Gemini)
// @route   POST /api/v1/disenos/:id/generar-fondos-lona
// @access  Public/Private
exports.generarFondosLona = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar que sea categoría de lonas
  if (diseno.categoria !== 'lonas-pancartas') {
    return next(new ErrorResponse('Esta función solo está disponible para lonas y pancartas', 400));
  }

  try {
    const cantidad = req.body.cantidad || 4;
    const fondos = [];
    
    // Generar múltiples fondos
    for (let i = 0; i < cantidad; i++) {
      const config = {
        tipoNegocio: req.body.tipoNegocio || 'restaurante',
        estiloVisual: req.body.estiloVisual || diseno.estiloVisual || 'moderno',
        colores: diseno.colores?.map(c => c.hex) || ['#90439e', '#667eea'],
        descripcion: req.body.descripcion,
      };
      
      const resultado = await geminiImageService.generarFondoLona(config);
      
      if (resultado.success && resultado.tipo === 'imagen') {
        // Guardar y subir a Cloudinary
        const filename = `lona_fondo_${diseno._id}_${i}_${Date.now()}.png`;
        const filepath = await geminiImageService.guardarImagen(
          resultado.imagen.base64,
          filename
        );
        
        const cloudinaryResult = await cloudinaryService.subirImagen(filepath, {
          folder: `rotulemos/disenos/${diseno._id}/fondos`,
        });
        
        fondos.push({
          id: i,
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          seleccionado: i === 0,
        });
      }
      
      // Pausa entre generaciones
      if (i < cantidad - 1) await new Promise(r => setTimeout(r, 1000));
    }
    
    // Guardar fondos en el diseño
    if (!diseno.imagenes) diseno.imagenes = {};
    diseno.imagenes.fondosLona = fondos;
    await diseno.save();

    res.status(200).json({
      success: true,
      data: {
        tipo: 'imagenes',
        fondos: fondos,
        totalGenerados: fondos.length,
      },
    });

  } catch (error) {
    logger.error('Error generando fondos para lona:', error);
    return next(new ErrorResponse('Error al generar los fondos', 500));
  }
});

// @desc    Subir imagen de diseño
// @route   POST /api/v1/disenos/:id/imagen
// @access  Private
exports.subirImagen = asyncHandler(async (req, res, next) => {
  const diseno = await Diseno.findById(req.params.id);

  if (!diseno) {
    return next(new ErrorResponse(`Diseño no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar propiedad
  if (diseno.usuario && diseno.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado', 403));
  }

  if (!req.file) {
    return next(new ErrorResponse('Por favor suba un archivo', 400));
  }

  // Subir a Cloudinary
  const resultado = await cloudinaryService.subirImagen(req.file.path, {
    folder: `rotulemos/disenos/${diseno._id}`,
  });

  // Actualizar diseño según el tipo de imagen
  const tipo = req.body.tipo || 'original';
  
  if (!diseno.imagenes) {
    diseno.imagenes = {};
  }

  diseno.imagenes[tipo] = resultado;
  await diseno.save();

  res.status(200).json({
    success: true,
    data: resultado,
  });
});
