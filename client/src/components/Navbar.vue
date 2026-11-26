<script setup>
/** Navigation supérieure : 2 liens seulement si déconnecté, + bouton de thème Noir/Bleu. */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { auth } from '../store'
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const { theme, basculer } = useTheme()

const onglets = computed(() => auth.user
  ? [['/', 'Accueil'], ['/trajets', 'Trajets'], ['/profil', 'Mon profil'], ['/a-propos', 'À propos']]
  : [['/', 'Accueil'], ['/auth', 'Connexion'], ['/a-propos', 'À propos']])
</script>

<template>
  <nav class="glass nav">
    <router-link v-for="[to, nom] in onglets" :key="to" :to="to" class="onglet" :class="{ actif: route.path === to }">{{ nom }}</router-link>
    <button class="onglet" title="Changer de thème (Noir, Bleu, Clair)" @click="basculer">
      Thème : {{ { noir: 'Noir', bleu: 'Bleu', clair: 'Clair' }[theme] }}
    </button>
  </nav>
</template>