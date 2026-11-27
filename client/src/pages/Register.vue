<template>
  <section class="auth-page">
    <form class="auth-card" @submit.prevent="submit">
      <h1>Inscription</h1>
      <p class="muted">Rejoins la communauté HOREGO.</p>

      <label class="field">
        <input v-model="nom" type="text" placeholder="Nom complet" autocomplete="name" required />
      </label>
      <label class="field">
        <input v-model="email" type="email" placeholder="Email" autocomplete="email" required />
      </label>
      <label class="field">
        <input v-model="password" type="password" placeholder="Mot de passe (6 caractères min.)" autocomplete="new-password" minlength="6" required />
      </label>

      <p v-if="error" class="alert alert-error">{{ error }}</p>

      <button class="btn-line" type="submit" :disabled="loading">{{ loading ? '…' : "S’inscrire" }}</button>
      <p class="auth-switch">Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { errMsg } from '../api'

const { register } = useAuth()
const router = useRouter()
const nom = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await register(nom.value, email.value, password.value)
    router.push('/trajets')
  } catch (e) {
    error.value = errMsg(e)
  } finally {
    loading.value = false
  }
}
</script>
