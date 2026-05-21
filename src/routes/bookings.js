const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authMiddleware = require('../middleware/auth');

router.post('/', async (req, res, next) => {
    const { customer_name, customer_phone, service_id, booking_date, booking_time } = req.body;
    if (!customer_name || !customer_phone || !service_id || !booking_date || !booking_time) {
        return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    if (typeof customer_name !== 'string' || customer_name.length < 1 || customer_name.length > 100) {
        return res.status(400).json({ error: 'Nama tidak valid' });
    }
    if (typeof customer_phone !== 'string' || !/^\d{10,15}$/.test(customer_phone)){
        return res.status(400).json({ error: 'Nomor telepon tidak valid' });
    }
    const service_id_num = Number(service_id);
    if (!Number.isInteger(service_id_num) || service_id_num <= 0){
        return res.status(400).json({ error: 'ID tidak valid' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(booking_date)){
        return res.status(400).json({ error: 'Tanggal tidak valid' })
    }
    if (new Date(booking_date) < new Date()){
        return res.status(400).json({ error: 'Tanggal tidak valid' })
    }
    if (!/^\d{2}:\d{2}$/.test(booking_time)){
        return res.status(400).json({ error: 'Waktu tidak valid' })
    }
    try {
        const serviceResult = await pool.query('SELECT id FROM services WHERE id = $1', [ service_id_num ])
        if (serviceResult.rows.length === 0){
            return res.status(400).json({ error: 'Service tidak ditemukan' })
        }
        const result = await pool.query(
            'INSERT INTO bookings (customer_name, customer_phone, service_id, booking_date, booking_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ customer_name, customer_phone, service_id_num, booking_date, booking_time ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const result = await pool.query(
            'SELECT bookings.*, services.name AS service_name, services.price AS service_price FROM bookings JOIN services ON bookings.service_id = services.id ORDER BY bookings.created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', authMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status harus approved atau rejected' });
    }
    try {
        const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking tidak ditemukan' });
        }
        res.json(result.rows[0]);  
    } catch (err) {
        next(err);
    }
});


module.exports = router;