<template>
  <div class="container">
    <!-- Header y Botón Añadir -->
    <div class="header">
      <h1 class="title">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        Gestión de Usuarios
      </h1>
      <button @click="openAddModal" class="btn-add">
        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo Usuario
      </button>
    </div>

    <!-- Tabla 
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th class="th-cell">ID</th>
            <th class="th-cell">Nombre Completo</th>
            <th class="th-cell actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="tr-row">
            <td class="td-cell id-cell">#{{ user.id }}</td>
            <td class="td-cell">{{ user.nombre }}</td>
            <td class="td-cell actions">
              <div class="action-buttons">
                <button @click="openEditModal(user)" class="btn-edit" title="Editar">
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button @click="openDeleteModal(user.id)" class="btn-delete" title="Eliminar">
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="empty-message">
              No se encontraron usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>-->

    <!-- Tabla DataTable-->
    <DataTable :value="users" :paginator="true" :rows="10" v-if="users.length > 0">
  <Column field="id" header="ID" :sortable="true"></Column>
  <Column field="name" header="Nombre Completo" :sortable="true"></Column>
  <Column field="email" header="Correo Electrónico" :sortable="true"></Column>
  <Column field="phone" header="Teléfono" :sortable="true"></Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <div class="action-buttons">
        <button @click="openEditModal(slotProps.data)" class="btn-edit" title="Editar">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </button>
        <button @click="openDeleteModal(slotProps.data.id)" class="btn-delete" title="Eliminar">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </template>
  </Column>
