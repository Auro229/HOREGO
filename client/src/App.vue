<script setup>
import { useRouter } from 'vue-router'
import { auth } from './auth'

const router = useRouter()

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="topbar">
    <RouterLink to="/" class="brand" aria-label="HOREGO – accueil">
      <span class="brand-mark" aria-hidden="true"></span>HOREGO
    </RouterLink>

    <nav class="menu" aria-label="Navigation principale">
      <RouterLink to="/trajets">Trajets</RouterLink>
      <RouterLink to="/a-propos">À propos de nous</RouterLink>
      <template v-if="auth.user">
        <RouterLink to="/profil">Mon profil</RouterLink>
        <button class="btn btn-ghost" @click="logout">Se déconnecter</button>
      </template>
      <RouterLink v-else to="/connexion" class="btn btn-primary">Se connecter</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="footer">
    HOREGO – projet de programmation web avancée, EFREI Paris 2025-2026
  </footer>
</template>