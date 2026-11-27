const db = require('../config/db');

const SELECT_TRIPS = `
  SELECT t.*, u.nom AS conducteur,
         t.places - (
           SELECT COUNT(*) FROM bookings b WHERE b.trip_id = t.id
         ) AS places_restantes
  FROM trips t
  JOIN users u ON u.id = t.driver_id
`;

exports.list = async (req, res) => {
  try {
    const { depart = '', arrivee = '', date = '', limit } = req.query;

    let sql = `${SELECT_TRIPS}
      WHERE t.depart LIKE ? AND t.arrivee LIKE ?`;
    const params = [`%${depart}%`, `%${arrivee}%`];

    if (date) {
      sql += ' AND DATE(t.date_heure) = ?';
      params.push(date);
    } else {
      sql += ' AND t.date_heure >= NOW()';
    }

    sql += ' ORDER BY t.date_heure ASC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(Math.max(1, Number.parseInt(limit, 10) || 10));
    }

    const [trips] = await db.execute(sql, params);
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du chargement des trajets' });
  }
};

exports.stats = async (req, res) => {
  try {
    const [[tripCount]] = await db.execute(
      'SELECT COUNT(*) AS n FROM trips WHERE date_heure >= NOW()'
    );
    const [[seatCount]] = await db.execute(`
      SELECT COALESCE(SUM(t.places - (
        SELECT COUNT(*) FROM bookings b WHERE b.trip_id = t.id
      )), 0) AS n
      FROM trips t WHERE t.date_heure >= NOW()
    `);
    const [[userCount]] = await db.execute(
      'SELECT COUNT(*) AS n FROM users'
    );

    res.json({
      trajets: tripCount.n,
      places: seatCount.n,
      etudiants: userCount.n,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du chargement des statistiques' });
  }
};

exports.mine = async (req, res) => {
  try {
    const [trips] = await db.execute(
      `${SELECT_TRIPS}
       WHERE t.driver_id = ?
       ORDER BY t.date_heure DESC`,
      [req.user.id]
    );
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du chargement de tes trajets' });
  }
};

exports.create = async (req, res) => {
  const { depart, arrivee, date_heure, places, prix, description } = req.body;

  if (!depart || !arrivee || !date_heure || !places) {
    return res.status(400).json({
      message: 'Départ, arrivée, date et places sont obligatoires',
    });
  }

  const seatCount = Number(places);
  if (!Number.isInteger(seatCount) || seatCount < 1 || seatCount > 8) {
    return res.status(400).json({ message: 'Places : entre 1 et 8' });
  }

  try {
    const mysqlDate = date_heure.replace('T', ' ');
    const [result] = await db.execute(
      `INSERT INTO trips
       (driver_id, depart, arrivee, date_heure, places, prix, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        depart.trim(),
        arrivee.trim(),
        mysqlDate,
        seatCount,
        Number(prix) || 0,
        description || '',
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du trajet' });
  }
};

exports.one = async (req, res) => {
  try {
    const [trips] = await db.execute(
      `${SELECT_TRIPS} WHERE t.id = ?`,
      [req.params.id]
    );

    if (!trips[0]) {
      return res.status(404).json({ message: 'Trajet introuvable' });
    }

    res.json(trips[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du chargement du trajet' });
  }
};

exports.update = async (req, res) => {
  const { depart, arrivee, date_heure, places, prix, description } = req.body;

  if (!depart || !arrivee || !date_heure || !places) {
    return res.status(400).json({
      message: 'Départ, arrivée, date et places sont obligatoires',
    });
  }

  const seatCount = Number(places);
  if (!Number.isInteger(seatCount) || seatCount < 1 || seatCount > 8) {
    return res.status(400).json({ message: 'Places : entre 1 et 8' });
  }

  try {
    const [trips] = await db.execute(
      `${SELECT_TRIPS} WHERE t.id = ?`,
      [req.params.id]
    );
    const trip = trips[0];

    if (!trip) {
      return res.status(404).json({ message: 'Trajet introuvable' });
    }

    if (trip.driver_id !== req.user.id) {
      return res.status(403).json({
        message: 'Tu ne peux modifier que tes propres trajets',
      });
    }

    const bookedSeats = trip.places - trip.places_restantes;
    if (seatCount < bookedSeats) {
      return res.status(400).json({
        message: `${bookedSeats} place(s) déjà réservée(s) : tu ne peux pas descendre en dessous`,
      });
    }

    await db.execute(
      `UPDATE trips
       SET depart = ?, arrivee = ?, date_heure = ?, places = ?, prix = ?, description = ?
       WHERE id = ? AND driver_id = ?`,
      [
        depart.trim(),
        arrivee.trim(),
        date_heure.replace('T', ' '),
        seatCount,
        Number(prix) || 0,
        description || '',
        req.params.id,
        req.user.id,
      ]
    );

    res.json({ message: 'Trajet modifié' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification du trajet' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM trips WHERE id = ? AND driver_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Trajet introuvable' });
    }

    res.json({ message: 'Trajet supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du trajet' });
  }
};