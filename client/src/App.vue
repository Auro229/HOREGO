<template>
  <Navbar />
  <main>
  <router-view :key="$route.fullPath" />
  </main>
  <footer class="footer">
    <span>© 2026 HOREGO · Covoiturage étudiant</span>
  </footer>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
