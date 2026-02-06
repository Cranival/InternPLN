// Database Service dengan localStorage untuk persistensi data
// Simulasi database dengan sinkronisasi dan integritas data

import { Intern, Mentor, GalleryPhoto, mockMentors, mockInterns } from '../data/mockData';

// Database Keys
const DB_KEYS = {
  INTERNS: 'pln_interns',
  MENTORS: 'pln_mentors',
  GALLERY: 'pln_gallery',
  SYNC_TIMESTAMP: 'pln_sync_timestamp',
  DB_VERSION: 'pln_db_version',
} as const;

// Current database version - increment when schema changes
const CURRENT_DB_VERSION = '1.0.0';

// Types for database operations
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SyncStatus {
  lastSync: string;
  pendingChanges: number;
  isOnline: boolean;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Validate data integrity
function validateIntern(intern: Partial<Intern>): string | null {
  if (!intern.name?.trim()) return 'Nama harus diisi';
  if (!intern.school?.trim()) return 'Sekolah/Kampus harus diisi';
  if (!intern.mentorId) return 'Mentor harus dipilih';
  if (intern.email && !/\S+@\S+\.\S+/.test(intern.email)) return 'Format email tidak valid';
  if (intern.phone && !/^[0-9+\-\s]+$/.test(intern.phone)) return 'Format nomor HP tidak valid';
  return null;
}

function validateMentor(mentor: Partial<Mentor>): string | null {
  if (!mentor.name?.trim()) return 'Nama mentor harus diisi';
  if (!mentor.nip?.trim()) return 'NIP harus diisi';
  if (!mentor.division?.trim()) return 'Divisi harus diisi';
  return null;
}

// ============================================
// DATABASE INITIALIZATION
// ============================================

export function initializeDatabase(): void {
  const storedVersion = localStorage.getItem(DB_KEYS.DB_VERSION);
  
  // Check if database needs initialization or migration
  if (!storedVersion || storedVersion !== CURRENT_DB_VERSION) {
    console.log('Initializing/Migrating database...');
    
    // Initialize with mock data if empty
    if (!localStorage.getItem(DB_KEYS.MENTORS)) {
      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(mockMentors));
    }
    
    if (!localStorage.getItem(DB_KEYS.INTERNS)) {
      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(mockInterns));
    }
    
    if (!localStorage.getItem(DB_KEYS.GALLERY)) {
      // Extract gallery photos from interns
      const galleryPhotos: GalleryPhoto[] = [];
      mockInterns.forEach((intern) => {
        intern.galleryPhotos.forEach((photo, index) => {
          galleryPhotos.push({
            id: `gallery-${intern.id}-${index}`,
            internId: intern.id,
            internName: intern.name,
            photo,
            caption: `Foto kegiatan ${intern.name}`,
            uploadedAt: intern.createdAt,
          });
        });
      });
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(galleryPhotos));
    }
    
    // Update version
    localStorage.setItem(DB_KEYS.DB_VERSION, CURRENT_DB_VERSION);
    localStorage.setItem(DB_KEYS.SYNC_TIMESTAMP, getCurrentTimestamp());
    
    console.log('Database initialized successfully');
  }
}

// ============================================
// INTERN OPERATIONS (CRUD)
// ============================================

