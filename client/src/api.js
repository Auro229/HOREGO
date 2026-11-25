/**
 * Petit client HTTP autour de fetch.
 * - credentials: 'include' envoie le cookie de session à chaque requête ;
 * - toute réponse non-2xx lève une Error dont le message vient du serveur ({ message }).
 */
async function request(method, url, body) {
  const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }
  if (body !== undefined) options.body = JSON.stringify(body)

  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`)
  return data
}

export const api = {
  // Authentification
  register: (user) => request('POST', '/api/register', user),
  login: (credentials) => request('POST', '/api/login', credentials),
  logout: () => request('POST', '/api/logout'),
  me: () => request('GET', '/api/me'),

  // Trajets
  getTrajets: () => request('GET', '/api/trajets'),               // trajets à venir de tous les utilisateurs
  getMesTrajets: () => request('GET', '/api/mes-trajets'),         // trajets publiés par l'utilisateur
  createTrajet: (trajet) => request('POST', '/api/trajets', trajet),
  updateTrajet: (id, trajet) => request('PUT', `/api/trajets/${id}`, trajet),
  deleteTrajet: (id) => request('DELETE', `/api/trajets/${id}`),

  // Réservations
  reserver: (trajetId) => request('POST', `/api/trajets/${trajetId}/reservations`),
  getMesReservations: () => request('GET', '/api/mes-reservations'),
  annulerReservation: (reservationId) => request('DELETE', `/api/reservations/${reservationId}`)
}