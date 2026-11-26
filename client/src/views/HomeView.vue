<script setup>
import { auth } from '../auth'
</script>

<template>
  <section class="hero">
    <div class="hero-text">
      <img class="logo" src="../assets/logo.svg" alt="Logo EfreiRoute" width="72" height="72" />
      <h1>Partagez la route jusqu’au campus.</h1>
      <p>
        EfreiRoute met en relation les étudiants de l’EFREI : proposez vos trajets en voiture
        ou réservez une place, et divisez vos frais de transport.
      </p>
      <div class="row">
        <RouterLink to="/trajets" class="btn btn-primary">Voir les trajets</RouterLink>
        <RouterLink :to="auth.user ? '/profil' : '/connexion'" class="btn btn-ghost">
          {{ auth.user ? 'Mon profil' : 'Créer un compte' }}
        </RouterLink>
      </div>
    </div>

    <!-- Image : illustration de route créée en SVG (aucune source externe à citer) -->
    <img class="hero-img" src="../assets/hero.svg" alt="Illustration d’une route entre deux lieux" />
  </section>
</template>