export const InternDB = {
  // Get all interns
  getAll(): DatabaseResult<Intern[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.INTERNS);
      const interns = data ? JSON.parse(data) : [];
      return { success: true, data: interns };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data intern' };
    }
  },

  // Get intern by ID
  getById(id: string): DatabaseResult<Intern | null> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const intern = result.data?.find((i) => i.id === id) || null;
      return { success: true, data: intern };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data intern' };
    }
  },

  // Get interns by mentor ID
  getByMentorId(mentorId: string): DatabaseResult<Intern[]> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const interns = result.data?.filter((i) => i.mentorId === mentorId) || [];
      return { success: true, data: interns };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data intern' };
    }
  },

  // Get interns by status
  getByStatus(status: 'pending' | 'active' | 'alumni' | 'rejected'): DatabaseResult<Intern[]> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const interns = result.data?.filter((i) => i.status === status) || [];
      return { success: true, data: interns };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data intern' };
    }
  },

  // Create new intern
  create(internData: Omit<Intern, 'id' | 'createdAt'>): DatabaseResult<Intern> {
    try {
      // Validate data
      const validationError = validateIntern(internData);
      if (validationError) {
        return { success: false, error: validationError };
      }

      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const newIntern: Intern = {
        ...internData,
        id: generateId(),
        createdAt: getCurrentTimestamp(),
      };

      const updatedInterns = [...(result.data || []), newIntern];
      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(updatedInterns));
      this.updateSyncTimestamp();

      // Also add to gallery if there are photos
      if (newIntern.galleryPhotos.length > 0) {
        newIntern.galleryPhotos.forEach((photo, index) => {
          GalleryDB.create({
            internId: newIntern.id,
            internName: newIntern.name,
            photo,
            caption: `Foto kegiatan ${newIntern.name}`,
          });
        });
      }

      return { success: true, data: newIntern };
    } catch (error) {
      return { success: false, error: 'Gagal menyimpan data intern' };
    }
  },

  // Update intern
  update(id: string, updates: Partial<Intern>): DatabaseResult<Intern> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const index = result.data?.findIndex((i) => i.id === id);
      if (index === undefined || index === -1) {
        return { success: false, error: 'Intern tidak ditemukan' };
      }

      const updatedIntern = { ...result.data![index], ...updates };
      result.data![index] = updatedIntern;

      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(result.data));
      this.updateSyncTimestamp();

      return { success: true, data: updatedIntern };
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate data intern' };
    }
  },

  // Delete intern
  delete(id: string): DatabaseResult<boolean> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const filteredInterns = result.data?.filter((i) => i.id !== id) || [];
      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(filteredInterns));
      
      // Also delete related gallery photos
      GalleryDB.deleteByInternId(id);
      
      this.updateSyncTimestamp();
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal menghapus data intern' };
    }
  },

  // Approve intern - set status based on period
  approve(id: string): DatabaseResult<Intern> {
    const internResult = this.getById(id);
    if (!internResult.success || !internResult.data) {
      return { success: false, error: 'Intern tidak ditemukan' };
    }
    
    const intern = internResult.data;
    const today = new Date();
    const periodEnd = new Date(intern.periodEnd);
    
    // Jika periode sudah selesai, set sebagai alumni
    // Jika masih dalam periode, set sebagai active
    const newStatus = periodEnd < today ? 'alumni' : 'active';
    
    return this.update(id, { status: newStatus });
  },

  // Reject intern (delete)
  reject(id: string): DatabaseResult<boolean> {
    return this.delete(id);
  },

  // Search interns
  search(query: string): DatabaseResult<Intern[]> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const searchLower = query.toLowerCase();
      const filtered = result.data?.filter((intern) =>
        intern.name.toLowerCase().includes(searchLower) ||
        intern.school.toLowerCase().includes(searchLower) ||
        intern.division.toLowerCase().includes(searchLower) ||
        intern.major.toLowerCase().includes(searchLower)
      ) || [];

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: 'Gagal mencari data intern' };
    }
  },

  // Update sync timestamp
  updateSyncTimestamp(): void {
    localStorage.setItem(DB_KEYS.SYNC_TIMESTAMP, getCurrentTimestamp());
  },

  // Get statistics
  getStatistics(): DatabaseResult<{
    total: number;
    active: number;
    alumni: number;
    pending: number;
    byDivision: Record<string, number>;
    byMentor: Record<string, number>;
  }> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const interns = result.data || [];
      const byDivision: Record<string, number> = {};
      const byMentor: Record<string, number> = {};

      interns.forEach((intern) => {
        byDivision[intern.division] = (byDivision[intern.division] || 0) + 1;
        byMentor[intern.mentorId] = (byMentor[intern.mentorId] || 0) + 1;
      });

      return {
        success: true,
        data: {
          total: interns.length,
          active: interns.filter((i) => i.status === 'active').length,
          alumni: interns.filter((i) => i.status === 'alumni').length,
          pending: interns.filter((i) => i.status === 'pending').length,
          byDivision,
          byMentor,
        },
      };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil statistik' };
    }
  },
};

