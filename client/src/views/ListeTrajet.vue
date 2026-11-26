<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, auth, recherche } from '../store'
import LigneTrajet from '../components/LigneTrajet.vue'

const router = useRouter()
const trajets = ref([])
const message = ref('')

const charger = async () => { trajets.value = await api('/trajets') }
onMounted(charger)

// Filtre selon la barre de recherche
const visibles = computed(() => {
  const q = recherche.value.trim().toLowerCase()
  return trajets.value.filter(t => !q || (t.depart + ' ' + t.destination + ' ' + t.conducteur_nom).toLowerCase().includes(q))
})

async function reserver(t) {
  if (!auth.user) return router.push('/auth')
  try {
    message.value = (await api(`/trajets/${t.id}/reserver`, 'POST')).message
    await Promise.all([charger(), auth.majReserves()])
  } catch (e) { message.value = e.message }
}
</script>

<template>
  <div class="panel">
    <h2>Trajets publiés</h2>
    <p v-if="message" class="info">{{ message }}</p>
    <LigneTrajet v-for="t in visibles" :key="t.id" :t="t">
      <button class="bouton petit" :disabled="t.places_disponibles < 1" @click="reserver(t)">{{ t.places_disponibles < 1 ? 'Complet' : 'Réserver' }}</button>
    </LigneTrajet>
    <p v-if="!visibles.length" class="muted">Aucun trajet ne correspond.</p>
  </div>
</template>
