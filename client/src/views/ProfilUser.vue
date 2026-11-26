<script setup>
import { ref, onMounted } from 'vue'
import { api, auth } from '../store'
import LigneTrajet from '../components/LigneTrajet.vue'
import AjoutTrajet from '../components/AjoutTrajet.vue'

const publies = ref([])
const reserves = ref([])
const formulaire = ref(false) // false | true (ajout) | trajet (modification)

async function charger() {
  const d = await api('/mes-trajets')
  publies.value = d.publies
  reserves.value = d.reserves
  await auth.majReserves()
}
onMounted(charger)

const fini = () => { formulaire.value = false; charger() }
async function supprimer(t) { if (confirm('Supprimer ce trajet ?')) { await api('/trajets/' + t.id, 'DELETE'); charger() } }
async function annuler(t) { await api('/reservations/' + t.reservation_id, 'DELETE'); charger() }
</script>

<template>
  <AjoutTrajet v-if="formulaire" :key="formulaire.id || 'new'" :trajet="formulaire === true ? null : formulaire" @fini="fini" @annuler="formulaire = false" />
  <section class="duo-panels">
    <div class="panel">
      <h2>Mes trajets publiés</h2>
      <LigneTrajet v-for="t in publies" :key="t.id" :t="t">
        <button class="bouton petit fantome" @click="formulaire = t">Modifier</button>
        <button class="bouton petit fantome" @click="supprimer(t)">Supprimer</button>
      </LigneTrajet>
      <p v-if="!publies.length" class="muted">Tu n'as publié aucun trajet.</p>
      <button class="bouton" @click="formulaire = true">Publier un trajet</button>
    </div>
    <div class="panel">
      <h2>Mes réservations</h2>
      <LigneTrajet v-for="t in reserves" :key="t.reservation_id" :t="t">
        <button class="bouton petit fantome" @click="annuler(t)">Annuler</button>
      </LigneTrajet>
      <p v-if="!reserves.length" class="muted">Aucune réservation.</p>
    </div>
  </section>
</template>