// ============================================
// MENTOR OPERATIONS (CRUD)
// ============================================

export const MentorDB = {
  // Get all mentors
  getAll(): DatabaseResult<Mentor[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.MENTORS);
      const mentors = data ? JSON.parse(data) : [];
      return { success: true, data: mentors };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data mentor' };
    }
  },

  // Get mentor by ID
  getById(id: string): DatabaseResult<Mentor | null> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const mentor = result.data?.find((m) => m.id === id) || null;
      return { success: true, data: mentor };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data mentor' };
    }
  },

  // Get mentor by NIP (for login)
  getByNip(nip: string): DatabaseResult<Mentor | null> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const mentor = result.data?.find((m) => m.nip === nip) || null;
      return { success: true, data: mentor };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data mentor' };
    }
  },

  // Authenticate mentor
  authenticate(nip: string, password: string): DatabaseResult<Mentor | null> {
    try {
      const result = this.getByNip(nip);
      if (!result.success) return { success: false, error: result.error };
      
      if (result.data && result.data.password === password) {
        // Return mentor without password
        const { password: _, ...mentorWithoutPassword } = result.data;
        return { success: true, data: mentorWithoutPassword as Mentor };
      }
      
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: 'Gagal melakukan autentikasi' };
    }
  },

  // Create mentor
  create(mentorData: Omit<Mentor, 'id'>): DatabaseResult<Mentor> {
    try {
      const validationError = validateMentor(mentorData);
      if (validationError) {
        return { success: false, error: validationError };
      }

      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      // Check if NIP already exists
      if (result.data?.some((m) => m.nip === mentorData.nip)) {
        return { success: false, error: 'NIP sudah terdaftar' };
      }

      const newMentor: Mentor = {
        ...mentorData,
        id: generateId(),
      };

      const updatedMentors = [...(result.data || []), newMentor];
      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(updatedMentors));

      return { success: true, data: newMentor };
    } catch (error) {
      return { success: false, error: 'Gagal menyimpan data mentor' };
    }
  },

  // Update mentor
  update(id: string, updates: Partial<Mentor>): DatabaseResult<Mentor> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const index = result.data?.findIndex((m) => m.id === id);
      if (index === undefined || index === -1) {
        return { success: false, error: 'Mentor tidak ditemukan' };
      }

      const updatedMentor = { ...result.data![index], ...updates };
      result.data![index] = updatedMentor;

      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(result.data));
      return { success: true, data: updatedMentor };
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate data mentor' };
    }
  },

  // Delete mentor
  delete(id: string): DatabaseResult<boolean> {
    try {
      // Check if mentor has interns
      const internResult = InternDB.getByMentorId(id);
      if (internResult.success && internResult.data && internResult.data.length > 0) {
        return { success: false, error: 'Tidak dapat menghapus mentor yang masih memiliki intern' };
      }

      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const filteredMentors = result.data?.filter((m) => m.id !== id) || [];
      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(filteredMentors));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal menghapus data mentor' };
    }
  },

  // Update intern count for mentor (count active + alumni)
  updateInternCount(mentorId: string): DatabaseResult<Mentor> {
    const internResult = InternDB.getByMentorId(mentorId);
    if (!internResult.success) return { success: false, error: internResult.error };

    const verifiedCount = internResult.data?.filter((i) => i.status === 'active' || i.status === 'alumni').length || 0;
    return this.update(mentorId, { totalInterns: verifiedCount });
  },
};

// ============================================
// GALLERY OPERATIONS (CRUD)
// ============================================

