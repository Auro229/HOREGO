<script setup>
import { useRouter } from 'vue-router'
import { auth, recherche } from './store'
import Navbar from './components/Navbar.vue'
import BarreTrajet from './components/BarreTrajet.vue'

const router = useRouter()
</script>

<template>
  <Navbar />

  <main class="shell">
    <header class="entete">
      <router-link to="/" class="logo"><img src="/logo-horego.png" alt="" class="logo-img" />HOREGO</router-link>
      <input class="glass recherche" v-model="recherche" placeholder="Rechercher un départ, une destination…" @keyup.enter="router.push('/trajets')" />
      <button v-if="auth.user" class="avatar" :title="'Se déconnecter (' + auth.user.nom + ')'" @click="auth.sortir().then(() => router.push('/'))">{{ auth.user.nom[0].toUpperCase() }}</button>
      <router-link v-else to="/auth" class="avatar" title="Connexion">?</router-link>
    </header>
    <router-view />
  </main>

  <BarreTrajet />
</template>
