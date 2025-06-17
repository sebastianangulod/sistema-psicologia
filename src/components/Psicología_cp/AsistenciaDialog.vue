<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import { computed, defineEmits, defineProps, ref, watch } from 'vue';
import api from '@/service/api';

const props = defineProps(['visible', 'usuario']);
const emit = defineEmits(['update:visible']);

const asistencias = ref([]);
const calendarValue = ref(new Date());
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dt = ref();

const cargarAsistencias = async () => {
    if (!props.usuario?.id) return;
    
    try {
        const response = await api.get(`/asistencias/usuario/${props.usuario.id}`);
        asistencias.value = response.data.content.map(asistencia => ({
            id: asistencia.id,
            fechaIngreso: new Date(asistencia.fechaIngreso),
            horaIngreso: asistencia.horaIngreso,
            estado: asistencia.estado
        }));
    } catch (error) {
        console.error('Error al cargar asistencias:', error);
    }
};

// Filtrar asistencias según la fecha seleccionada
const filteredAsistencias = computed(() => {
    if (!calendarValue.value) return asistencias.value;
    
    const selectedDate = calendarValue.value.toISOString().split('T')[0];
    return asistencias.value.filter(asistencia => {
        const asistenciaDate = asistencia.fechaIngreso.toISOString().split('T')[0];
        return asistenciaDate === selectedDate;
    });
});

watch(() => props.visible, (newValue) => {
    if (newValue) {
        cargarAsistencias();
    }
});

function exportCSV() {
    dt.value.exportCSV();
}

function close() {
    emit('update:visible', false);
}

function formatearHora(hora) {
    return `${hora.hour.toString().padStart(2, '0')}:${hora.minute.toString().padStart(2, '0')}`;
}
</script>

<template>
    <Dialog :visible="visible" :style="{ width: '1000px', height: '660px' }" header="Visualizar Asistencia" :modal="true" @update:visible="close">
        <div class="p-4 flex flex-col h-full">
            <!-- Primer cuadrante: Datos personales y roles (arriba) -->
            <div class="p-4 rounded-lg shadow-md mb-4 border-2">
                <h4 class="m-0 text-lg font-semibold">Datos:</h4>
                <div class="flex justify-between mt-2">
                    <div class="text-left">
                        <div class="flex items-center gap-4">
                            <label class="font-bold">Nombre:</label>
                            <span>{{ usuario?.nombreCompleto }}</span>
                        </div>
                        <div class="flex items-center gap-4 mt-2">
                            <label class="font-bold">Teléfono:</label>
                            <span>{{ usuario?.telefono }}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="font-bold">Estado:</label>
                        <span :class="['px-2 py-1 rounded', usuario?.estado ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
                            {{ usuario?.estado ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>
                </div>
            </div>
            <br>

            <!-- Segundo cuadrante: Toolbar con DatePicker (medio) -->
            <Toolbar class="mb-4 p-4 rounded-t-lg">
                <template #start>
                    <div class="flex items-center gap-2">
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" class="w-64" />
                    </div>
                </template>
                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV" />
                </template>
            </Toolbar>

            <br>
            <!-- Tercer cuadrante: Tabla (abajo) -->
            <div class="p-4 rounded-lg shadow-md overflow-auto flex-grow border-2">
                <DataTable
                    ref="dt"
                    :value="filteredAsistencias"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros"
                    class="centered-datatable rounded-b-lg"
                >
                    <Column field="id" sortable style="min-width: 6rem">
                        <template #header>
                            <div class="text-center w-full">N°</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ data.id }}</div>
                        </template>
                    </Column>
                    <Column field="fechaIngreso" sortable style="min-width: 12rem">
                        <template #header>
                            <div class="text-center w-full">Fecha</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ data.fechaIngreso.toLocaleDateString() }}</div>
                        </template>
                    </Column>
                    <Column field="horaIngreso" sortable style="min-width: 8rem">
                        <template #header>
                            <div class="text-center w-full">Hora</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">{{ formatearHora(data.horaIngreso) }}</div>
                        </template>
                    </Column>
                    <Column field="estado" sortable style="min-width: 12rem">
                        <template #header>
                            <div class="text-center w-full">Estado</div>
                        </template>
                        <template #body="{ data }">
                            <div class="text-center">
                                <div class="p-1 rounded w-28 mx-auto text-black" :class="{
                                    'bg-green-200': data.estado === 'PRESENTE',
                                    'bg-yellow-200': data.estado === 'TARDE',
                                    'bg-red-200': data.estado === 'FALTA'
                                }">
                                    {{ data.estado }}
                                </div>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
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