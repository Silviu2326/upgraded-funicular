require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

// Configuración
const config = require('./config');
const connectDB = require('./config/database');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');

// Rutas
const disenoRoutes = require('./routes/disenoRoutes');
const leadRoutes = require('./routes/leadRoutes');
const presupuestoRoutes = require('./routes/presupuestoRoutes');
const diccionarioRoutes = require('./routes/diccionarioRoutes');
const diccionarioRoutesPro = require('./routes/diccionarioRoutesPro');
const mockupRoutes = require('./routes/mockupRoutes');

// Logger
const logger = require('./utils/logger');

// Crear app Express
const app = express();

// Conectar a base de datos
connectDB();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS - Permitir cualquier origen en desarrollo
app.use(cors({
  origin: config.NODE_ENV === 'production' 
    ? ['https://rotulemos.com', 'https://www.rotulemos.com', 'https://rotulos-psi.vercel.app'] 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} - Origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate limiting específico para generación de imágenes
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 generaciones por hora
  message: 'Límite de generaciones alcanzado, por favor intente más tarde',
});
app.use('/api/v1/disenos/generar', aiLimiter);

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rutas API
app.use('/api/v1/disenos', disenoRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/presupuestos', presupuestoRoutes);
app.use('/api/v1/diccionario', diccionarioRoutes);
app.use('/api/v1/diccionario-pro', diccionarioRoutesPro);
app.use('/api/v1/mockups', mockupRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Rotulemos',
    version: '1.0.0',
    documentacion: '/api/v1/docs',
  });
});

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

// Error handler global
app.use(errorHandler);

// Iniciar servidor
const PORT = config.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Servidor corriendo en modo ${config.NODE_ENV} en puerto ${PORT}`);
});

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  logger.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Excepción no capturada:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
