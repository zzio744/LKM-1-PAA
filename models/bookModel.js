const pool = require('../config/db');

const Book = {
  getAll: async (categoryId) => {
    // Menggunakan JOIN untuk mengambil nama kategori dari tabel categories
    let query = `
      SELECT b.id, b.title, b.author, b.isbn, b.stock, b.created_at, b.updated_at, 
             b.category_id, c.name as category_name 
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE b.deleted_at IS NULL
    `;
    let params = [];
    
    // Filter sekarang berdasarkan category_id
    if (categoryId) {
      query += ' AND b.category_id = $1';
      params.push(categoryId);
    }
    const result = await pool.query(query, params);
    return result.rows;
  },
  
  getById: async (id) => {
    const query = `
      SELECT b.id, b.title, b.author, b.isbn, b.stock, b.created_at, b.updated_at, 
             b.category_id, c.name as category_name 
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1 AND b.deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  
  create: async (data) => {
    // Ubah parameter category menjadi category_id
    const { title, author, isbn, category_id, stock } = data;
    const query = 'INSERT INTO books (title, author, isbn, category_id, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(query, [title, author, isbn, category_id, stock]);
    return result.rows[0];
  },
  
  update: async (id, data) => {
    // Ubah parameter category menjadi category_id
    const { title, author, category_id, stock } = data;
    const query = 'UPDATE books SET title = $1, author = $2, category_id = $3, stock = $4 WHERE id = $5 AND deleted_at IS NULL RETURNING *';
    const result = await pool.query(query, [title, author, category_id, stock, id]);
    return result.rows[0];
  },
  
  softDelete: async (id) => {
    const query = 'UPDATE books SET deleted_at = NOW() WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Book;