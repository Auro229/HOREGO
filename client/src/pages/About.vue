<template>
  <section class="page about">
    <p class="eyebrow eyebrow-soft"><span class="eyebrow-line"></span>À PROPOS</p>
    <h1 class="page-title">Le covoiturage pensé pour les étudiants d'Efrei</h1>
    <p class="about-lead">
      HOREGO met en relation les étudiants qui font le même trajet : pour aller en cours, rentrer chez soi
      ou partir en week-end. Moins de frais, moins d’attente, beaucoup plus de rencontres.
    </p>

    <h2 class="page-subtitle">Comment ça marche</h2>
    <div class="steps">
      <div v-for="s in steps" :key="s.num" class="step glass">
        <span class="step-num">{{ s.num }}</span>
        <h3>{{ s.title }}</h3>
        <p class="muted">{{ s.text }}</p>
      </div>
    </div>

    <h2 class="page-subtitle">Nos valeurs</h2>
    <div class="steps">
      <div v-for="v in values" :key="v.title" class="step glass">
        <h3>{{ v.title }}</h3>
        <p class="muted">{{ v.text }}</p>
      </div>
    </div>

    <h2 class="page-subtitle">L’équipe</h2>
    <div class="team">
      <div v-for="m in team" :key="m.nom" class="member glass">
        <div class="avatar">{{ m.nom.charAt(0) }}</div>
        <strong>{{ m.nom }}</strong>
        <span class="muted">{{ m.role }}</span>
      </div>
    </div>

    <div class="cta glass">
      <h2>Prêt à rouler ensemble ?</h2>
      <div class="hero-actions">
        <router-link to="/trajets" class="btn btn-primary">Trouver un trajet</router-link>
        <router-link to="/publier" class="btn-line-link">Proposer un trajet</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { num: '01', title: 'Crée ton compte', text: 'Inscris-toi en quelques secondes avec ton email.' },
  { num: '02', title: 'Trouve ou publie', text: 'Cherche un trajet qui te convient, ou propose le tien avec tes places libres.' },
  { num: '03', title: 'Roule ensemble', text: 'Réserve ta place, retrouve ton conducteur et partage la route.' },
]

const values = [
  { title: 'Simplicité', text: 'Une plateforme claire, rapide, sans te compliquer la vie.' },
  { title: 'Partage', text: 'Des frais partagés et des rencontres entre étudiants du même campus.' },
  { title: 'Liberté', text: 'Tu choisis tes horaires, tes trajets et ton rythme.' },
]

// À modifier : remplace par les vrais noms et rôles de l'équipe
const team = [
  { nom: 'Membre 1', role: 'Rôle' },
  { nom: 'Membre 2', role: 'Rôle' },
  { nom: 'Membre 3', role: 'Rôle' },
]
</script>