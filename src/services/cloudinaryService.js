const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const config = require('../config');
const logger = require('../utils/logger');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  // Subir imagen
  async subirImagen(filePath, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: options.folder || 'rotulemos/disenos',
        public_id: options.publicId,
        overwrite: true,
        transformation: options.transformations || [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
        ...options,
      });

      // Eliminar archivo temporal
      await fs.unlink(filePath).catch(() => {});

      logger.info(`Imagen subida a Cloudinary: ${result.public_id}`);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      };

    } catch (error) {
      // Eliminar archivo temporal en caso de error
      await fs.unlink(filePath).catch(() => {});
      logger.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  }

  // Subir múltiples imágenes
  async subirImagenes(filePaths, options = {}) {
    const uploadPromises = filePaths.map(filePath => 
      this.subirImagen(filePath, options)
    );
    
    return Promise.all(uploadPromises);
  }

  // Eliminar imagen
  async eliminarImagen(publicId) {
    try {
      if (!publicId) return;
      
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`Imagen eliminada de Cloudinary: ${publicId}`);
      return result;

    } catch (error) {
      logger.error('Error eliminando imagen de Cloudinary:', error);
      throw error;
    }
  }

  // Eliminar múltiples imágenes
  async eliminarImagenes(publicIds) {
    try {
      const deletePromises = publicIds
        .filter(id => id)
        .map(id => this.eliminarImagen(id));
      
      return Promise.all(deletePromises);

    } catch (error) {
      logger.error('Error eliminando imágenes de Cloudinary:', error);
      throw error;
    }
  }

  // Generar URL transformada
  generarUrlTransformada(publicId, opciones = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width: opciones.ancho, height: opciones.alto, crop: opciones.recorte || 'limit' },
        { quality: opciones.calidad || 'auto' },
        ...(opciones.efectos || []),
      ],
    });
  }

  // Crear versión optimizada para thumbnail
  generarThumbnail(publicId, ancho = 300) {
    return this.generarUrlTransformada(publicId, {
      ancho,
      recorte: 'thumb',
      calidad: 80,
    });
  }

  // Verificar si una imagen existe
  async imagenExiste(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return !!result;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new CloudinaryService();
