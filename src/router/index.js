// Importa Vue y Vue Router para la configuración de navegación
import Vue from 'vue'
import VueRouter from 'vue-router'

// Importa los componentes que serán utilizados en las rutas
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import UserManagement from '../views/UserManagement.vue'
// Otros componentes importados...

// Registra el plugin de Router en Vue
Vue.use(VueRouter)

// Define las rutas de la aplicación
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/usuarios',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  }
  // Otras rutas definidas...
]

// Crea la instancia del enrutador con las rutas definidas
const router = new VueRouter({
  mode: 'history', // Usa el modo historia de HTML5 para URLs limpias
  base: process.env.BASE_URL,
  routes
})

// Añade logs para debugging
router.beforeEach((to, from, next) => {
  console.log('Navegando a:', to.path)
  console.log('Token existente:', localStorage.getItem('token'))
  
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    // Verifica si el usuario tiene un token de autenticación válido
    if (!token) {
      // Si no existe un token, registra el evento y redirige al usuario a la página de inicio (login)
      console.log('No hay token, redirigiendo a login')
      next('/')
    } else {
      // Si el token existe, permite continuar con la navegación a la ruta solicitada
      console.log('Token encontrado, permitiendo navegación')
      next()
    }
  } else {
    // Si la ruta no requiere autenticación, permite la navegación sin verificar el token
    next()
  }
})

// Exporta el enrutador configurado para que pueda ser utilizado en la aplicación
export default router