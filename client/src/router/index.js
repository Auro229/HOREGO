import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Trips from '../pages/Trips.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Publish from '../pages/Publish.vue'
import Bookings from '../pages/Bookings.vue'
import About from '../pages/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/trajets', name: 'Trips', component: Trips },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/publier', name: 'Publish', component: Publish, meta: { auth: true } },
  { path: '/trajets/:id/modifier', name: 'EditTrip', component: Publish, meta: { auth: true } },
  { path: '/reservations', name: 'Bookings', component: Bookings, meta: { auth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/a-propos', name: 'About', component: About },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 }),
})

// Pages protégées : redirige vers la connexion si pas de jeton
router.beforeEach((to) => {
  let token = null
  try { token = localStorage.getItem('horego-token') } catch (e) {}
  if (to.meta.auth && !token) return { name: 'Login', query: { redirect: to.fullPath } }
})

export default router
