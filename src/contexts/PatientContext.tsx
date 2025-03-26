import { createContext, useContext, ReactNode } from 'react';
import { Patient } from '../types/patient';
import { usePractice } from './PracticeContext';

interface PatientContextType {
  patients: Patient[];
  createPatient: (patient: Patient) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const { state, send } = usePractice();
  const patientState = state.context.patientRef.getSnapshot();

  const createPatient = (patient: Patient) => {
    send({ type: 'CREATE_PATIENT', patient });
  };

  const value: PatientContextType = {
    patients: patientState.context.patients,
    createPatient,
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
