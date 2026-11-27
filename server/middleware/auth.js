// middleware/auth.js : vérifie le jeton JWT (Authorization: Bearer ...)
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Connexion requise' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (e) {
    res.status(401).json({ message: 'Session expirée, reconnecte-toi' });
  }
};
