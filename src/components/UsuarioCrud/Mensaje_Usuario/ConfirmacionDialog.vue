<template>
    <Dialog v-model:visible="internalVisible" :style="{ width: '400px' }" :header="header" :modal="true">
        <p>{{ mensaje }}</p>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="cancelar" />
            <Button label="Aceptar" icon="pi pi-check" text @click="confirmar" />
        </template>
    </Dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
    visible: { type: Boolean, required: true },
    header: { type: String, default: 'Confirmación' },
    mensaje: { type: String, required: true }
});

const emit = defineEmits(['update:visible', 'confirmar']);

const internalVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
    internalVisible.value = newVal;
});

watch(internalVisible, (newVal) => {
    emit('update:visible', newVal);
});

function confirmar() {
    emit('confirmar');
    internalVisible.value = false;
}

function cancelar() {
    internalVisible.value = false;
}
</script>