<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label for="correo">Correo</label>
            <InputText id="correo" v-model="localUsuario.correopersonal" fluid class="mb-4" disabled />
        </div>
        <div class="flex flex-col gap-2 mb-32">
            <label for="rolesid">Roles</label>
            <MultiSelect 
                id="rolesid" 
                v-model="localUsuario.rolesId" 
                :options="roles" 
                optionLabel="name" 
                optionValue="id" 
                placeholder="Seleccione Roles" 
                multiple 
                fluid 
                style="width: 250px;" 
                class="mb-4"
                @change="handleRolesChange" 
            />
        </div>
        <br><br><br><br><br><br>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, onMounted } from 'vue';
import api from '@/service/api';

const props = defineProps(['usuario']);
const emit = defineEmits(['update:usuario', 'validate']);

// Inicializar localUsuario con los datos del usuario
const localUsuario = ref({
    ...props.usuario,
    rolesId: props.usuario.rolesId ? [props.usuario.rolesId].flat() : []
});

console.log('Usuario inicial:', props.usuario);
console.log('localUsuario inicializado:', localUsuario.value);

const roles = ref([]);

const handleRolesChange = (event) => {
    console.log('Evento de cambio de roles:', event);
    
    // Si el nuevo valor está vacío, mantener el valor anterior
    if (!event.value || event.value.length === 0) {
        console.log('Intentando desmarcar todos los roles, manteniendo valor anterior');
        return;
    }
    
    // Actualizar el valor de rolesId
    localUsuario.value.rolesId = event.value;
    console.log('rolesId actualizado:', localUsuario.value.rolesId);
    
    // Actualizar el usuario y emitir la validación
    emit('update:usuario', localUsuario.value);
    validateFields();
};

// Validación de campos
function validateFields() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = localUsuario.value.correopersonal && emailRegex.test(localUsuario.value.correopersonal);
    const hasRoles = Array.isArray(localUsuario.value.rolesId) && localUsuario.value.rolesId.length > 0;
    
    console.log('Validando campos:');
    console.log('- rolesId:', localUsuario.value.rolesId);
    console.log('- hasRoles:', hasRoles);
    console.log('- isEmailValid:', isEmailValid);
    
    const isValid = !!(isEmailValid && hasRoles);
    console.log('isValid:', isValid);
    
    emit('validate', isValid);
}

// Actualizar localUsuario cuando cambie el prop usuario
watch(() => props.usuario, (nuevoUsuario) => {
    console.log('Nuevo usuario recibido:', nuevoUsuario);
    localUsuario.value = {
        ...nuevoUsuario,
        rolesId: nuevoUsuario.rolesId ? [nuevoUsuario.rolesId].flat() : []
    };
    console.log('localUsuario actualizado:', localUsuario.value);
}, { immediate: true });

onMounted(async () => {
    try {
        const response = await api.get('/rol');
        console.log('Roles cargados del API:', response.data);
        // Mapear a formato { id, name }
        roles.value = response.data.map(r => ({ 
            id: r.id, 
            name: r.nombre || r.name || r.descripcion 
        }));
        console.log('Roles mapeados:', roles.value);
        
        // Validar después de cargar los roles
        validateFields();
    } catch (error) {
        console.error('Error al cargar roles:', error);
        roles.value = [];
    }
});
</script>