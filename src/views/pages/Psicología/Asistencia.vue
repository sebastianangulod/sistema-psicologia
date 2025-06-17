<script setup>
import AsistenciaDialog from '@/components/Psicología_cp/AsistenciaDialog.vue';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { ref, onMounted } from 'vue';
import api from '@/service/api';

const usuarios = ref([]);
const dialogVisible = ref(false);
const selectedUsuario = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dt = ref();

const cargarUsuarios = async () => {
    try {
        const response = await api.get('/usuario');
        usuarios.value = response.data.content.map(user => ({
            id: user.id,
            nombreCompleto: user.nombreCompleto,
            telefono: user.telefono,
            estado: user.estado === 'ACTIVO'
        }));
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

onMounted(() => {
    cargarUsuarios();
});

function openVisualizar(user) {
    selectedUsuario.value = user;
    dialogVisible.value = true;
}
</script>

<template>
    <div class="p-4">
        <div class="card shadow-md rounded-lg">
            <DataTable
                ref="dt"
                :value="usuarios"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} practicantes"
                class="centered-datatable rounded-b-lg overflow-hidden"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between p-4">
                        <h4 class="m-0 text-lg font-semibold">Asistencia de practicantes</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar practicante..." class="border rounded-md p-2 border-blue-500" />
                        </IconField>
                    </div>
                </template>
                <Column field="id" sortable style="min-width: 2rem">
                    <template #header>
                        <div class="text-center w-full">N°</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.id }}</div>
                    </template>
                </Column>
                <Column field="nombreCompleto" sortable style="min-width: 10rem">
                    <template #header>
                        <div class="text-center w-full">Nombre Completo</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.nombreCompleto }}</div>
                    </template>
                </Column>
                <Column field="telefono" sortable style="min-width: 5rem">
                    <template #header>
                        <div class="text-center w-full">Teléfono</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.telefono }}</div>
                    </template>
                </Column>
                <Column field="estado" sortable style="min-width: 7rem">
                    <template #header>
                        <div class="text-center w-full">Estado</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">
                            <span :class="['inline-block px-2 py-1 rounded', data.estado ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
                                {{ data.estado ? 'Activo' : 'Inactivo' }}
                            </span>
                        </div>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #header>
                        <div class="text-center w-full">Acción</div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="openVisualizar(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <AsistenciaDialog 
            :visible="dialogVisible" 
            :usuario="selectedUsuario" 
            @update:visible="dialogVisible = $event" 
        />
    </div>
</template>

<style scoped>
.card {
    border: 1px solid #e5e7eb;
}

/* Centrado completo de la tabla */
:deep(.centered-datatable .p-datatable-thead > tr > th) {
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    transition: background-color 0.2s ease;
}

:deep(.centered-datatable .p-datatable-tbody > tr > td) {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: center;
    vertical-align: middle;
}

:deep(.centered-datatable .p-column-header-content) {
    justify-content: center !important;
    width: 100%;
    display: flex;
}

:deep(.centered-datatable .p-sortable-column-icon) {
    margin-left: 0.5rem;
}

.p-paginator {
    background: #f9fafb;
    padding: 0.5rem 1rem;
    border-top: 1px solid #e5e7eb;
}

/* Centrar paginación */
:deep(.p-paginator) {
    display: flex;
    justify-content: center;
}

/* Botón con icono del ojo (Visualizar, Fondo Azul) en Asistencia.vue */
.p-button.p-button-outlined.p-button-rounded:has(.pi-eye) {
    background-color: #3B82F6 !important; /* Azul brillante */
    border-color: #3B82F6 !important;
    color: #ffffff !important; /* Icono blanco para contraste */
    border-radius: 9999px; /* Mantener rounded */
    transition: background-color 0.2s, transform 0.1s;
}
.p-button.p-button-outlined.p-button-rounded:has(.pi-eye):hover {
    background-color: #2563EB !important; /* Azul más oscuro al hover */
    border-color: #2563EB !important;
    transform: scale(1.05);
}


</style>