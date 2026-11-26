<script setup>
/** Barre flottante du bas : trajet réservé suivant (comme le lecteur de l'exemple). */
import { ref, computed } from 'vue'
import { auth, jour, heure } from '../store'

const i = ref(0)
const liste = computed(() => [...auth.reserves].sort((a, b) => a.date_heure.localeCompare(b.date_heure)))
const courant = computed(() => liste.value[i.value % Math.max(liste.value.length, 1)])
const aller = (n) => { if (liste.value.length) i.value = (i.value + n + liste.value.length) % liste.value.length }
</script>

<template>
  <div class="glass barre">
    <button class="rond" title="Précédent" @click="aller(-1)">‹</button>
    <button class="rond" title="Suivant" @click="aller(1)">›</button>
    <div class="capsule">
      <span class="pastille"></span>
      <div v-if="courant" class="capsule-txt">
        <b>{{ courant.depart }} → {{ courant.destination }}</b>
        <small>{{ jour(courant.date_heure) }} · {{ courant.conducteur_nom }}</small>
      </div>
      <div v-else class="capsule-txt"><b>Aucune réservation</b><small>Réserve un trajet dans la liste</small></div>
      <span class="muted">{{ courant ? heure(courant.date_heure) : '--:--' }}</span>
    </div>
    <router-link to="/trajets" class="rond" title="Voir les trajets">⌕</router-link>
    <router-link to="/profil" class="rond" title="Mon profil">☺</router-link>
  </div>
</template>
