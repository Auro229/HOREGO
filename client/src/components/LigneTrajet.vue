<script setup>
/** Une ligne de trajet (miniature, texte, heure, boutons ronds). Les boutons viennent du slot. */
import { jour, heure } from '../store'
defineProps({ t: Object })
</script>

<template>
  <div class="ligne">
    <div class="mini" :style="{ background: `hsl(${(t.id * 67) % 360} 45% 38%)` }">{{ t.destination[0] }}</div>
    <div class="ligne-txt">
      <b>{{ t.depart }} → {{ t.destination }}</b>
      <small>{{ jour(t.date_heure) }} · {{ t.conducteur_nom || 'Moi' }} · {{ t.places_disponibles }} place(s)</small>
    </div>
    <span class="muted">{{ heure(t.date_heure) }}</span>
    <slot />
  </div>
</template>
