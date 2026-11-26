import { reactive } from 'vue'
import { api } from './api'

/**
 * État d'authentification partagé par toute l'application.
 * `user` vaut null tant que personne n'est connecté.
 */
export const auth = reactive({
  user: null,

  /** Récupère l'utilisateur lié au cookie de session, s'il existe. */
  async restore() {
    try {
      this.user = (await api.me()).user
    } catch {
      this.user = null
    }
  },

  async login(credentials) {
    this.user = (await api.login(credentials)).user
  },

  async register(infos) {
    this.user = (await api.register(infos)).user
  },

  async logout() {
    await api.logout()
    this.user = null
  }
}) 