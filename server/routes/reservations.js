/**
 * routes/reservations.js - Réserver une place / annuler une réservation.
 * Le nombre de places du trajet est mis à jour dans une transaction.
 */
const express = require('express');
const db = require('../db');
const { authRequise } = require('../middleware/auth');

const router = express.Router();

// POST /api/trajets/:id/reserver
router.post('/trajets/:id/reserver', authRequise, (req, res) => {
  const reserver = db.transaction((trajetId, userId) => {
    const trajet = db.prepare('SELECT * FROM Trajets WHERE id = ?').get(trajetId);
    if (!trajet) return { code: 404, message: 'Trajet introuvable' };
    if (trajet.conducteur_id === userId) {
      return { code: 400, message: 'Vous ne pouvez pas réserver votre propre trajet' };
    }
    if (trajet.places_disponibles < 1) {
      return { code: 400, message: 'Plus de places disponibles' };
    }
    const deja = db
      .prepare('SELECT id FROM Reservations WHERE trajet_id = ? AND passager_id = ?')
      .get(trajetId, userId);
    if (deja) return { code: 409, message: 'Vous avez déjà réservé ce trajet' };

    db.prepare('INSERT INTO Reservations (trajet_id, passager_id) VALUES (?, ?)').run(trajetId, userId);
    db.prepare('UPDATE Trajets SET places_disponibles = places_disponibles - 1 WHERE id = ?').run(trajetId);
    return { code: 201, message: 'Réservation confirmée' };
  });

  const { code, message } = reserver(req.params.id, req.user.id);
  res.status(code).json({ message });
});

// DELETE /api/reservations/:id : annuler (remet la place disponible)
router.delete('/reservations/:id', authRequise, (req, res) => {
  const annuler = db.transaction((reservationId, userId) => {
    const resa = db
      .prepare('SELECT * FROM Reservations WHERE id = ? AND passager_id = ?')
      .get(reservationId, userId);
    if (!resa) return { code: 404, message: 'Réservation introuvable' };

    db.prepare('DELETE FROM Reservations WHERE id = ?').run(resa.id);
    db.prepare('UPDATE Trajets SET places_disponibles = places_disponibles + 1 WHERE id = ?').run(resa.trajet_id);
    return { code: 200, message: 'Réservation annulée' };
  });

  const { code, message } = annuler(req.params.id, req.user.id);
  res.status(code).json({ message });
});

module.exports = router;
