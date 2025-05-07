<!--
  LoginCRUD.vue - Componente de Autenticación de Usuario
  
  Este componente maneja el proceso de inicio de sesión de usuarios en el sistema.
  Se encarga de:
  - Presentar un formulario de autenticación con correo y contraseña
  - Validar las credenciales enviándolas al servidor a través de la API
  - Manejar el token de autenticación almacenándolo en localStorage
  - Gestionar estados de error y proporcionar información de depuración
  - Redirigir al usuario a la sección de gestión de usuarios tras una autenticación exitosa
  
  El componente se asegura de limpiar cualquier token de autenticación previo al cargar,
  garantizando que el usuario comience con una sesión limpia. Implementa un manejo detallado
  de errores para proporcionar mensajes informativos al usuario en caso de fallos de autenticación.
  
  Utiliza la configuración centralizada de API desde api.js para realizar las peticiones HTTP
  con los encabezados adecuados para trabajar con el backend a través de Ngrok.
-->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../service/api.js'

// Referencias reactivas para el formulario y estados
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('') 
const isLoading = ref(false)
const debugInfo = ref('')

// Limpia el token anterior al cargar el componente
onMounted(() => {
  // Eliminar cualquier token existente
  localStorage.removeItem('token')
  console.log('Token eliminado al cargar la página de login')
  
  // Verificar que realmente se haya eliminado
  const token = localStorage.getItem('token')
  if (token) {
    console.error('Error: El token no se eliminó correctamente')
    debugInfo.value = `Error: Token aún presente: ${token.substring(0, 15)}...`
  } else {
    console.log('Verificado: No hay token en localStorage')
  }
})

