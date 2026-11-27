const db = require('../config/db');

// POST /api/bookings { trip_id }
exports.create = async (req, res) => {
  const tripId = Number(req.body.trip_id);

  if (!Number.isInteger(tripId) || tripId < 1) {
    return res.status(400).json({ message: 'Trajet invalide' });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [trips] = await connection.execute(
      `SELECT id, driver_id, places
       FROM trips
       WHERE id = ?
       FOR UPDATE`,
      [tripId]
    );

    const trip = trips[0];

    if (!trip) {
      await connection.rollback();
      return res.status(404).json({ message: 'Trajet introuvable' });
    }

    if (Number(trip.driver_id) === Number(req.user.id)) {
      await connection.rollback();
      return res.status(400).json({
        message: 'Tu ne peux pas réserver ton propre trajet',
      });
    }

    const [[count]] = await connection.execute(
      'SELECT COUNT(*) AS total FROM bookings WHERE trip_id = ?',
      [tripId]
    );

    if (Number(count.total) >= Number(trip.places)) {
      await connection.rollback();
      return res.status(409).json({ message: 'Plus de place disponible' });
    }

    await connection.execute(
      'INSERT INTO bookings (trip_id, user_id) VALUES (?, ?)',
      [tripId, req.user.id]
    );

    await connection.commit();
    res.status(201).json({ message: 'Réservation confirmée' });
  } catch (error) {
    if (connection) await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Tu as déjà réservé ce trajet',
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réservation' });
  } finally {
    if (connection) connection.release();
  }
};

// GET /api/bookings : mes réservations
exports.mine = async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.id, b.created_at, t.depart, t.arrivee,
              t.date_heure, t.prix, u.nom AS conducteur
       FROM bookings b
       JOIN trips t ON t.id = b.trip_id
       JOIN users u ON u.id = t.driver_id
       WHERE b.user_id = ?
       ORDER BY t.date_heure ASC`,
      [req.user.id]
    );

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors du chargement des réservations',
    });
  }
};

// DELETE /api/bookings/:id
exports.remove = async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM bookings WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    res.json({ message: 'Réservation annulée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'annulation de la réservation",
    });
  }
};