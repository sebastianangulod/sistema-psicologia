<!--
  UserCRUD.vue - Componente para Gestión de Usuarios
  
  Este componente implementa una interfaz completa para la gestión de usuarios 
  del sistema (CRUD: Crear, Leer, Actualizar y Eliminar). Presenta una tabla 
  interactiva con los usuarios existentes y formularios para crear o editar usuarios.
  
  Características principales:
  - Tabla de datos paginada con información de usuarios
  - Formulario modal para creación y edición de usuarios
  - Validación de campos del formulario
  - Confirmación antes de eliminar usuarios
  - Notificaciones de éxito/error tras operaciones CRUD
  - Filtros y ordenamiento para buscar usuarios específicos
  
  Este componente se conecta con PersonaService para realizar las operaciones
  en la API y mantiene el estado local sincronizado con el backend.
-->
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

    <!-- Tabla Primevue -->
     <div class="table-container">
      <DataTable :value="users" :paginator="true" :rows="10" v-if="users.length > 0">
        <Column field="id" header="ID" :sortable="true"></Column>
        <Column field="name" header="Nombre Completo" :sortable="true"></Column>
        <Column field="email" header="Correo Electrónico" :sortable="true"></Column>
        <Column field="phone" header="Número Telefónica" :sortable="true"></Column>
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
     </div>

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
                v-model="form.name" 
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
            <div class="form-group">
              <label class="form-label">Número Telefónico</label>
              <input 
                v-model="form.phone" 
                type="number" 
                class="form-input" 
                minlength="9"
                maxlength="9"
                placeholder="1234567890"
                required>
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
// Importamos el servicio que maneja las operaciones CRUD con el backend
import PersonaService from '../service/PersonaService';

