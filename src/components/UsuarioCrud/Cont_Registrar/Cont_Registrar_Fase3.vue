<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-col grow basis-0 gap-2">
                <label>Días</label>
                <div class="flex flex-col custom-gap">
                    <div v-for="dia in dias" :key="dia" class="flex items-center">
                        <Checkbox v-model="selectedDias" :value="dia" :id="'chk_' + dia" :disabled="loading" />
                        <label :for="'chk_' + dia" class="ml-2">{{ dia }}</label>
                    </div>
                </div>
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
                <label>Hora</label>
                <div class="flex flex-col gap-2">
                    <!-- Cambia v-for para usar todos los días -->
                    <InputText 
                        v-for="dia in dias" 
                        :key="dia + '_hora'" 
                        v-model="horarios[dia].hora" 
                        :disabled="!selectedDias.includes(dia)" 
                        placeholder="Hora" 
                    />
                </div>
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
                <label>Minuto</label>
                <div class="flex flex-col gap-2 mb-32">
                    <!-- Cambia v-for para usar todos los días -->
                    <InputText 
                        v-for="dia in dias" 
                        :key="dia + '_minuto'" 
                        v-model="horarios[dia].minuto" 
                        :disabled="!selectedDias.includes(dia)" 
                        placeholder="Minuto" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps(['usuario']);
const emit = defineEmits(['update:usuario', 'validate']);

const localUsuario = ref({ ...props.usuario });
const selectedDias = ref([]);
const horarios = ref({
    Lunes: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Martes: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Miércoles: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Jueves: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Viernes: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Sábado: { hora: '', minuto: '', segundo: '0', nano: '0' },
    Domingo: { hora: '', minuto: '', segundo: '0', nano: '0' }
});
const dias = ref(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);

// Validar formato de hora y minuto
function validateTimeFormat(value) {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 59;
}

// Validar hora completa (0-23)
function validateHourFormat(value) {
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 23;
}

// Observar cambios en horarios
watch(horarios, (newHorarios) => {
    Object.entries(newHorarios).forEach(([dia, tiempo]) => {
        if (tiempo.hora) {
            tiempo.hora = tiempo.hora.replace(/[^0-9]/g, '').slice(0, 2);
            if (!validateHourFormat(tiempo.hora)) {
                tiempo.hora = '';
            }
        }
        if (tiempo.minuto) {
            tiempo.minuto = tiempo.minuto.replace(/[^0-9]/g, '').slice(0, 2);
            if (!validateTimeFormat(tiempo.minuto)) {
                tiempo.minuto = '';
            }
        }
    });
}, { deep: true });

// Elimino cualquier validación duplicada y dejo solo una función robusta:
function validateFields() {
    const isValid = selectedDias.value.length > 0 && 
        selectedDias.value.every(dia => {
            const tiempo = horarios.value[dia];
            return (
                tiempo &&
                tiempo.hora !== undefined &&
                tiempo.minuto !== undefined &&
                tiempo.hora !== '' &&
                tiempo.minuto !== '' &&
                validateHourFormat(tiempo.hora) && 
                validateTimeFormat(tiempo.minuto)
            );
        });
    emit('validate', isValid);
}

// Watcher para actualizar horarios en el usuario
watch([selectedDias, horarios], () => {
    // Construir un objeto de horarios solo con los días seleccionados y con hora/minuto válidos
    const horariosActualizados = {};
    selectedDias.value.forEach(dia => {
        const tiempo = horarios.value[dia] || { hora: '', minuto: '' };
        if (tiempo.hora && tiempo.minuto) {
            horariosActualizados[dia] = {
                hora: tiempo.hora,
                minuto: tiempo.minuto
            };
        }
    });
    localUsuario.value.horarios = horariosActualizados;
    emit('update:usuario', localUsuario.value);
    validateFields();
}, { deep: true });
</script>

<style scoped>
.custom-gap {
    gap: 1.6rem; /* Valor decimal personalizado */
}
</style>