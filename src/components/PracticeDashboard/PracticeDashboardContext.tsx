import { createContext, useContext, ReactNode } from 'react';
import { Patient } from '../../types/patient';

interface PracticeDashboardContextType {
  newPatientName: string;
  setNewPatientName: (name: string) => void;
  newPatientDiagnosis: string;
  setNewPatientDiagnosis: (diagnosis: string) => void;
  isAddPatientModalOpen: boolean;
  setIsAddPatientModalOpen: (isOpen: boolean) => void;
  handleAddPatient: () => void;
  patients: Patient[];
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
}

const PracticeDashboardContext = createContext<PracticeDashboardContextType | undefined>(undefined);

export function PracticeDashboardProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PracticeDashboardContextType;
}) {
  return <PracticeDashboardContext.Provider value={value}>{children}</PracticeDashboardContext.Provider>;
}

export function usePracticeDashboard() {
  const context = useContext(PracticeDashboardContext);
  if (!context) {
    throw new Error('usePracticeDashboard must be used within a PracticeDashboardProvider');
  }
  return context;
}
