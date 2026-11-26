/**
 * db.js - Connexion à la base SQLite et création des tables.
 * Tables : Users, Trajets, Reservations
 */
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'horego.db'));

// Active les clés étrangères (suppression en cascade des réservations)
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nom           TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Trajets (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    conducteur_id       INTEGER NOT NULL,
    depart              TEXT NOT NULL,
    destination         TEXT NOT NULL,
    date_heure          TEXT NOT NULL,          -- format "YYYY-MM-DDTHH:MM"
    places_disponibles  INTEGER NOT NULL CHECK (places_disponibles >= 0),
    created_at          TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conducteur_id) REFERENCES Users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Reservations (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    trajet_id    INTEGER NOT NULL,
    passager_id  INTEGER NOT NULL,
    created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (trajet_id, passager_id),
    FOREIGN KEY (trajet_id)   REFERENCES Trajets(id) ON DELETE CASCADE,
    FOREIGN KEY (passager_id) REFERENCES Users(id)   ON DELETE CASCADE
  );
`);

module.exports = db;
