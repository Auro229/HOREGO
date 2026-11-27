require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/api', (req, res) => res.json({ app: 'HOREGO API', status: 'ok' }));

app.listen(port, () => console.log(`HOREGO API lancée sur http://localhost:${port}`));
