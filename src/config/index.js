require('dotenv').config();

const config = {
  // Servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Base de datos
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/rotulemos',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_2024',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7,

  // APIs de IA
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@rotulemos.com',
  FROM_NAME: process.env.FROM_NAME || 'Rotulemos',

  // Remove.bg API
  REMOVEBG_API_KEY: process.env.REMOVEBG_API_KEY,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Validación de configuración crítica
const requiredInProduction = [
  'JWT_SECRET',
  'MONGODB_URI',
];

if (config.NODE_ENV === 'production') {
  requiredInProduction.forEach((key) => {
    if (!process.env[key]) {
      console.error(`Error: La variable de entorno ${key} es requerida en producción`);
      process.exit(1);
    }
  });
}

module.exports = config;
