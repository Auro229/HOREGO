<template>
  <!-- La route se partage mieux -->
  <section id="decouvrir" class="section">
    <p class="eyebrow eyebrow-soft"><span class="eyebrow-line"></span>POURQUOI HOREGO</p>
    <h2 class="section-title">La route se partage mieux.</h2>

    <div class="cards">
      <article v-for="c in cards" :key="c.num" class="card-photo">
        <div class="card-bg" :style="{ backgroundImage: `url(${c.img})` }"></div>
        <span class="card-tag">{{ c.num }} · {{ c.label }}</span>
        <div class="card-body">
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
        </div>
      </article>
    </div>
  </section>

  <!-- Communauté -->
  <section class="section">
    <h2 class="section-title">Rejoignez aussi la communauté HOREGO !</h2>
    <div class="stats">
      <div class="stat"><strong>{{ stats.trajets }}</strong><span>trajets à venir</span></div>
      <div class="stat"><strong>{{ stats.places }}</strong><span>places disponibles</span></div>
      <div class="stat"><strong>{{ stats.etudiants }}</strong><span>étudiants inscrits</span></div>
    </div>
  </section>

  <!-- Prochains départs -->
  <section class="section">
    <div class="section-head">
      <h2 class="section-title">Prochains départs</h2>
      <router-link to="/trajets" class="link-more">Voir tous les trajets →</router-link>
    </div>

    <div v-if="trips.length" class="trip-grid">
      <TripCard v-for="t in trips" :key="t.id" :trip="t" />
    </div>
    <div v-else class="empty">Aucun trajet publié pour le moment : sois le premier !</div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../api'
import TripCard from './TripCard.vue'

const stats = reactive({ trajets: 0, places: 0, etudiants: 0 })
const trips = ref([])

// Photos à placer dans client/public/images/
const cards = [
  { num: '01', label: 'Simplicité', title: 'Trouvez votre trajet.', text: 'Rejoignez votre campus sans vous compliquer la vie.', img: '/images/simplicite.jpg' },
  { num: '02', label: 'Partage', title: 'Partagez la route.', text: "Publiez vos trajets et voyagez avec d'autres étudiants.", img: '/images/partage.jpg' },
  { num: '03', label: 'Liberté', title: 'Bougez à votre rythme.', text: 'Réservez une place en quelques clics.', img: '/images/liberte.jpg' },
]

onMounted(async () => {
  try {
    Object.assign(stats, (await api.get('/trips/stats')).data)
    trips.value = (await api.get('/trips', { params: { limit: 3 } })).data
  } catch (e) { /* serveur éteint : on garde les valeurs par défaut */ }
})
</script>
