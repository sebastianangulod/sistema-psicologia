<template>
    <Dialog :visible="visible" :style="{ width: '650px', height: '600px' }" header="Editar Usuario" :modal="true" @update:visible="onClose" class="custom-dialog">
        <div class="dialog-content">
            <!-- Stepper personalizado NO CLICKEABLE -->
            <div class="custom-stepper">
                <div 
                    v-for="step in steps" 
                    :key="step.value" 
                    class="step" 
                    :class="{ 'active': activeStep === step.value, 'completed': isStepCompleted(step.value) }"
                >
                    <div class="step-circle">{{ step.value }}</div>
                    <div class="step-label">{{ step.label }}</div>
                </div>
                <div class="step-connector"></div>
            </div>
            
            <div class="mt-4 phase-content">
                <Cont_Editar_Fase1 v-if="activeStep === '1'" v-model:usuario="localUsuario" @validate="updateValidation" />
                <Cont_Editar_Fase2 v-if="activeStep === '2'" v-model:usuario="localUsuario" @validate="updateValidation" />
                <Cont_Editar_Fase3 v-if="activeStep === '3'" v-model:usuario="localUsuario" @validate="updateValidation" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between">
                <Button v-if="activeStep !== '1'" label="Volver" icon="pi pi-arrow-left" text @click="faseAnterior" />
                <div>
                    <Button v-if="activeStep !== '3'" label="Siguiente" icon="pi pi-arrow-right" iconPos="right" text @click="siguienteFase" :disabled="isNextDisabled" />
                    <Button v-if="activeStep === '3'" label="Editar" icon="pi pi-check" text @click="handleEdit" :disabled="!validarFase3()" />
                </div>
            </div>
        </template>

        <ConfirmacionDialog
            :visible="showConfirmDialog"
            header="Confirmar Edición"
            mensaje="¿Desea guardar los cambios realizados?"
            @update:visible="showConfirmDialog = $event"
            @confirmar="confirmEdit"
        />
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Cont_Editar_Fase1 from './Cont_Editar/Cont_Editar_Fase1.vue';
import Cont_Editar_Fase2 from './Cont_Editar/Cont_Editar_Fase2.vue';
import Cont_Editar_Fase3 from './Cont_Editar/Cont_Editar_Fase3.vue';
import ConfirmacionDialog from './Mensaje_Usuario/ConfirmacionDialog.vue';
import api from '@/service/api';

const props = defineProps(['visible', 'usuario']);
const emit = defineEmits(['update:visible', 'editar']);

const steps = [
    { value: '1', label: 'Datos Personales' },
    { value: '2', label: 'Datos de Usuario' },
    { value: '3', label: 'Horarios' }
];

const activeStep = ref('1');
const localUsuario = ref({ ...props.usuario });
const isNextDisabled = ref(false);
const showConfirmDialog = ref(false);
const currentValidation = ref(true);

const validarFase1 = () => {
    return localUsuario.value.nombre && 
           localUsuario.value.apaterno && 
           localUsuario.value.amaterno && 
           localUsuario.value.tdocumento && 
           localUsuario.value.ndocumento;
};

const validarFase2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = localUsuario.value.correopersonal && emailRegex.test(localUsuario.value.correopersonal);
    return isEmailValid;
};

const validarFase3 = () => {
    const horarios = localUsuario.value.horarios || {};
    const diasConHorario = Object.entries(horarios).filter(([_, valor]) => 
        valor.hora && valor.minuto && 
        validateHourFormat(parseInt(valor.hora)) && 
        validateTimeFormat(parseInt(valor.minuto))
    );

    const hasHorarios = diasConHorario.length > 0;
    console.log('Validando horarios:', { horarios, hasHorarios });
    return hasHorarios;
};

// Funciones auxiliares para validar formato de hora y minuto
function validateTimeFormat(value) {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 59;
}

function validateHourFormat(value) {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 23;
}

const validarFaseActual = () => {
    switch (activeStep.value) {
        case '1':
            return validarFase1();
        case '2':
            return validarFase2();
        case '3':
            return validarFase3();
        default:
            return false;
    }
};

