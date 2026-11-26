<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../store'

const router = useRouter()
const mode = ref('login') // 'login' | 'register'
const f = reactive({ nom: '', email: '', password: '' })
const erreur = ref('')

function basculer() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  erreur.value = ''
}

async function valider() {
  erreur.value = ''
  try {
    await auth.entrer(mode.value, f)
    router.push('/profil') // redirection automatique après authentification
  } catch (e) { erreur.value = e.message }
}
</script>

<template>
  <section class="auth-carte">
    <h1 class="auth-titre">{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h1>

    <form @submit.prevent="valider">
      <label v-if="mode === 'register'" class="souligne"><span>Nom</span><input v-model="f.nom" autocomplete="name" required /></label>
      <label class="souligne"><span>Email</span><input type="email" v-model="f.email" autocomplete="email" required /></label>
      <label class="souligne"><span>Mot de passe</span><input type="password" v-model="f.password" minlength="6" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" required /></label>
      <p v-if="erreur" class="auth-erreur" role="alert">{{ erreur }}</p>
      <button class="btn-contour" type="submit">{{ mode === 'login' ? 'Se connecter' : "S'inscrire" }}</button>
    </form>

    <p class="auth-bas">
      {{ mode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?' }}
      <a href="#" @click.prevent="basculer">{{ mode === 'login' ? "S'inscrire" : 'Se connecter' }}</a>
    </p>
  </section>
</template>

<style scoped>
/* Carte en verre dépoli : mêmes couleurs que le reste du site (suit le thème Noir / Bleu / Clair) */
.auth-carte { max-width: 24rem; margin: 2rem auto; padding: 2.4rem 2rem; color: var(--texte); background: var(--verre);
  border: 1px solid var(--ligne); border-radius: 1.6rem; backdrop-filter: blur(22px) saturate(140%); box-shadow: 0 20px 60px rgba(0, 0, 0, .25) }
.auth-titre { text-align: center; font-size: 1.8rem; font-weight: 700; margin-bottom: 1.8rem }

/* Champs soulignés */
.souligne { display: block; margin-bottom: 1.6rem }
.souligne span { display: block; font-size: .9rem; margin-bottom: .2rem; color: var(--muted) }
.souligne input { width: 100%; background: transparent; border: 0; border-bottom: 2px solid var(--muted); color: var(--texte); padding: .5rem 0; font: inherit; outline: none; border-radius: 0 }
.souligne input:focus { border-bottom-color: var(--focus); box-shadow: 0 2px 0 0 var(--focus) }
.souligne input:-webkit-autofill { -webkit-text-fill-color: var(--texte); box-shadow: 0 0 0 100px var(--fond) inset }

.auth-erreur { color: #ef4444; background: rgba(239, 68, 68, .12); padding: .6rem .8rem; border-radius: .5rem; font-size: .9rem; margin-bottom: 1rem }
.btn-contour { width: 100%; margin-top: .6rem; padding: .85rem; background: transparent; color: var(--texte); border: 1px solid var(--muted); border-radius: .5rem; font: inherit; cursor: pointer; transition: background .2s, border-color .2s }
.btn-contour:hover { background: var(--verre-fort); border-color: var(--focus) }
.auth-bas { text-align: center; margin-top: 1.4rem; font-size: .9rem; color: var(--muted) }
.auth-bas a { color: var(--texte); font-weight: 700; text-decoration: underline }
</style>