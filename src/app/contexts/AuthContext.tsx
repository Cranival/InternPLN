import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Mentor, mockMentors } from '../data/mockData';

interface AuthContextType {
  currentMentor: Mentor | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);

  const login = (username: string, password: string): boolean => {
    const mentor = mockMentors.find(
      (m) => m.nip === username && m.password === password
    );
    if (mentor) {
      setCurrentMentor(mentor);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentMentor(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentMentor,
        login,
        logout,
        isAuthenticated: !!currentMentor,
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
