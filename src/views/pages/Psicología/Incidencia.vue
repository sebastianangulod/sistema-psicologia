<script setup>
import Registrar_Incidencia from '../../../components/Psicología_cp/Administrar_Incidencia/Registrar_Incidencia.vue';
import IncidenciaDialog from '../../../components/Psicología_cp/IncidenciaDialog.vue';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { ref, onMounted } from 'vue';
import api from '@/service/api';

const usuarios = ref([]);
const dialogVisible = ref(false);
const registrarDialogVisible = ref(false);
const selectedUsuario = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dt = ref();

const cargarUsuarios = async () => {
    try {
        const response = await api.get('/sucesos/alumnos');
        const lista = response.data.content || [];
        console.log('Lista recibida:', lista);
        usuarios.value = lista.map(alumno => ({
            id: alumno.id,
            nombreCompleto: alumno.nombrecompleto,
            telefonoApoderado1: alumno.telefono || 'No registrado',
            telefonoApoderado2: alumno.telefono2 || 'No registrado',
            grado: alumno.nivelseccion || 'No registrado'
        }));
        console.log('Usuarios mapeados:', usuarios.value);
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
    }
};

onMounted(() => {
    cargarUsuarios();
});

function openVisualizar(user) {
    selectedUsuario.value = user;
    dialogVisible.value = true;
}

function openRegistrar() {
    registrarDialogVisible.value = true;
}

function exportCSV() {
    dt.value.exportCSV();
}

async function registrarIncidencia(incidenciaData) {
    try {
        const response = await api.post('/asistencias', {
            fechaIngreso: incidenciaData.fecha,
            horaIngreso: {
                hour: incidenciaData.hora.getHours(),
                minute: incidenciaData.hora.getMinutes(),
                second: 0,
                nano: 0
            },
            estado: incidenciaData.estado
        });
        
        if (response.status === 200 || response.status === 201) {
            registrarDialogVisible.value = false;
            // Recargar datos si es necesario
        }
    } catch (error) {
        console.error('Error al registrar incidencia:', error);
    }
}
</script>

<template>
    <div class="p-4">
        <div class="card shadow-md rounded-lg">
            <Toolbar class="mb-4 p-4 bg-white rounded-t-lg">
                <template #start>
                    <Button label="Registrar" icon="pi pi-plus" severity="success" class="mr-2" @click="openRegistrar" />
                </template>
                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                :value="usuarios"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios"
                class="centered-datatable rounded-b-lg overflow-hidden"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between p-4">
                        <h6 class="m-1 text-lg font-semibold">Incidencias</h6>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar Nombres..." class="border rounded-md p-2 border-blue-500" />
                        </IconField>
                    </div>
                </template>
                <Column field="id" sortable style="min-width: 6rem">
                    <template #header>
                        <div class="text-center w-full">N°</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.id }}</div>
                    </template>
                </Column>
                <Column field="nombreCompleto" sortable style="min-width: 15rem">
                    <template #header>
                        <div class="text-center w-full">Nombre Completo</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.nombreCompleto }}</div>
                    </template>
                </Column>
                <Column field="grado" sortable style="min-width: 12rem">
                    <template #header>
                        <div class="text-center w-full">Grado</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.grado }}</div>
                    </template>
                </Column>
                <Column field="telefonoApoderado1" sortable style="min-width: 12rem">
                    <template #header>
                        <div class="text-center w-full">Teléfono Apoderado 1</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.telefonoApoderado1 }}</div>
                    </template>
                </Column>
                <Column field="telefonoApoderado2" sortable style="min-width: 12rem">
                    <template #header>
                        <div class="text-center w-full">Teléfono Apoderado 2</div>
                    </template>
                    <template #body="{ data }">
                        <div class="text-center">{{ data.telefonoApoderado2 }}</div>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #header>
                        <div class="text-center w-full">Acciones</div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Button icon="pi pi-eye" rounded @click="openVisualizar(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <IncidenciaDialog 
            :visible="dialogVisible" 
            :usuario="selectedUsuario" 
            @update:visible="dialogVisible = $event" 
        />
        <Registrar_Incidencia
            :visible="registrarDialogVisible"
            :allAlumnos="usuarios"
            @update:visible="registrarDialogVisible = $event"
            @registrarIncidencia="registrarIncidencia"
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
</style>