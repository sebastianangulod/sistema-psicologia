// src/service/api.js - Configuración centralizada para peticiones HTTP
import axios from 'axios';

// Creamos una instancia personalizada de axios para todas las peticiones API
const api = axios.create({
    baseURL: '/api', // Utiliza la configuración de proxy definida en vue.config.js
    headers: {
        'Content-Type': 'application/json', // Define el formato de envío como JSON
        'Accept': 'application/json', // Indica que esperamos recibir JSON
        'ngrok-skip-browser-warning': 'true'
    }
});

// Configuramos un interceptor que se ejecuta antes de cada petición
api.interceptors.request.use(
    config => {
        // Para la ruta de login no necesitamos enviar token de autenticación
        if (config.url === '/login') {
            console.log('Omitiendo token para la ruta de login');
            return config;
        }

        const token = localStorage.getItem('token');
        if (token) {
            // Verificar si el token parece ser un JWT (contiene puntos)
            if (token.includes('.')) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // Si no parece ser un JWT, enviarlo como está (podría ser un token simple)
                config.headers.Authorization = token;
            }
            
            console.log('Enviando token:', token.substring(0, 15) + '...');
            console.log('Tipo de token:', token.includes('.') ? 'JWT' : 'Simple');
        } else {
            console.warn('No hay token disponible para la solicitud');
        }
        
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    response => {
        console.log('Respuesta recibida correctamente');
        return response;
    },
    error => {
        if (error.response) {
            console.error('Error de respuesta:', error.response.status, error.response.data);

            // Solo redirigir en 401, pero NO en 403 (para depuración)
            if (error.response.status === 401) {
                console.log('Error de autenticación, redirigiendo al login');
                localStorage.removeItem('token');
                window.location = '/auth/login_nw';
            }
            // Si es 403, solo mostrar el error y NO redirigir
        } else if (error.request) {
            console.error('Error de solicitud (no hubo respuesta)');
        } else {
            console.error('Error de configuración:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 