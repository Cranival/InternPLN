import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Intern, Mentor, GalleryPhoto } from '../data/mockData';
import { 
  initializeDatabase, 
  InternDB, 
  MentorDB, 
  GalleryDB, 
  DatabaseSync,
  SyncStatus 
} from '../lib/database';
import { toast } from 'sonner';

interface InternStatistics {
  total: number;
  active: number;
  alumni: number;
  pending: number;
  byDivision: Record<string, number>;
  byMentor: Record<string, number>;
}

interface DataContextType {
  // Data
  interns: Intern[];
  mentors: Mentor[];
  gallery: GalleryPhoto[];
  
  // Loading states
  isLoading: boolean;
  
  // Sync status
  syncStatus: SyncStatus;
  
  // Intern CRUD
  addIntern: (intern: Omit<Intern, 'id' | 'createdAt'>) => Promise<boolean>;
  updateIntern: (id: string, updates: Partial<Intern>) => Promise<boolean>;
  deleteIntern: (id: string) => Promise<boolean>;
  approveIntern: (id: string) => Promise<boolean>;
  rejectIntern: (id: string) => Promise<boolean>;
  getInternById: (id: string) => Intern | undefined;
  getInternsByMentor: (mentorId: string) => Intern[];
  searchInterns: (query: string) => Intern[];
  
  // Mentor operations
  getMentorById: (id: string) => Mentor | undefined;
  updateMentor: (id: string, updates: Partial<Mentor>) => Promise<boolean>;
  
  // Gallery operations
  getGalleryByIntern: (internId: string) => GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id' | 'uploadedAt'>) => Promise<boolean>;
  deleteGalleryPhoto: (id: string) => Promise<boolean>;
  
  // Statistics
  getStatistics: () => InternStatistics;
  
