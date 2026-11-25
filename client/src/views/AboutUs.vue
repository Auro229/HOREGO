<script setup>
// À remplacer par les vrais membres du groupe (nom, rôle, réalisations).
const membres = [
  { nom: 'Prénom NOM', role: 'Front-end Vue.js', texte: 'Pages, composants et navigation.' },
  { nom: 'Prénom NOM', role: 'Back-end Express', texte: 'API REST, base de données, sécurité.' }
]
</script>

<template>
  <section class="page">
    <h1>À propos de nous</h1>
    <p class="lead">
      EfreiRoute est un projet de programmation web avancée réalisé à l’EFREI Paris (I1, 2024-2025)
      avec Vue.js, Node.js et Express.
    </p>
    <div class="list members">
      <article v-for="(m, i) in membres" :key="i" class="panel">
        <h3>{{ m.nom }}</h3>
        <p class="role">{{ m.role }}</p>
        <p>{{ m.texte }}</p>
      </article>
    </div>
  </section>
</template>