export const GalleryDB = {
  // Get all gallery photos
  getAll(): DatabaseResult<GalleryPhoto[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.GALLERY);
      const photos = data ? JSON.parse(data) : [];
      return { success: true, data: photos };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data galeri' };
    }
  },

  // Get photos by intern ID
  getByInternId(internId: string): DatabaseResult<GalleryPhoto[]> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };
      
      const photos = result.data?.filter((p) => p.internId === internId) || [];
      return { success: true, data: photos };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data galeri' };
    }
  },

  // Create gallery photo
  create(photoData: Omit<GalleryPhoto, 'id' | 'uploadedAt'>): DatabaseResult<GalleryPhoto> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const newPhoto: GalleryPhoto = {
        ...photoData,
        id: generateId(),
        uploadedAt: getCurrentTimestamp(),
      };

      const updatedPhotos = [...(result.data || []), newPhoto];
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(updatedPhotos));

      return { success: true, data: newPhoto };
    } catch (error) {
      return { success: false, error: 'Gagal menyimpan foto' };
    }
  },

  // Delete gallery photo
  delete(id: string): DatabaseResult<boolean> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const filteredPhotos = result.data?.filter((p) => p.id !== id) || [];
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(filteredPhotos));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal menghapus foto' };
    }
  },

  // Delete all photos by intern ID
  deleteByInternId(internId: string): DatabaseResult<boolean> {
    try {
      const result = this.getAll();
      if (!result.success) return { success: false, error: result.error };

      const filteredPhotos = result.data?.filter((p) => p.internId !== internId) || [];
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(filteredPhotos));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal menghapus foto' };
    }
  },
};

// ============================================
// SYNC & BACKUP OPERATIONS
// ============================================

export const DatabaseSync = {
  // Get sync status
  getStatus(): SyncStatus {
    const lastSync = localStorage.getItem(DB_KEYS.SYNC_TIMESTAMP) || '';
    return {
      lastSync,
      pendingChanges: 0, // In a real app, track pending changes
      isOnline: navigator.onLine,
    };
  },

  // Export all data (for backup)
  exportData(): DatabaseResult<string> {
    try {
      const data = {
        version: CURRENT_DB_VERSION,
        exportedAt: getCurrentTimestamp(),
        interns: InternDB.getAll().data || [],
        mentors: MentorDB.getAll().data || [],
        gallery: GalleryDB.getAll().data || [],
      };
      
      return { success: true, data: JSON.stringify(data, null, 2) };
    } catch (error) {
      return { success: false, error: 'Gagal mengexport data' };
    }
  },

  // Import data (from backup)
  importData(jsonData: string): DatabaseResult<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.version || !data.interns || !data.mentors) {
        return { success: false, error: 'Format backup tidak valid' };
      }

      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(data.interns));
      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(data.mentors));
      
      if (data.gallery) {
        localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(data.gallery));
      }

      localStorage.setItem(DB_KEYS.SYNC_TIMESTAMP, getCurrentTimestamp());
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal mengimport data' };
    }
  },

  // Clear all data
  clearAll(): DatabaseResult<boolean> {
    try {
      localStorage.removeItem(DB_KEYS.INTERNS);
      localStorage.removeItem(DB_KEYS.MENTORS);
      localStorage.removeItem(DB_KEYS.GALLERY);
      localStorage.removeItem(DB_KEYS.SYNC_TIMESTAMP);
      localStorage.removeItem(DB_KEYS.DB_VERSION);
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal menghapus data' };
    }
  },

  // Reset to initial data
  resetToDefault(): DatabaseResult<boolean> {
    try {
      this.clearAll();
      localStorage.setItem(DB_KEYS.MENTORS, JSON.stringify(mockMentors));
      localStorage.setItem(DB_KEYS.INTERNS, JSON.stringify(mockInterns));
      localStorage.setItem(DB_KEYS.DB_VERSION, CURRENT_DB_VERSION);
      localStorage.setItem(DB_KEYS.SYNC_TIMESTAMP, getCurrentTimestamp());
      
      // Re-initialize gallery
      const galleryPhotos: GalleryPhoto[] = [];
      mockInterns.forEach((intern) => {
        intern.galleryPhotos.forEach((photo, index) => {
          galleryPhotos.push({
            id: `gallery-${intern.id}-${index}`,
            internId: intern.id,
            internName: intern.name,
            photo,
            caption: `Foto kegiatan ${intern.name}`,
            uploadedAt: intern.createdAt,
          });
        });
      });
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(galleryPhotos));
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Gagal mereset data' };
    }
  },
};
