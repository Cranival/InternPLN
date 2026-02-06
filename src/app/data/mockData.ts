// Mock data untuk sistem PLN Intern

export interface Mentor {
  id: string;
  name: string;
  nip: string;
  division: string;
  photo: string;
  totalInterns: number;
  position: string;
  password?: string;
}

export interface Intern {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  socialMedia?: string;
  school: string;
  major: string;
  location: string;
  division: string;
  mentorId: string;
  periodStart: string;
  periodEnd: string;
  impression: string;
  message: string;
  photo: string;
  galleryPhotos: string[];
  status: 'approved' | 'pending';
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  internId: string;
  internName: string;
  photo: string;
  caption?: string;
  uploadedAt: string;
}

// Mock Mentors
export const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Ir. Budi Santoso, M.T.',
    nip: '198501012010011001',
    division: 'Distribusi',
    photo: 'https://i.pravatar.cc/400?img=1',
    totalInterns: 24,
    position: 'Manager Distribusi',
    password: 'mentor123',
  },
  {
    id: '2',
    name: 'Siti Rahma, S.T., M.Eng',
    nip: '198703152011012002',
    division: 'Teknologi Informasi',
    photo: 'https://i.pravatar.cc/400?img=2',
    totalInterns: 18,
    position: 'Kepala Seksi TI',
    password: 'mentor123',
  },
  {
    id: '3',
    name: 'Agus Prasetyo, S.T.',
    nip: '199002202012011003',
    division: 'Pembangkitan',
    photo: 'https://i.pravatar.cc/400?img=3',
    totalInterns: 15,
    position: 'Supervisor Pembangkitan',
    password: 'mentor123',
  },
  {
    id: '4',
    name: 'Dr. Maya Kusuma, M.T.',
    nip: '198805102013012004',
    division: 'Transmisi',
    photo: 'https://i.pravatar.cc/400?img=5',
    totalInterns: 20,
    position: 'Manager Transmisi',
    password: 'mentor123',
  },
];

