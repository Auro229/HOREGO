<template>
  <section class="page">
    <h1 class="page-title">Mes réservations</h1>

    <p v-if="message" :class="['alert', ok ? 'alert-ok' : 'alert-error']">{{ message }}</p>

    <div v-if="bookings.length" class="list">
      <article v-for="b in bookings" :key="b.id" class="list-row glass">
        <div>
          <strong>{{ b.depart }} → {{ b.arrivee }}</strong>
          <p class="muted">{{ formatDate(b.date_heure) }} · avec {{ b.conducteur }} · {{ b.prix > 0 ? b.prix + ' FCFA' : 'Gratuit' }}</p>
        </div>
        <button class="btn btn-danger" @click="cancelBooking(b.id)">Annuler</button>
      </article>
    </div>
    <div v-else class="empty">
      Aucune réservation. <router-link to="/trajets" class="inline-link">Réserve un trajet dans la liste →</router-link>
    </div>

    <h2 class="page-subtitle">Mes trajets publiés</h2>
    <div v-if="myTrips.length" class="list">
      <article v-for="t in myTrips" :key="t.id" class="list-row glass">
        <div>
          <strong>{{ t.depart }} → {{ t.arrivee }}</strong>
          <p class="muted">{{ formatDate(t.date_heure) }} · {{ t.places - t.places_restantes }}/{{ t.places }} places réservées</p>
        </div>
        <div class="row-actions">
  <router-link :to="`/trajets/${t.id}/modifier`" class="btn btn-edit">Modifier</router-link>
  <button class="btn btn-danger" @click="removeTrip(t.id)">Supprimer</button>
</div>
      </article>
    </div>
    <div v-else class="empty">
      Tu n'as publié aucun trajet. <router-link to="/publier" class="inline-link">Proposer un trajet →</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { errMsg, formatDate } from '../api'

const bookings = ref([])
const myTrips = ref([])
const message = ref('')
const ok = ref(false)

async function load() {
  try {
    bookings.value = (await api.get('/bookings')).data
    myTrips.value = (await api.get('/trips/mine')).data
  } catch (e) {
    message.value = errMsg(e)
    ok.value = false
  }
}

async function cancelBooking(id) {
  try { message.value = (await api.delete(`/bookings/${id}`)).data.message; ok.value = true; await load() }
  catch (e) { message.value = errMsg(e); ok.value = false }
}
async function removeTrip(id) {
  try { message.value = (await api.delete(`/trips/${id}`)).data.message; ok.value = true; await load() }
  catch (e) { message.value = errMsg(e); ok.value = false }
}

onMounted(load)
</script>
