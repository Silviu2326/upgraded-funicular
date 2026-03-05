/**
 * Script de prueba para generar imagen con Gemini 3.1 Flash
 * Ejecutar: node test-generar-imagen.js
 */

const geminiImageService = require('./src/services/geminiImageService');
const fs = require('fs').promises;
const path = require('path');

// Datos de prueba - Letras neón
const disenoPrueba = {
  categoria: 'letras-neon',
  nombreNegocio: 'CAFÉ CENTRAL',
  estiloVisual: 'moderno',
  colores: [
    { nombre: 'warm white', hex: '#FFF8E7' },
    { nombre: 'deep purple', hex: '#90439E' }
  ],
  tipografia: { nombre: 'Montserrat Bold' },
  dimensiones: { ancho: 120, alto: 40 },
};

// Datos de prueba - Letras corpóreas
const disenoCorporeas = {
  categoria: 'letras-corporeas',
  nombreNegocio: 'ROTU-LEMOS',
  estiloVisual: 'elegante',
  colores: [
    { nombre: 'aluminium silver', hex: '#C0C0C0' },
  ],
  tipografia: { nombre: 'Bebas Neue' },
  dimensiones: { ancho: 150, alto: 50 },
  configEspecifica: { material: 'aluminio cepillado', espesor: '8cm' }
};

// Datos de prueba - Lona
const disenoLona = {
  categoria: 'lonas-pancartas',
  nombreNegocio: 'GRAND OPENING',
  estiloVisual: 'festivo',
  colores: [
    { nombre: 'bright red', hex: '#FF0000' },
    { nombre: 'gold', hex: '#FFD700' },
  ],
  dimensiones: { ancho: 300, alto: 100 },
};

async function testGenerarImagen() {
  console.log('\n🎨 ===========================================');
  console.log('   TEST: Generación de Imágenes con Gemini');
  console.log('   Modelo: gemini-3.1-flash-image-preview');
  console.log('===========================================\n');

  // 1. Verificar disponibilidad del servicio
  console.log('1️⃣  Verificando disponibilidad del servicio...');
  try {
    const disponibilidad = await geminiImageService.verificarDisponibilidad();
    console.log('   ✅ Estado:', disponibilidad.disponible ? 'DISPONIBLE' : 'NO DISPONIBLE');
    console.log('   📋 Modelo:', disponibilidad.modelo);
    if (disponibilidad.error) {
      console.log('   ⚠️  Error:', disponibilidad.error);
    }
  } catch (error) {
    console.log('   ❌ Error verificando disponibilidad:', error.message);
  }

  console.log('\n2️⃣  Generando imagen de LETRAS NEÓN...');
  console.log('   📝 Negocio:', disenoPrueba.nombreNegocio);
  console.log('   🎨 Estilo:', disenoPrueba.estiloVisual);
  
  try {
    const resultado = await geminiImageService.generarImagenRotulo(disenoPrueba);
    
    if (resultado.tipo === 'imagen') {
      console.log('   ✅ IMAGEN GENERADA EXITOSAMENTE');
      console.log('   📊 Tamaño base64:', resultado.imagen.base64.length, 'caracteres');
      console.log('   🖼️  MimeType:', resultado.imagen.mimeType);
      
      // Guardar imagen
      const filename = `test_neon_${Date.now()}.png`;
      const filepath = await geminiImageService.guardarImagen(
        resultado.imagen.base64,
        filename
      );
      console.log('   💾 Imagen guardada en:', filepath);
      
      // Guardar también el prompt
      await fs.writeFile(
        path.join(__dirname, 'uploads', `test_neon_${Date.now()}_prompt.txt`),
        resultado.prompt
      );
      console.log('   📝 Prompt guardado');
    } else {
      console.log('   ⚠️  No se generó imagen, se obtuvo prompt:');
      console.log('   📝', resultado.prompt.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    console.log('   📋 Stack:', error.stack);
  }

  console.log('\n3️⃣  Generando imagen de LETRAS CORPÓREAS...');
  console.log('   📝 Negocio:', disenoCorporeas.nombreNegocio);
  
  try {
    const resultado = await geminiImageService.generarImagenRotulo(disenoCorporeas);
    
    if (resultado.tipo === 'imagen') {
      console.log('   ✅ IMAGEN GENERADA EXITOSAMENTE');
      const filename = `test_corporeas_${Date.now()}.png`;
      const filepath = await geminiImageService.guardarImagen(
        resultado.imagen.base64,
        filename
      );
      console.log('   💾 Imagen guardada en:', filepath);
    } else {
      console.log('   ⚠️  No se generó imagen (modo prompt)');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n4️⃣  Generando FONDO PARA LONA...');
  console.log('   📝 Tipo:', disenoLona.categoria);
  
  try {
    const resultado = await geminiImageService.generarFondoLona({
      tipoNegocio: 'restaurante',
      estiloVisual: 'moderno',
      colores: ['#90439E', '#FFD700'],
    });
    
    if (resultado.success && resultado.tipo === 'imagen') {
      console.log('   ✅ FONDO GENERADO EXITOSAMENTE');
      const filename = `test_fondo_lona_${Date.now()}.png`;
      const filepath = await geminiImageService.guardarImagen(
        resultado.imagen.base64,
        filename
      );
      console.log('   💾 Fondo guardado en:', filepath);
    } else {
      console.log('   ⚠️  No se generó imagen del fondo');
      if (resultado.error) console.log('   ❌ Error:', resultado.error);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n5️⃣  Probando GENERAR MÚLTIPLES VARIACIONES...');
  console.log('   📝 Negocio:', disenoPrueba.nombreNegocio);
  console.log('   🔢 Cantidad: 3 variaciones');
  
  try {
    const resultado = await geminiImageService.generarVariaciones(disenoPrueba, 3);
    
    console.log('   ✅ Variaciones generadas:', resultado.totalGenerados);
    
    for (let i = 0; i < resultado.variaciones.length; i++) {
      const variacion = resultado.variaciones[i];
      const filename = `test_variacion_${i}_${Date.now()}.png`;
      await geminiImageService.guardarImagen(variacion.imagen.base64, filename);
      console.log(`   💾 Variación ${i + 1} guardada`);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n===========================================');
  console.log('   TEST COMPLETADO');
  console.log('===========================================\n');
  
  // Listar archivos generados
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = await fs.readdir(uploadsDir);
    const testFiles = files.filter(f => f.startsWith('test_'));
    
    if (testFiles.length > 0) {
      console.log('📁 Archivos generados:');
      testFiles.forEach(f => console.log('   -', f));
    }
  } catch (e) {
    // ignore
  }
  
  process.exit(0);
}

// Ejecutar test
testGenerarImagen().catch(err => {
  console.error('\n❌ ERROR FATAL:', err);
  process.exit(1);
});
