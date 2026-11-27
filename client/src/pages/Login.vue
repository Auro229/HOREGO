<template>
  <section class="auth-page">
    <form class="auth-card" @submit.prevent="submit">
      <h1>Connexion</h1>
      <p class="muted">Content de te revoir sur HOREGO.</p>

      <label class="field">
        <input v-model="email" type="email" placeholder="Email" autocomplete="email" required />
      </label>
      <label class="field">
        <input v-model="password" type="password" placeholder="Mot de passe" autocomplete="current-password" required />
      </label>

      <p v-if="error" class="alert alert-error">{{ error }}</p>

      <button class="btn-line" type="submit" :disabled="loading">{{ loading ? '…' : 'Se connecter' }}</button>
      <p class="auth-switch">Pas encore de compte ? <router-link to="/register">S’inscrire</router-link></p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { errMsg } from '../api'

const { login } = useAuth()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push(route.query.redirect || '/trajets')
  } catch (e) {
    error.value = errMsg(e)
  } finally {
    loading.value = false
  }
}
</script>
