/**
 * index.js - Point d'entrée du serveur HOREGO (Express).
 * Lancement : npm install && npm start  (http://localhost:3000)
 */
require('dotenv').config(); // charge .env (PORT, JWT_SECRET, CLIENT_URL) avant tout le reste
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Le client Vue (Vite) tourne sur le port 5173 ; credentials: true pour les cookies
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/trajets'));
app.use('/api', require('./routes/reservations'));

app.listen(PORT, () => console.log(`HOREGO API sur http://localhost:${PORT}`));
