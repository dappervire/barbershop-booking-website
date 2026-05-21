const bcrypt = require('bcrypt');
const pool = require('./pool');

async function seedAdmin(){
    const username = 'admin';
    const password = 'admin123';

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
    );

    console.log('admin berhasil dibuat: ', result.rows[0]);
    process.exit(0);

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

seedAdmin();