<template>
  <section class="page page-narrow">
    <h1 class="page-title">{{ isEdit ? 'Modifier le trajet' : 'Proposer un trajet' }}</h1>

    <form class="glass form-grid" @submit.prevent="submit">
      <input v-model="form.depart" type="text" placeholder="Ville de départ" required />
      <input v-model="form.arrivee" type="text" placeholder="Ville d'arrivée" required />
      <input v-model="form.date_heure" type="datetime-local" required />
      <input v-model.number="form.places" type="number" min="1" max="8" placeholder="Places" required />
      <input v-model.number="form.prix" type="number" min="0" step="50" placeholder="Prix par place (FCFA, 0 = gratuit)" />
      <textarea v-model="form.description" rows="3" placeholder="Infos utiles (point de rendez-vous, bagages…)"></textarea>

      <p v-if="error" class="alert alert-error">{{ error }}</p>
      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? '…' : isEdit ? 'Enregistrer les modifications' : 'Publier le trajet' }}
      </button>
      <router-link v-if="isEdit" to="/reservations" class="auth-switch">Annuler</router-link>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { errMsg } from '../api'

const router = useRouter()
const route = useRoute()
const isEdit = computed(() => !!route.params.id)

const form = reactive({ depart: '', arrivee: '', date_heure: '', places: 3, prix: 0, description: '' })
const error = ref('')
const loading = ref(false)

// En mode modification : on pré-remplit le formulaire avec le trajet existant
onMounted(async () => {
  if (!isEdit.value) return
  try {
    const { data } = await api.get(`/trips/${route.params.id}`)
    Object.assign(form, {
      depart: data.depart,
      arrivee: data.arrivee,
      date_heure: (data.date_heure || '').slice(0, 16),
      places: data.places,
      prix: data.prix,
      description: data.description || '',
    })
  } catch (e) {
    error.value = errMsg(e)
  }
})

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (isEdit.value) await api.put(`/trips/${route.params.id}`, form)
    else await api.post('/trips', form)
    router.push('/reservations')
  } catch (e) {
    error.value = errMsg(e)
  } finally {
    loading.value = false
  }
}
</script>