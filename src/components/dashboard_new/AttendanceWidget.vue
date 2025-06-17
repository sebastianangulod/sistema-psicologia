<script setup>
import { ref } from 'vue';

const products = ref([]); // Tabla vacía sin ProductService
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Asistencia del Día</div>
    <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
      <Column style="width: 15%" header="ID"></Column>
      <Column field="name" header="Nombre Completo" :sortable="true" style="width: 35%"></Column>
      <Column field="time" header="Hora de ingreso" :sortable="true" style="width: 35%"></Column>
      <Column field="status" header="Asistencia" style="width: 15%"></Column>
    </DataTable>
  </div>
</template>