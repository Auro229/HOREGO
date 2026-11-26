/**
 * middleware/auth.js - Vérifie le JWT stocké dans le cookie "token".
 * Si valide, place l'utilisateur dans req.user ({ id, nom, email }).
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'horego-secret-dev-a-changer';

function authRequise(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Non authentifié' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session invalide ou expirée' });
  }
}

module.exports = { authRequise, JWT_SECRET };
