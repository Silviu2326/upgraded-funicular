const Lead = require('../models/Lead');
const Diseno = require('../models/Diseno');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Crear nuevo lead
// @route   POST /api/v1/leads
// @access  Public
exports.crearLead = asyncHandler(async (req, res, next) => {
  const { 
    nombre, 
    email, 
    telefono, 
    empresa, 
    disenoId, 
    aceptaPrivacidad, 
    aceptaComunicaciones,
    mensaje 
  } = req.body;

  // Validaciones
  if (!nombre || !email) {
    return next(new ErrorResponse('Nombre y email son obligatorios', 400));
  }

  if (!aceptaPrivacidad) {
    return next(new ErrorResponse('Debe aceptar la política de privacidad', 400));
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Email no válido', 400));
  }

  // Verificar si existe el diseño
  let diseno = null;
  if (disenoId) {
    diseno = await Diseno.findById(disenoId);
    if (!diseno) {
      return next(new ErrorResponse('Diseño no encontrado', 404));
    }
  }

  // Verificar si ya existe un lead con ese email y diseño
  const leadExistente = await Lead.findOne({ 
    email: email.toLowerCase(),
    ...(disenoId && { diseno: disenoId })
  });

  if (leadExistente) {
    // Actualizar el lead existente
    leadExistente.telefono = telefono || leadExistente.telefono;
    leadExistente.empresa = empresa || leadExistente.empresa;
    leadExistente.mensaje = mensaje || leadExistente.mensaje;
    leadExistente.aceptaComunicaciones = aceptaComunicaciones !== undefined 
      ? aceptaComunicaciones 
      : leadExistente.aceptaComunicaciones;
    leadExistente.interacciones.push({
      tipo: 'visita',
      descripcion: 'Visita recurrente',
    });
    
    await leadExistente.save();

    logger.info(`Lead actualizado: ${email}`);

    return res.status(200).json({
      success: true,
      data: leadExistente,
      message: 'Información actualizada correctamente',
    });
  }

  // Crear nuevo lead
  const lead = await Lead.create({
    nombre,
    email: email.toLowerCase(),
    telefono,
    empresa,
    diseno: disenoId,
    aceptaPrivacidad,
    aceptaComunicaciones: aceptaComunicaciones || false,
    mensaje,
    interacciones: [{
      tipo: 'registro',
      descripcion: 'Registro de nuevo lead',
    }],
  });

  logger.info(`Nuevo lead creado: ${email}`);

  res.status(201).json({
    success: true,
    data: lead,
    message: 'Registro completado correctamente',
  });
});

// @desc    Obtener todos los leads
// @route   GET /api/v1/leads
// @access  Private (Admin)
exports.getLeads = asyncHandler(async (req, res, next) => {
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

  query = Lead.find(JSON.parse(queryStr));

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
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Lead.countDocuments(query.getQuery());

  query = query.skip(startIndex).limit(limit);

  // Populate diseño
  query = query.populate({
    path: 'diseno',
    select: 'categoria nombreNegocio tipografia colores',
  });

  // Ejecutar query
  const leads = await query;

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
    count: leads.length,
    pagination,
    total,
    data: leads,
  });
});

// @desc    Obtener un lead
// @route   GET /api/v1/leads/:id
// @access  Private (Admin)
exports.getLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id).populate({
    path: 'diseno',
    select: '-__v',
  });

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// @desc    Actualizar lead
// @route   PUT /api/v1/leads/:id
// @access  Private (Admin)
exports.updateLead = asyncHandler(async (req, res, next) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// @desc    Eliminar lead
// @route   DELETE /api/v1/leads/:id
// @access  Private (Admin)
exports.deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  await lead.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Añadir interacción a lead
// @route   POST /api/v1/leads/:id/interaccion
// @access  Private (Admin)
exports.addInteraccion = asyncHandler(async (req, res, next) => {
  const { tipo, descripcion } = req.body;

  if (!tipo || !descripcion) {
    return next(new ErrorResponse('Tipo y descripción son obligatorios', 400));
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  lead.interacciones.push({
    tipo,
    descripcion,
  });

  await lead.save();

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// @desc    Convertir lead a cliente
// @route   PUT /api/v1/leads/:id/convertir
// @access  Private (Admin)
exports.convertirLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  if (lead.estado === 'cliente') {
    return next(new ErrorResponse('Este lead ya es cliente', 400));
  }

  lead.estado = 'cliente';
  lead.interacciones.push({
    tipo: 'conversion',
    descripcion: 'Convertido a cliente',
  });

  await lead.save();

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// @desc    Obtener estadísticas de leads
// @route   GET /api/v1/leads/stats/resumen
// @access  Private (Admin)
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await Lead.aggregate([
    {
      $group: {
        _id: '$estado',
        count: { $sum: 1 },
      },
    },
  ]);

  const porMes = await Lead.aggregate([
    {
      $group: {
        _id: {
          mes: { $month: '$createdAt' },
          anio: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.anio': -1, '_id.mes': -1 },
    },
  ]);

  const total = await Lead.countDocuments();
  const nuevosEsteMes = await Lead.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      nuevosEsteMes,
      porEstado: stats,
      porMes,
    },
  });
});

// @desc    Marcar lead como contactado
// @route   PUT /api/v1/leads/:id/contactar
// @access  Private (Admin)
exports.contactarLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(`Lead no encontrado con id ${req.params.id}`, 404));
  }

  if (!lead.contactado) {
    lead.contactado = true;
    lead.fechaContacto = new Date();
    lead.interacciones.push({
      tipo: 'contacto',
      descripcion: 'Lead contactado por primera vez',
    });
    await lead.save();
  }

  res.status(200).json({
    success: true,
    data: lead,
  });
});
