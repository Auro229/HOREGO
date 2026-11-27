<template>
  <section class="hero">
    <div class="hero-content">
      <p class="eyebrow"><span class="eyebrow-line"></span>COVOITURAGE ÉTUDIANT</p>

      <h1 class="hero-title">Le campus est plus proche quand on roule ensemble.</h1>

      <div class="hero-bottom">
        <p class="hero-text">
          HOREGO relie les étudiants d'Efrei qui partagent la même route.
          Moins de frais, moins d’attente, beaucoup plus de rencontres.
        </p>
        <div class="hero-actions">
          <router-link to="/trajets" class="btn btn-white">
            Trouver un trajet
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </router-link>
          <router-link to="/publier" class="btn btn-ghost">Proposer un trajet</router-link>
        </div>
      </div>
    </div>

    <a href="#decouvrir" class="scroll-hint">
      DÉCOUVRIR
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
    </a>
  </section>
</template>