</DataTable> 

    <!-- Modal de Crear/Editar -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-content">
          <h2 class="modal-title">
            {{ editMode ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
          <form @submit.prevent="saveUser" class="form">
            <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input 
                v-model="form.nombre" 
                type="text" 
                class="form-input" 
                placeholder="Juan Pérez"
                required
              >
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input" 
                placeholder="juan@ejemplo.com"
                required
              >
            </div>
            <div class="form-actions">
              <button 
                type="button" 
                @click="showModal = false" 
                class="btn-cancel"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn-save"
              >
                {{ editMode ? 'Guardar Cambios' : 'Crear Usuario' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminar -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
      <div class="modal delete-modal">
        <div class="modal-content">
          <h2 class="modal-title delete-title">
            <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Eliminar Usuario
          </h2>
          <p class="delete-message">
            ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
          </p>
          <div class="form-actions">
            <button 
              type="button" 
              @click="showDeleteModal = false" 
              class="btn-cancel"
            >
              Cancelar
            </button>
            <button 
              type="button"
              @click="confirmDelete" 
              class="btn-delete-confirm"
            >
              Eliminar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonaService from './src/service/PersonaService';

export default {
  name: 'CrudUsuarios',
  data() {
  return {
    users: [],           // Inicialmente vacío, se llenará con la API
    loading: false,      // Control de estado de carga
    error: null,         // Almacenar mensajes de error
    saving: false,       // Estado durante guardado
    deleting: false,     // Estado durante eliminación
    showModal: false,    // Control de visibilidad del modal
    showDeleteModal: false,
    userToDelete: null,
    form: {
      id: null,
      name: '',          // Cambiado de "nombre" a "name"
      password: '',      // Añadido campo password
      email: '',
      phone: ''          // Añadido campo phone
    },
    editMode: false,
    personaService: null
  }
},
  methods: {
    loadUsers() {
      this.loading = true;
      this.error = null;

      this.personaService.getAll()
        .then(response => {
          this.loading = false;
          console.log("Respuesta procesada:", response);
          
          if (response && response.data) {
            // Asegurarse de que users sea siempre un array
            this.users = Array.isArray(response.data) ? response.data : 
                         (response.data.content && Array.isArray(response.data.content)) ? response.data.content : 
                         [];
            
            console.log("Usuarios cargados:", this.users);
          } else {
            this.users = [];
            console.log("No se encontraron datos de usuarios");
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("Error al cargar usuarios:", error);
          this.error = "Error al cargar usuarios: " + (error.message || "Error desconocido");
          this.users = [];
        });
    },

    openAddModal() {
      this.form = { id: null, name: '', password: '', email: '', phone: '' };
      this.editMode = false;
      this.showModal = true;
    },

    openEditModal(user) {
      this.form = { ...user };
      this.editMode = true;
      this.showModal = true;
    },

    openDeleteModal(id) {
      this.userToDelete = id;
      this.showDeleteModal = true;
    },

    saveUser() {
      this.saving = true;

      if (this.editMode) {
        this.personaService.update(this.form.id, this.form)
          .then(response => {
            const index = this.users.findIndex(u => u.id === this.form.id);
            if (index !== -1) {
              this.users.splice(index, 1, response.data || this.form);
            }
            this.showModal = false;
          })
          .catch(error => {
            console.error("Error al actualizar usuario:", error);
            alert("Error al actualizar usuario: " + (error.message || "Error desconocido"));
          })
          .finally(() => {
            this.saving = false;
          });
      } else {
        this.personaService.create(this.form)
          .then(response => {
            this.users.push(response.data);
            this.showModal = false;
          })
          .catch(error => {
            console.error("Error al crear usuario:", error);
            alert("Error al crear usuario: " + (error.message || "Error desconocido"));
          })
          .finally(() => {
            this.saving = false;
          });
      }
    },

    confirmDelete() {
      this.deleting = true;

      this.personaService.delete(this.userToDelete)
        .then(() => {
          this.users = this.users.filter(user => user.id !== this.userToDelete);
          this.showDeleteModal = false;
          this.userToDelete = null;
        })
        .catch(error => {
          console.error("Error al eliminar usuario:", error);
          alert("Error al eliminar usuario: " + (error.message || "Error desconocido"));
        })
        .finally(() => {
          this.deleting = false;
        });
    }
  }
}
</script>

<style scoped>
:root {
  --custom-blue: #0b19aa;
  --custom-blue-hover: #091483;
  --white: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --red-50: #fef2f2;
  --red-600: #dc2626;
  --red-900: #7f1d1d;
  --blue-50: #eff6ff;
  --blue-900: #1e3a8a;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--gray-50);
  color: var(--gray-700);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .header {
    flex-direction: row;
  }
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0b19aa;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .title {
    margin-bottom: 0;
  }
}

.icon {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  display: inline-block;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.btn-add {
  background-color: #0b19aa;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  transition: background-color 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background-color: #091483;
}

.table-container {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-100);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.th-cell {
  padding: 16px 32px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #0b19aa;
  color: white;
}

.th-cell.actions {
  text-align: right;
}

.tr-row {
  transition: background-color 0.3s;
}

.tr-row:hover {
  background-color: var(--gray-50);
}

.td-cell {
  padding: 16px 32px;
  border-bottom: 1px solid var(--gray-200);
  vertical-align: middle; /* Alinea verticalmente el contenido */
}

/* Asegurar que cada columna tenga el mismo alineamiento que su encabezado */
.th-cell:nth-child(1), .td-cell:nth-child(1) {
  width: 10%;
  text-align: left;
}

.th-cell:nth-child(2), .td-cell:nth-child(2) {
  width: 35%;
  text-align: left;
}

.th-cell:nth-child(3), .td-cell:nth-child(3) {
  width: 35%;
  text-align: left;
}

.th-cell:nth-child(4), .td-cell:nth-child(4) {
  width: 20%;
  text-align: right;
}

.id-cell {
  font-family: monospace;
  color: var(--gray-600);
}

.email-cell {
  color: #0b19aa;
}

.td-cell.actions {
  white-space: nowrap;
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-edit {
  color: #0b19aa;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.btn-edit:hover {
  color: var(--blue-900);
  background-color: var(--blue-50);
}

.btn-delete {
  color: var(--red-600);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.btn-delete:hover {
  color: var(--red-900);
  background-color: var(--red-50);
}

.empty-message {
  text-align: center;
  padding: 24px;
  color: var(--gray-500);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.delete-modal {
  max-width: 450px;
}

.modal-content {
  padding: 32px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0b19aa;
  margin-bottom: 24px;
}

.delete-title {
  color: var(--red-600);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0b19aa;
}

.delete-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--red-600);
}

.delete-message {
  margin-bottom: 24px;
  color: var(--gray-700);
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #374151; /* Cambiado a un color más oscuro para mayor visibilidad */
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: white; /* Asegura que el fondo sea blanco */
}

.form-input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px #0b19aa;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background-color: transparent;
  color: var(--gray-600);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: var(--gray-50);
}

.btn-save {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: #0b19aa;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-save:hover {
  background-color: var(--blue-900);
}

.btn-delete-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background-color: #0b19aa;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

}

.btn-delete-confirm:hover {
  background-color: var(--red-900);
}
</style>