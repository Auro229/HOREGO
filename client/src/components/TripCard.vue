<template>
  <article class="trip-card">
    <div class="trip-route">
      <strong>{{ trip.depart }}</strong>
      <span class="trip-arrow">→</span>
      <strong>{{ trip.arrivee }}</strong>
    </div>
    <p class="trip-date">{{ formatDate(trip.date_heure) }}</p>
    <p class="trip-meta">
      <span class="badge">{{ trip.places_restantes }} place(s)</span>
      <span class="badge badge-price">{{ trip.prix > 0 ? trip.prix + ' FCFA' : 'Gratuit' }}</span>
      <span class="muted">avec {{ trip.conducteur }}</span>
    </p>
    <p v-if="trip.description" class="trip-desc">{{ trip.description }}</p>
    <slot />
  </article>
</template>

<script setup>
import { formatDate } from '../api'
defineProps({ trip: { type: Object, required: true } })
</script>
