# Sistem Manajemen Data Intern & PKL PLN

Sistem web internal profesional untuk pendataan dan dokumentasi mahasiswa magang/internship serta siswa PKL/prakerin di lingkungan PLN.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React

## 🎯 Fitur Utama

### Halaman Publik
- **Dashboard Utama**: Statistik, grafik intern per tahun, testimoni, dan galeri
- **Daftar Mentor**: Card view semua mentor dengan detail bimbingan
- **Data Intern/Alumni**: Database lengkap dengan search dan filter
- **Detail Intern**: Halaman detail lengkap untuk setiap intern
- **Galeri Kegiatan**: Dokumentasi foto kegiatan magang
- **Form Tambah Intern**: Pendaftaran intern baru (menunggu approval)

### Dashboard Mentor (Setelah Login)
- **Dashboard**: Overview statistik dan data bimbingan
- **Approval Intern**: Review dan approve/tolak data intern yang masuk
- **Data Intern Bimbingan**: Daftar lengkap intern yang dibimbing
- **Statistik**: Grafik dan analisis data bimbingan
- **Profil**: Edit informasi profil mentor

### Dashboard Admin (Setelah Login)
- **Dashboard**: Overview statistik keseluruhan sistem
- **Manajemen Mentor**: CRUD data mentor (tambah, edit, hapus)
- **Manajemen Intern**: Kelola seluruh data intern dalam sistem

## 🔐 Demo Login Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Akses**: `/admin/login`

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
4. **Detail Intern** (`/intern/:id`) - Detail data intern
5. **Galeri** (`/gallery`) - Foto kegiatan
6. **Login Mentor** (`/login`) - Halaman login mentor

### Mentor Dashboard (Setelah Login)
1. **Dashboard** (`/mentor/dashboard`) - Overview
2. **Approval Intern** (`/mentor/approval`) - Review pendaftar baru
3. **Data Intern** (`/mentor/interns`) - Daftar bimbingan
4. **Statistik** (`/mentor/statistics`) - Analisis data
5. **Profil Saya** (`/mentor/profile`) - Edit profil

### Admin Dashboard (Setelah Login)
1. **Dashboard** (`/admin/dashboard`) - Overview sistem
2. **Manajemen Mentor** (`/admin/mentors`) - CRUD mentor
3. **Manajemen Intern** (`/admin/interns`) - Kelola data intern

## 🚀 Cara Menggunakan

### Instalasi
```bash
npm install
npm run dev
```

### Penggunaan
1. Buka aplikasi di browser (`http://localhost:5173`)
2. Explore halaman publik untuk melihat data intern dan mentor
3. Klik "Tambah Intern" untuk submit data intern baru
4. Login sebagai mentor untuk approve/tolak data intern
5. Login sebagai admin untuk manajemen mentor dan data

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

## 📁 Struktur Folder

```
src/
├── app/
│   ├── components/     # Komponen reusable (Layout, Navbar, UI)
│   ├── contexts/       # React Context (Auth, Admin, Data)
│   ├── data/           # Mock data
│   ├── lib/            # Utilities dan database
│   ├── pages/          # Halaman aplikasi
│   │   ├── admin/      # Halaman admin
│   │   └── mentor/     # Halaman mentor
│   ├── App.tsx
│   └── routes.tsx
└── styles/             # CSS dan Tailwind config
```

---

**© 2026 PT PLN (Persero)**
