const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');
const { ErrorResponse } = require('./errorHandler');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Solo se permiten imágenes (jpeg, jpg, png, gif, webp, svg)', 400), false);
  }
};

// Configuración de multer
const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  fileFilter,
});

// Middleware para subir imagen única
exports.uploadImagen = (fieldName) => upload.single(fieldName);

// Middleware para subir múltiples imágenes
exports.uploadImagenes = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Middleware para subir campos mixtos
exports.uploadMixto = (fields) => upload.fields(fields);

// Middleware de manejo de errores de multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse(`El archivo es demasiado grande. Tamaño máximo: ${config.MAX_FILE_SIZE / 1024 / 1024}MB`, 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse('Demasiados archivos', 400));
    }
    return next(new ErrorResponse(err.message, 400));
  }
  next(err);
};
