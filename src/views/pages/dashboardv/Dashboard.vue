<script setup>
import AppointmentsWidget from '@/components/dashboard_new/AppointmentsWidget.vue';
import AttendanceWidget from '@/components/dashboard_new/AttendanceWidget.vue';
import RecentFormatsWidget from '@/components/dashboard_new/RecentFormatsWidget.vue';
import StatsWidget from '@/components/dashboard_new/StatsWidget.vue';
</script>

<template>
  <div class="grid grid-cols-12 gap-6 p-6 bg-gray-100 min-h-screen">
    <!-- Fila superior: Contenedores pequeños (StatsWidget) -->
    <div class="col-span-12">
      <StatsWidget />
    </div>

    <!-- Fila inferior: Tablas -->
    <div class="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sección izquierda: Tablas apiladas -->
      <div class="flex flex-col gap-6">
        <RecentFormatsWidget />
        <AppointmentsWidget />
      </div>

      <!-- Sección derecha: Tabla de Asistencia -->
      <div>
        <AttendanceWidget />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Igualar la altura de los contenedores pequeños dentro de StatsWidget */
:deep(.card) {
  height: 100%; /* Asegura que todos los contenedores tengan la misma altura */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Ajustar la altura de la sección derecha para que coincida con la izquierda */
.grid-cols-1 > div:last-child {
  height: 100%; /* Hace que el contenedor derecho ocupe toda la altura disponible */
}

:deep(.p-datatable) {
  flex-grow: 1; /* Permite que la tabla crezca para llenar el espacio */
}
</style>