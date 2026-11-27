<script setup>
// À personnaliser : remplace par les vrais noms, rôles et descriptions du groupe
const membres = [
  { nom: 'Aurel', role: 'Backend et authentification', texte: 'Étudiant en cycle préparatoire ingénieur (numérique).' },
  { nom: 'Membre 2', role: 'Pages Profil et Trajets', texte: 'À compléter.' },
  { nom: 'Membre 3', role: 'Design et accueil', texte: 'À compléter.' }
]
</script>

<template>
  <div class="panel">**************
    <h2>À propos de HOREGO</h2>
    <p class="muted">Plateforme de covoiturage pour la communauté étudiante d'EFREI, réalisée par un groupe de trois étudiants.</p>
    <div class="grille trois">
      <div v-for="m in membres" :key="m.nom" class="mini-carte membre">
        <div class="mini grand">{{ m.nom[0] }}</div>
        <b>{{ m.nom }}</b><small>{{ m.role }}</small><p>{{ m.texte }}</p>
      </div>
    </div>
  </div>
</template>
