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

## Memulai

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

## Struktur Proyek

```
final-project-ecommerce/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── products.json
├── images/
├── index.html
├── product.html
├── product-detail.html
├── cart.html
├── checkout.html
├── about.html
└── contact.html
```

## Dukungan Browser

Website ini telah diuji dan berfungsi pada:
- Chrome (direkomendasikan)
- Firefox
- Safari
- Edge

## Teknologi yang Digunakan

- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Library AOS (Animate On Scroll)
- Local Storage untuk fungsionalitas keranjang

## Cara Berkontribusi

1. Fork repositori ini
2. Buat branch fitur Anda (`git checkout -b feature/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`)
4. Push ke branch tersebut (`git push origin feature/FiturKeren`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detail
# FinalProject-BNCC-LnT-FrontendDevelopment-2025
