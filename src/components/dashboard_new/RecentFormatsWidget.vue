<script setup>
import { ref } from 'vue';

const products = ref([]); // Tabla vacía sin ProductService

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Últimos formatos Recibidos</div>
    <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
      <Column style="width: 15%" header="ID"></Column>
      <Column field="author" header="Autor" :sortable="true" style="width: 35%"></Column>
      <Column field="title" header="Título" :sortable="true" style="width: 35%"></Column>
      <Column field="status" header="Estado" style="width: 15%"></Column>
    </DataTable>
  </div>
</template>