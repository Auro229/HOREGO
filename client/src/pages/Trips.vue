<template>
  <section class="page">
    <h1 class="page-title">Trouver un trajet</h1>

    <form class="filters glass" @submit.prevent="load">
      <input v-model="depart" type="text" placeholder="Départ" />
      <input v-model="arrivee" type="text" placeholder="Arrivée" />
      <input v-model="date" type="date" />
      <button class="btn btn-primary" type="submit">Rechercher</button>
    </form>

    <p v-if="message" :class="['alert', ok ? 'alert-ok' : 'alert-error']">{{ message }}</p>

    <div v-if="trips.length" class="trip-grid">
      <TripCard v-for="t in trips" :key="t.id" :trip="t">
        <button class="btn btn-primary btn-block" :disabled="t.places_restantes <= 0" @click="book(t)">
          {{ t.places_restantes <= 0 ? 'Complet' : 'Réserver' }}
        </button>
      </TripCard>
    </div>
    <div v-else class="empty">Aucun trajet ne correspond à ta recherche.</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { errMsg } from '../api'
import { useAuth } from '../composables/useAuth'
import TripCard from '../components/TripCard.vue'

const router = useRouter()
const { isAuth } = useAuth()
const trips = ref([])
const depart = ref('')
const arrivee = ref('')
const date = ref('')
const message = ref('')
const ok = ref(false)

async function load() {
  try {
    const { data } = await api.get('/trips', { params: { depart: depart.value, arrivee: arrivee.value, date: date.value } })
    trips.value = data
  } catch (e) {
    message.value = errMsg(e)
    ok.value = false
  }
}

async function book(trip) {
  message.value = ''
  if (!isAuth.value) return router.push({ name: 'Login', query: { redirect: '/trajets' } })
  try {
    const { data } = await api.post('/bookings', { trip_id: trip.id })
    message.value = data.message
    ok.value = true
    await load()
  } catch (e) {
    message.value = errMsg(e)
    ok.value = false
  }
}

onMounted(load)
</script>
