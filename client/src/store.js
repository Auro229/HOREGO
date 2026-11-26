/** store.js - Appels API et état partagé (utilisateur connecté, recherche, réservations). */
import { reactive, ref } from 'vue'

/** Appel API avec cookies ; lève une Error(message) si le serveur refuse */
export async function api(url, method = 'GET', body) {
  const res = await fetch('/api' + url, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Erreur serveur')
  return data
}

export const recherche = ref('')

export const auth = reactive({
  user: null,
  pret: false,
  reserves: [],
  async charger() {
    if (this.pret) return
    try { this.user = (await api('/me')).user } catch { this.user = null }
    this.pret = true
    await this.majReserves()
  },
  async majReserves() {
    if (!this.user) { this.reserves = []; return }
    this.reserves = (await api('/mes-trajets')).reserves
  },
  async entrer(mode, champs) {
    this.user = (await api('/' + mode, 'POST', champs)).user
    await this.majReserves()
  },
  async sortir() {
    await api('/logout', 'POST')
    this.user = null
    this.reserves = []
  }
})

/** "2027-01-10T08:00" -> "10 janv. 2027" / "08:00" */
export const jour = (dh) => new Date(dh).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
export const heure = (dh) => dh.slice(11, 16)
