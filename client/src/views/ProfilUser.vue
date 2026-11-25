<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../api'
import { auth } from '../auth'
import TrajetCard from '../components/TrajetCard.vue'
import AjoutTrajet from '../components/AjoutTrajet.vue'

const mesTrajets = ref([])
const mesReservations = ref([])
const error = ref('')

// Formulaire : null = masqué, {} = création, objet trajet = modification
const editing = ref(null)

async function load() {
  try {
    ;[mesTrajets.value, mesReservations.value] = await Promise.all([
      api.getMesTrajets(),
      api.getMesReservations()
    ])
  } catch (e) {
    error.value = e.message
  }
}

async function onSaved() {
  editing.value = null
  await load()
}

async function supprimer(trajet) {
  if (!confirm(`Supprimer le trajet ${trajet.depart} → ${trajet.destination} ?`)) return
  try {
    await api.deleteTrajet(trajet.id)
    await load()
  } catch (e) {
    error.value = e.message
  }
}

async function annuler(reservation) {
  try {
    await api.annulerReservation(reservation.reservationId)
    await load()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(load)
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1>Bonjour {{ auth.user.nom }}</h1>
      <button v-if="!editing" class="btn btn-primary" @click="editing = {}">Publier un trajet</button>
    </header>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <AjoutTrajet
      v-if="editing"
      :trajet="editing.id ? editing : null"
      @saved="onSaved"
      @cancel="editing = null"
    />

    <h2>Mes trajets publiés</h2>
    <p v-if="!mesTrajets.length" class="empty">Vous n’avez publié aucun trajet. Cliquez sur « Publier un trajet » pour commencer.</p>
    <div class="list">
      <TrajetCard v-for="t in mesTrajets" :key="t.id" :trajet="t">
        <template #actions>
          <button class="btn btn-ghost" @click="editing = t">Modifier</button>
          <button class="btn btn-danger" @click="supprimer(t)">Supprimer</button>
        </template>
      </TrajetCard>
    </div>

    <h2>Mes réservations</h2>
    <p v-if="!mesReservations.length" class="empty">Aucune réservation. Parcourez les <RouterLink to="/trajets">trajets disponibles</RouterLink>.</p>
    <div class="list">
      <TrajetCard v-for="r in mesReservations" :key="r.reservationId" :trajet="r">
        <template #actions>
          <button class="btn btn-danger" @click="annuler(r)">Annuler la réservation</button>
        </template>
      </TrajetCard>
    </div>
  </section>
</template>