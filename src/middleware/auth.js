const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('./errorHandler');
const config = require('../config');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obtener token del header
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si existe token
  if (!token) {
    return next(new ErrorResponse('No autorizado para acceder a esta ruta', 401));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // En producción, buscar usuario en base de datos
    // Por ahora, simulamos el usuario
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol || 'usuario',
    };

    next();
  } catch (err) {
    return next(new ErrorResponse('No autorizado para acceder a esta ruta', 401));
  }
};

// Middleware de autenticación opcional
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.usuario = {
        id: decoded.id,
        email: decoded.email,
        rol: decoded.rol || 'usuario',
      };
    } catch (err) {
      // Ignorar error, continuar sin usuario
    }
  }

  next();
};

// Middleware para verificar rol de admin
exports.admin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return next(new ErrorResponse('No autorizado, rol de administrador requerido', 403));
  }
};
