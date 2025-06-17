const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    
    devServer: {
        proxy: {
            '/api': {
                target: '127.0.0.1:8082',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                },
                logLevel: 'debug',
                onProxyReq: (proxyReq) => {
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('X-Forwarded-Proto', 'https');
                    proxyReq.setHeader('Origin', 'http://localhost:8082');
                },
                onProxyRes: (proxyRes) => {
                    console.log('Estado de respuesta del proxy:', proxyRes.statusCode);
                    console.log('Content-Type:', proxyRes.headers['content-type']);
                    
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