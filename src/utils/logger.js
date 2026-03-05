const winston = require('winston');
const config = require('../config');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato personalizado
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  return msg;
});

// Transportes
const transports = [
  // Console
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
  }),
];

// Añadir archivos en producción
if (config.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), logFormat),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), logFormat),
    })
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { service: 'rotulemos-api' },
  transports,
  exitOnError: false,
});

// Stream para Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
