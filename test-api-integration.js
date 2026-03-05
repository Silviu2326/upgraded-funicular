/**
 * Test de integración del API de generación de imágenes
 */

const API_URL = 'http://localhost:5000/api/v1/diccionario-pro/generar-imagen';

async function testGeneracionImagen() {
  const datos = {
    categoria: 'letras-neon',
    nombreNegocio: 'TEST BAR',
    estiloVisual: 'moderno',
    colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#E4007C' }],
    tipografia: 'bebas',
    colorLuzLed: 'rosa',
    fachada: 'ladrillo',
    tipoNegocio: 'bar'
  };

  console.log('Enviando petición al backend...');
  console.log('URL:', API_URL);
  console.log('Datos:', JSON.stringify(datos, null, 2));
  console.log('');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error);
      return;
    }

    const data = await response.json();
    
    console.log('✅ Respuesta exitosa!');
    console.log('Success:', data.success);
    console.log('Tamaño imagen:', data.imagen?.tamanoKB, 'KB');
    console.log('Metadata:', data.metadata);
    
    if (data.imagen?.base64) {
      console.log('\n✅ Imagen generada correctamente');
      console.log('Base64 (primeros 100 chars):', data.imagen.base64.substring(0, 100) + '...');
    }
    
  } catch (error) {
    console.error('Error en la petición:', error.message);
  }
}

testGeneracionImagen();
