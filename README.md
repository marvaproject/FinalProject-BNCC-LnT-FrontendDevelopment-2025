# Website E-Commerce UrbanThread

Website e-commerce modern untuk fashion streetwear yang dibangun dengan HTML, Tailwind CSS, dan vanilla JavaScript.

## Fitur

- Desain responsif dengan tema neon cyberpunk
- Filter produk berdasarkan kategori dan rentang harga
- Pengurutan produk (terbaru, harga terendah-tertinggi, harga tertinggi-terendah, terpopuler)
- Fungsi keranjang belanja dengan localStorage
- Sistem pagination (6 produk per halaman)
- Navigasi yang mobile-friendly
- Halaman detail produk
- Proses checkout

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda memiliki:
- Editor Visual Studio Code
- Ekstensi Live Server untuk VS Code

## How to get started

### Metode Utama: Menggunakan VS Code Live Server (Direkomendasikan)
1. Install Visual Studio Code jika belum ada
2. Install ekstensi "Live Server" di VS Code:
   - Klik ikon Extensions di sidebar (atau tekan Ctrl+Shift+X)
   - Cari "Live Server"
   - Klik Install pada ekstensi oleh Ritwick Dey
3. Buka folder proyek di VS Code
4. Klik kanan pada `index.html`
5. Pilih "Open with Live Server"
6. Website akan otomatis terbuka di browser default Anda

Live Server akan secara otomatis:
- Memulai server lokal
- Membuka browser default Anda
- Memuat ulang otomatis saat ada perubahan file
- Menangani semua konfigurasi server yang diperlukan

### Metode Alternatif

Jika Anda tidak memiliki VS Code, Anda bisa menggunakan solusi server lainnya:

#### Menggunakan http-server Node.js
```bash
# Install http-server secara global
npm install -g http-server

# Jalankan server
http-server
```
Kemudian buka http://localhost:8080 di browser Anda.

#### Menggunakan Python
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```
Kemudian buka http://localhost:8000 di browser Anda.

## Catatan Penting

- Website membutuhkan server lokal untuk berjalan dengan benar karena menggunakan Fetch API untuk memuat data produk
- Membuka file HTML langsung di browser (menggunakan protokol `file://`) akan menyebabkan gagalnya pemuatan produk
- Pastikan Anda mengakses situs melalui protokol `http://` atau `https://`
- VS Code Live Server adalah metode yang direkomendasikan karena memberikan pengalaman pengembangan terbaik

## Penjelasan File-file Utama

### File HTML
- `index.html`: Halaman beranda dengan tampilan produk unggulan
- `product.html`: Menampilkan daftar lengkap produk dengan fitur filter dan sort
- `product-detail.html`: Template untuk menampilkan detail produk individual
- `cart.html`: Halaman keranjang belanja dengan perhitungan total
- `checkout.html`: Form checkout dengan validasi
- `about.html`: Informasi tentang perusahaan dan brand
- `contact.html`: Form kontak dan informasi kontak

### File JavaScript
- `main.js`: Mengatur fungsi-fungsi utama website dan event listeners
- `cart.js`: Mengelola operasi keranjang belanja dan localStorage
- `checkout.js`: Validasi form dan proses checkout
- `product-detail.js`: Menangani tampilan dan interaksi detail produk
- `products.json`: Database produk dalam format JSON

### File CSS
- `style.css`: Mengatur seluruh styling website termasuk responsivitas

## Teknologi yang Digunakan

- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Library AOS (Animate On Scroll)
- Local Storage untuk fungsionalitas keranjang