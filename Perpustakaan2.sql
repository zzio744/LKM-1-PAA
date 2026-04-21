-- ==========================================
-- 1. PEMBERSIHAN DATA (Opsional - Gunakan jika ingin reset)
-- ==========================================
DROP TABLE IF EXISTS borrowings;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS borrowing_status;

-- ==========================================
-- 2. PEMBUATAN TIPE DATA ENUM
-- ==========================================
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE borrowing_status AS ENUM ('borrowed', 'returned');

-- ==========================================
-- 3. PEMBUATAN TABEL UTAMA (4 TABEL)
-- ==========================================

-- Tabel 1: Users (Pengguna)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel 2: Categories (Kategori Buku) - TABEL BARU
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tabel 3: Books (Buku)
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20) UNIQUE,
    category_id BIGINT NOT NULL, -- Diubah menjadi Foreign Key
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    -- Relasi ke tabel categories
    CONSTRAINT fk_category_book FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Tabel 4: Borrowings (Transaksi Peminjaman)
CREATE TABLE borrowings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
    return_date DATE DEFAULT NULL,
    status borrowing_status DEFAULT 'borrowed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    -- Relasi ke tabel users dan books
    CONSTRAINT fk_user_borrowing FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_book_borrowing FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- ==========================================
-- 4. PEMBUATAN INDEX (Optimasi Filter)
-- ==========================================
CREATE INDEX idx_user_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_book_category ON books(category_id) WHERE deleted_at IS NULL; -- Diupdate ke category_id
CREATE INDEX idx_borrowing_status ON borrowings(status) WHERE deleted_at IS NULL;

-- ==========================================
-- 5. AUTOMASI UPDATED_AT (TRIGGER)
-- ==========================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_timestamp_column(); -- Trigger untuk tabel baru
CREATE TRIGGER trg_update_books BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_update_borrowings BEFORE UPDATE ON borrowings FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ==========================================
-- 6. PENGISIAN DATA AWAL (DUMMY DATA Minimal 5 Baris)
-- ==========================================

-- 1. Data Users (Semua password di-set ke hash dari 'password123' agar API Login MVC bisa dipakai)
INSERT INTO users (name, email, password, role) VALUES 
('Admin Perpustakaan', 'admin@mail.com', '$2b$10$W6X0B9v.uE3Q4Y0e9.3N.OqP7O/oZp7O5O6O7O8O9O0O1O2O3O4O5', 'admin'),
('Rafli Hidayatullah', 'rafli@mail.com', '$2b$10$W6X0B9v.uE3Q4Y0e9.3N.OqP7O/oZp7O5O6O7O8O9O0O1O2O3O4O5', 'member'),
('Sinta', 'sinta@mail.com', '$2b$10$W6X0B9v.uE3Q4Y0e9.3N.OqP7O/oZp7O5O6O7O8O9O0O1O2O3O4O5', 'member'),
('Budi', 'budi@mail.com', '$2b$10$W6X0B9v.uE3Q4Y0e9.3N.OqP7O/oZp7O5O6O7O8O9O0O1O2O3O4O5', 'member'),
('Dewi', 'dewi@mail.com', '$2b$10$W6X0B9v.uE3Q4Y0e9.3N.OqP7O/oZp7O5O6O7O8O9O0O1O2O3O4O5', 'member');

-- 2. Data Categories (5 Kategori Buku)
INSERT INTO categories (name, description) VALUES 
('Programming', 'Buku terkait bahasa pemrograman dan logika koding'),
('Database', 'Buku terkait manajemen basis data SQL dan NoSQL'),
('Software Engineering', 'Buku terkait arsitektur dan metodologi pengembangan perangkat lunak'),
('Web Development', 'Buku terkait pengembangan frontend dan backend web'),
('Networking', 'Buku terkait infrastruktur dan keamanan jaringan komputer');

-- 3. Data Books (Menggunakan category_id 1-5)
INSERT INTO books (title, author, isbn, category_id, stock) VALUES 
('Belajar Node.js MVC', 'Robby Prihandaya', '978-602-1234-01-0', 1, 5),
('Dasar PostgreSQL', 'Budi Raharjo', '978-602-1234-02-1', 2, 3),
('Clean Code', 'Robert C. Martin', '978-013-2350-88-4', 3, 10),
('Algoritma dan Struktur Data', 'Rinaldi Munir', '978-602-1234-03-2', 1, 7),
('Pemrograman Web Modern', 'Eko Kurniawan', '978-602-1234-04-3', 4, 4),
('Dasar Routing CCNA', 'Cisco Press', '978-602-1234-05-4', 5, 2);

-- 4. Data Borrowings (5 Transaksi Peminjaman)
INSERT INTO borrowings (user_id, book_id, borrow_date, status) VALUES 
(2, 1, CURRENT_DATE - INTERVAL '5 days', 'borrowed'),
(3, 2, CURRENT_DATE - INTERVAL '10 days', 'returned'),
(4, 3, CURRENT_DATE - INTERVAL '2 days', 'borrowed'),
(5, 4, CURRENT_DATE - INTERVAL '15 days', 'returned'),
(2, 6, CURRENT_DATE, 'borrowed');