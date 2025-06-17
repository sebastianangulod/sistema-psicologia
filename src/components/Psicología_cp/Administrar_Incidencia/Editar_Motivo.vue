<template>
    <Dialog :visible="visible" :style="{ width: '500px' }" header="Editar Motivo" :modal="true" @update:visible="emit('update:visible', $event)">
        <div class="p-4">
            <div class="flex flex-col gap-2">
                <label for="motivo">Motivo</label>
                <Textarea
                    id="motivo"
                    v-model="localMotivo"
                    rows="4"
                    class="w-full"
                />
            </div>
        </div>
        <template #footer>
            <Button label="Editar" icon="pi pi-check" text @click="saveMotivo" />
        </template>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps(['visible', 'alumno']);
const emit = defineEmits(['update:visible', 'update:motivo']);

const localMotivo = ref(props.alumno?.motivo || '');

watch(() => props.alumno, (newVal) => {
    localMotivo.value = newVal?.motivo || '';
});

function saveMotivo() {
    emit('update:motivo', localMotivo.value);
    emit('update:visible', false);
}
</script>