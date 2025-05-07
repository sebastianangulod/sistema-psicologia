// src/service/PersonaService.js
import api from './api';

export default class PersonaService {
  constructor() {
    // Definir el endpoint para el servicio
    this.endpoint = '/user';
  }

  async getAll() {
    try {
      console.log("Llamando al endpoint:", this.endpoint);
      
      // Verificar si hay token antes de hacer la solicitud
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No hay token disponible para la solicitud de usuarios");
        throw new Error("No hay token de autenticación");
      }
      
      // Añadir opciones para obtener la respuesta sin procesar
      const response = await api.get(this.endpoint, {
        transformResponse: [(data) => {
          // Devolver los datos sin procesar para poder inspeccionarlos
          return data;
        }],
        // Aceptar cualquier tipo de contenido para diagnóstico
        headers: {
          'Accept': '*/*',
          // Añadir el header para evitar la página de interstitial de ngrok
          'ngrok-skip-browser-warning': 'true'
        },
        // Añadir un parámetro para evitar caché
        params: {
          _t: new Date().getTime()
        }
      });
      
      // Mostrar información detallada para diagnóstico
      console.log("Respuesta completa:", response);
      console.log("Headers:", response.headers);
      console.log("Status:", response.status);
      
      // Si la respuesta es una cadena, intentar parsearla como JSON
      if (typeof response.data === 'string') {
        console.log("Primeros 100 caracteres de la respuesta:", response.data.substring(0, 100));
        
        // Verificar si la respuesta contiene HTML
        if (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html>')) {
          console.error("La respuesta contiene HTML, probablemente es una página de error o redirección");
          
          // Si es una página de ngrok, intentar hacer la solicitud de nuevo con un header adicional
          if (response.data.includes('ngrok')) {
            console.log("Detectada página de ngrok, intentando con header adicional");
            
            // Intentar hacer la solicitud de nuevo con el header ngrok-skip-browser-warning
            const retryResponse = await api.get(this.endpoint, {
              headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
              }
            });
            
            return retryResponse;
          }
          
          // Verificar si parece ser un error de autenticación
          if (response.data.toLowerCase().includes('login') || 
              response.data.toLowerCase().includes('auth') || 
              response.data.toLowerCase().includes('unauthorized')) {
            localStorage.removeItem('token');
            throw new Error("Sesión expirada o token inválido. Redirigiendo al login...");
          }
          
          throw new Error("El servidor devolvió HTML en lugar de JSON");
        }
        
        // Intentar parsear la respuesta como JSON
        try {
          const jsonData = JSON.parse(response.data);
          console.log("Datos JSON parseados:", jsonData);
          return { data: jsonData };
        } catch (e) {
          console.error("Error al parsear la respuesta como JSON:", e);
          throw new Error("No se pudo parsear la respuesta como JSON");
        }
      }
      
      return response;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      
      // Manejo específico de errores de autenticación
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('token');
          console.warn("Token inválido o expirado. Se requiere volver a iniciar sesión.");
        }
      }
      
      throw error;
    }
  }

  /** Obtiene un usuario por su ID*/
  async getById(id) {
    try {
      return await api.get(`${this.endpoint}/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  }

  /** Crea un nuevo usuario en el sistema*/
  async create(userData) {
    try {
      // Envía una petición POST al endpoint con los datos del nuevo usuario
      return await api.post(this.endpoint, userData, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
    } catch (error) {
      // Registra el error y lo propaga hacia arriba
      console.error("Error al crear usuario:", error);
      throw error;
    }
  }

  /*** Actualiza los datos de un usuario existente*/
  async update(id, userData) {
    try {
      return await api.put(`${this.endpoint}/${id}`, userData, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
    } catch (error) {
      // Captura y registra cualquier error que ocurra durante la actualización
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      // Propaga el error para que sea manejado por el componente que llamó a este método
      throw error;
    }
  }

  /**
   * Elimina un usuario por su ID mediante una petición DELETE a la API
   * @param {number|string} id - Identificador único del usuario a eliminar
   * @returns {Promise} Promesa que resuelve con la respuesta de la API
   * @throws {Error} Si ocurre un problema durante la eliminación
   */
  async delete(id) {
    try {
      // Realiza una petición DELETE al endpoint específico para eliminar el usuario
      return await api.delete(`${this.endpoint}/${id}`, {
        headers: {
          // Este encabezado evita la advertencia del navegador al usar ngrok en desarrollo
          'ngrok-skip-browser-warning': 'true'
        }
      });
    } catch (error) {
      // Registra el error en la consola con información del ID que falló
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      // Propaga el error para que sea manejado por el componente que lo llamó
      throw error;
    }
  }
}