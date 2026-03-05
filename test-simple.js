fetch('http://localhost:5000/api/v1/mockups/generar-completo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    categoria: 'letras-neon',
    nombreNegocio: 'TEST',
    estiloVisual: 'moderno',
    colores: [{ id: 'rojo', nombre: 'Rojo', hex: '#DA291C' }],
    tipografia: 'bebas',
    colorLuzLed: 'rojo',
    fachada: 'ladrillo',
    tipoNegocio: 'bar'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ ÉXITO!');
  console.log('Rotulo:', data.rotulo ? 'SÍ' : 'NO');
  console.log('Mockups:', data.mockups?.length || 0);
  console.log('Tiempos:', data.tiempos);
})
.catch(e => console.error('❌ Error:', e.message));