// Función para manejar el inicio de sesión
// Esta función se ejecuta al enviar el formulario
// Se encarga de validar las credenciales y manejar la respuesta del servidor
const handleLogin = async () => {
  try {
    // Validar que los campos no estén vacíos
    errorMessage.value = ''
    debugInfo.value = ''
    isLoading.value = true
    
    console.log('Intentando iniciar sesión con:', email.value)
    
    // Usar api.post con header adicional para ngrok
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    }, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    
    console.log('Respuesta del servidor:', response.data)
    debugInfo.value = `Respuesta: ${JSON.stringify(response.data)}`
    
    // Limpiar cualquier token existente antes de guardar el nuevo
    localStorage.removeItem('token')
    
    // Verificar todas las posibles ubicaciones del token
    let token = null
    
    // Estrategia de búsqueda robusta para el token de autenticación
    // El sistema intenta encontrar el token en múltiples ubicaciones posibles de la respuesta
    // debido a que diferentes implementaciones de backend pueden usar diferentes formatos

    // Estrategia 1: Buscar en response.data.token (formato más común y estándar)
    if (response.data && response.data.token) {
        token = response.data.token
        console.log('Token encontrado en response.data.token')
    } 
    // Estrategia 2: Buscar variante con error ortográfico (tocken) 
    // Este caso maneja una inconsistencia posible en el backend
    else if (response.data && response.data.tocken) {
        token = response.data.tocken
        console.log('Token encontrado en response.data.tocken (con error ortográfico)')
    } 
    // Estrategia 3: Verificar si toda la respuesta es el token directamente
    // Algunos backends simplificados pueden devolver el token como string sin estructura
    else if (response.data && typeof response.data === 'string') {
        token = response.data
        console.log('La respuesta completa es el token (formato string directo)')
    } 
    // Estrategia 4: Buscar en headers de autorización (formato según estándares RESTful)
    // Común en implementaciones que siguen estrictamente los estándares HTTP
    else if (response.headers && response.headers.authorization) {
        // Elimina el prefijo 'Bearer ' si existe
        token = response.headers.authorization.replace('Bearer ', '')
        console.log('Token encontrado en el header de autorización')
    }
    
    // Guardar el token en localStorage
    // Solo si se encontró un token válido
    // Esto asegura que no se guarde un valor nulo o indefinido
    if (token) {
      localStorage.setItem('token', token)
      console.log('Token guardado:', token)
      debugInfo.value = `Token guardado: ${token.substring(0, 15)}...`
      
      // Verificar que se haya guardado correctamente
      const storedToken = localStorage.getItem('token')

      // Comparar el token guardado con el token recibido
      // Esto asegura que el token no se haya modificado o perdido en el proceso
      if (storedToken === token) {
        console.log('Token verificado correctamente')
        router.push('/user')
      } else {
        console.error('Error: El token no se guardó correctamente')
        errorMessage.value = 'Error al guardar el token de autenticación'
      }
    // Si no se encontró un token válido, mostrar un mensaje de error
    } else {
      errorMessage.value = 'No se encontró token en la respuesta del servidor'
      console.error('Respuesta sin token:', response.data)
    }
  // Manejo de errores de autenticación
  } catch (error) {
    console.error('Error completo:', error)
    
    // Manejo más detallado de errores
    if (error.response) {
      debugInfo.value = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
      
      // Mensajes de error específicos según el código de estado
      // 401: Credenciales incorrectas
      // 404: Servicio no encontrado
      if (error.response.status === 401) {
        errorMessage.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
      } else if (error.response.status === 404) {
        errorMessage.value = 'Servicio de autenticación no encontrado. Verifique la URL.'
      } else {
        errorMessage.value = `Error del servidor: ${error.response.status} - ${error.response.statusText}`
      }
      console.error('Datos de error:', error.response.data)
    // Manejo de errores de red
    } else if (error.request) {
      errorMessage.value = 'No se pudo conectar con el servidor. Verifique su conexión.'
      debugInfo.value = 'No se recibió respuesta del servidor'
    // Manejo de errores generales
    } else {
      errorMessage.value = 'Error al realizar la solicitud: ' + error.message
      debugInfo.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Contenedor principal del formulario de login -->
  <div class="login-container">
    <!-- Formulario que llama al método handleLogin al ser enviado,
         prevent evita la recarga de página -->
    <form class="login-form" @submit.prevent="handleLogin">
      <!-- Título del formulario con estilo inline -->
      <h2 style="text-align: center; color: #1a237e; margin-bottom: 2rem;">Iniciar Sesión</h2>
      
      <!-- Campo para el correo electrónico -->
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <!-- Input vinculado a la variable reactiva 'email' mediante v-model -->
        <input 
          type="email" 
          id="email"
          v-model="email"
          required
          placeholder="correo@ejemplo.com"
        >
      </div>
      
      <!-- Campo para la contraseña -->
      <div class="form-group">
        <label for="password">Contraseña</label>
        <!-- Input tipo password para ocultar caracteres,
             vinculado a la variable reactiva 'password' -->
        <input 
          type="password" 
          id="password"
          v-model="password"
          required
          placeholder="••••••••"
        >
      </div>
      
      <!-- Botón de envío que se deshabilita durante el proceso de login -->
      <button type="submit" class="login-button" :disabled="isLoading">
        <!-- Texto dinámico que cambia según el estado de carga -->
        {{ isLoading ? 'Procesando...' : 'Iniciar Sesión' }}
      </button>
      
      <!-- Mensaje de error que solo se muestra cuando hay un error (v-if) -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      
      <!-- Sección de información de depuración que solo aparece cuando hay datos -->
      <div v-if="debugInfo" class="debug-info">
        <p>Información de diagnóstico:</p>
        <!-- La etiqueta pre mantiene el formato del texto para mejor legibilidad -->
        <pre>{{ debugInfo }}</pre>
      </div>
    </form>
  </div>
</template>

<!-- Estilos específicos para el componente de login -->
<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 50px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
input:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.2);
}
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1a237e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
.login-button:hover {
  background-color: #0d1642;
}
.login-button:disabled {
  background-color: #9fa8da;
  cursor: not-allowed;
}
.error-message {
  color: #d32f2f;
  margin-top: 15px;
  text-align: center;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
}
/* Añadir estilo para la información de depuración */
.debug-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.debug-info pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>