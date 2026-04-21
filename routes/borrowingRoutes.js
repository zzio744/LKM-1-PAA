const express = require('express');
const router = express.Router();
const { getAllBorrowings, borrowBook, returnBook } = require('../controllers/borrowingController');

router.get('/', getAllBorrowings);
router.post('/borrow', borrowBook);
router.put('/return/:id', returnBook); // Menggunakan PUT karena ini update status

module.exports = router;    