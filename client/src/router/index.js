import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../auth'
import HomeView from '../views/HomeView.vue'
import AuthUser from '../views/AuthUser.vue'
import ProfilUser from '../views/ProfilUser.vue'
import ListeTrajet from '../views/ListeTrajet.vue'
import AboutUs from '../views/AboutUs.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'accueil', component: HomeView },
    { path: '/connexion', name: 'auth', component: AuthUser },
    { path: '/profil', name: 'profil', component: ProfilUser, meta: { requiresAuth: true } },
    { path: '/trajets', name: 'trajets', component: ListeTrajet },
    { path: '/a-propos', name: 'about', component: AboutUs },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

// Garde : les pages protégées renvoient vers la connexion si l'utilisateur n'est pas authentifié.
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.user) return { name: 'auth', query: { redirect: to.fullPath } }
})

export default router