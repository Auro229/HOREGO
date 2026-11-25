<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { auth } from '../auth'
import TrajetCard from '../components/TrajetCard.vue'

const router = useRouter()
const trajets = ref([])
const recherche = ref('')
const error = ref('')
const message = ref('')

// Filtre local sur le lieu de départ ou la destination
const filtres = computed(() => {
  const q = recherche.value.trim().toLowerCase()
  if (!q) return trajets.value
  return trajets.value.filter((t) =>
    `${t.depart} ${t.destination}`.toLowerCase().includes(q)
  )
})

async function load() {
  try {
    trajets.value = await api.getTrajets() // le serveur ne renvoie que les trajets à venir
  } catch (e) {
    error.value = e.message
  }
}

async function reserver(trajet) {
  error.value = message.value = ''
  if (!auth.user) return router.push({ name: 'auth', query: { redirect: '/trajets' } })
  try {
    await api.reserver(trajet.id)
    message.value = `Place réservée : ${trajet.depart} → ${trajet.destination}.`
    await load() // rafraîchit le nombre de places restantes
  } catch (e) {
    error.value = e.message
  }
}

// Un conducteur ne peut pas réserver son propre trajet
const estMonTrajet = (t) => auth.user && t.conducteurId === auth.user.id

onMounted(load)
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1>Trajets disponibles</h1>
      <input v-model="recherche" class="search" type="search" placeholder="Filtrer par ville ou lieu…" aria-label="Filtrer les trajets" />
    </header>

    <p v-if="message" class="success" role="status">{{ message }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="!filtres.length" class="empty">Aucun trajet à venir ne correspond pour le moment.</p>

    <div class="list">
      <TrajetCard v-for="t in filtres" :key="t.id" :trajet="t">
        <template #actions>
          <span v-if="estMonTrajet(t)" class="hint">Votre trajet</span>
          <button v-else class="btn btn-primary" :disabled="t.places === 0" @click="reserver(t)">
            Réserver une place
          </button>
        </template>
      </TrajetCard>
    </div>
  </section>
</template>