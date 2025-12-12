# bookshelf
saya membuat aplikasi bookshelf,
aplikasi ini tujuannya untuk membuat perpustakaan mini atau digital fungisi utama nya itu menambahakan gambar buku, penulis,  tahun terbit, dan juga descripsi selain itu juga ada progres membaca dan ada rak untuk buku yang selesai dibaca dan juga rak buku yang belum di baca 
# ada 3 menu utama  home explore dan save

# 📚 Bookshelf App (JavaScript Version)

Aplikasi Bookshelf versi JavaScript murni untuk mengelola koleksi buku digital pribadi dengan fitur tracking progress membaca.



## 🚀 Demo

🔗 **Live Demo:** [preview](https://ranggautama47.github.io/bookshelf/)  
📂 **Repository:** [cek disini](https://github.com/ranggautama47/bookshelf)

## ✨ Fitur Utama

### 📖 Manajemen Buku Lengkap
- ✅ Tambah buku dengan cover, judul, penulis, tahun, kategori, dan deskripsi
- ✅ Edit dan hapus buku
- ✅ Upload gambar cover atau gunakan placeholder
- ✅ Filter berdasarkan kategori (Fiksi, Non-Fiksi, Teknologi, dll)

### 📊 Tracking Membaca
- ✅ Progress bar dengan persentase (0-100%)
- ✅ Sistem rak: "Belum Dibaca" vs "Selesai Dibaca"
- ✅ Tandai buku sebagai selesai/belum selesai
- ✅ Slider untuk update progress di halaman detail

### 🎨 UI/UX Modern
- ✅ Responsive design (mobile & desktop)
- ✅ Dark mode tema dengan warna neon
- ✅ Navigasi mobile-friendly dengan bottom navbar
- ✅ Animasi smooth dan transisi
- ✅ Card design dengan hover effect

### 🔍 Fitur Pencarian
- ✅ Cari buku berdasarkan judul
- ✅ Filter kategori interaktif
- ✅ Tampilan grid/list sesuai kebutuhan

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan custom properties
- **Vanilla JavaScript (ES6)** - No frameworks!
- **LocalStorage** - Penyimpanan data di browser
- **FileReader API** - Upload gambar cover
- **Responsive Web Design** - Mobile-first approach

## 📁 Struktur Proyek

bookshelf-js/

├── index.html # Homepage

├── home.html # Halaman utama

├── explore.html # Halaman eksplorasi

├── save.html # Halaman koleksi tersimpan

├── add_book.html # Form tambah/edit buku

├── book_detail.html # Halaman detail buku

├── style.css # Stylesheet utama

├── script.js # Logika aplikasi

├── bukuku.png # Default cover image

└── README.md # Dokumentasi ini 


## 🎯 Fitur Khusus

### 📱 Responsive Navigation
- **Desktop**: Top navbar dengan logo dan menu
- **Mobile**: Bottom tab bar dengan icon
- **Floating Action Button** di desktop untuk tambah buku cepat

### 🎨 Kategori Buku
- Fiction
- Non-Fiksi  
- Teknologi
- Self-help
- Sejarah
- Sains
- Biography
- Business
- Lainnya

### 📈 Progress System

Progress Bar Colors:

    0-49% : Orange (sedang dibaca)

    50-99% : Blue (hampir selesai)

    100% : Green (selesai)




## 🚀 Cara Menjalankan

### Opsi 1: Langsung di Browser
1. Clone repository:
```bash
git clone https://github.com/ranggautama47/bookshelf.git
cd bookshelf

    Buka file home.html di browser

 Opsi 2: Live Server (Rekomendasi)


# Install Live Server Extension di VS Code
# Klik kanan home.html → Open with Live Server

Opsi 3: Deploy ke GitHub Pages

    Push ke repository GitHub

    Settings → Pages → Select main branch

    Tunggu beberapa menit, akses di https://username.github.io/bookshelf



📸 Screenshots


### 🏠 Homepage
![Home Page](./src/screenshots/home.png)

### 🔍 Explore Page  
![Explore Page](./src/screenshots/explore.png)

### 💾 Save Page
![Save Page](./src/screenshots/save.png)

### 📖 Detail Book
![Detail Page](./src/screenshots/detail.png)
🔧 API & Storage
LocalStorage Structure
javascript

{
  books: [
    {
      id: "unique-id",
      title: "Judul Buku",
      author: "Penulis",
      year: "2024",
      category: "Fiction",
      description: "Deskripsi buku...",
      coverDataUrl: "data:image/png;base64...",
      isComplete: false,
      progress: 65,
      createdAt: "2024-03-20T10:30:00Z"
    }
  ]
}

📝 Fitur Dicoding Compliance

✅ Book Item Component (data-testid attributes):

    bookItem

    bookItemTitle

    bookItemAuthor

    bookItemYear

    bookItemIsCompleteButton

    bookItemDeleteButton

    bookItemEditButton

✅ CRUD Operations:

    Create: Tambah buku baru

    Read: Tampilkan daftar buku

    Update: Edit buku & ubah status

    Delete: Hapus buku

✅ Local Storage:

    Data persisten di browser

    Tidak hilang saat refresh

    Support semua browser modern

🎨 Design System
    Color Palette
    css

    --bg: #0F0F0F          /* Background utama */
    --card: #1A1A1A        /* Card background */
    --accent: #00A86B      /* Warna aksen hijau */
    --neon: #39FF14        /* Warna neon */
    --blue: #2DA8FF        /* Warna biru */
    --danger: #D0342C      /* Warna merah */

Typography

    Primary Font: Poppins

    Headings: Montserrat

    Sizes: 12px - 28px scaling

🤝 Kontribusi

    Fork repository

    Buat branch fitur (git checkout -b feature/amazing-feature)

    Commit perubahan (git commit -m 'Add amazing feature')

    Push ke branch (git push origin feature/amazing-feature)

    Buat Pull Request


👤 Penulis

Rangga Utama

    GitHub: @ranggautama47

    Project: Bookshelf App