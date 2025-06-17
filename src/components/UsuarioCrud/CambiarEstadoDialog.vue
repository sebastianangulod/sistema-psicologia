<template>
    <Dialog :visible="visible" :style="{ width: '400px' }" header="Cambiar Estado" :modal="true" @update:visible="emit('update:visible', $event)">
        <div class="p-4">
            <p>¿Desea cambiar el estado de <strong>{{ usuario.nombre }} {{ usuario.apaterno }} {{ usuario.amaterno }}</strong> a <strong>{{ nuevoEstado }}</strong>?</p>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="emit('update:visible', false)"  />
            <Button label="Confirmar" icon="pi pi-check" text @click="confirmarCambio"  />
        </template>
    </Dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps(['visible', 'usuario']);
const emit = defineEmits(['update:visible', 'confirmar-cambio']);

const nuevoEstado = ref(props.usuario.estado ? 'Inactivo' : 'Activo');

function confirmarCambio() {
    emit('confirmar-cambio', props.usuario);
    emit('update:visible', false);
}
</script>