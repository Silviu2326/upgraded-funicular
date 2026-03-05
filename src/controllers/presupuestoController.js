const Presupuesto = require('../models/Presupuesto');
const Diseno = require('../models/Diseno');
const Lead = require('../models/Lead');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Precios base por categoría (€)
const PRECIOS_BASE = {
  corporeas: {
    pvc: 85,
    acrilico: 120,
    metal: 150,
    madera: 95,
    aluminio: 130,
    'composite-aluminio': 110,
  },
  neon: {
    tradicional: 180,
    led: 140,
    flexible: 100,
  },
  vinilo: {
    basico: 15,
    premium: 25,
    microperforado: 30,
    esmerilado: 35,
  },
  lona: {
    estandar: 20,
    premium: 35,
    backlight: 45,
    mesh: 30,
  },
  bandejas: {
    composite: 150,
    aluminio: 180,
    acero: 200,
    pvc: 120,
  },
  rotulacion: {
    vehiculo_pequeno: 200,
    vehiculo_mediano: 350,
    vehiculo_grande: 500,
    cristal: 40,
  },
  toldos: {
    estandar: 250,
    premium: 400,
    retractil: 600,
  },
  senaletica: {
    basica: 50,
    intermedia: 80,
    premium: 120,
    braille: 150,
  },
};

// Factores por complejidad
const FACTORES_COMPLEJIDAD = {
  baja: 1,
  media: 1.3,
  alta: 1.6,
  premium: 2,
};

// @desc    Calcular presupuesto
// @route   POST /api/v1/presupuestos/calcular
// @access  Public/Private
exports.calcularPresupuesto = asyncHandler(async (req, res, next) => {
  const { 
    disenoId, 
    categoria, 
    material, 
    dimensiones, 
    complejidad,
    instalacion,
    iluminacion,
    cantidad = 1,
    detalles = {}
  } = req.body;

  // Validar categoría
  if (!categoria || !PRECIOS_BASE[categoria]) {
    return next(new ErrorResponse('Categoría no válida', 400));
  }

  // Validar material
  if (!material || !PRECIOS_BASE[categoria][material]) {
    return next(new ErrorResponse('Material no válido para esta categoría', 400));
  }

  // Validar dimensiones
  if (!dimensiones || !dimensiones.ancho || !dimensiones.alto) {
    return next(new ErrorResponse('Las dimensiones son obligatorias', 400));
  }

  const ancho = parseFloat(dimensiones.ancho);
  const alto = parseFloat(dimensiones.alto);
  const superficie = ancho * alto;

  // Calcular precio base
  const precioBaseM2 = PRECIOS_BASE[categoria][material];
  let precioMaterial = precioBaseM2 * superficie;

  // Aplicar factor de complejidad
  const factorComplejidad = FACTORES_COMPLEJIDAD[complejidad] || 1;
  precioMaterial *= factorComplejidad;

  // Calcular extras
  const extras = [];
  let precioInstalacion = 0;
  let precioIluminacion = 0;

  if (instalacion) {
    // Instalación: 20% del precio material, mínimo 50€
    precioInstalacion = Math.max(precioMaterial * 0.2, 50);
    extras.push({
      concepto: 'Instalación',
      precio: Math.round(precioInstalacion),
    });
  }

  if (iluminacion) {
    // Iluminación: +30% al precio base
    precioIluminacion = precioMaterial * 0.3;
    extras.push({
      concepto: 'Sistema de iluminación LED',
      precio: Math.round(precioIluminacion),
    });
  }

  // Subtotal
  const subtotal = precioMaterial + precioInstalacion + precioIluminacion;

  // IVA (21%)
  const iva = subtotal * 0.21;

  // Total
  const total = (subtotal + iva) * cantidad;

  const desglose = {
    material: {
      concepto: `Material: ${material} (${superficie.toFixed(2)} m²)`,
      precioUnitario: Math.round(precioBaseM2 * factorComplejidad),
      cantidad: superficie.toFixed(2),
      subtotal: Math.round(precioMaterial),
    },
    extras,
    subtotal: Math.round(subtotal),
    iva: Math.round(iva),
    total: Math.round(total),
    cantidad,
  };

  res.status(200).json({
    success: true,
    data: desglose,
  });
});

