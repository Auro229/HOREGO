import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../store'

const routes = [
  { path: '/', component: () => import('../views/Accueil.vue') },
  { path: '/auth', component: () => import('../views/AuthUser.vue') },
  { path: '/profil', component: () => import('../views/ProfilUser.vue'), meta: { requiert: true } },
  { path: '/trajets', component: () => import('../views/ListeTrajet.vue') },
  { path: '/a-propos', component: () => import('../views/AboutUs.vue') }
]

const router = createRouter({ history: createWebHistory(), routes })

// Les pages protégées redirigent vers la connexion
router.beforeEach(async (to) => {
  await auth.charger()
  if (to.meta.requiert && !auth.user) return '/auth'
})

export default router
