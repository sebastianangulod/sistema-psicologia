<script setup>
import CambiarEstadoDialog from '@/components/UsuarioCrud/CambiarEstadoDialog.vue';
import EditarUsuarioDialog from '@/components/UsuarioCrud/EditarUsuarioDialog.vue';
import RegistrarUsuarioDialog from '@/components/UsuarioCrud/RegistrarUsuarioDialog.vue';
import VisualizarUsuarioDialog from '@/components/UsuarioCrud/VisualizarUsuarioDialog.vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, onMounted } from 'vue';
import api from '@/service/api';

const usuarios = ref([]);
const dt = ref();
const registrarDialog = ref(false);
const editarDialog = ref(false);
const visualizarDialog = ref(false);
const cambiarEstadoDialog = ref(false);
const usuario = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const DIAS_VALIDOS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

const cargarUsuarios = async () => {
    try {
        const response = await api.get('/usuario');
        usuarios.value = response.data.content.map(user => ({
            id: user.id,
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            telefono: user.telefono,
            estado: user.estado
        }));
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

onMounted(() => {
    cargarUsuarios();
});

function openRegistrar() {
    usuario.value = {};
    registrarDialog.value = true;
}

async function openEditar(user) {
    try {
        const response = await api.get(`/usuario/${user.id}`);
        usuario.value = response.data;
        editarDialog.value = true;
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
    }
}

async function openVisualizar(user) {
    try {
        const response = await api.get(`/usuario/${user.id}`);
        usuario.value = response.data;
        visualizarDialog.value = true;
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
    }
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

async function confirmarCambioEstado(user) {
    try {
        const nuevoEstado = user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        const data = {
            id: user.id,
            nombre: user.nombreCompleto,
            estado: nuevoEstado
        };
        
        console.log('Enviando datos para cambio de estado:', data);
        const response = await api.put(`/usuario/estado/${user.id}`, data);
        
        if (response.status === 200) {
            // Actualizar el estado en la lista local
            const index = usuarios.value.findIndex(u => u.id === user.id);
            if (index !== -1) {
                usuarios.value[index].estado = nuevoEstado;
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        return false;
    }
}

function normalizarDia(dia) {
    return dia
        .toUpperCase()
        .normalize('NFD')
        .replace(/[0-\u036f]/g, '');
}

async function registrarUsuario(nuevoUsuario) {
    try {
        const rolesId = Array.isArray(nuevoUsuario.rolesid)
            ? nuevoUsuario.rolesid.map(rol => {
                if (typeof rol === 'object' && rol.id) {
                    return rol.id;
                }
                return Number(rol);
            })
            : [];

        const usuarioFormateado = {
            nombre: nuevoUsuario.nombre,
            apaterno: nuevoUsuario.apaterno,
            amaterno: nuevoUsuario.amaterno,
            tdocumento: nuevoUsuario.tdocumento?.name || nuevoUsuario.tdocumento,
            ndocumento: nuevoUsuario.ndocumento,
            telefono1: nuevoUsuario.telefono1,
            telefono2: nuevoUsuario.telefono2,
            correopersonal: nuevoUsuario.correopersonal,
            direccion: nuevoUsuario.direccion,
            lnacimiento: nuevoUsuario.lnacimiento,
            fnacimiento: nuevoUsuario.fnacimiento,
            correo: nuevoUsuario.correopersonal,
            contrasenia: nuevoUsuario.contrasenia,
            idRoles: rolesId,
            horarios: Object.entries(nuevoUsuario.horarios || {})
                .filter(([dia, valor]) =>
                    valor.hora && valor.minuto &&
                    DIAS_VALIDOS.includes(normalizarDia(dia))
                )
                .map(([dia, valor]) => ({
                    dias: normalizarDia(dia),
                    hora: {
                        hour: parseInt(valor.hora) || 0,
                        minute: parseInt(valor.minuto) || 0,
                        second: 0,
                        nano: 0
                    }
                }))
        };

        console.log('Roles antes de enviar:', rolesId);
        console.log('Usuario formateado completo:', usuarioFormateado);

        const response = await api.post('/usuario', usuarioFormateado);
        if (response.status === 200 || response.status === 201) {
            await cargarUsuarios();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return false;
    }
}

async function editarUsuario(usuarioEditado) {
    try {
        const usuarioFormateado = {
            id: usuarioEditado.id,
            telefono1: usuarioEditado.telefono1,
            telefono2: usuarioEditado.telefono2,
            correopersonal: usuarioEditado.correopersonal,
            direccion: usuarioEditado.direccion,
            rolesId: usuarioEditado.rolesId ? usuarioEditado.rolesId.map(rol => typeof rol === 'object' ? rol.id : rol) : [],
            horarios: usuarioEditado.horarios
        };

        console.log('Enviando datos para editar:', JSON.parse(JSON.stringify(usuarioFormateado)));
        await api.put('/usuario/actualizar', usuarioFormateado);
        await cargarUsuarios();
    } catch (error) {
        console.error('Error al editar usuario:', error);
    }
}
</script>

<template>
    <div class="p-4">
        <div class="card shadow-md rounded-lg">
            <Toolbar class="mb-4 p-4 bg-white rounded-t-lg">
                <template #start>
                    <Button label="Registrar" icon="pi pi-plus" class="bg-gray-100 text-gray-700 border border-blue-500 rounded-full hover:bg-gray-200 mr-2" @click="openRegistrar" />
                </template>
                <template #end>
                    <Button label="Exportar" icon="pi pi-upload" class="bg-gray-100 text-gray-700 border border-blue-500 rounded-full hover:bg-gray-200" @click="exportCSV($event)" />
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
                <Column field="nombreCompleto" header="Nombre Completo" sortable style="min-width: 15rem" class="text-center"></Column>
                <Column field="email" header="Email" sortable style="min-width: 15rem" class="text-center"></Column>
                <Column field="telefono" header="Teléfono" sortable style="min-width: 7rem" class="text-center"></Column>
                <Column header="Estado" sortable style="min-width: 3rem" class="text-center">
                    <template #body="slotProps">
                        <span :class="['inline-block px-2 py-1 rounded', slotProps.data.estado === 'ACTIVO' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
                            {{ slotProps.data.estado === 'ACTIVO' ? 'Activo' : 'Inactivo' }}
                        </span>
                    </template>
                </Column>
                <Column header="Acciones" :exportable="false" style="min-width: 11rem" class="text-center">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="openVisualizar(slotProps.data)" />
                        <Button icon="pi pi-sync" outlined rounded class="mr-2" :class="[slotProps.data.estado === 'ACTIVO' ? 'text-green-600' : 'text-red-600']" @click="openCambiarEstado(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined rounded @click="openEditar(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <RegistrarUsuarioDialog :visible="registrarDialog" @update:visible="registrarDialog = $event" @registrar="registrarUsuario" />
        <EditarUsuarioDialog :visible="editarDialog" :usuario="usuario" @update:visible="editarDialog = $event" @editar="editarUsuario" />
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