# HOREGO - Covoiturage étudiant

Plateforme de covoiturage pour la communauté étudiante d'EFREI.
Stack : Node.js + Express + SQLite (backend), Vue 3 + Vite (frontend).

## Lancer le projet

Backend (terminal 1) :
```
cd server
npm install
npm start
```
(optionnel : copier `.env.example` en `.env` et changer `JWT_SECRET`)

Frontend (terminal 2) :
```
cd client
npm install
npm run dev
```
Ouvrir http://localhost:5173

## Fonctionnalités
- Inscription / connexion (mot de passe hashé avec bcrypt, session par cookie JWT)
- Publier, modifier, supprimer un trajet
- Réserver une place (nombre de places mis à jour) et annuler une réservation
- Pages : Accueil, Authentification, Profil, Liste des trajets, À propos
- Thème Noir / Bleu

## Équipe
À compléter avec les noms du groupe.
