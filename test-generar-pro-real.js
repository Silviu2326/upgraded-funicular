/**
 * ============================================================================
 * TEST GENERACIÓN REAL CON DICCIONARIO PRO
 * ============================================================================
 */

require('dotenv').config();
const geminiServicePro = require('./src/services/geminiImageServicePro');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     GENERACIÓN REAL CON DICCIONARIO PRO v3.0                ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

async function main() {
  // Test de generación con diferentes configuraciones
  
  const tests = [
    {
      nombre: 'Neón Moderno Rosa',
      datos: {
        categoria: 'letras-neon',
        nombreNegocio: 'PINK VIBES',
        estiloVisual: 'moderno',
        colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#E4007C' }],
        tipografia: 'bebas',
        colorLuzLed: 'rosa',
        fachada: 'ladrillo'
      }
    },
    {
      nombre: 'Corpórea Elegante',
      datos: {
        categoria: 'letras-corporeas',
        nombreNegocio: 'ROYAL SPA',
        estiloVisual: 'elegante',
        colores: [{ id: 'dorado', nombre: 'Dorado', hex: '#FFD100' }],
        tipografia: 'playfair',
        material: 'laton',
        sistemaIluminacion: 'trasera',
        colorLuzLed: 'blanco-calido',
        espesor: 8,
        fachada: 'marmol'
      }
    },
    {
      nombre: 'Neón Industrial',
      datos: {
        categoria: 'letras-neon',
        nombreNegocio: 'STEEL COFFEE',
        estiloVisual: 'industrial',
        colores: [{ id: 'naranja', nombre: 'Naranja', hex: '#FF6B00' }],
        tipografia: 'archivo',
        colorLuzLed: 'naranja',
        fachada: 'hormigon'
      }
    }
  ];

  for (const test of tests) {
    console.log('\n' + '═'.repeat(70));
    console.log(`🎨 ${test.nombre.toUpperCase()}`);
    console.log('═'.repeat(70));
    
    // Mostrar prompt generado
    const prompt = geminiServicePro.construirPromptImagen(test.datos, { formato: 'gemini' });
    console.log('\n📝 Prompt:');
    console.log(prompt);
    console.log(`\n📊 Longitud: ${prompt.length} caracteres`);

    // Generar imagen
    try {
      console.log('\n⏳ Generando imagen...');
      const resultado = await geminiServicePro.generarImagenRotulo(test.datos, { enfasisEn: 'iluminacion' });

      if (!resultado.success) {
        console.error('❌ Error:', resultado.error);
        continue;
      }

      // Guardar
      const guardado = await geminiServicePro.guardarImagen(resultado, 'uploads/pro');
      
      console.log('\n✅ ÉXITO:');
      console.log(`   📁 Imagen: ${guardado.imagen}`);
      console.log(`   📝 Prompt: ${guardado.prompt}`);
      console.log(`   ⏱️  Tiempo: ${(resultado.metadata.tiempoGeneracion/1000).toFixed(1)}s`);
      console.log(`   📊 Tamaño: ${(resultado.imagenBase64.length * 0.75 / 1024).toFixed(1)} KB`);

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    // Pausa entre generaciones
    console.log('\n⏸️  Pausa de 2 segundos...');
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n' + '═'.repeat(70));
  console.log('TESTS COMPLETADOS');
  console.log('═'.repeat(70));
}

main().catch(console.error);
