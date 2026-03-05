/**
 * ============================================================================
 * TEST DICCIONARIO PRO v3.0
 * ============================================================================
 * Script de prueba para el diccionario de prompts mejorado
 */

require('dotenv').config();
const geminiServicePro = require('./src/services/geminiImageServicePro');
const diccionarioPro = require('./src/config/diccionarioPromptsPro');
const fs = require('fs');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     TEST DICCIONARIO PRO v3.0 - Rótulos Profesionales       ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

// Mostrar información del diccionario
console.log('\n📚 Información del Diccionario:');
const info = geminiServicePro.getDiccionarioInfo();
console.log(`  Versión: ${info.version}`);
console.log(`  Categorías: ${info.categorias.length}`);
console.log(`  Estilos: ${info.estilos.length}`);
console.log(`  Tipografías: ${info.tipografias.length}`);
console.log(`  Colores: ${info.colores.length}`);

// ============================================================================
// TEST 1: Comparación de prompts (Básico vs PRO)
// ============================================================================
console.log('\n' + '═'.repeat(70));
console.log('TEST 1: Comparación de calidad de prompts');
console.log('═'.repeat(70));

const disenioTest = {
  categoria: 'letras-neon',
  nombreNegocio: 'NEON CAFE',
  estiloVisual: 'moderno',
  colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#E4007C' }],
  tipografia: 'bebas',
  colorLuzLed: 'rosa',
  fachada: 'ladrillo'
};

console.log('\n📋 Datos de diseño:', JSON.stringify(disenioTest, null, 2));

// Prompt estructurado
console.log('\n' + '─'.repeat(70));
console.log('FORMATO ESTRUCTURADO (para debugging):');
console.log('─'.repeat(70));
const promptEstructurado = geminiServicePro.construirPromptImagen(disenioTest, { formato: 'estructurado' });
console.log(promptEstructurado);

// Prompt natural para Gemini
console.log('\n' + '─'.repeat(70));
console.log('FORMATO NATURAL (enviado a Gemini):');
console.log('─'.repeat(70));
const promptNatural = geminiServicePro.construirPromptImagen(disenioTest, { formato: 'gemini' });
console.log(promptNatural);
console.log(`\n📊 Longitud: ${promptNatural.length} caracteres`);

// ============================================================================
// TEST 2: Generación de imagen con prompts PRO
// ============================================================================
console.log('\n' + '═'.repeat(70));
console.log('TEST 2: Generación con Prompts PRO');
console.log('═'.repeat(70));

async function generarImagenPro() {
  try {
    console.log('\n🎨 Generando imagen con prompt PRO...');
    
    const resultado = await geminiServicePro.generarImagenRotulo(disenioTest, {
      formato: 'gemini',
      enfasisEn: 'iluminacion'
    });

    if (!resultado.success) {
      console.error('❌ Error:', resultado.error);
      return;
    }

    // Guardar imagen
    const guardado = await geminiServicePro.guardarImagen(resultado, 'uploads/pro');
    
    console.log('\n✅ Imagen guardada:');
    console.log(`  📁 ${guardado.imagen}`);
    console.log(`  📝 ${guardado.prompt}`);
    console.log(`  ⏱️  Tiempo: ${(resultado.metadata.tiempoGeneracion/1000).toFixed(1)}s`);
    
    // Guardar JSON con metadata
    const metadataPath = guardado.imagen.replace('.png', '-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify({
      prompt: resultado.prompt,
      metadata: resultado.metadata,
      disenio: disenioTest
    }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============================================================================
// TEST 3: Variaciones de prompts
// ============================================================================
console.log('\n' + '═'.repeat(70));
console.log('TEST 3: Generación de variaciones');
console.log('═'.repeat(70));

const variaciones = diccionarioPro.generarVariaciones(disenioTest, 3);
console.log('\n📸 Variaciones generadas:');
variaciones.forEach((v, i) => {
  console.log(`\n  Variación ${i + 1}:`);
  console.log(`    Ángulo: ${v.angulo}`);
  console.log(`    Iluminación: ${v.iluminacion}`);
  console.log(`    Prompt: ${v.prompt.substring(0, 80)}...`);
});

// ============================================================================
// TEST 4: Diferentes categorías con prompts específicos
// ============================================================================
console.log('\n' + '═'.repeat(70));
console.log('TEST 4: Prompts específicos por categoría');
console.log('═'.repeat(70));

const testsCategorias = [
  {
    nombre: 'Neón Vintage',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'RETRO DINER',
      estiloVisual: 'vintage',
      colores: [{ id: 'rojo', nombre: 'Rojo', hex: '#DA291C' }],
      tipografia: 'lobster',
      colorLuzLed: 'rojo'
    }
  },
  {
    nombre: 'Corpórea Elegante',
    datos: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'LUXURY SPA',
      estiloVisual: 'elegante',
      colores: [{ id: 'dorado', nombre: 'Dorado', hex: '#FFD100' }],
      tipografia: 'playfair',
      material: 'laton',
      sistemaIluminacion: 'trasera',
      colorLuzLed: 'blanco-calido',
      espesor: 8
    }
  },
  {
    nombre: 'Neón Industrial',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'IRON WORKS',
      estiloVisual: 'industrial',
      colores: [{ id: 'naranja', nombre: 'Naranja', hex: '#FF6B00' }],
      tipografia: 'archivo',
      colorLuzLed: 'naranja',
      fachada: 'hormigon'
    }
  }
];

console.log('\n📋 Prompts generados por categoría:\n');
testsCategorias.forEach((test, i) => {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`${i + 1}. ${test.nombre.toUpperCase()}`);
  console.log('─'.repeat(70));
  console.log('Datos:', JSON.stringify(test.datos, null, 2));
  console.log('\nPrompt:');
  const prompt = geminiServicePro.construirPromptImagen(test.datos, { formato: 'gemini' });
  console.log(prompt);
  console.log(`\n📊 Longitud: ${prompt.length} caracteres`);
});

// ============================================================================
// TEST 5: Keywords enriquecidos para búsqueda
// ============================================================================
console.log('\n' + '═'.repeat(70));
console.log('TEST 5: Keywords enriquecidas para embeddings');
console.log('═'.repeat(70));

testsCategorias.forEach((test, i) => {
  const keywords = diccionarioPro.getKeywordsPro(test.datos);
  console.log(`\n${test.nombre}:`);
  console.log(`  Keywords: ${keywords.slice(0, 8).join(', ')}${keywords.length > 8 ? '...' : ''}`);
});

// ============================================================================
// EJECUCIÓN
// ============================================================================
async function ejecutarTests() {
  // Generar una imagen de prueba
  await generarImagenPro();
  
  console.log('\n' + '═'.repeat(70));
  console.log('TESTS COMPLETADOS');
  console.log('═'.repeat(70));
}

// Ejecutar si se corre directamente
if (require.main === module) {
  ejecutarTests().catch(console.error);
}

module.exports = {
  diccionarioPro,
  geminiServicePro
};
