const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Mot de passe : 6 caractères minimum' });
  }

  const cleanName = nom.trim();
  const cleanEmail = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      'INSERT INTO users (nom, email, password) VALUES (?, ?, ?)',
      [cleanName, cleanEmail, hash]
    );

    res.status(201).json({
      token: sign(result.insertId),
      user: { id: result.insertId, nom: cleanName, email: cleanEmail },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute(
      'SELECT id, nom, email, password FROM users WHERE email = ?',
      [(email || '').trim().toLowerCase()]
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    res.json({
      token: sign(user.id),
      user: { id: user.id, nom: user.nom, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

exports.me = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, nom, email FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!users[0]) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};