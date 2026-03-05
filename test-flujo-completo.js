/**
 * Test del flujo completo: Rótulo aislado + Mockups
 */

const API_URL = 'http://localhost:5000/api/v1/mockups/generar-completo';

async function testFlujoCompleto() {
  const datos = {
    categoria: 'letras-neon',
    nombreNegocio: 'BAR TEST',
    estiloVisual: 'moderno',
    colores: [{ id: 'azul', nombre: 'Azul', hex: '#0033A0' }],
    tipografia: 'bebas',
    colorLuzLed: 'azul',
    fachada: 'ladrillo',
    tipoNegocio: 'bar'
  };

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  TEST FLUJO COMPLETO: Rótulo + Mockups');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Datos de entrada:');
  console.log(JSON.stringify(datos, null, 2));
  console.log('\nEnviando petición...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error);
      return;
    }

    const data = await response.json();
    
    console.log('✅ RESPUESTA EXITOSA!\n');
    console.log('─'.repeat(60));
    console.log('RESULTADOS:');
    console.log('─'.repeat(60));
    
    console.log('\n📸 RÓTULO AISLADO:');
    console.log(`   ✓ Generado: ${data.rotulo ? 'SÍ' : 'NO'}`);
    console.log(`   ✓ Tamaño: ${data.rotulo?.tamanoKB} KB`);
    console.log(`   ✓ URL: ${data.rotulo?.url}`);
    
    console.log('\n🏢 MOCKUPS:');
    console.log(`   ✓ Total generados: ${data.mockups?.length || 0}`);
    
    data.mockups?.forEach((mockup, i) => {
      console.log(`\n   [${i+1}] ${mockup.tipo.toUpperCase()}:`);
      console.log(`       Éxito: ${mockup.success ? '✅' : '❌'}`);
      if (mockup.success) {
        console.log(`       Tamaño: ${mockup.tamanoKB} KB`);
        console.log(`       URL: ${mockup.url}`);
      } else {
        console.log(`       Error: ${mockup.error}`);
      }
    });
    
    console.log('\n─'.repeat(60));
    console.log('TIEMPOS:');
    console.log('─'.repeat(60));
    console.log(`   Rótulo: ${(data.tiempos?.rotulo/1000).toFixed(1)}s`);
    console.log(`   Mockups: ${(data.tiempos?.mockups/1000).toFixed(1)}s`);
    console.log(`   TOTAL: ${(data.tiempos?.total/1000).toFixed(1)}s`);
    console.log('─'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFlujoCompleto();
