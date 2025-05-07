<!--
  Menu.vue - Componente de Menú Lateral (Sidebar)
  
  Este componente implementa la navegación principal de la aplicación mediante un menú lateral
  que puede expandirse o colapsarse. El menú proporciona acceso a las diferentes secciones
  de la aplicación como la gestión de usuarios, envío de correos y mensajes WhatsApp.
  
  Características principales:
  - Diseño responsive que puede colapsarse para ocupar menos espacio
  - Iconos y etiquetas para cada elemento del menú
  - Sistema de navegación dinámica entre secciones
  - Estilizado con colores corporativos (#1a237e como color principal)
  - Indicador visual para el elemento actualmente seleccionado
  
  Este componente usa el sistema de componentes de PrimeVue para los elementos de UI 
  como Button y Dialog, manteniendo un diseño consistente a lo largo de la aplicación.
-->

<template>
    <div class="layout-wrapper">
      <!-- Menú Lateral -->
      <div class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
        <div class="sidebar-header">
          <span v-if="!collapsed" class="sidebar-title">Gestión</span>
          <Button icon="pi pi-bars" @click="toggleSidebar" class="p-button-text sidebar-toggle" />
        </div>
        <div class="sidebar-menu">
          <div 
            v-for="(item, index) in menuItems" 
            :key="index" 
            class="sidebar-item"
            :class="{ 'active': activeItem === item.id }"
            @click="selectMenuItem(item.id)">
            <i :class="item.icon"></i>
            <span v-if="!collapsed" class="sidebar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
  
      <!-- Contenido Principal -->
      <div class="main-content">
        <!-- Mostrar modales según la selección -->
        <Dialog v-model:visible="showModal" :header="modalTitle" :style="{ width: '50vw' }">
          <p>{{ modalContent }}</p>
        </Dialog>
  
        <!-- Área donde se mostrarán las vistas dinámicamente (comentado por ahora) -->
        <div class="content-area">
          <!-- 
          <component 
            :is="currentView" 
            v-if="currentView" 
          />
          -->
          <div v-if="activeItem === 'usuarios'" class="view-content">
            <div class="header-actions">
              <h1>Gestión de Usuarios</h1>
              <Button icon="pi pi-plus" label="Nuevo Usuario" class="p-button-primary" />
            </div>
            
            <DataTable :value="users" class="p-datatable-users">
              <Column field="id" header="ID"></Column>
              <Column field="nombre" header="NOMBRE COMPLETO"></Column>
              <Column field="correo" header="CORREO ELECTRÓNICO"></Column>
              <Column header="ACCIONES">
                <template #body>
                  <div class="action-buttons">
                    <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" />
                    <Button icon="pi pi-trash" class="p-button-text p-button-rounded p-button-danger" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
          <div v-else-if="activeItem === 'correo'" class="view-content">
            <h1>Enviar Correo</h1>
            <p>Esta vista permitirá enviar correos electrónicos.</p>
          </div>
          <div v-else-if="activeItem === 'whatsapp'" class="view-content">
            <h1>Enviar WhatsApp</h1>
            <p>Esta vista permitirá enviar mensajes de WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // import { defineComponent } from 'vue';
  // Importar componentes cuando se implemente la carga dinámica de vistas
  // import UsuariosView from './views/UsuariosView.vue';
  // import CorreoView from './views/CorreoView.vue';
  // import WhatsAppView from './views/WhatsAppView.vue';
  
  export default {
    name: 'SidebarMenu',
    data() {
      return {
        collapsed: false,
        activeItem: 'usuarios', // Selección inicial
        menuItems: [
          { id: 'usuarios', label: 'Usuarios', icon: 'pi pi-users' },
          { id: 'correo', label: 'Mandar Correo', icon: 'pi pi-envelope' },
          { id: 'whatsapp', label: 'Mandar Whatsapp', icon: 'pi pi-whatsapp' }
        ],
        showModal: false,
        modalTitle: '',
        modalContent: '',
        // Para la implementación futura con vistas dinámicas
        // currentView: null,
        // viewMap: {
        //   usuarios: UsuariosView,
        //   correo: CorreoView,
        //   whatsapp: WhatsAppView
        // },
        // Datos de ejemplo para la tabla
        users: [
          { id: '#1', nombre: 'Ana García', correo: 'ana@ejemplo.com' }
        ]
      };
    },
    methods: {
      toggleSidebar() {
        this.collapsed = !this.collapsed;
      },
      selectMenuItem(itemId) {
        this.activeItem = itemId;
        
        // Para la implementación modal (temporal)
        this.showModalForItem(itemId);
        
        // Para la implementación futura con vistas dinámicas
        // this.currentView = this.viewMap[itemId];
      },
      showModalForItem(itemId) {
        // Esta lógica se puede eliminar cuando se implementen las vistas reales
        const modalInfo = {
          usuarios: {
            title: 'Gestión de Usuarios',
            content: 'Aquí podrás administrar los usuarios del sistema.'
          },
          correo: {
            title: 'Enviar Correo',
            content: 'Desde aquí podrás enviar correos a los usuarios registrados.'
          },
          whatsapp: {
            title: 'Enviar WhatsApp',
            content: 'Envía mensajes de WhatsApp a los usuarios desde esta sección.'
          }
        };
        
        this.modalTitle = modalInfo[itemId].title;
        this.modalContent = modalInfo[itemId].content;
        this.showModal = true;
      }
    },
    mounted() {
      // Para la implementación futura con vistas dinámicas
      // this.currentView = this.viewMap[this.activeItem];
    }
  };
  </script>
  
  <style scoped>
  .layout-wrapper {
    display: flex;
    min-height: 100vh;
    background-color: #f0f0f0;
  }
  
  .sidebar {
    width: 250px;
    background-color: #1a237e;
    color: white;
    transition: width 0.3s;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-collapsed {
    width: 60px;
  }
  
  .sidebar-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .sidebar-title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .sidebar-toggle {
    color: white !important;
  }
  
  .sidebar-menu {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
  }
  
  .sidebar-item {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .sidebar-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .sidebar-item.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .sidebar-item i {
    font-size: 1.2rem;
    margin-right: 12px;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .content-area {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .view-content {
    width: 100%;
  }
  
  .p-datatable-users {
    margin-top: 20px;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  </style>