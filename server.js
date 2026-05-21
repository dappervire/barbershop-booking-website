const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./src/db/pool');
pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error('DB error:', err);
    } else {
        console.log('DB connected:', result.rows[0].now)
    }
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.json({ message: 'Barbershop API running' });
});

const servicesRouter = require('./src/routes/services');
app.use('/services', servicesRouter);

const bookingsRouter = require('./src/routes/bookings');
app.use('/bookings', bookingsRouter);

const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