// Mock Interns
export const mockInterns: Intern[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    phone: '081234567890',
    email: 'ahmad.fauzi@email.com',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    socialMedia: '@ahmadfauzi',
    school: 'Universitas Indonesia',
    major: 'Teknik Elektro',
    location: 'PLN Unit Induk Pembangunan Jakarta',
    division: 'Distribusi',
    mentorId: '1',
    periodStart: '2024-01-15',
    periodEnd: '2024-03-15',
    impression: 'Pengalaman yang sangat berharga, belajar banyak tentang sistem distribusi tenaga listrik.',
    message: 'Terima kasih atas bimbingan dan ilmu yang diberikan. Semoga PLN semakin maju!',
    photo: 'https://i.pravatar.cc/400?img=11',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092795442-6ad9df14126c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092446943-ec3293a0b0b6?w=600&h=400&fit=crop',
    ],
    status: 'approved',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Dewi Lestari',
    phone: '081234567891',
    email: 'dewi.lestari@email.com',
    address: 'Jl. Dago No. 456, Bandung',
    socialMedia: '@dewilestari',
    school: 'Institut Teknologi Bandung',
    major: 'Teknik Informatika',
    location: 'PLN Kantor Pusat',
    division: 'Teknologi Informasi',
    mentorId: '2',
    periodStart: '2024-02-01',
    periodEnd: '2024-04-01',
    impression: 'Mendapat insight mendalam tentang transformasi digital di PLN.',
    message: 'Pengalaman magang terbaik! Tim IT PLN sangat supportive.',
    photo: 'https://i.pravatar.cc/400?img=12',
    galleryPhotos: [
      'https://via.placeholder.com/600x400/dc2626/ffffff?text=Foto+Magang+1',
      'https://via.placeholder.com/600x400/7c3aed/ffffff?text=Foto+Magang+2',
      'https://via.placeholder.com/600x400/ea580c/ffffff?text=Foto+Magang+3',
    ],
    status: 'approved',
    createdAt: '2024-01-25',
  },
  {
    id: '3',
    name: 'Rizky Pratama',
    phone: '081234567892',
    email: 'rizky.pratama@email.com',
    address: 'Jl. Malioboro No. 789, Yogyakarta',
    socialMedia: '@rizkypratama',
    school: 'Universitas Gadjah Mada',
    major: 'Teknik Mesin',
    location: 'PLN PLTU Paiton',
    division: 'Pembangkitan',
    mentorId: '3',
    periodStart: '2023-08-01',
    periodEnd: '2023-10-01',
    impression: 'Belajar langsung operasional PLTU, sangat mengesankan!',
    message: 'Terima kasih telah memberi kesempatan belajar di fasilitas world-class.',
    photo: 'https://i.pravatar.cc/400?img=13',
    galleryPhotos: [
      'https://via.placeholder.com/600x400/4f46e5/ffffff?text=Foto+Kegiatan+1',
      'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Foto+Kegiatan+2',
      'https://via.placeholder.com/600x400/10b981/ffffff?text=Foto+Kegiatan+3',
    ],
    status: 'approved',
    createdAt: '2023-07-20',
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    phone: '081234567893',
    email: 'siti.nurhaliza@email.com',
    address: 'Jl. Ijen No. 321, Malang',
    socialMedia: '@sitinurhaliza',
    school: 'Universitas Brawijaya',
    major: 'Teknik Elektro',
    location: 'PLN UIT JBB',
    division: 'Transmisi',
    mentorId: '4',
    periodStart: '2024-03-01',
    periodEnd: '2024-05-01',
    impression: 'Pengalaman luar biasa mempelajari sistem transmisi tegangan tinggi.',
    message: 'Ilmu yang didapat sangat aplikatif dan bermanfaat untuk karir saya.',
    photo: 'https://i.pravatar.cc/400?img=14',
    galleryPhotos: [
      'https://via.placeholder.com/600x400/16a34a/ffffff?text=PLN+Activity+1',
      'https://via.placeholder.com/600x400/ca8a04/ffffff?text=PLN+Activity+2',
      'https://via.placeholder.com/600x400/0891b2/ffffff?text=PLN+Activity+3',
    ],
    status: 'approved',
    createdAt: '2024-02-20',
  },
  {
    id: '5',
    name: 'Andi Wijaya',
    phone: '081234567894',
    email: 'andi.wijaya@email.com',
    address: 'Jl. Thamrin No. 654, Jakarta Selatan',
    socialMedia: '@andiwijaya',
    school: 'SMK Negeri 1 Jakarta',
    major: 'Teknik Instalasi Tenaga Listrik',
    location: 'PLN UP3 Jakarta Selatan',
    division: 'Distribusi',
    mentorId: '1',
    periodStart: '2024-01-10',
    periodEnd: '2024-02-10',
    impression: 'PKL yang sangat berkesan, banyak praktik lapangan.',
    message: 'Semoga bisa bergabung di PLN setelah lulus nanti!',
    photo: 'https://i.pravatar.cc/400?img=15',
    galleryPhotos: [
      'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Training+Session',
      'https://via.placeholder.com/600x400/3b82f6/ffffff?text=Team+Photo',
      'https://via.placeholder.com/600x400/ef4444/ffffff?text=Project+Work',
    ],
    status: 'approved',
    createdAt: '2024-01-05',
  },
  {
    id: '6',
    name: 'Fitri Rahmawati',
    phone: '081234567895',
    email: 'fitri.rahmawati@email.com',
    address: 'Jl. Pandanaran No. 987, Semarang',
    socialMedia: '@fitrirahmawati',
    school: 'Universitas Diponegoro',
    major: 'Sistem Informasi',
    location: 'PLN Kantor Pusat',
    division: 'Teknologi Informasi',
    mentorId: '2',
    periodStart: '2024-04-01',
    periodEnd: '2024-06-01',
    impression: 'Belajar banyak tentang sistem SAP dan digital transformation PLN.',
    message: 'Thank you for the amazing learning experience!',
    photo: 'https://i.pravatar.cc/400?img=16',
    galleryPhotos: [
      'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Workshop+Day',
      'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Office+Tour',
      'https://via.placeholder.com/600x400/10b981/ffffff?text=Final+Presentation',
      'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Certificate+Ceremony',
    ],
    status: 'approved',
    createdAt: '2024-03-20',
  },
  {
    id: '6',
    name: 'Andi Setiawan',
    phone: '081234567895',
    email: 'andi.setiawan@email.com',
    address: 'Jl. Somba Opu No. 234, Makassar',
    socialMedia: '@andisetiawan',
    school: 'Universitas Hasanuddin',
    major: 'Teknik Elektro',
    location: 'PLN Unit Induk Pembangunan Makassar',
    division: 'Distribusi',
    mentorId: '1',
    periodStart: '2026-03-01',
    periodEnd: '2026-05-01',
    impression: '',
    message: '',
    photo: 'https://i.pravatar.cc/400?img=17',
    galleryPhotos: [],
    status: 'pending',
    createdAt: '2026-02-01',
  },
  {
    id: '7',
    name: 'Maya Sari',
    phone: '081234567896',
    email: 'maya.sari@email.com',
    address: 'Jl. Raya ITS No. 567, Surabaya',
    socialMedia: '@mayasari',
    school: 'Institut Teknologi Sepuluh Nopember',
    major: 'Sistem Informasi',
    location: 'PLN Kantor Pusat Jakarta',
    division: 'Teknologi Informasi',
    mentorId: '2',
    periodStart: '2026-03-15',
    periodEnd: '2026-05-15',
    impression: '',
    message: '',
    photo: 'https://i.pravatar.cc/400?img=18',
    galleryPhotos: [],
    status: 'pending',
    createdAt: '2026-02-05',
  },
  {
    id: '8',
    name: 'Bayu Anggoro',
    phone: '081234567897',
    email: 'bayu.anggoro@email.com',
    address: 'Jl. Pleburan No. 890, Semarang',
    socialMedia: '@bayuanggoro',
    school: 'Universitas Diponegoro',
    major: 'Teknik Mesin',
    location: 'PLN PLTU Cilacap',
    division: 'Pembangkitan',
    mentorId: '3',
    periodStart: '2026-04-01',
    periodEnd: '2026-06-01',
    impression: '',
    message: '',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    galleryPhotos: [],
    status: 'pending',
    createdAt: '2026-02-10',
  },
  {
    id: '9',
    name: 'Lina Wulandari',
    phone: '081234567898',
    email: 'lina.wulandari@email.com',
    address: 'Jl. Dago No. 135, Bandung',
    socialMedia: '@linawulandari',
    school: 'Universitas Padjadjaran',
    major: 'Teknik Industri',
    location: 'PLN Unit Induk Transmisi Bandung',
    division: 'Transmisi',
    mentorId: '4',
    periodStart: '2026-03-20',
    periodEnd: '2026-05-20',
    impression: '',
    message: '',
    photo: 'https://i.pravatar.cc/400?img=20',
    galleryPhotos: [],
    status: 'pending',
    createdAt: '2026-02-12',
  },
  {
    id: '10',
    name: 'Fajar Ramadhan',
    phone: '081234567899',
    email: 'fajar.ramadhan@email.com',
    address: 'Jl. Salemba No. 246, Jakarta Pusat',
    socialMedia: '@fajarramadhan',
    school: 'Politeknik Negeri Jakarta',
    major: 'Teknik Elektronika',
    location: 'PLN Unit Pelayanan Jaringan Jakarta Selatan',
    division: 'Distribusi',
    mentorId: '1',
    periodStart: '2026-04-15',
    periodEnd: '2026-06-15',
    impression: '',
    message: '',
    photo: 'https://i.pravatar.cc/400?img=19',
    galleryPhotos: [],
    status: 'pending',
    createdAt: '2026-02-15',
  },
];

// Statistics helpers
export const getInternsByYear = (interns: Intern[]) => {
  const yearCounts: { [year: string]: number } = {};
  interns.forEach((intern) => {
    const year = new Date(intern.periodStart).getFullYear().toString();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));
};