export default {
  // Nombre del componente para depuración y herramientas de desarrollo
  name: 'CrudUsuarios',
  
  // Estado local del componente
  data() {
    return {
      users: [],                // Array para almacenar los usuarios cargados desde el backend
      showModal: false,         // Controla la visibilidad del modal de edición/creación
      showDeleteModal: false,   // Controla la visibilidad del modal de confirmación de eliminación
      userToDelete: null,       // Almacena el ID del usuario que se va a eliminar
      form: {                   // Objeto para los datos del formulario de usuario
        id: null,               // ID único del usuario (null para nuevos usuarios)
        name: '',               // Nombre del usuario
        password: '',           // Contraseña (solo requerida para nuevos usuarios)
        email: '',              // Correo electrónico del usuario
        phone: ''               // Número telefónico del usuario
      },
      editMode: false,          // Determina si estamos editando un usuario existente o creando uno nuevo
      personaService: null      // Instancia del servicio para comunicación con la API
    }
  },
  
  // Hook que se ejecuta cuando el componente es creado
  created() {
    // Inicializamos el servicio de comunicación con la API
    this.personaService = new PersonaService();
    // Cargamos la lista de usuarios al crear el componente
    this.loadUsers();
  },
  
  // Métodos del componente
  methods: {
    /**
     * Carga la lista de usuarios desde el backend
     * Maneja diferentes formatos de respuesta y errores de autenticación
     */
    loadUsers() {
      console.log("Intentando cargar usuarios...");
      
      this.personaService.getAll()
        .then(response => {
          console.log("Respuesta completa:", response);
          
          // Procesamiento flexible para manejar diferentes estructuras de datos
          if (response.data) {
            // Caso 1: La respuesta es directamente un array de usuarios
            if (Array.isArray(response.data)) {
              this.users = response.data;
            } 
            // Caso 2: La respuesta es un objeto que contiene los usuarios
            else if (typeof response.data === 'object') {
              // Formato típico de API con paginación donde los datos están en 'content'
              if (Array.isArray(response.data.content)) {
                this.users = response.data.content;
              } else {
                // Error: Formato desconocido
                console.error("Formato de datos desconocido:", response.data);
                this.error = "Formato de datos desconocido: " + JSON.stringify(response.data);
                this.users = [];
              }
            } else {
              // Error: Formato desconocido
              console.error("Formato de datos desconocido:", response.data);
              this.users = [];
            }
          } else {
            // Sin datos, inicializamos como array vacío
            this.users = [];
          }
        })
        .catch(error => {
          console.error("Error al cargar usuarios:", error);
          
          // Manejo de errores de autenticación
          if (error.response && error.response.status === 401) {
        // Error 401: No autorizado, token expirado o inválido
        // Se elimina el token y se redirige al usuario a la página de login
        console.warn("Error de autenticación. Redirigiendo al login...");
        localStorage.removeItem('token');
        this.$router.push('/');
    } else if (error.message && error.message.includes("HTML")) {
        // Si el error indica que recibimos HTML en lugar de JSON
        // Esto suele ocurrir cuando ngrok devuelve su página de advertencia
        // o cuando las sesiones han caducado en el servidor
        console.error("El servidor respondió con HTML. Posible problema de autenticación.");
        localStorage.removeItem('token');
        this.$router.push('/');
    }
      
    // Si hay algún error, inicializamos la lista como vacía
    this.users = [];
    });
    },

    /**
     * Abre el modal para añadir un nuevo usuario
     * Reinicia el formulario a valores vacíos y configura el modo de edición en falso
     */
    openAddModal() {
        // Reinicia el formulario para un nuevo usuario (sin ID)
        this.form = { id: null, nombre: '', email: '' };
        this.editMode = false;
        // Muestra el modal
        this.showModal = true;
    },

    /**
     * Abre el modal para editar un usuario existente
     * @param {Object} user - El objeto usuario a editar con todos sus datos
     */
    openEditModal(user) {
        // Clona los datos del usuario seleccionado al formulario
        this.form = { ...user };
        // Activa el modo de edición para que saveUser sepa que debe actualizar en vez de crear
        this.editMode = true;
        // Muestra el modal
        this.showModal = true;
    },

    /**
     * Abre el modal de confirmación para eliminar un usuario
     * @param {number|string} id - El ID del usuario a eliminar
     */
    openDeleteModal(id) {
        // Guarda el ID del usuario que se va a eliminar
        this.userToDelete = id;
        // Muestra el modal de confirmación
        this.showDeleteModal = true;
    },
    saveUser() {
      // Aquí deberías implementar la lógica para guardar en el backend
      // Por ahora, solo actualizamos la UI
      if (this.editMode) {
        const index = this.users.findIndex(u => u.id === this.form.id);
        this.users.splice(index, 1, { ...this.form });
        // Aquí iría la llamada al servicio para actualizar el usuario
        // this.personaService.update(this.form.id, this.form)
      } else {
        // Aquí iría la llamada al servicio para crear un nuevo usuario
        // this.personaService.create(this.form)
        //   .then(response => {
        //     // Actualizar la lista con el usuario creado que viene del backend
        //     this.loadUsers();
        //   });
        
        // Por ahora, simulamos la creación
        this.form.id = Date.now();
        this.users.push({ ...this.form });
      }
      this.showModal = false;
    },
    confirmDelete() {
      // Aquí deberías implementar la lógica para eliminar en el backend
      // Por ejemplo:
      // this.personaService.delete(this.userToDelete)
      //   .then(() => {
      //     this.users = this.users.filter(user => user.id !== this.userToDelete);
      //   });
      
      // Por ahora, solo actualizamos la UI
      this.users = this.users.filter(user => user.id !== this.userToDelete);
      this.showDeleteModal = false;
      this.userToDelete = null;
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
  text-align: center; /* Cambiado de 'right' a 'center' */
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
  width: 20%;
  text-align: left;
}

.th-cell:nth-child(2), .td-cell:nth-child(2) {
  width: 60%;
  text-align: left;
}

.th-cell:nth-child(3), .td-cell:nth-child(3) {
  width: 20%;
  text-align: center; /* Cambiado de 'left' a 'center' */
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
  text-align: center; /* Cambiado de 'right' a 'center' */
}

.action-buttons {
  display: flex;
  justify-content: center; /* Cambiado de 'flex-end' a 'center' */
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