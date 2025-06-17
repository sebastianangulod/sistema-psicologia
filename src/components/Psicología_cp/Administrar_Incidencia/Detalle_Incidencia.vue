<script setup>
import { defineProps, defineEmits } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
    incidencia: {
        type: Object,
        default: () => ({})
    },
    visible: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:visible']);

function close() {
    emit('update:visible', false);
}
</script>

<template>
    <Dialog :visible="visible" :style="{ width: '600px', maxWidth: '95vw' }" header="Detalles de la Incidencia" :modal="true" @update:visible="close">
        <div class="detalle-incidencia-container">
            <div class="detalle-section">
                <span class="detalle-label">Nombre del incidente :</span>
                <span class="detalle-value">{{ incidencia?.nombre || 'Sin nombre' }}</span>
            </div>
            <div class="detalle-section">
                <span class="detalle-label">Detalles de incidente:</span>
                <div class="detalle-text">{{ incidencia?.detalle || 'Sin detalles' }}</div>
            </div>
            <div class="detalle-section">
                <span class="detalle-label">Argumento del alumno:</span>
                <div class="detalle-text">{{ incidencia?.argumentos || 'Sin argumento' }}</div>
            </div>
            <div class="detalle-section">
                <span class="detalle-label">Acciones realizadas:</span>
                <div class="detalle-text">{{ incidencia?.acciones || 'Sin acciones' }}</div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.detalle-incidencia-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0.5rem;
}
.detalle-section {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}
.detalle-label {
    font-weight: bold;
    font-size: 1.1rem;
    color: #22223b;
}
.detalle-value {
    font-size: 1.1rem;
    color: #3a3a3a;
    margin-left: 0.5rem;
}
.detalle-text {
    background: #f8fafc;
    border-radius: 8px;
    padding: 0.7rem 1rem;
    color: #444;
    font-size: 1rem;
    white-space: pre-line;
    border: 1px solid #e5e7eb;
}
</style> 