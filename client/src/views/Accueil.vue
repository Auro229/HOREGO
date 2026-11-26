<script setup>
import { ref, computed, onMounted } from 'vue'
import { api, auth } from '../store'
import LigneTrajet from '../components/LigneTrajet.vue'

const trajets = ref([])
onMounted(async () => { trajets.value = await api('/trajets') })

const prochains = computed(() => trajets.value.slice(0, 4))
const placesLibres = computed(() => trajets.value.reduce((n, t) => n + t.places_disponibles, 0))
const lienProposer = computed(() => (auth.user ? '/profil' : '/auth'))

// Photos à déposer dans client/public/images/ (un dégradé s'affiche tant qu'elles sont absentes)
const image = (nom, degrade) => ({ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,.75)), url('/images/${nom}'), ${degrade}` })
const cartes = [
  { n: '01', tag: 'Simplicité', titre: 'Trouvez votre trajet.', texte: 'Rejoignez votre campus sans vous compliquer la vie.', img: 'simplicite.jpg', fond: 'linear-gradient(160deg,#6d4fd8,#1b1340)' },
  { n: '02', tag: 'Partage', titre: 'Partagez la route.', texte: "Publiez vos trajets et voyagez avec d'autres étudiants.", img: 'partage.jpg', fond: 'linear-gradient(160deg,#c2679a,#2a1236)' },
  { n: '03', tag: 'Liberté', titre: 'Bougez à votre rythme.', texte: 'Réservez une place en quelques clics.', img: 'liberte.jpg', fond: 'linear-gradient(160deg,#2f6fd6,#0a1a3d)' }
]
</script>

<template>
  <!-- 1. Héros plein écran -->
  <section class="hero" :style="{ backgroundImage: 'linear-gradient(180deg, rgba(9,11,18,.35), rgba(9,11,18,.85)), url(/images/hero.jpg)' }">
    <p class="eyebrow">Le covoiturage pensé pour les étudiants</p>
    <h1 class="titre-xxl">Le campus est plus proche quand on roule <span class="pill">ensemble.</span></h1>
    <p class="sous-titre">Avec HOREGO, trouvez un trajet, partagez vos déplacements et faites des économies entre étudiants.</p>
    <div class="cta">
      <router-link to="/trajets" class="bouton">Trouver un trajet ↗</router-link>
      <router-link :to="lienProposer" class="bouton fantome">Proposer un trajet</router-link>
    </div>
  </section>

  <!-- 2. Trois cartes photo -->
  <h2 class="titre-section">La route se partage mieux.</h2>
  <section class="cartes3">
    <article v-for="c in cartes" :key="c.n" class="carte-photo" :style="image(c.img, c.fond)">
      <div class="entete-carte"><span class="puce">{{ c.n }}</span><span class="tag">{{ c.tag }}</span></div>
      <div><h3>{{ c.titre }}</h3><p>{{ c.texte }}</p></div>
    </article>
  </section>

  <!-- 3. Chiffres (données réelles de la base) -->
  <section class="stats">
    <h2 class="titre-section gauche">Rejoignez aussi la communauté <span class="pill">HOREGO</span> !</h2>
    <div class="stat-liste">
      <div class="stat"><b>{{ trajets.length }}</b><span>trajets à venir</span></div>
      <div class="stat"><b>{{ placesLibres }}</b><span>places disponibles</span></div>
      <div class="stat"><b>3</b><span>étudiants derrière le projet</span></div>
    </div>
  </section>

  <!-- 4. Prochains départs -->
  <section class="panel">
    <h2>Prochains départs</h2>
    <LigneTrajet v-for="t in prochains" :key="t.id" :t="t" />
    <p v-if="!prochains.length" class="muted">Aucun trajet publié pour le moment : sois le premier !</p>
    <router-link to="/trajets" class="bouton fantome">Voir tous les trajets</router-link>
  </section>
</template>