// @desc    Crear presupuesto
// @route   POST /api/v1/presupuestos
// @access  Public/Private
exports.crearPresupuesto = asyncHandler(async (req, res, next) => {
  // Si viene de un diseño existente
  if (req.body.diseno) {
    const diseno = await Diseno.findById(req.body.diseno);
    if (!diseno) {
      return next(new ErrorResponse('Diseño no encontrado', 404));
    }
  }

  // Añadir usuario si está autenticado
  if (req.usuario) {
    req.body.creadoPor = req.usuario.id;
  }

  const presupuesto = await Presupuesto.create(req.body);

  logger.info(`Nuevo presupuesto creado: ${presupuesto._id}`);

  res.status(201).json({
    success: true,
    data: presupuesto,
  });
});

// @desc    Obtener presupuestos
// @route   GET /api/v1/presupuestos
// @access  Private
exports.getPresupuestos = asyncHandler(async (req, res, next) => {
  let query;

  if (req.usuario.rol !== 'admin') {
    query = Presupuesto.find({ creadoPor: req.usuario.id });
  } else {
    query = Presupuesto.find();
  }

  query = query.populate('diseno', 'nombreNegocio categoria').sort('-createdAt');

  const presupuestos = await query;

  res.status(200).json({
    success: true,
    count: presupuestos.length,
    data: presupuestos,
  });
});

// @desc    Obtener un presupuesto
// @route   GET /api/v1/presupuestos/:id
// @access  Private
exports.getPresupuesto = asyncHandler(async (req, res, next) => {
  const presupuesto = await Presupuesto.findById(req.params.id)
    .populate('diseno')
    .populate('creadoPor', 'nombre email');

  if (!presupuesto) {
    return next(new ErrorResponse(`Presupuesto no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar permisos
  if (presupuesto.creadoPor && 
      presupuesto.creadoPor._id.toString() !== req.usuario.id && 
      req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado para ver este presupuesto', 403));
  }

  res.status(200).json({
    success: true,
    data: presupuesto,
  });
});

// @desc    Actualizar presupuesto
// @route   PUT /api/v1/presupuestos/:id
// @access  Private
exports.updatePresupuesto = asyncHandler(async (req, res, next) => {
  let presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return next(new ErrorResponse(`Presupuesto no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar permisos
  if (presupuesto.creadoPor && 
      presupuesto.creadoPor.toString() !== req.usuario.id && 
      req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado para actualizar este presupuesto', 403));
  }

  presupuesto = await Presupuesto.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: presupuesto,
  });
});

// @desc    Eliminar presupuesto
// @route   DELETE /api/v1/presupuestos/:id
// @access  Private
exports.deletePresupuesto = asyncHandler(async (req, res, next) => {
  const presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return next(new ErrorResponse(`Presupuesto no encontrado con id ${req.params.id}`, 404));
  }

  // Verificar permisos
  if (presupuesto.creadoPor && 
      presupuesto.creadoPor.toString() !== req.usuario.id && 
      req.usuario.rol !== 'admin') {
    return next(new ErrorResponse('No autorizado para eliminar este presupuesto', 403));
  }

  await presupuesto.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Aprobar presupuesto
// @route   PUT /api/v1/presupuestos/:id/aprobar
// @access  Private
exports.aprobarPresupuesto = asyncHandler(async (req, res, next) => {
  const presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return next(new ErrorResponse(`Presupuesto no encontrado con id ${req.params.id}`, 404));
  }

  if (presupuesto.estado === 'aprobado') {
    return next(new ErrorResponse('Este presupuesto ya está aprobado', 400));
  }

  presupuesto.estado = 'aprobado';
  presupuesto.fechaAprobacion = new Date();
  await presupuesto.save();

  logger.info(`Presupuesto aprobado: ${presupuesto._id}`);

  res.status(200).json({
    success: true,
    data: presupuesto,
  });
});

// @desc    Enviar presupuesto por email
// @route   POST /api/v1/presupuestos/:id/enviar
// @access  Private
exports.enviarPresupuesto = asyncHandler(async (req, res, next) => {
  const { email, mensaje } = req.body;

  if (!email) {
    return next(new ErrorResponse('El email es obligatorio', 400));
  }

  const presupuesto = await Presupuesto.findById(req.params.id).populate('diseno');

  if (!presupuesto) {
    return next(new ErrorResponse(`Presupuesto no encontrado con id ${req.params.id}`, 404));
  }

  // Aquí iría la lógica para enviar el email
  // Por ahora simulamos el envío
  logger.info(`Presupuesto ${presupuesto._id} enviado a ${email}`);

  presupuesto.emailEnviado = true;
  presupuesto.fechaEnvio = new Date();
  await presupuesto.save();

  res.status(200).json({
    success: true,
    message: 'Presupuesto enviado correctamente',
    data: presupuesto,
  });
});
