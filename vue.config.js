// Importamos la función defineConfig de Vue CLI para tener autocompletado y validación de tipo
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Activa la transpilación de dependencias que lo necesiten
  transpileDependencies: true,
  
  // Configuración del servidor de desarrollo
  devServer: {
    // Configuración del proxy para redirigir peticiones API
    proxy: {
      // Todas las peticiones que comiencen con /api serán redirigidas
      '/api': {
        // URL de destino (servidor backend) - URL de Ngrok 
        // Esta URL debe actualizarse con tu URL actual de Ngrok
        target: 'https://1eb1-2803-a3e0-133c-790-52b8-88d8-abfc-d033.ngrok-free.app',
        
        // Cambia el origen de la petición al valor de 'target'
        changeOrigin: true,
        
        // Desactiva la verificación de certificados SSL
        // Útil en desarrollo o cuando se usa Ngrok
        secure: false, 
        
        // Reglas para reescribir la ruta de la petición
        pathRewrite: {
          '^/api': '' // Elimina el prefijo /api al redirigir al backend
        },
        
        // Nivel de registro para depuración
        logLevel: 'debug',
        
        // Función que se ejecuta antes de enviar la petición al servidor proxy
        onProxyReq: (proxyReq) => {
          // Agrega cabeceras necesarias para el manejo correcto de JSON
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('X-Forwarded-Proto', 'https');
          proxyReq.setHeader('Origin', 'http://localhost:8080');
        },
        
        // Función que se ejecuta cuando se recibe una respuesta del servidor proxy
        onProxyRes: (proxyRes) => {
          // Registro mejorado de información de la respuesta
          console.log('Estado de respuesta del proxy:', proxyRes.statusCode);
          console.log('Content-Type:', proxyRes.headers['content-type']);
          
          // Captura y registra el cuerpo de la respuesta para depuración
          let responseBody = '';
          proxyRes.on('data', function(chunk) {
            responseBody += chunk;
          });
          proxyRes.on('end', function() {
            if (responseBody) {
              console.log('Cuerpo de la respuesta:', responseBody.toString());
            } else {
              console.log('Cuerpo de respuesta vacío');
            }
          });
        }
      }
    }
  }
})