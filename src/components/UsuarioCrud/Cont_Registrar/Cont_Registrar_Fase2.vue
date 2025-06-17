<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label for="correo">Correo institucional</label>
            <InputText id="correo" v-model="usuario.correo" fluid class="mb-4" />
        </div>
        <div class="flex flex-col gap-2">
            <label for="password1">Contraseña</label>
            <Password id="password1" v-model="usuario.contrasenia" placeholder="Contraseña" :toggleMask="true" class="mb-1" fluid :feedback="false" />
            <span v-if="usuario.contrasenia && usuario.contrasenia.length > 0 && usuario.contrasenia.length < 8" style="color: #e53e3e; font-size: 0.9em;">
              La contraseña debe tener al menos 8 caracteres.
            </span>
        </div>
        <div class="flex flex-col gap-2 mb-32">
            <label for="rolesid">Roles</label>
            <MultiSelect id="rolesid" v-model="usuario.rolesid" :options="roles" optionLabel="nombre" optionValue="id" placeholder="Seleccione Roles" multiple fluid style="width: 250px;" class="mb-4" />
        </div>
        <br><br>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, onMounted } from 'vue';
import api from '@/service/api';

const props = defineProps(['usuario']);
const emit = defineEmits(['update:usuario', 'validate']);

const usuario = ref({
    ...props.usuario,
    correo: props.usuario.correo || '',
    contrasenia: props.usuario.contrasenia || '',
    rolesid: props.usuario.rolesid || []
});

function validateFields() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = usuario.value.correo && emailRegex.test(usuario.value.correo);
    const isPasswordValid = usuario.value.contrasenia && usuario.value.contrasenia.length >= 8;
    const isValid = !!(
        isEmailValid &&
        isPasswordValid &&
        Array.isArray(usuario.value.rolesid) &&
        usuario.value.rolesid.length > 0
    );
    emit('validate', isValid);
}

watch(() => [usuario.value.correo, usuario.value.contrasenia, usuario.value.rolesid], () => {
    if (Array.isArray(usuario.value.rolesid)) {
        usuario.value.rolesid = usuario.value.rolesid.map(rol => {
            if (typeof rol === 'object' && rol.id) {
                return rol.id;
            }
            return Number(rol);
        });
    }
    emit('update:usuario', usuario.value);
    validateFields();
}, { deep: true });

const roles = ref([]);
onMounted(async () => {
    try {
        const response = await api.get('/rol');
        roles.value = response.data.map(r => ({ 
            id: r.id, 
            nombre: r.nombre || r.name || r.descripcion 
        }));
    } catch (error) {
        console.error('Error al cargar roles:', error);
        roles.value = [];
    }
});
</script>