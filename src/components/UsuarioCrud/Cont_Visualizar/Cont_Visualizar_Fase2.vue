<template>
    <div class="p-4 grid grid-cols-2 gap-4">
        <div><strong class="text-lg ">Contraseña:</strong></div>
        <div class="text-lg text-gray-900">{{ usuario.usuario }}</div>
        <div><strong class="text-lg ">Roles:</strong></div>
        <div class="text-lg text-gray-900">
            <span v-for="(roleId, index) in usuario.rolesId" :key="index" class="inline-block px-2 py-1 bg-gray-200 rounded mr-1">{{ getRoleName(roleId) }}{{ index < usuario.rolesId.length - 1 ? '' : '' }}</span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import api from '@/service/api';

const props = defineProps(['usuario']);
const roles = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('/rol');
    roles.value = response.data;
  } catch (error) {
    roles.value = [];
  }
});

function getRoleName(id) {
  const rol = roles.value.find(r => r.id === id);
  return rol ? rol.nombre || rol.name || rol.descripcion : id;
}
</script>