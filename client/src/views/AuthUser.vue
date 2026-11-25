<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../auth'

const router = useRouter()
const route = useRoute()

const mode = ref('login') // 'login' | 'register'
const form = reactive({ nom: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') await auth.login({ email: form.email, password: form.password })
    else await auth.register({ ...form })
    // Redirection automatique vers le profil (ou la page demandée avant la connexion)
    router.push(route.query.redirect || '/profil')
  } catch (e) {
    error.value = e.message // ex. « Cet email est déjà inscrit »
  } finally {
    loading.value = false
  }
}

function switchMode(next) {
  mode.value = next
  error.value = ''
}
</script>

<template>
  <section class="narrow">
    <div class="tabs" role="tablist">
      <button role="tab" :aria-selected="mode === 'login'" :class="{ active: mode === 'login' }" @click="switchMode('login')">Connexion</button>
      <button role="tab" :aria-selected="mode === 'register'" :class="{ active: mode === 'register' }" @click="switchMode('register')">Inscription</button>
    </div>

    <form class="panel form" @submit.prevent="submit">
      <label v-if="mode === 'register'">Nom complet
        <input v-model.trim="form.nom" required autocomplete="name" />
      </label>
      <label>Adresse e-mail
        <input v-model.trim="form.email" type="email" required autocomplete="email" placeholder="prenom.nom@efrei.net" />
      </label>
      <label>Mot de passe
        <input v-model="form.password" type="password" required minlength="6"
               :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" />
      </label>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button class="btn btn-primary" :disabled="loading">
        {{ mode === 'login' ? 'Se connecter' : 'S’inscrire' }}
      </button>
    </form>
  </section>
</template>