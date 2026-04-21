const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes'); // 1. Import route peminjaman
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes); // 2. Daftarkan endpoint peminjaman

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));