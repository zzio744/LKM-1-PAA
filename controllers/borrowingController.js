const Borrowing = require('../models/borrowingModel');

const getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.getAll();
    res.status(200).json({ status: 'success', data: borrowings });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) {
      return res.status(400).json({ status: 'error', message: 'user_id dan book_id wajib diisi' });
    }

    const newBorrowing = await Borrowing.borrowBook(user_id, book_id);
    res.status(201).json({ status: 'success', message: 'Buku berhasil dipinjam', data: newBorrowing });
  } catch (err) {
    // Jika error karena stok habis atau buku tidak ada
    const statusCode = err.message.includes('Stok') || err.message.includes('ditemukan') ? 400 : 500;
    res.status(statusCode).json({ status: 'error', message: err.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params; // ID dari tabel borrowings
    const returnedBook = await Borrowing.returnBook(id);
    res.status(200).json({ status: 'success', message: 'Buku berhasil dikembalikan', data: returnedBook });
  } catch (err) {
    const statusCode = err.message.includes('ditemukan') || err.message.includes('dikembalikan') ? 400 : 500;
    res.status(statusCode).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllBorrowings, borrowBook, returnBook };