  // Data management
  refreshData: () => Promise<void>;
  exportData: () => string | null;
  importData: (jsonData: string) => Promise<boolean>;
  resetData: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: '',
    pendingChanges: 0,
    isOnline: navigator.onLine,
  });

  // Initialize database and load data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Initialize database with mock data if needed
        initializeDatabase();
        
        // Load data from localStorage
        await refreshData();
      } catch (error) {
        console.error('Error initializing database:', error);
        toast.error('Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Listen for online/offline status
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('pln_')) {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Refresh data from database
  const refreshData = useCallback(async () => {
    const internsResult = InternDB.getAll();
    const mentorsResult = MentorDB.getAll();
    const galleryResult = GalleryDB.getAll();

    if (internsResult.success && internsResult.data) {
      setInterns(internsResult.data);
    }
    if (mentorsResult.success && mentorsResult.data) {
      setMentors(mentorsResult.data);
    }
    if (galleryResult.success && galleryResult.data) {
      setGallery(galleryResult.data);
    }

    setSyncStatus(DatabaseSync.getStatus());
  }, []);

  // ============================================
  // INTERN CRUD OPERATIONS
  // ============================================

  const addIntern = useCallback(async (internData: Omit<Intern, 'id' | 'createdAt'>): Promise<boolean> => {
    const result = InternDB.create(internData);
    
    if (result.success && result.data) {
      setInterns(prev => [...prev, result.data!]);
      
      // Update mentor intern count
      MentorDB.updateInternCount(internData.mentorId);
      
      setSyncStatus(DatabaseSync.getStatus());
      return true;
    } else {
      toast.error(result.error || 'Gagal menambah intern');
      return false;
    }
  }, []);

  const updateIntern = useCallback(async (id: string, updates: Partial<Intern>): Promise<boolean> => {
    const result = InternDB.update(id, updates);
    
    if (result.success && result.data) {
      setInterns(prev => prev.map(i => i.id === id ? result.data! : i));
      setSyncStatus(DatabaseSync.getStatus());
      return true;
    } else {
      toast.error(result.error || 'Gagal mengupdate intern');
      return false;
    }
  }, []);

  const deleteIntern = useCallback(async (id: string): Promise<boolean> => {
    const intern = interns.find(i => i.id === id);
    const result = InternDB.delete(id);
    
    if (result.success) {
      setInterns(prev => prev.filter(i => i.id !== id));
      setGallery(prev => prev.filter(g => g.internId !== id));
      
      // Update mentor intern count
      if (intern) {
        MentorDB.updateInternCount(intern.mentorId);
      }
      
      setSyncStatus(DatabaseSync.getStatus());
      return true;
    } else {
      toast.error(result.error || 'Gagal menghapus intern');
      return false;
    }
  }, [interns]);

  const approveIntern = useCallback(async (id: string): Promise<boolean> => {
    const result = InternDB.approve(id);
    
    if (result.success && result.data) {
      // Use status from result.data (will be 'active' or 'alumni' based on period)
      setInterns(prev => prev.map(i => i.id === id ? result.data! : i));
      
      // Update mentor intern count
      const intern = interns.find(i => i.id === id);
      if (intern) {
        MentorDB.updateInternCount(intern.mentorId);
        
        // Refresh mentors
        const mentorsResult = MentorDB.getAll();
        if (mentorsResult.success && mentorsResult.data) {
          setMentors(mentorsResult.data);
        }
      }
      
      setSyncStatus(DatabaseSync.getStatus());
      return true;
    } else {
      toast.error(result.error || 'Gagal memverifikasi peserta');
      return false;
    }
  }, [interns]);

  const rejectIntern = useCallback(async (id: string): Promise<boolean> => {
    return deleteIntern(id);
  }, [deleteIntern]);

  const getInternById = useCallback((id: string): Intern | undefined => {
    return interns.find(i => i.id === id);
  }, [interns]);

  const getInternsByMentor = useCallback((mentorId: string): Intern[] => {
    return interns.filter(i => i.mentorId === mentorId);
  }, [interns]);

  const searchInterns = useCallback((query: string): Intern[] => {
    if (!query.trim()) return interns;
    
    const searchLower = query.toLowerCase();
    return interns.filter(intern =>
      intern.name.toLowerCase().includes(searchLower) ||
      intern.school.toLowerCase().includes(searchLower) ||
      intern.division.toLowerCase().includes(searchLower) ||
      intern.major.toLowerCase().includes(searchLower)
    );
  }, [interns]);

  // ============================================
  // MENTOR OPERATIONS
  // ============================================

  const getMentorById = useCallback((id: string): Mentor | undefined => {
    return mentors.find(m => m.id === id);
  }, [mentors]);

  const updateMentor = useCallback(async (id: string, updates: Partial<Mentor>): Promise<boolean> => {
    const result = MentorDB.update(id, updates);
    
    if (result.success && result.data) {
      setMentors(prev => prev.map(m => m.id === id ? result.data! : m));
      return true;
    } else {
      toast.error(result.error || 'Gagal mengupdate mentor');
      return false;
    }
  }, []);

  // ============================================
  // GALLERY OPERATIONS
  // ============================================

  const getGalleryByIntern = useCallback((internId: string): GalleryPhoto[] => {
    return gallery.filter(g => g.internId === internId);
  }, [gallery]);

  const addGalleryPhoto = useCallback(async (photoData: Omit<GalleryPhoto, 'id' | 'uploadedAt'>): Promise<boolean> => {
    const result = GalleryDB.create(photoData);
    
    if (result.success && result.data) {
      setGallery(prev => [...prev, result.data!]);
      return true;
    } else {
      toast.error(result.error || 'Gagal menambah foto');
      return false;
    }
  }, []);

  const deleteGalleryPhoto = useCallback(async (id: string): Promise<boolean> => {
    const result = GalleryDB.delete(id);
    
    if (result.success) {
      setGallery(prev => prev.filter(g => g.id !== id));
      return true;
    } else {
      toast.error(result.error || 'Gagal menghapus foto');
      return false;
    }
  }, []);

  // ============================================
  // STATISTICS
  // ============================================

  const getStatistics = useCallback((): InternStatistics => {
    const byDivision: Record<string, number> = {};
    const byMentor: Record<string, number> = {};

    interns.forEach(intern => {
      byDivision[intern.division] = (byDivision[intern.division] || 0) + 1;
      byMentor[intern.mentorId] = (byMentor[intern.mentorId] || 0) + 1;
    });

    return {
      total: interns.length,
      active: interns.filter(i => i.status === 'active').length,
      alumni: interns.filter(i => i.status === 'alumni').length,
      pending: interns.filter(i => i.status === 'pending').length,
      byDivision,
      byMentor,
    };
  }, [interns]);

  // ============================================
  // DATA MANAGEMENT
  // ============================================

  const exportData = useCallback((): string | null => {
    const result = DatabaseSync.exportData();
    if (result.success && result.data) {
      return result.data;
    }
    toast.error(result.error || 'Gagal export data');
    return null;
  }, []);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    const result = DatabaseSync.importData(jsonData);
    
    if (result.success) {
      await refreshData();
      toast.success('Data berhasil diimport');
      return true;
    } else {
      toast.error(result.error || 'Gagal import data');
      return false;
    }
  }, [refreshData]);

  const resetData = useCallback(async (): Promise<boolean> => {
    const result = DatabaseSync.resetToDefault();
    
    if (result.success) {
      await refreshData();
      toast.success('Data berhasil direset ke default');
      return true;
    } else {
      toast.error(result.error || 'Gagal reset data');
      return false;
    }
  }, [refreshData]);

  return (
    <DataContext.Provider
      value={{
        // Data
        interns,
        mentors,
        gallery,
        
        // Loading states
        isLoading,
        
        // Sync status
        syncStatus,
        
        // Intern CRUD
        addIntern,
        updateIntern,
        deleteIntern,
        approveIntern,
        rejectIntern,
        getInternById,
        getInternsByMentor,
        searchInterns,
        
        // Mentor operations
        getMentorById,
        updateMentor,
        
        // Gallery operations
        getGalleryByIntern,
        addGalleryPhoto,
        deleteGalleryPhoto,
        
        // Statistics
        getStatistics,
        
        // Data management
        refreshData,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
