import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://7418-38-25-23-23.ngrok-free.app', 
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        proxyReq.setHeader('Content-Type', 'application/json');
                        proxyReq.setHeader('X-Forwarded-Proto', 'https');
                        proxyReq.setHeader('Origin', 'http://localhost:5173');
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('Estado de respuesta del proxy:', proxyRes.statusCode);
                        console.log('Content-Type:', proxyRes.headers['content-type']);
                    });
                }
            }
        }
    }
});
