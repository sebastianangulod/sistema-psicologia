<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-col grow basis-0 gap-2">
                <label>Días</label>
                <div class="flex flex-col gap-6">
                    <div v-for="dia in dias" :key="dia" class="flex items-center">
                        <Checkbox v-model="selectedDias" :value="dia" :id="'chk_' + dia" :disabled="loading" />
                        <label :for="'chk_' + dia" class="ml-2">{{ dia }}</label>
                    </div>
                </div>
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
                <label>Hora</label>
                <div class="flex flex-col gap-2">
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
const horarios = ref({});
const dias = ref(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);

// Inicializar horarios para cada día
dias.value.forEach(dia => {
    horarios.value[dia] = { hora: '', minuto: '', segundo: '0', nano: '0' };
});

// Observar cambios en selectedDias y horarios
watch([selectedDias, horarios], () => {
    const horariosActualizados = {};
    
    // Solo agregar días que estén seleccionados y tengan hora y minuto válidos
    Object.entries(horarios.value).forEach(([dia, valor]) => {
        if (selectedDias.value.includes(dia) && valor.hora && valor.minuto) {
            const hora = parseInt(valor.hora);
            const minuto = parseInt(valor.minuto);
            
            if (validateHourFormat(hora) && validateTimeFormat(minuto)) {
                horariosActualizados[dia] = {
                    hora: hora.toString(),
                    minuto: minuto.toString()
                };
            }
        }
    });

    // Actualizar el usuario local solo si hay cambios
    if (JSON.stringify(localUsuario.value.horarios) !== JSON.stringify(horariosActualizados)) {
        localUsuario.value = {
            ...localUsuario.value,
            horarios: horariosActualizados
        };
        emit('update:usuario', localUsuario.value);
    }

    // Emitir estado de validación
    const isValid = Object.keys(horariosActualizados).length > 0;
    emit('validate', isValid);
}, { deep: true });

// Observar cambios en props.usuario
watch(() => props.usuario, (newVal) => {
    if (!newVal) return;
    
    // Evitar actualización recursiva
    if (JSON.stringify(localUsuario.value) === JSON.stringify(newVal)) return;
    
    // Convertir el formato de horarios si es necesario
    const horariosFormateados = {};
    const diasSeleccionados = [];
    
    // Inicializar todos los días con valores vacíos
    dias.value.forEach(dia => {
        horariosFormateados[dia] = { hora: '', minuto: '' };
    });

    if (Array.isArray(newVal.horarios)) {
        newVal.horarios.forEach(horario => {
            if (horario.dias && horario.hora) {
                const dia = horario.dias.charAt(0).toUpperCase() + horario.dias.slice(1);
                horariosFormateados[dia] = {
                    hora: horario.hora.hour.toString(),
                    minuto: horario.hora.minute.toString()
                };
                diasSeleccionados.push(dia);
            }
        });
    } else if (typeof newVal.horarios === 'object') {
        Object.entries(newVal.horarios).forEach(([dia, valor]) => {
            if (valor.hora && valor.minuto) {
                horariosFormateados[dia] = {
                    hora: valor.hora.toString(),
                    minuto: valor.minuto.toString()
                };
                diasSeleccionados.push(dia);
            }
        });
    }
    
    // Actualizar los valores de forma segura
    horarios.value = horariosFormateados;
    selectedDias.value = diasSeleccionados;
    localUsuario.value = {
        ...newVal,
        horarios: horariosFormateados
    };
}, { immediate: true, deep: true });

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
            const hora = tiempo.hora.replace(/[^0-9]/g, '').slice(0, 2);
            if (validateHourFormat(parseInt(hora))) {
                tiempo.hora = hora;
            } else {
                tiempo.hora = '';
            }
        }
        if (tiempo.minuto) {
            const minuto = tiempo.minuto.replace(/[^0-9]/g, '').slice(0, 2);
            if (validateTimeFormat(parseInt(minuto))) {
                tiempo.minuto = minuto;
            } else {
                tiempo.minuto = '';
            }
        }
    });
}, { deep: true });
</script>