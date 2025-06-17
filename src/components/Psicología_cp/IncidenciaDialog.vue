<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import { ref, defineEmits, defineProps, watch } from 'vue';
import DetalleIncidencia from './Administrar_Incidencia/Detalle_Incidencia.vue';
import api from '@/service/api';

const props = defineProps(['visible', 'usuario']);
const emit = defineEmits(['update:visible']);

const sucesos = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dt = ref();
const detailDialogs = ref({});
const detalleSucesos = ref({});

const cargarSucesos = async () => {
    if (!props.usuario?.id) return;
    try {
        const response = await api.get(`/sucesos/alumnos/${props.usuario.id}`);
        sucesos.value = response.data.content || [];
    } catch (error) {
        console.error('Error al cargar sucesos:', error);
    }
};

const openDetailDialog = async (sucesoId) => {
    try {
        const response = await api.get(`/sucesos/${sucesoId}`);
        let detalle = null;
        if (response.data.content && Array.isArray(response.data.content)) {
            detalle = response.data.content[0];
        } else if (response.data && typeof response.data === 'object') {
            detalle = response.data;
        }
        console.log('Detalle obtenido para suceso', sucesoId, ':', detalle);
        if (detalle) {
            detalleSucesos.value[sucesoId] = detalle;
            detailDialogs.value[sucesoId] = true;
        }
    } catch (error) {
        console.error('Error al cargar detalle del suceso:', error);
    }
};

const closeDetailDialog = (sucesoId) => {
    detailDialogs.value[sucesoId] = false;
};

watch(() => props.visible, (newValue) => {
    if (newValue) {
        cargarSucesos();
    }
});

function exportCSV() {
    dt.value.exportCSV();
}

function close() {
    emit('update:visible', false);
}
</script>

<template>
    <Dialog :visible="visible" :style="{ width: '700px', height: '700px' }" :header="'Incidencias del Alumno ' + (usuario?.nombreCompleto || '')" :modal="true" @update:visible="close">
        <div class="p-4">
            <Toolbar class="mb-4 p-4 bg-white rounded-t-lg">
                <template #start>
                    <div class="flex items-center gap-2">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters.global.value" placeholder="Buscar Incidente..." class="border rounded-md p-2 border-blue-500" />
                        </IconField>
                    </div>
                </template>
                <template #end>
                    <Button icon="pi pi-download" severity="help" @click="exportCSV" />
                </template>
            </Toolbar>
            <div class="p-4 rounded-lg shadow-md border-2 border-gray-300">
                <DataTable
                    ref="dt"
                    :value="sucesos"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} sucesos"
                    class="centered-datatable rounded-b-lg overflow-hidden"
                >
                    <Column field="id" sortable style="min-width: 6rem">
                        <template #header>
                            <div class="text-center w-full">N°</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ data.id }}</div>
                        </template>
                    </Column>
                    <Column field="nombre" sortable style="min-width: 15rem">
                        <template #header>
                            <div class="text-center w-full">Nombre</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ data.nombre }}</div>
                        </template>
                    </Column>
                    <Column field="fecha" sortable style="min-width: 12rem">
                        <template #header>
                            <div class="text-center w-full">Fecha</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ data.fecha ? (new Date(data.fecha)).toLocaleDateString() : '' }}</div>
                        </template>
                    </Column>
                    <Column field="nivel" sortable style="min-width: 10rem">
                        <template #header>
                            <div class="text-center w-full">Nivel</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">
                                <div class="p-1 rounded w-28 mx-auto text-black" :class="{
                                    'bg-red-200': data.nivel === 'ALTA',
                                    'bg-yellow-200': data.nivel === 'MEDIA',
                                    'bg-green-200': data.nivel === 'BAJA'
                                }">
                                    {{ data.nivel }}
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width: 8rem">
                        <template #header>
                            <div class="text-center w-full">Acciones</div>
                        </template>
                        <template #body="{ data }">
                            <div class="flex justify-center">
                                <Button icon="pi pi-info-circle" rounded class="mr-2" @click="openDetailDialog(data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <DetalleIncidencia
            v-for="suceso in sucesos"
            :key="suceso.id"
            :visible="detailDialogs[suceso.id] || false"
            :incidencia="detalleSucesos[suceso.id]"
            @update:visible="closeDetailDialog(suceso.id)"
        />
    </Dialog>
</template>

<style scoped>
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