const pool = require('../config/db');

const Borrowing = {
  // Mengambil semua riwayat peminjaman beserta nama user dan judul buku (JOIN)
  getAll: async () => {
    const query = `
      SELECT br.id, u.name as user_name, b.title as book_title, 
             br.borrow_date, br.return_date, br.status 
      FROM borrowings br
      JOIN users u ON br.user_id = u.id
      JOIN books b ON br.book_id = b.id
      WHERE br.deleted_at IS NULL
      ORDER BY br.borrow_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Logika Meminjam Buku (Mengurangi Stok)
  borrowBook: async (user_id, book_id) => {
    const client = await pool.connect(); // Menggunakan client khusus untuk transaksi
    try {
      await client.query('BEGIN'); // Mulai transaksi

      // 1. Cek ketersediaan stok buku
      const bookRes = await client.query('SELECT stock FROM books WHERE id = $1 AND deleted_at IS NULL', [book_id]);
      if (bookRes.rows.length === 0) throw new Error('Buku tidak ditemukan');
      if (bookRes.rows[0].stock <= 0) throw new Error('Stok buku sedang kosong');

      // 2. Masukkan data ke tabel borrowings
      const borrowQuery = `
        INSERT INTO borrowings (user_id, book_id, borrow_date, status) 
        VALUES ($1, $2, CURRENT_DATE, 'borrowed') RETURNING *`;
      const borrowRes = await client.query(borrowQuery, [user_id, book_id]);

      // 3. Kurangi stok buku
      await client.query('UPDATE books SET stock = stock - 1 WHERE id = $1', [book_id]);

      await client.query('COMMIT'); // Simpan permanen jika semua sukses
      return borrowRes.rows[0];
    } catch (error) {
      await client.query('ROLLBACK'); // Batalkan semua jika ada error
      throw error;
    } finally {
      client.release(); // Kembalikan koneksi ke pool
    }
  },

  // Logika Mengembalikan Buku (Menambah Stok)
  returnBook: async (borrowing_id) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cek status peminjaman
      const borrowRes = await client.query('SELECT * FROM borrowings WHERE id = $1 AND deleted_at IS NULL', [borrowing_id]);
      if (borrowRes.rows.length === 0) throw new Error('Data peminjaman tidak ditemukan');
      if (borrowRes.rows[0].status === 'returned') throw new Error('Buku sudah dikembalikan sebelumnya');

      const book_id = borrowRes.rows[0].book_id;

      // 2. Update status jadi 'returned' dan isi return_date
      const updateBorrowQuery = `
        UPDATE borrowings SET status = 'returned', return_date = CURRENT_DATE 
        WHERE id = $1 RETURNING *`;
      const updatedBorrow = await client.query(updateBorrowQuery, [borrowing_id]);

      // 3. Tambah kembali stok buku
      await client.query('UPDATE books SET stock = stock + 1 WHERE id = $1', [book_id]);

      await client.query('COMMIT');
      return updatedBorrow.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = Borrowing;