/**
 * routes/auth.js - Inscription, connexion, déconnexion.
 * Les mots de passe sont hashés avec bcrypt avant d'être stockés.
 */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authRequise, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

// Options du cookie de session (httpOnly : inaccessible au JavaScript du navigateur)
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 h
};

/** Crée le JWT et le place dans le cookie */
function ouvrirSession(res, user) {
  const token = jwt.sign(
    { id: user.id, nom: user.nom, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.cookie('token', token, cookieOptions);
}

// POST /api/register
router.post('/register', async (req, res) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mot de passe : 6 caractères minimum' });
  }

  const existant = db.prepare('SELECT id FROM Users WHERE email = ?').get(email);
  if (existant) {
    return res.status(409).json({ message: 'Un compte existe déjà avec cet email' });
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const info = db
    .prepare('INSERT INTO Users (nom, email, password_hash) VALUES (?, ?, ?)')
    .run(nom, email, hash);

  const user = { id: Number(info.lastInsertRowid), nom, email };
  ouvrirSession(res, user);
  res.status(201).json({ user });
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const row = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  const ok = row && (await bcrypt.compare(password, row.password_hash));
  if (!ok) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  const user = { id: row.id, nom: row.nom, email: row.email };
  ouvrirSession(res, user);
  res.json({ user });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
});

// GET /api/me : utilisateur connecté (utile au démarrage du client Vue)
router.get('/me', authRequise, (req, res) => {
  const { id, nom, email } = req.user;
  res.json({ user: { id, nom, email } });
});

module.exports = router;
