# Sistem Manajemen Data Intern & PKL PLN

Sistem web internal profesional untuk pendataan dan dokumentasi mahasiswa magang/internship serta siswa PKL/prakerin di lingkungan PLN.

## 🎯 Fitur Utama

### Halaman Publik
- **Dashboard Utama**: Statistik, grafik intern per tahun, testimoni, dan galeri
- **Daftar Mentor**: Card view semua mentor dengan detail bimbingan
- **Data Intern/Alumni**: Database lengkap dengan search dan filter
- **Galeri Kegiatan**: Dokumentasi foto kegiatan magang
- **Form Tambah Intern**: Pendaftaran intern baru (menunggu approval)

### Dashboard Mentor (Setelah Login)
- **Dashboard**: Overview statistik dan data bimbingan
- **Approval Intern**: Review dan approve data intern yang masuk
- **Data Intern Bimbingan**: Daftar lengkap intern yang dibimbing
- **Statistik**: Grafik dan analisis data bimbingan
- **Profil**: Edit informasi profil mentor

## 🔐 Demo Login Credentials

Untuk mengakses dashboard mentor, gunakan kredensial berikut:

### Mentor 1 - Distribusi
- **NIP**: `198501012010011001`
- **Password**: `mentor123`

### Mentor 2 - Teknologi Informasi
- **NIP**: `198703152011012002`
- **Password**: `mentor123`

### Mentor 3 - Pembangkitan
- **NIP**: `199002202012011003`
- **Password**: `mentor123`

### Mentor 4 - Transmisi
- **NIP**: `198805102013012004`
- **Password**: `mentor123`

## 🎨 Design Style

- **Warna**: Dominan biru PLN (#1e40af), putih, dan clean UI
- **Style**: Modern corporate dashboard enterprise
- **Responsive**: Desktop dan mobile friendly
- **Typography**: Clean dan profesional

## 📱 Navigasi

### Publik
1. **Dashboard** (`/`) - Halaman utama dengan statistik
2. **Mentor** (`/mentor`) - Daftar mentor
3. **Intern** (`/intern`) - Database alumni intern
4. **Galeri** (`/galeri`) - Foto kegiatan
5. **Login Mentor** (`/login`) - Halaman login

### Mentor Dashboard (Setelah Login)
1. **Dashboard** (`/mentor/dashboard`) - Overview
2. **Approval Intern** (`/mentor/approval`) - Review pendaftar baru
3. **Data Intern** (`/mentor/interns`) - Daftar bimbingan
4. **Statistik** (`/mentor/statistics`) - Analisis data
5. **Profil Saya** (`/mentor/profile`) - Edit profil

## 🚀 Cara Menggunakan

1. Buka aplikasi di browser
2. Explore halaman publik untuk melihat data intern dan mentor
3. Klik "Tambah Intern" untuk submit data intern baru
4. Login sebagai mentor menggunakan kredensial di atas
5. Approve atau tolak data intern yang masuk
6. Lihat statistik dan data bimbingan Anda

## 💾 Data Storage

Saat ini menggunakan React Context untuk state management dengan mock data. 
Data akan reset setiap kali halaman di-refresh.

Untuk persistensi data permanen, sistem ini dapat diintegrasikan dengan Supabase atau backend lainnya.

## 📊 Fitur Statistik & Grafik

- Grafik intern per tahun (Bar Chart)
- Distribusi kampus (Bar Chart)
- Distribusi jurusan (Pie Chart)
- Top 5 kampus dan jurusan
- Export data (mock function)

---

**© 2026 PT PLN (Persero)**
