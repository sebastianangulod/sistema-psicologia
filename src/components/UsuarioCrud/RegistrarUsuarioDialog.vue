<template>
    <Dialog :visible="visible" :style="{ width: '650px', height: '600px' }" header="Registrar Usuario" :modal="true" @update:visible="onClose" class="custom-dialog">
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
                <Cont_Registrar_Fase1 v-if="activeStep === '1'" v-model:usuario="localUsuario" @validate="updateValidation" />
                <Cont_Registrar_Fase2 v-if="activeStep === '2'" v-model:usuario="localUsuario" @validate="updateValidation" />
                <Cont_Registrar_Fase3 v-if="activeStep === '3'" v-model:usuario="localUsuario" @validate="updateValidation" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between">
                <Button
                    v-if="activeStep !== '1'"
                    label="Volver"
                    icon="pi pi-arrow-left"
                    text
                    @click="prevStep"
                />
                <div>
                    <Button
                        v-if="activeStep !== '3'"
                        label="Siguiente"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        text
                        @click="nextStep"
                        :disabled="isNextDisabled"
                    />
                    <Button
                        v-if="activeStep === '3'"
                        label="Registrar"
                        icon="pi pi-check"
                        text
                        @click="handleRegister"
                        :disabled="isNextDisabled"
                    />
                </div>
            </div>
        </template>

        <ConfirmacionDialog
            :visible="showConfirmDialog"
            header="Confirmar Registro"
            mensaje="¿Estás seguro de registrar este usuario?"
            @update:visible="showConfirmDialog = $event"
            @confirmar="confirmRegister"
        />
    </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import Cont_Registrar_Fase1 from './Cont_Registrar/Cont_Registrar_Fase1.vue';
import Cont_Registrar_Fase2 from './Cont_Registrar/Cont_Registrar_Fase2.vue';
import Cont_Registrar_Fase3 from './Cont_Registrar/Cont_Registrar_Fase3.vue';
import ConfirmacionDialog from './Mensaje_Usuario/ConfirmacionDialog.vue';

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible', 'registrar']);

const steps = [
    { value: '1', label: 'Datos Personales' },
    { value: '2', label: 'Datos de Usuario' },
    { value: '3', label: 'Horarios' }
];

const activeStep = ref('1');
const localUsuario = ref({
    nombre: '',
    apaterno: '',
    amaterno: '',
    tdocumento: null,
    ndocumento: '',
    telefono1: '',
    telefono2: '',
    direccion: '',
    correopersonal: '',
    usuario: '',
    contrasenia: '',
    rolesid: [],
    horarios: {}
});

const isNextDisabled = ref(true);
const showConfirmDialog = ref(false);
const currentValidation = ref(false);

function isStepCompleted(stepValue) {
    return steps.findIndex(s => s.value === activeStep.value) > steps.findIndex(s => s.value === stepValue);
}

function updateValidation(isValid) {
    currentValidation.value = isValid;
    isNextDisabled.value = !isValid;
}

function nextStep() {
    if (!currentValidation.value) return;
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex < steps.length - 1) {
        activeStep.value = steps[currentIndex + 1].value;
        isNextDisabled.value = true;
    }
}

function prevStep() {
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex > 0) {
        activeStep.value = steps[currentIndex - 1].value;
        isNextDisabled.value = true;
    }
}

function handleRegister() {
    showConfirmDialog.value = true;
}

function confirmRegister() {
    // Formatear la fecha al formato ISO
    let fechaFormateada;
    if (localUsuario.value.fnacimiento instanceof Date) {
        const fecha = localUsuario.value.fnacimiento;
        fechaFormateada = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    } else {
        fechaFormateada = localUsuario.value.fnacimiento;
    }

    // Formatear los datos según el formato requerido por la API
    const usuarioFormateado = {
        nombre: localUsuario.value.nombre,
        apaterno: localUsuario.value.apaterno,
        amaterno: localUsuario.value.amaterno,
        tdocumento: localUsuario.value.tdocumento?.name || localUsuario.value.tdocumento,
        ndocumento: localUsuario.value.ndocumento,
        telefono1: localUsuario.value.telefono1,
        telefono2: localUsuario.value.telefono2,
        correopersonal: localUsuario.value.correopersonal,
        correo: localUsuario.value.correo,
        direccion: localUsuario.value.direccion,
        lnacimiento: localUsuario.value.lnacimiento,
        fnacimiento: fechaFormateada,
        contrasenia: localUsuario.value.contrasenia,
        idRoles: Array.isArray(localUsuario.value.rolesid)
            ? localUsuario.value.rolesid.map(rol => typeof rol === 'object' ? rol.id : rol)
            : [],
        horarios: Object.entries(localUsuario.value.horarios || {})
            .filter(([dia, valor]) => valor && valor.hora && valor.minuto)
            .map(([dia, valor]) => ({
                dias: dia.toLowerCase(),
                hora: {
                    hour: parseInt(valor.hora) || 0,
                    minute: parseInt(valor.minuto) || 0,
                    second: 0,
                    nano: 0
                }
            }))
    };

    // Verificar que todos los campos requeridos estén presentes y no sean vacíos
    const camposRequeridos = [
        'nombre', 'apaterno', 'amaterno', 'tdocumento', 'ndocumento',
        'telefono1', 'telefono2', 'correopersonal', 'direccion',
        'lnacimiento', 'fnacimiento', 'correo', 'contrasenia', 'idRoles'
    ];

    const camposFaltantes = camposRequeridos.filter(campo => {
        const valor = usuarioFormateado[campo];
        return !valor || 
               (typeof valor === 'string' && valor.trim() === '') ||
               (Array.isArray(valor) && valor.length === 0);
    });
    
    if (camposFaltantes.length > 0) {
        console.error('Campos faltantes o vacíos:', camposFaltantes);
        return;
    }

    // Agregar console.log para depuración
    console.log('Datos a enviar:', {
        ...usuarioFormateado,
        fnacimiento: fechaFormateada // Asegurarnos de que la fecha se muestre correctamente
    });

    // Emitir el evento con los datos formateados
    emit('registrar', usuarioFormateado);
    emit('update:visible', false);
    showConfirmDialog.value = false;
    resetForm();
}

function onClose(newVisible) {
    emit('update:visible', newVisible);
    if (!newVisible) {
        showConfirmDialog.value = false;
        resetForm();
    }
}

function resetForm() {
    localUsuario.value = {
        nombre: '',
        apaterno: '',
        amaterno: '',
        tdocumento: null,
        ndocumento: '',
        telefono1: '',
        telefono2: '',
        direccion: '',
        correopersonal: '',
        usuario: '',
        contrasenia: '',
        rolesid: [],
        horarios: {}
    };
    activeStep.value = '1';
    isNextDisabled.value = true;
    currentValidation.value = false;
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
    /* Removido cursor: pointer */
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