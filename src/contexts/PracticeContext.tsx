import { createContext, useContext, useState,ReactNode } from 'react';
import { useActor } from '@xstate/react';
import { practiceMachine } from '../actors/practice';
import { Patient } from '../types/patient';

interface PracticeContextType {
  state: ReturnType<typeof useActor<typeof practiceMachine>>[0];
  send: ReturnType<typeof useActor<typeof practiceMachine>>[1];
  isLoading: boolean;
  error?: string;
  modal: { isOpen: boolean; content: 'patientDetails' | null };
  openModal: (content: 'patientDetails') => void;
  closeModal: () => void;
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [state, send] = useActor(practiceMachine);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const openModal = (content: 'patientDetails') => {
    send({ type: 'OPEN_MODAL', content });
  };

  const closeModal = () => {
    send({ type: 'CLOSE_MODAL' });
  };

  const value: PracticeContextType = {
    state,
    send,
    isLoading: state.context.isLoading,
    error: state.context.error,
    modal: state.context.modal,
    openModal,
    closeModal,
    activePatient,
    setActivePatient,
  };

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
}
