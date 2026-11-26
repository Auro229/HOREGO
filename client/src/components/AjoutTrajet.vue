<script setup>
/** Formulaire de publication (POST) ou de modification (PUT) d'un trajet. */
import { reactive, ref } from 'vue'
import { api } from '../store'

const props = defineProps({ trajet: Object })
const emit = defineEmits(['fini', 'annuler'])
const t = props.trajet
const f = reactive({
  depart: t?.depart || '', destination: t?.destination || '',
  date: t?.date_heure.slice(0, 10) || '', heure: t?.date_heure.slice(11, 16) || '',
  places: t?.places_disponibles || 1
})
const erreur = ref('')

async function envoyer() {
  try {
    await (t ? api('/trajets/' + t.id, 'PUT', f) : api('/trajets', 'POST', f))
    emit('fini')
  } catch (e) { erreur.value = e.message }
}
</script>

<template>
  <form class="panel formulaire" @submit.prevent="envoyer">
    <h2>{{ t ? 'Modifier le trajet' : 'Publier un trajet' }}</h2>
    <input class="champ" v-model="f.depart" placeholder="Lieu de départ" required />
    <input class="champ" v-model="f.destination" placeholder="Destination" required />
    <div class="duo">
      <input class="champ" type="date" v-model="f.date" required />
      <input class="champ" type="time" v-model="f.heure" required />
      <input class="champ" type="number" min="1" v-model="f.places" required />
    </div>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
    <div class="duo">
      <button class="bouton" type="submit">{{ t ? 'Enregistrer' : 'Publier' }}</button>
      <button class="bouton fantome" type="button" @click="emit('annuler')">Annuler</button>
    </div>
  </form>
</template>
