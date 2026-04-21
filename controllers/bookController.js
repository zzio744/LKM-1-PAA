const Book = require('../models/bookModel');

const getAllBooks = async (req, res) => {
  try {
    // Mengubah .category menjadi .category_id untuk konsistensi dengan tabel baru
    const books = await Book.getAll(req.query.category_id);
    res.status(200).json({ status: 'success', data: books });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ status: 'error', message: 'Buku tidak ditemukan' });
    res.status(200).json({ status: 'success', data: book });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    // Opsional: Validasi sederhana untuk memastikan category_id dikirim
    if (!req.body.category_id) {
      return res.status(400).json({ status: 'error', message: 'category_id wajib diisi' });
    }

    const newBook = await Book.create(req.body);
    res.status(201).json({ status: 'success', message: 'Buku berhasil ditambah', data: newBook });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updated = await Book.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Buku tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Buku diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.softDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Buku tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Buku berhasil dihapus (soft delete)' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };