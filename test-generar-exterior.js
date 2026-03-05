/**
 * ============================================================================
 * TEST GENERACIÓN - FACHADAS EXTERIORES
 * ============================================================================
 */

require('dotenv').config();
const geminiServicePro = require('./src/services/geminiImageServicePro');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     GENERACIÓN DE FACHADAS EXTERIORES CORREGIDAS            ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

async function main() {
  const tests = [
    {
      nombre: 'BAR - PINK VIBES (Exterior)',
      datos: {
        categoria: 'letras-neon',
        nombreNegocio: 'PINK VIBES',
        estiloVisual: 'moderno',
        colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#E4007C' }],
        tipografia: 'bebas',
        colorLuzLed: 'rosa',
        fachada: 'ladrillo',
        tipoNegocio: 'bar'  // Fuerza EXTERIOR
      }
    },
    {
      nombre: 'CAFETERÍA - STEEL COFFEE (Exterior)',
      datos: {
        categoria: 'letras-neon',
        nombreNegocio: 'STEEL COFFEE',
        estiloVisual: 'industrial',
        colores: [{ id: 'naranja', nombre: 'Naranja', hex: '#FF6B00' }],
        tipografia: 'archivo',
        colorLuzLed: 'naranja',
        fachada: 'hormigon',
        tipoNegocio: 'cafe'  // Fuerza EXTERIOR
      }
    }
  ];

  for (const test of tests) {
    console.log('\n' + '═'.repeat(70));
    console.log(`🎨 ${test.nombre}`);
    console.log('═'.repeat(70));
    
    // Mostrar prompt
    const prompt = geminiServicePro.construirPromptImagen(test.datos, { formato: 'gemini' });
    console.log('\n📝 Prompt:');
    console.log(prompt);
    console.log(`\n📊 Longitud: ${prompt.length} caracteres`);

    // Generar imagen
    try {
      console.log('\n⏳ Generando imagen...');
      const resultado = await geminiServicePro.generarImagenRotulo(test.datos);

      if (!resultado.success) {
        console.error('❌ Error:', resultado.error);
        continue;
      }

      // Guardar
      const guardado = await geminiServicePro.guardarImagen(resultado, 'uploads/exterior');
      
      console.log('\n✅ ÉXITO:');
      console.log(`   📁 Imagen: ${guardado.imagen}`);
      console.log(`   ⏱️  Tiempo: ${(resultado.metadata.tiempoGeneracion/1000).toFixed(1)}s`);

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    // Pausa entre generaciones
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n' + '═'.repeat(70));
  console.log('GENERACIÓN COMPLETADA');
  console.log('═'.repeat(70));
}

main().catch(console.error);
