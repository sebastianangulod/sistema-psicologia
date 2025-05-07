/**
 * main.js - Archivo principal de inicialización de la aplicación
 * 
 * Este archivo es el punto de entrada principal de la aplicación Vue.js. 
 * Se encarga de:
 * - Crear la instancia principal de la aplicación
 * - Configurar los plugins necesarios (PrimeVue, Router)
 * - Registrar componentes globales para su uso en toda la aplicación
 * 
 * Las directivas eslint-disable/enable se utilizan para deshabilitar temporalmente 
 * la regla de nombres de componentes multi-palabra. Esta regla recomienda que los 
 * componentes tengan nombres compuestos (ej: UserTable en lugar de Table) para 
 * evitar conflictos con elementos HTML actuales o futuros. Para componentes como
 * Column, Button y Dialog, deshabilitamos esta regla ya que son componentes de PrimeVue
 * con nombres de una sola palabra.
 */

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
/* eslint-disable vue/multi-word-component-names */
import Column from 'primevue/column'

import Button from 'primevue/button';

import Dialog from 'primevue/dialog';
/* eslint-enable vue/multi-word-component-names */
import router from './router'
const app = createApp(App)

app.use(PrimeVue)
app.use(router)

app.component('DataTable', DataTable)
/* eslint-disable vue/multi-word-component-names */
app.component('Column', Column) 

app.component('Button', Button)

app.component('Dialog', Dialog)
/* eslint-enable vue/multi-word-component-names */
app.mount('#app')
