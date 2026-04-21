const pool = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', 
      [email]
    );
    return result.rows[0];
  },
  create: async (name, email, hashedPassword) => {
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
    const result = await pool.query(query, [name, email, hashedPassword]);
    return result.rows[0];
  }
};

module.exports = User;