const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({ error : 'Format header tidak valid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({ error : 'Format header tidak valid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token tidak valid atau expired' })
    }
}

module.exports = authMiddleware;