<template>
  <div class="p-4">
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(horario, idx) in usuario.horarios" :key="idx" class="flex items-center mb-2">
        <div class="text-lg font-medium w-32">{{ horario.dias }}:</div>
        <div class="text-lg text-gray-900">
          <span class="inline-block px-3 py-1 bg-gray-100 rounded-lg">
            {{ typeof horario.hora === 'string' ? horario.hora : (horario.hora.hour !== undefined ? (horario.hora.hour.toString().padStart(2, '0') + ':' + horario.hora.minute.toString().padStart(2, '0')) : horario.hora) }}
          </span>
        </div>
      </div>
      <div v-if="!usuario.horarios || usuario.horarios.length === 0" class="col-span-2 text-gray-500">Sin horarios asignados</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['usuario']);
</script>