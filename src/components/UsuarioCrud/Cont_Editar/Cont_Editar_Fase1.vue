<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" v-model="localUsuario.nombre" autofocus fluid class="mb-4" disabled />
        </div>
        <div class="flex flex-row gap-4">
            <div class="flex-1">
                <label for="apaterno">Apellido Paterno</label>
                <InputText id="apaterno" v-model="localUsuario.apaterno" fluid class="mb-4" disabled />
            </div>
            <div class="flex-1">
                <label for="amaterno">Apellido Materno</label>
                <InputText id="amaterno" v-model="localUsuario.amaterno" fluid class="mb-4" disabled />
            </div>
        </div>
        <div class="flex flex-row gap-4">
            <div class="flex-1">
                <label for="tdocumento">Tipo Documento</label>
                <Select id="tdocumento" v-model="localUsuario.tdocumento" :options="tiposDocumento" optionLabel="name" placeholder="Seleccione Tipo" fluid class="mb-4" disabled />
            </div>
            <div class="flex-1">
                <label for="ndocumento">N° Documento</label>
                <InputText id="ndocumento" v-model="localUsuario.ndocumento" type="number" fluid class="mb-4" disabled />
            </div>
        </div>
        <div class="flex flex-row gap-4">
            <div class="flex-1">
                <label for="telefono1">Teléfono 1</label>
                <InputText id="telefono1" v-model="localUsuario.telefono1" fluid class="mb-4" />
            </div>
            <div class="flex-1">
                <label for="telefono2">Teléfono 2</label>
                <InputText id="telefono2" v-model="localUsuario.telefono2" fluid class="mb-4" />
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <label for="direccion">Dirección</label>
            <InputText id="direccion" v-model="localUsuario.direccion" fluid class="mb-4" />
        </div>
        <div class="flex flex-col gap-2">
            <label for="correopersonal">Correo Personal</label>
            <InputText id="correopersonal" v-model="localUsuario.correopersonal" fluid class="mb-4" />
        </div>
        <div class="flex flex-col gap-2">
            <label for="fechaNacimiento">Fecha de Nacimiento</label>
            <DatePicker id="fechaNacimiento" v-model="localUsuario.fechaNacimiento" :showIcon="true" :showButtonBar="true" fluid class="mb-4" disabled />
        </div>
        <div class="flex flex-col gap-2">
            <label for="lugarNacimiento">Lugar de Nacimiento</label>
            <InputText id="lugarNacimiento" v-model="localUsuario.lugarNacimiento" fluid class="mb-4" disabled />
        </div>
    </div>
</template>

<script setup>
import DatePicker from 'primevue/datepicker';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps(['usuario']);
const emit = defineEmits(['update:usuario', 'validate']);

const localUsuario = ref({ ...props.usuario });

// Actualizar localUsuario cuando cambie el prop usuario
watch(() => props.usuario, (nuevoUsuario) => {
  localUsuario.value = { ...nuevoUsuario };
}, { immediate: true });

// Validación de campos
function validateFields() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = localUsuario.value.correopersonal && emailRegex.test(localUsuario.value.correopersonal);
    const isTelefono1Valid = localUsuario.value.telefono1 && 
        localUsuario.value.telefono1.length >= 9 && 
        /^\d+$/.test(localUsuario.value.telefono1);
    const isTelefono2Valid = !localUsuario.value.telefono2 || 
        (localUsuario.value.telefono2.length >= 9 && 
        /^\d+$/.test(localUsuario.value.telefono2));

    const isValid = !!(
        isTelefono1Valid &&
        isTelefono2Valid &&
        localUsuario.value.direccion &&
        localUsuario.value.direccion.trim().length > 0 &&
        isEmailValid
    );
    emit('validate', isValid);
}

// Restringir entrada a solo números
function restrictToNumbers(field) {
    const value = localUsuario.value[field];
    if (value) {
        localUsuario.value[field] = value.replace(/[^0-9]/g, '');
    }
}

// Emitir validación cuando cambien los campos
watch(localUsuario, (newVal) => {
    // Validar campos numéricos
    if (newVal.telefono1) {
        newVal.telefono1 = newVal.telefono1.replace(/[^0-9]/g, '').slice(0, 15);
    }
    if (newVal.telefono2) {
        newVal.telefono2 = newVal.telefono2.replace(/[^0-9]/g, '').slice(0, 15);
    }
    // Limpiar espacios en blanco
    if (newVal.direccion) {
        newVal.direccion = newVal.direccion.trim();
    }
    if (newVal.correopersonal) {
        newVal.correopersonal = newVal.correopersonal.trim();
    }
    emit('update:usuario', newVal);
    validateFields();
}, { deep: true });

const tiposDocumento = ref([
    { name: 'DNI' },
    { name: 'Pasaporte' },
    { name: 'Carnet de Extranjería' }
]);
</script>