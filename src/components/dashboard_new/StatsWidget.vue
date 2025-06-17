<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Practicantes Registrados -->
    <div class="card p-4 bg-white dark:bg-surface-900 shadow rounded-lg">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">Practicantes Registrados</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">50</div>
        </div>
        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full" style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-users text-blue-500 text-xl"></i>
        </div>
      </div>
      <span class="text-primary font-medium">24 practicantes </span>
      <span class="text-muted-color">conectados</span>
    </div>

    <!-- Total de Formatos Recibidos -->
    <div class="card p-4 bg-white dark:bg-surface-900 shadow rounded-lg">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">Total de Formatos Recibidos</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">230</div>
        </div>
        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full" style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-file text-orange-500 text-xl"></i>
        </div>
      </div>
      <span class="text-primary font-medium">20 formatos </span>
      <span class="text-muted-color">pendientes</span>
    </div>

    <!-- Asistencia del Día -->
    <div class="card p-4 bg-white dark:bg-surface-900 shadow rounded-lg">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">Asistencia del Día</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">30</div>
        </div>
        <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full" style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-calendar text-cyan-500 text-xl"></i>
        </div>
      </div>
      <span class="text-primary font-medium">10 usuarios </span>
      <span class="text-muted-color">fueron ingresados</span>
    </div>
  </div>
</template>