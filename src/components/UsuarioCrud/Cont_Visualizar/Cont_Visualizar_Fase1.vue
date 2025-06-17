<template>
    <div class="p-4 grid grid-cols-2 gap-4">
        <div><strong class="text-lg">Nombre:</strong></div>
        <div class="text-lg ">{{ usuario.nombre }}</div>
        <div><strong class="text-lg ">Apellido Paterno:</strong></div>
        <div class="text-lg ">{{ usuario.apaterno }}</div>
        <div><strong class="text-lg ">Apellido Materno:</strong></div>
        <div class="text-lg ">{{ usuario.amaterno }}</div>
        <div><strong class="text-lg ">Tipo Documento:</strong></div>
        <div class="text-lg ">{{ usuario.tdocumento || 'N/A' }}</div>
        <div><strong class="text-lg ">N° Documento:</strong></div>
        <div class="text-lg ">{{ usuario.ndocumento }}</div>
        <div><strong class="text-lg ">Teléfono 1:</strong></div>
        <div class="text-lg ">{{ usuario.telefono1 }}</div>
        <div><strong class="text-lg ">Teléfono 2:</strong></div>
        <div class="text-lg ">{{ usuario.telefono2 }}</div>
        <div><strong class="text-lg ">Dirección:</strong></div>
        <div class="text-lg ">{{ usuario.direccion }}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['usuario']);
</script>