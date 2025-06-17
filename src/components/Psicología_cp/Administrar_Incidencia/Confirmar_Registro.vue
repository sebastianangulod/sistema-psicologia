<template>
    <Dialog :visible="visible" :style="{ width: '400px' }" header="Confirmar Registro" :modal="true" @update:visible="onClose">
        <div class="p-4">
            <p>¿Estás seguro de que deseas registrar este incidente?</p>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="onClose(false)" />
            <Button label="Confirmar" icon="pi pi-check" text @click="onClose(true)" />
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible']);

function onClose(confirmed) {
    emit('update:visible', confirmed);
}
</script>