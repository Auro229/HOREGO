# HOREGO – Covoiturage étudiant

Stack : **Vue 3 + Vite** (client) · **Node.js + Express + SQLite** (serveur) · JWT + bcrypt pour l'authentification.

## Structure
```
horego/
├── client/   (Vue 3, Vue Router, Axios)
│   ├── public/images/        hero.jpg, simplicite.jpg, partage.jpg, liberte.jpg  ← remplace par tes photos
│   └── src/
│       ├── components/       Navbar, Hero, HomeSections, TripCard
│       ├── pages/            Home, Trips, Login, Register, Publish, Bookings
│       ├── composables/      useTheme (Noir/Bleu/Blanc), useAuth
│       ├── router/           routes + garde de connexion
│       ├── styles/           horego.css (thèmes, navbar, hero), sections.css, pages.css
│       └── api.js            Axios + jeton JWT automatique
└── server/   (Express, SQLite)
    ├── config/db.js          base SQLite + tables (users, trips, bookings)
    ├── controllers/          auth, trips, bookings
    ├── middleware/auth.js    vérification du JWT
    ├── routes/               /api/auth, /api/trips, /api/bookings
    └── .env                  PORT, JWT_SECRET, CLIENT_URL
```

## Lancer le projet
Terminal 1 (serveur) :
```
cd server
npm install
npm start
```
Terminal 2 (client) :
```
cd client
npm install
npm run dev
```
Ouvre http://localhost:5173

Pense à changer `JWT_SECRET` dans `server/.env` avant de déployer.

## API
| Méthode | Route | Auth | Rôle |
|---|---|---|---|
| POST | /api/auth/register | non | inscription |
| POST | /api/auth/login | non | connexion |
| GET | /api/auth/me | oui | profil |
| GET | /api/trips?depart=&arrivee=&date= | non | rechercher des trajets |
| GET | /api/trips/stats | non | statistiques de l'accueil |
| GET | /api/trips/mine | oui | mes trajets publiés |
| POST | /api/trips | oui | publier un trajet |
| DELETE | /api/trips/:id | oui | supprimer mon trajet |
| POST | /api/bookings | oui | réserver un trajet |
| GET | /api/bookings | oui | mes réservations |
| DELETE | /api/bookings/:id | oui | annuler une réservation |
