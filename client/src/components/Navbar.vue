<template>
  <header class="navbar" :class="{ open: menuOpen }">
    <router-link to="/" class="brand" @click="menuOpen = false">
      <span class="brand-logo has-img">
      <img src="/logo-horego.png" alt="HOREGO" />
      </span>
      <span class="brand-name">HOREGO</span>
    </router-link>

    <nav class="nav-links" @click="menuOpen = false">
      <router-link to="/">Accueil</router-link>
      <router-link to="/trajets">Trouver un trajet</router-link>
      <router-link v-if="isAuth" to="/publier">Publier</router-link>
      <router-link v-if="isAuth" to="/reservations">Réservations</router-link>
      <router-link v-if="!isAuth" to="/login">Connexion</router-link>
      <a v-else href="#" @click.prevent="doLogout">Déconnexion</a>
      <router-link to="/a-propos">À propos</router-link>
    </nav>

    <div class="nav-right">
      <button class="theme-pill" @click="nextTheme" :aria-label="'Thème : ' + theme">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <span class="theme-label">{{ labels[theme] }}</span>
        <span class="dots"><i v-for="t in THEMES" :key="t" :class="{ on: t === theme }"></i></span>
      </button>
      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const { theme, THEMES, nextTheme } = useTheme()
const { isAuth, logout } = useAuth()
const router = useRouter()
const menuOpen = ref(false)
const labels = { noir: 'Noir', bleu: 'Bleu', blanc: 'Blanc' }

function doLogout() {
  logout()
  router.push('/')
}
</script>
