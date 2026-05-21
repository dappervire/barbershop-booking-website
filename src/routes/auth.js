const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db/pool.js')
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Terlalu banyak percobaan login, coba lagi 15 menit lagi' }
});

router.post('/login', loginLimiter, async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi'});
    }
    try {
        const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
        if (result.rows.length === 0){
            return res.status(401).json({ error: 'unauthorized' });
        }
        const admin = result.rows[0];
        const status = await bcrypt.compare(password, admin.password);
        if (status === false){
            return res.status(401).json({ error: 'unauthorized user' });
        }
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
})

module.exports = router;
