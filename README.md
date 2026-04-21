# 📚 LKM-1-PAA — Sistem Informasi Perpustakaan

REST API untuk manajemen data perpustakaan, dibangun menggunakan Node.js dan Express dengan database PostgreSQL. Project ini merupakan tugas Latihan Kerja Mandiri (LKM) mata kuliah Perancangan Arsitektur Aplikasi (PAA).

---

## 🛠️ Teknologi yang Digunakan

| Kategori    | Teknologi              |
|-------------|------------------------|
| Bahasa      | JavaScript (Node.js)   |
| Framework   | Express.js v5          |
| Database    | PostgreSQL              |
| ORM / Driver| node-postgres (`pg`)   |
| Keamanan    | bcrypt                 |
| Konfigurasi | dotenv                 |

---

## 🗂️ Domain

**Perpustakaan** — pengelolaan data buku, anggota, dan peminjaman buku di lingkungan perpustakaan.

---

## ⚙️ Instalasi dan Menjalankan Project

### Prasyarat

- Node.js >= 18
- PostgreSQL >= 14
- npm

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/zzio744/LKM-1-PAA.git
   cd LKM-1-PAA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env` di root project (atau sesuaikan yang sudah ada):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=Perpustakaan2
   PORT=3000
   ```

4. **Import database** *(lihat bagian berikutnya)*

5. **Jalankan server**
   ```bash
   node app.js
   ```

   Server berjalan di `http://localhost:3000`

---

## 🗄️ Cara Import Database

1. Pastikan PostgreSQL sudah berjalan dan kamu sudah login sebagai superuser.

2. Buat database baru:
   ```sql
   CREATE DATABASE "Perpustakaan2";
   ```

3. Import file SQL:
   ```bash
   psql -U postgres -d Perpustakaan2 -f Perpustakaan2.sql
   ```

   Atau menggunakan pgAdmin:
   - Buka pgAdmin → klik kanan database → pilih **Restore** / **Query Tool**
   - Jalankan isi file `Perpustakaan2.sql`

---

## 📋 Daftar Endpoint

### 🔐 Auth

| Method | URL             | Keterangan              |
|--------|-----------------|-------------------------|
| POST   | `/auth/register`| Registrasi pengguna baru |
| POST   | `/auth/login`   | Login dan mendapatkan token |

### 📖 Buku

| Method | URL             | Keterangan                  |
|--------|-----------------|-----------------------------|
| GET    | `/buku`         | Ambil semua data buku        |
| GET    | `/buku/:id`     | Ambil detail buku by ID      |
| POST   | `/buku`         | Tambah buku baru             |
| PUT    | `/buku/:id`     | Update data buku by ID       |
| DELETE | `/buku/:id`     | Hapus buku by ID             |

### 👤 Anggota

| Method | URL               | Keterangan                    |
|--------|-------------------|-------------------------------|
| GET    | `/anggota`        | Ambil semua data anggota       |
| GET    | `/anggota/:id`    | Ambil detail anggota by ID     |
| POST   | `/anggota`        | Tambah anggota baru            |
| PUT    | `/anggota/:id`    | Update data anggota by ID      |
| DELETE | `/anggota/:id`    | Hapus anggota by ID            |

### 🔄 Peminjaman

| Method | URL                   | Keterangan                        |
|--------|-----------------------|-----------------------------------|
| GET    | `/peminjaman`         | Ambil semua data peminjaman        |
| GET    | `/peminjaman/:id`     | Ambil detail peminjaman by ID      |
| POST   | `/peminjaman`         | Catat peminjaman buku baru         |
| PUT    | `/peminjaman/:id`     | Update data peminjaman (pengembalian) |
| DELETE | `/peminjaman/:id`     | Hapus data peminjaman by ID        |

> **Catatan:** Sesuaikan nama endpoint dengan implementasi aktual di folder `routes/`.

---

## 🎬 Video Presentasi

[![Video Presentasi](https://img.shields.io/badge/YouTube-https://youtu.be/AYnWk8ERPXk-red?logo=youtube)](https://youtu.be/AYnWk8ERPXk)
