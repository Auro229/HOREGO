<script setup>
import { reactive, ref } from 'vue'
import { api } from '../api'

/**
 * Formulaire de publication d'un trajet.
 * Si la prop `trajet` est fournie, le formulaire passe en mode modification (PUT) ;
 * sinon il crée un nouveau trajet (POST).
 */
const props = defineProps({ trajet: { type: Object, default: null } })
const emit = defineEmits(['saved', 'cancel'])

const form = reactive({
  depart: props.trajet?.depart ?? '',
  destination: props.trajet?.destination ?? '',
  date: props.trajet?.date ?? '',
  heure: props.trajet?.heure ?? '',
  places: props.trajet?.places ?? 1
})
const error = ref('')
const loading = ref(false)
const today = new Date().toISOString().slice(0, 10)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const payload = { ...form, places: Number(form.places) }
    if (props.trajet) await api.updateTrajet(props.trajet.id, payload)
    else await api.createTrajet(payload)
    emit('saved')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="panel form" @submit.prevent="submit">
    <h3>{{ trajet ? 'Modifier le trajet' : 'Publier un trajet' }}</h3>

    <div class="grid-2">
      <label>Lieu de départ
        <input v-model.trim="form.depart" required placeholder="Ex. Gare de Villejuif" />
      </label>
      <label>Destination
        <input v-model.trim="form.destination" required placeholder="Ex. Campus EFREI" />
      </label>
      <label>Date
        <input v-model="form.date" type="date" :min="today" required />
      </label>
      <label>Heure de départ
        <input v-model="form.heure" type="time" required />
      </label>
      <label>Places disponibles
        <input v-model="form.places" type="number" min="1" max="8" required />
      </label>
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div class="row">
      <button class="btn btn-primary" :disabled="loading">
        {{ trajet ? 'Enregistrer les modifications' : 'Publier le trajet' }}
      </button>
      <button type="button" class="btn btn-ghost" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>