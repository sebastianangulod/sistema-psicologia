<template>
    <Dialog :visible="visible" :style="{ width: '900px', height: '700px' }" header="Registrar Incidencia" :modal="true" @update:visible="onClose">
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
                <Cont_Registrar_Fase1 v-if="activeStep === '1'" v-model:alumnos="localFormData.alumnos" :allAlumnos="allAlumnos" />
                <Cont_Registrar_Fase2 v-if="activeStep === '2'" v-model:formData="localFormData" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-between">
                <Button v-if="activeStep !== '1'" label="Volver" icon="pi pi-arrow-left" text @click="prevStep" />
                <div>
                    <Button v-if="activeStep !== '2'" label="Siguiente" icon="pi pi-arrow-right" iconPos="right" text @click="nextStep" :disabled="localFormData.alumnos.length === 0" />
                    <Button v-if="activeStep === '2'" label="Registrar" icon="pi pi-check" text @click="handleConfirm" />
                </div>
            </div>
        </template>
    </Dialog>

    <Confirmar_Registro :visible="showConfirmDialog" @update:visible="onConfirm" />
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { defineEmits, defineProps, ref } from 'vue';
import Confirmar_Registro from './Confirmar_Registro.vue';
import Cont_Registrar_Fase1 from '../../UsuarioCrud/Cont_Registrar/Cont_Registrar_Fase1.vue';
import Cont_Registrar_Fase2 from '../../UsuarioCrud/Cont_Registrar/Cont_Registrar_Fase2.vue';

const props = defineProps(['visible', 'allAlumnos']);
const emit = defineEmits(['update:visible', 'registrarIncidencia']);

const steps = [
    { value: '1', label: 'Seleccionar Alumnos' },
    { value: '2', label: 'Registrar Detalles del Incidente' }
];

const activeStep = ref('1');
const localFormData = ref({
    alumnos: [],
    nombreIncidente: '',
    detalles: '',
    argumento: '',
    acciones: ''
});
const showConfirmDialog = ref(false);

function isStepCompleted(stepValue) {
    return steps.findIndex(s => s.value === activeStep.value) > steps.findIndex(s => s.value === stepValue);
}

function nextStep() {
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex < steps.length - 1) {
        activeStep.value = steps[currentIndex + 1].value;
    }
}

function prevStep() {
    const currentIndex = steps.findIndex(s => s.value === activeStep.value);
    if (currentIndex > 0) {
        activeStep.value = steps[currentIndex - 1].value;
    }
}

function handleConfirm() {
    showConfirmDialog.value = true;
}

function onConfirm(confirmed) {
    showConfirmDialog.value = false;
    if (confirmed) {
        emit('registrarIncidencia', localFormData.value);
        emit('update:visible', false);
        resetForm();
    }
}

function onClose(newVisible) {
    emit('update:visible', newVisible);
    if (!newVisible) {
        showConfirmDialog.value = false;
        resetForm();
    }
}

function resetForm() {
    localFormData.value = {
        alumnos: [],
        nombreIncidente: '',
        detalles: '',
        argumento: '',
        acciones: ''
    };
    activeStep.value = '1';
}
</script>

<style scoped>
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