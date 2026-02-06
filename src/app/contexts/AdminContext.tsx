import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Admin credentials (in real app, this would be in backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const ADMIN_SESSION_KEY = 'pln_admin_session';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (savedSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
