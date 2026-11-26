/**
 * routes/trajets.js - CRUD des trajets + liste des trajets de l'utilisateur.
 */
const express = require('express');
const db = require('../db');
const { authRequise } = require('../middleware/auth');

const router = express.Router();

/** Date/heure actuelle au format "YYYY-MM-DDTHH:MM" (comparable en SQL) */
function maintenant() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Valide les champs d'un trajet. Retourne un message d'erreur ou null. */
function validerTrajet({ depart, destination, date, heure, places }) {
  if (!depart || !destination || !date || !heure || places === undefined) {
    return 'Tous les champs sont obligatoires';
  }
  if (!Number.isInteger(Number(places)) || Number(places) < 1) {
    return 'Le nombre de places doit être un entier >= 1';
  }
  if (`${date}T${heure}` <= maintenant()) {
    return 'La date du trajet doit être dans le futur';
  }
  return null;
}

// GET /api/trajets : trajets à venir publiés par tous les utilisateurs
router.get('/trajets', (req, res) => {
  const trajets = db
    .prepare(
      `SELECT t.*, u.nom AS conducteur_nom
       FROM Trajets t JOIN Users u ON u.id = t.conducteur_id
       WHERE t.date_heure > ?
       ORDER BY t.date_heure ASC`
    )
    .all(maintenant());
  res.json(trajets);
});

// GET /api/mes-trajets : trajets publiés + trajets réservés par l'utilisateur
router.get('/mes-trajets', authRequise, (req, res) => {
  const publies = db
    .prepare('SELECT * FROM Trajets WHERE conducteur_id = ? ORDER BY date_heure DESC')
    .all(req.user.id);

  const reserves = db
    .prepare(
      `SELECT r.id AS reservation_id, t.*, u.nom AS conducteur_nom
       FROM Reservations r
       JOIN Trajets t ON t.id = r.trajet_id
       JOIN Users u ON u.id = t.conducteur_id
       WHERE r.passager_id = ?
       ORDER BY t.date_heure DESC`
    )
    .all(req.user.id);

  res.json({ publies, reserves });
});

// POST /api/trajets : publier un trajet
router.post('/trajets', authRequise, (req, res) => {
  const erreur = validerTrajet(req.body);
  if (erreur) return res.status(400).json({ message: erreur });

  const { depart, destination, date, heure, places } = req.body;
  const info = db
    .prepare(
      `INSERT INTO Trajets (conducteur_id, depart, destination, date_heure, places_disponibles)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(req.user.id, depart, destination, `${date}T${heure}`, Number(places));

  const trajet = db.prepare('SELECT * FROM Trajets WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(trajet);
});

// PUT /api/trajets/:id : modifier un trajet (propriétaire uniquement)
router.put('/trajets/:id', authRequise, (req, res) => {
  const trajet = db.prepare('SELECT * FROM Trajets WHERE id = ?').get(req.params.id);
  if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
  if (trajet.conducteur_id !== req.user.id) {
    return res.status(403).json({ message: 'Ce trajet ne vous appartient pas' });
  }

  const erreur = validerTrajet(req.body);
  if (erreur) return res.status(400).json({ message: erreur });

  const { depart, destination, date, heure, places } = req.body;
  db.prepare(
    `UPDATE Trajets
     SET depart = ?, destination = ?, date_heure = ?, places_disponibles = ?
     WHERE id = ?`
  ).run(depart, destination, `${date}T${heure}`, Number(places), trajet.id);

  res.json(db.prepare('SELECT * FROM Trajets WHERE id = ?').get(trajet.id));
});

// DELETE /api/trajets/:id : supprimer un trajet (publié ou passé)
router.delete('/trajets/:id', authRequise, (req, res) => {
  const trajet = db.prepare('SELECT * FROM Trajets WHERE id = ?').get(req.params.id);
  if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
  if (trajet.conducteur_id !== req.user.id) {
    return res.status(403).json({ message: 'Ce trajet ne vous appartient pas' });
  }

  db.prepare('DELETE FROM Trajets WHERE id = ?').run(trajet.id); // réservations supprimées en cascade
  res.json({ message: 'Trajet supprimé' });
});

module.exports = router;
