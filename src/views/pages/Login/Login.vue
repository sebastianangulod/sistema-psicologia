<script setup>
import api from '@/service/api.js';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const debugInfo = ref('');

// Limpia el token anterior al cargar el componente
onMounted(() => {
    localStorage.removeItem('token');
    console.log('Token eliminado al cargar la página de login');
    
    const token = localStorage.getItem('token');
    if (token) {
        console.error('Error: El token no se eliminó correctamente');
        debugInfo.value = `Error: Token aún presente: ${token.substring(0, 15)}...`;
    } else {
        console.log('Verificado: No hay token en localStorage');
    }
});

// --- REGISTRO AUTOMÁTICO DE ASISTENCIA ---
async function registrarAsistenciaAlLogin(userId) {
    try {
        // 1. Obtener datos completos del usuario (incluye horarios)
        const response = await api.get(`/usuario/${userId}`);
        const usuario = response.data;
        const horarios = usuario.horarios || [];

        // 2. Día actual en mayúsculas
        const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const hoy = new Date();
        const diaActual = diasSemana[hoy.getDay()];

        // 3. Buscar si tiene horario para hoy (normaliza a mayúsculas)
        const horarioHoy = horarios.find(h => h.dias.toUpperCase() === diaActual);

        if (!horarioHoy) {
            // No tiene horario para hoy, no se registra asistencia
            return;
        }

        // 4. Comparar hora actual con la hora de entrada
        const horaActual = hoy.getHours();
        const minutoActual = hoy.getMinutes();
        const horaEntrada = horarioHoy.hora.hour;
        const minutoEntrada = horarioHoy.hora.minute;

        let estado = 'PRESENTE';
        if (horaActual > horaEntrada || (horaActual === horaEntrada && minutoActual > minutoEntrada)) {
            estado = 'TARDE';
        }

        // 5. Registrar asistencia
        const asistencia = {
            fechaIngreso: hoy.toISOString(),
            horaIngreso: {
                hour: horaActual,
                minute: minutoActual,
                second: hoy.getSeconds(),
                nano: 0
            },
            estado
        };

        // POST /asistencias/{idUsuario}
        await api.post(`/asistencias/${userId}`, asistencia);
        // Puedes guardar en localStorage la fecha para evitar duplicados si lo deseas
    } catch (error) {
        console.error('Error al registrar asistencia automática:', error);
    }
}
// --- FIN REGISTRO AUTOMÁTICO DE ASISTENCIA ---

const handleLogin = async () => {
    try {
        errorMessage.value = '';
        debugInfo.value = '';
        isLoading.value = true;
        
        console.log('Intentando iniciar sesión con:', email.value);
        
        const response = await api.post('/login', {
            correo: email.value,
            contrasenia: password.value
        }, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        
        console.log('Respuesta del servidor:', response.data);
        debugInfo.value = `Respuesta: ${JSON.stringify(response.data)}`;
        
        localStorage.removeItem('token');
        
        let token = null;
        let userId = null;
        
        if (response.data && response.data.token) {
            token = response.data.token;
            // Intentar obtener el id del usuario
            userId = response.data.id || (response.data.usuario && response.data.usuario.id);
            console.log('Token encontrado en response.data.token');
        } else if (response.data && response.data.tocken) {
            token = response.data.tocken;
            userId = response.data.id || (response.data.usuario && response.data.usuario.id);
            console.log('Token encontrado en response.data.tocken');
        } else if (response.data && typeof response.data === 'string') {
            token = response.data;
            console.log('La respuesta completa es el token');
        } else if (response.headers && response.headers.authorization) {
            token = response.headers.authorization.replace('Bearer ', '');
            console.log('Token encontrado en el header de autorización');
        }
        
        if (token) {
            localStorage.setItem('token', token);
            console.log('Token guardado:', token);
            debugInfo.value = `Token guardado: ${token.substring(0, 15)}...`;
            
            const storedToken = localStorage.getItem('token');
            
            // --- REGISTRO AUTOMÁTICO DE ASISTENCIA ---
            if (userId) {
                await registrarAsistenciaAlLogin(userId);
            } else {
                console.warn('No se pudo obtener el id del usuario para registrar asistencia automática');
            }
            // --- FIN REGISTRO AUTOMÁTICO DE ASISTENCIA ---

            if (storedToken === token) {
                console.log('Token verificado correctamente');
                router.push('/dash');
            } else {
                console.error('Error: El token no se guardó correctamente');
                errorMessage.value = 'Error al guardar el token de autenticación';
            }
        } else {
            errorMessage.value = 'No se encontró token en la respuesta del servidor';
            console.error('Respuesta sin token:', response.data);
        }
    } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
            debugInfo.value = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
            
            if (error.response.status === 401) {
                errorMessage.value = 'Credenciales incorrectas. Inténtalo de nuevo.';
            } else if (error.response.status === 404) {
                errorMessage.value = 'Servicio de autenticación no encontrado. Verifique la URL.';
            } else {
                errorMessage.value = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
            }
            console.error('Datos de error:', error.response.data);
        } else if (error.request) {
            errorMessage.value = 'No se pudo conectar con el servidor. Verifique su conexión.';
            debugInfo.value = 'No se recibió respuesta del servidor';
        } else {
            errorMessage.value = 'Error al realizar la solicitud: ' + error.message;
            debugInfo.value = error.message;
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 24px; padding: 0.3rem; background: linear-gradient(180deg, #3b82f6 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-6 sm:px-12" style="border-radius: 21px">
          <div class="text-center mb-6">
            <!-- Logo desde assets (asegúrate de que la imagen exista en src/assets/logo_abs.jpg) -->
            <img src="@/assets/logo_abs.png" alt="Logo" class="mb-6 w-16 shrink-0 mx-auto" />
            <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium mb-2">Alberto Benjamin Simpson</div>
            <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
          </div>

          <div>
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Correo</label>
            <InputText id="email1" type="text" placeholder="Correo" class="w-full md:w-[25rem] mb-6" v-model="email" />

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-2">Contraseña</label>
            <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

            <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

            <div class="flex items-center justify-end mt-2 mb-6">
              <span class="font-medium no-underline text-right cursor-pointer" style="color: #3b82f6;">¿Has olvidado la contraseña?</span>
            </div>
            <Button label="Iniciar Sesión" class="w-full" @click="handleLogin" :loading="isLoading" style="background-color: #3b82f6; border-color: #3b82f6;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para los íconos de mostrar/ocultar contraseña */
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

/* Sobrescribir el contorno de InputText y Password para que sea azul */
:deep(.p-inputtext),
:deep(.p-password input) {
  border-color: #3b82f6 !important;
}

:deep(.p-inputtext:focus),
:deep(.p-password input:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 1px #3b82f6 !important;
}
</style>