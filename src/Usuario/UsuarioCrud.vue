<script setup>
import CambiarEstadoDialog from '@/components/UsuarioCrud/CambiarEstadoDialog.vue';
import EditarUsuarioDialog from '@/components/UsuarioCrud/EditarUsuarioDialog.vue';
import RegistrarUsuarioDialog from '@/components/UsuarioCrud/RegistrarUsuarioDialog.vue';
import VisualizarUsuarioDialog from '@/components/UsuarioCrud/VisualizarUsuarioDialog.vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref } from 'vue';

const usuarios = ref([
    {
        id: 1,
        nombre: "Juan",
        apaterno: "Pérez",
        amaterno: "Gómez",
        tdocumento: "DNI",
        ndocumento: "12345678",
        telefono1: "987654321",
        telefono2: "912345678",
        correopersonal: "juan.perez@example.com",
        direccion: "Av. Siempre Viva 123",
        rolesid: [{ id: 1, name: "Admin" }, { id: 2, name: "Editor" }],
        estado: true,
        horarios: {
            Lunes: { hora: '09', minuto: '00', segundo: '0', nano: '0' },
            Miércoles: { hora: '14', minuto: '30', segundo: '0', nano: '0' }
        }
    },
    {
        id: 2,
        nombre: "María",
        apaterno: "López",
        amaterno: "Rodríguez",
        tdocumento: "Pasaporte",
        ndocumento: "AB123456",
        telefono1: "976543210",
        telefono2: "",
        correopersonal: "maria.lopez@example.com",
        direccion: "Calle Falsa 456",
        rolesid: [{ id: 3, name: "Usuario" }],
        estado: false,
        horarios: {}
    },
    {
        id: 3,
        nombre: "Carlos",
        apaterno: "García",
        amaterno: "Mendoza",
        tdocumento: "DNI",
        ndocumento: "87654321",
        telefono1: "965432109",
        telefono2: "923456789",
        correopersonal: "carlos.garcia@example.com",
        direccion: "Jr. Los Olivos 789",
        rolesid: [{ id: 1, name: "Admin" }, { id: 3, name: "Usuario" }],
        estado: true,
        horarios: {
            Martes: { hora: '10', minuto: '15', segundo: '0', nano: '0' },
            Viernes: { hora: '16', minuto: '45', segundo: '0', nano: '0' }
        }
    }
]);

const dt = ref();
const registrarDialog = ref(false);
const editarDialog = ref(false);
const visualizarDialog = ref(false);
const cambiarEstadoDialog = ref(false);
const usuario = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function openRegistrar() {
    usuario.value = {};
    registrarDialog.value = true;
}

function openEditar(user) {
    usuario.value = { ...user };
    editarDialog.value = true;
}

function openVisualizar(user) {
    usuario.value = { ...user };
    visualizarDialog.value = true;
}

function openCambiarEstado(user) {
    usuario.value = { ...user };
    cambiarEstadoDialog.value = true;
}

function toggleEstado(user) {
    openCambiarEstado(user);
}

function exportCSV() {
    dt.value.exportCSV();
}

function getNombreCompleto(user) {
    return `${user.nombre} ${user.apaterno} ${user.amaterno}`;
}

function confirmarCambioEstado(user) {
    user.estado = !user.estado;
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
                class="rounded-b-lg overflow-hidden"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between p-4">
                        <h4 class="m-0 text-lg font-semibold">Gestion de Usuarios</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar usuario..." class="border rounded-md p-2 border-blue-500" />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Id" sortable style="min-width: 3rem" class="text-center"></Column>
                <Column header="Nombre Completo" sortable style="min-width: 15rem" class="text-center">
                    <template #body="slotProps">
                        {{ getNombreCompleto(slotProps.data) }}
                    </template>
                </Column>
                <Column field="correopersonal" header="Email" sortable style="min-width: 15rem" class="text-center"></Column>
                <Column field="telefono1" header="Teléfono" sortable style="min-width: 7rem" class="text-center"></Column>
                <Column header="Estado" sortable style="min-width: 3rem" class="text-center">
                    <template #body="slotProps">
                        <span :class="['inline-block px-2 py-1 rounded', slotProps.data.estado ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
                            {{ slotProps.data.estado ? 'Activo' : 'Inactivo' }}
                        </span>
                    </template>
                </Column>
                <Column header="Acciones" :exportable="false" style="min-width: 11rem" class="text-center">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" rounded class="mr-2" @click="openVisualizar(slotProps.data)" />
                        <Button icon="pi pi-sync" severity="contrast" rounded class="mr-2" :class="[slotProps.data.estado ? 'text-green-600' : 'text-red-600']" @click="openCambiarEstado(slotProps.data)" />
                        <Button icon="pi pi-pencil" severity="warn" rounded @click="openEditar(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <RegistrarUsuarioDialog :visible="registrarDialog" @update:visible="registrarDialog = $event" />
        <EditarUsuarioDialog :visible="editarDialog" :usuario="usuario" @update:visible="editarDialog = $event" />
        <VisualizarUsuarioDialog :visible="visualizarDialog" :usuario="usuario" @update:visible="visualizarDialog = $event" />
        <CambiarEstadoDialog :visible="cambiarEstadoDialog" :usuario="usuario" @update:visible="cambiarEstadoDialog = $event" @confirmar-cambio="confirmarCambioEstado" />
    </div>
</template>

<style scoped>
.card {
    border: 1px solid #e5e7eb;
}

.p-datatable .p-datatable-thead > tr > th {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
    font-weight: 600;
    text-align: center;
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: center;
}

.p-paginator {
    background: #f9fafb;
    padding: 0.5rem 1rem;
    border-top: 1px solid #e5e7eb;
}
</style>