// api.js : instance Axios partagée (ajoute le jeton JWT automatiquement)
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('horego-token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {}
  return config
})

// Extrait un message d'erreur lisible
export const errMsg = (e, fallback = 'Une erreur est survenue') =>
  e?.response?.data?.message || (e?.request ? 'Serveur injoignable' : fallback)

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default api
