// Importa createRouter y createWebHistory de vue-router para Vue 3
import { createRouter, createWebHistory } from 'vue-router'

// Importa los componentes que realmente existen
import Login from '../components/LoginCRUD.vue'
import UserCRUD from '../components/UserCRUD.vue'
import Menu from '../components/Menu.vue'
import EnvioMensajes from '../components/EnvioMensajes.vue'

// Define las rutas de la aplicación con los componentes correctos
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/user',
    name: 'UserCRUD',
    component: UserCRUD,
    meta: { requiresAuth: true }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
    meta: { requiresAuth: true }
  },
  {
    path: '/mensajes',
    name: 'EnvioMensajes',
    component: EnvioMensajes,
    meta: { requiresAuth: true }
  }
]

// Crea la instancia del enrutador con las rutas definidas usando la API de Vue 3
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guarda de navegación para autenticación
router.beforeEach((to, from, next) => {
  console.log('Navegando a:', to.path)
  console.log('Token existente:', localStorage.getItem('token'))
  
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No hay token, redirigiendo a login')
      next('/')
    } else {
      console.log('Token encontrado, permitiendo navegación')
      next()
    }
  } else {
    next()
  }
})

export default router