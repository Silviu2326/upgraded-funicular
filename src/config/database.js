const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      // Estas opciones ya no son necesarias en Mongoose 6+, pero las dejamos por si acaso
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);
    
    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      logger.error(`Error de MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB desconectado');
    });

    // Cerrar conexión gracefulmente al terminar la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexión a MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
