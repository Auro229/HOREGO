<script setup>
/**
 * Carte d'un trajet : affiche l'itinéraire (départ → destination) sous forme de ligne de route.
 * Les boutons d'action sont fournis par le parent via le slot « actions ».
 */
defineProps({ trajet: { type: Object, required: true } })

function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
}
</script>

<template>
  <article class="trajet">
    <div class="trajet-when">
      <strong>{{ trajet.heure }}</strong>
      <span>{{ formatDate(trajet.date) }}</span>
    </div>

    <div class="route">
      <span class="route-stop">{{ trajet.depart }}</span>
      <span class="route-line" aria-hidden="true"></span>
      <span class="route-stop">{{ trajet.destination }}</span>
    </div>

    <div class="trajet-meta">
      <span v-if="trajet.conducteur">Conducteur : {{ trajet.conducteur }}</span>
      <span :class="['seats', { full: trajet.places === 0 }]">
        {{ trajet.places === 0 ? 'Complet' : trajet.places + (trajet.places > 1 ? ' places' : ' place') }}
      </span>
    </div>

    <div class="trajet-actions"><slot name="actions" /></div>
  </article>
</template>