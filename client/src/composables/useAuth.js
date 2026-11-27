// composables/useAuth.js : état de connexion partagé
import { reactive, computed } from 'vue'
import api from '../api'

const state = reactive({ user: null, token: null })

export function initAuth() {
  try {
    const t = localStorage.getItem('horego-token')
    const u = localStorage.getItem('horego-user')
    if (t && u) { state.token = t; state.user = JSON.parse(u) }
  } catch (e) {}
}

function save(data) {
  state.token = data.token
  state.user = data.user
  try {
    localStorage.setItem('horego-token', data.token)
    localStorage.setItem('horego-user', JSON.stringify(data.user))
  } catch (e) {}
}

export function useAuth() {
  const isAuth = computed(() => !!state.token)

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    save(data)
  }
  async function register(nom, email, password) {
    const { data } = await api.post('/auth/register', { nom, email, password })
    save(data)
  }
  function logout() {
    state.token = null
    state.user = null
    try { localStorage.removeItem('horego-token'); localStorage.removeItem('horego-user') } catch (e) {}
  }

  return { state, isAuth, login, register, logout }
}
