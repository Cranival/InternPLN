import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mentor } from '../data/mockData';
import { MentorDB } from '../lib/database';

// Session storage key
const SESSION_KEY = 'pln_auth_session';

interface AuthContextType {
  currentMentor: Mentor | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  updateCurrentMentor: (updates: Partial<Mentor>) => void;
  refreshMentor: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);

  // Restore session on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const mentor = JSON.parse(savedSession);
        // Verify mentor still exists in database
        const result = MentorDB.getById(mentor.id);
        if (result.success && result.data) {
          setCurrentMentor(result.data);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const result = MentorDB.authenticate(username, password);
    
    if (result.success && result.data) {
      setCurrentMentor(result.data);
      // Save session
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentMentor(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const updateCurrentMentor = (updates: Partial<Mentor>) => {
    if (currentMentor) {
      const result = MentorDB.update(currentMentor.id, updates);
      if (result.success && result.data) {
        setCurrentMentor(result.data);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
      }
    }
  };

  const refreshMentor = () => {
    if (currentMentor) {
      const result = MentorDB.getById(currentMentor.id);
      if (result.success && result.data) {
        setCurrentMentor(result.data);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentMentor,
        login,
        logout,
        isAuthenticated: !!currentMentor,
        updateCurrentMentor,
        refreshMentor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
