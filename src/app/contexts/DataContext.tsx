import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Intern, mockInterns } from '../data/mockData';

interface DataContextType {
  interns: Intern[];
  addIntern: (intern: Intern) => void;
  updateIntern: (id: string, updates: Partial<Intern>) => void;
  deleteIntern: (id: string) => void;
  approveIntern: (id: string) => void;
  rejectIntern: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [interns, setInterns] = useState<Intern[]>(mockInterns);

  const addIntern = (intern: Intern) => {
    setInterns((prev) => [...prev, intern]);
  };

  const updateIntern = (id: string, updates: Partial<Intern>) => {
    setInterns((prev) =>
      prev.map((intern) =>
        intern.id === id ? { ...intern, ...updates } : intern
      )
    );
  };

  const deleteIntern = (id: string) => {
    setInterns((prev) => prev.filter((intern) => intern.id !== id));
  };

  const approveIntern = (id: string) => {
    updateIntern(id, { status: 'approved' });
  };

  const rejectIntern = (id: string) => {
    deleteIntern(id);
  };

  return (
    <DataContext.Provider
      value={{
        interns,
        addIntern,
        updateIntern,
        deleteIntern,
        approveIntern,
        rejectIntern,
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