const siguienteFase = () => {
    console.log('Intentando avanzar a siguiente fase');
    console.log('Validación actual:', validarFaseActual());
    console.log('Estado de validación:', {
        email: localUsuario.value.correopersonal,
        rolesId: localUsuario.value.rolesId
    });
    
    if (validarFaseActual()) {
        const currentIndex = steps.findIndex(s => s.value === activeStep.value);
        if (currentIndex < steps.length - 1) {
            activeStep.value = steps[currentIndex + 1].value;
            console.log('Avanzando a fase:', activeStep.value);
        }
    }
};

const faseAnterior = () => {
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex > 0) {
        activeStep.value = steps[currentIndex - 1].value;
    }
};

function handleEdit() {
    showConfirmDialog.value = true;
}

function confirmEdit() {
    // Formatear los datos según el formato requerido por la API
    const horariosFormateados = Object.entries(localUsuario.value.horarios || {})
        .filter(([_, valor]) => valor.hora && valor.minuto)
        .map(([dia, valor]) => {
            const hora = parseInt(valor.hora);
            const minuto = parseInt(valor.minuto);
            return {
                dias: dia.toLowerCase(),
                hora: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:00`
            };
        });

    const usuarioFormateado = {
        id: localUsuario.value.id,
        telefono1: localUsuario.value.telefono1,
        telefono2: localUsuario.value.telefono2,
        correopersonal: localUsuario.value.correopersonal,
        direccion: localUsuario.value.direccion,
        rolesId: localUsuario.value.rolesId,
        horarios: horariosFormateados
    };

    console.log('Datos a enviar:', JSON.parse(JSON.stringify(usuarioFormateado)));
    // Emitir el evento con los datos formateados
    emit('editar', usuarioFormateado);
    emit('update:visible', false);
    showConfirmDialog.value = false;
}

function onClose(newVisible) {
    emit('update:visible', newVisible);
    if (!newVisible) {
        showConfirmDialog.value = false;
        localUsuario.value = { ...props.usuario };
        activeStep.value = '1'; // También reiniciamos aquí por seguridad
        isNextDisabled.value = false;
        currentValidation.value = true;
    }
}

// Añadimos este watch para reiniciar el paso y cargar datos cuando se abre el diálogo
watch(() => props.visible, async (newVal) => {
    if (newVal) {
        activeStep.value = '1';
        isNextDisabled.value = false;
        currentValidation.value = true;
        await cargarDatosUsuario();
    }
});

function isStepCompleted(stepValue) {
    return steps.findIndex(s => s.value === activeStep.value) > steps.findIndex(s => s.value === stepValue);
}

function updateValidation(isValid) {
    console.log('Actualizando validación:', isValid);
    currentValidation.value = isValid;
    isNextDisabled.value = !isValid;
}

// Función para cargar los datos del usuario
async function cargarDatosUsuario() {
    try {
        const response = await api.get(`/usuario/${props.usuario.id}`);
        console.log('Datos del usuario cargados:', response.data);
        
        // Formatear los horarios al cargar
        if (response.data.horarios) {
            const horariosFormateados = {};
            response.data.horarios.forEach(horario => {
                if (horario.hora) {
                    horariosFormateados[horario.dias.toLowerCase()] = {
                        hora: String(horario.hora.hour).padStart(2, '0'),
                        minuto: String(horario.hora.minute).padStart(2, '0')
                    };
                }
            });
            response.data.horarios = horariosFormateados;
        }
        
        localUsuario.value = response.data;
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}
</script>

<style scoped>
.custom-dialog {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.dialog-content {
    flex: 1;
    overflow-y: auto;
}

.phase-content {
    height: calc(100% - 60px);
    overflow-y: auto;
}

/* Estilos del stepper personalizado NO CLICKEABLE */
.custom-stepper {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 2rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e5e7eb;
    color: #6b7280;
    font-weight: 600;
    transition: all 0.3s ease;
}

.step-label {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    text-align: center;
    transition: all 0.3s ease;
}

.step.active .step-circle {
    background-color: #3b82f6;
    color: white;
}

.step.active .step-label {
    color: #3b82f6;
    font-weight: 600;
}

.step.completed .step-circle {
    background-color: #10b981;
    color: white;
}

.step.completed .step-label {
    color: #10b981;
}

.step-connector {
    position: absolute;
    top: 16px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e5e7eb;
    z-index: 1;
}
</style>