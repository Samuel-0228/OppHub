import React from 'react';
import { Opportunity } from '../types';
import { mockOpportunities } from '../data/mockData';

interface OpportunityContextType {
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  savedIds: string[];
  toggleSave: (id: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

export const OpportunityContext = React.createContext<OpportunityContextType | undefined>(undefined);

export function OpportunityProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>(mockOpportunities);
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <OpportunityContext.Provider value={{ opportunities, setOpportunities, savedIds, toggleSave, isAdmin, setIsAdmin }}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunities() {
  const context = React.useContext(OpportunityContext);
  if (!context) throw new Error('useOpportunities must be used within OpportunityProvider');
  return context;
}