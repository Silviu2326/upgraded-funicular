/**
 * ============================================================================
 * TEST DE UBICACIONES - EXTERIOR vs INTERIOR
 * ============================================================================
 */

const diccionarioPro = require('./src/config/diccionarioPromptsPro');
const geminiServicePro = require('./src/services/geminiImageServicePro');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     TEST DE UBICACIONES - Fachadas vs Interiores            ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

const tests = [
  {
    nombre: 'BAR - Debe ser EXTERIOR (fachada en calle)',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'PINK VIBES',
      estiloVisual: 'moderno',
      colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#E4007C' }],
      tipografia: 'bebas',
      colorLuzLed: 'rosa',
      fachada: 'ladrillo',
      tipoNegocio: 'bar'  // <-- Esto debería forzar EXTERIOR
    }
  },
  {
    nombre: 'CAFETERÍA - Debe ser EXTERIOR (fachada en calle)',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'STEEL COFFEE',
      estiloVisual: 'industrial',
      colores: [{ id: 'naranja', nombre: 'Naranja', hex: '#FF6B00' }],
      tipografia: 'archivo',
      colorLuzLed: 'naranja',
      fachada: 'hormigon',
      tipoNegocio: 'cafe'  // <-- Esto debería forzar EXTERIOR
    }
  },
  {
    nombre: 'TIENDA - Debe ser EXTERIOR (fachada comercial)',
    datos: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'FASHION STORE',
      estiloVisual: 'moderno',
      colores: [{ id: 'negro', nombre: 'Negro', hex: '#1D1D1D' }],
      tipografia: 'montserrat',
      material: 'aluminio',
      fachada: 'blanca',
      tipoNegocio: 'tienda'  // <-- Esto debería forzar EXTERIOR
    }
  },
  {
    nombre: 'SPA - Debe ser INTERIOR (recepción)',
    datos: {
      categoria: 'letras-corporeas',
      nombreNegocio: 'ROYAL SPA',
      estiloVisual: 'elegante',
      colores: [{ id: 'dorado', nombre: 'Dorado', hex: '#FFD100' }],
      tipografia: 'playfair',
      material: 'laton',
      sistemaIluminacion: 'trasera',
      colorLuzLed: 'blanco-calido',
      fachada: 'marmol',
      tipoNegocio: 'spa'  // <-- Esto debería forzar INTERIOR
    }
  },
  {
    nombre: 'RESTAURANTE - Debe ser EXTERIOR (fachada)',
    datos: {
      categoria: 'letras-neon',
      nombreNegocio: 'BISTRO ROYAL',
      estiloVisual: 'vintage',
      colores: [{ id: 'rojo', nombre: 'Rojo', hex: '#DA291C' }],
      tipografia: 'lobster',
      colorLuzLed: 'rojo',
      fachada: 'ladrillo',
      tipoNegocio: 'restaurante'  // <-- Esto debería forzar EXTERIOR
    }
  }
];

console.log('\n' + '═'.repeat(70));
console.log('VERIFICACIÓN DE PROMPTS GENERADOS');
console.log('═'.repeat(70));

tests.forEach((test, i) => {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`${i + 1}. ${test.nombre}`);
  console.log('─'.repeat(70));
  
  const prompt = geminiServicePro.construirPromptImagen(test.datos, { formato: 'gemini' });
  
  // Buscar indicadores de exterior/interior
  const tieneExterior = prompt.toLowerCase().includes('exterior') || 
                        prompt.toLowerCase().includes('storefront') ||
                        prompt.toLowerCase().includes('sidewalk') ||
                        prompt.toLowerCase().includes('street');
  
  const tieneInterior = prompt.toLowerCase().includes('interior') ||
                        prompt.toLowerCase().includes('reception') ||
                        prompt.toLowerCase().includes('lobby');
  
  console.log('\n📝 Prompt:');
  console.log(prompt);
  console.log(`\n📊 Longitud: ${prompt.length} caracteres`);
  
  if (test.datos.tipoNegocio === 'spa') {
    console.log(`\n✅ ¿Es INTERIOR? ${tieneInterior ? 'SÍ ✓' : 'NO ✗'}`);
  } else {
    console.log(`\n✅ ¿Es EXTERIOR? ${tieneExterior ? 'SÍ ✓' : 'NO ✗'}`);
  }
});

console.log('\n' + '═'.repeat(70));
console.log('TESTS COMPLETADOS');
console.log('═'.repeat(70));
