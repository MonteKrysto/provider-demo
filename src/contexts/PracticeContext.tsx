import { createContext, useContext, ReactNode } from 'react';
import { useActor } from '@xstate/react';
import { practiceMachine } from '../actors/practice';
import { Patient } from 'types';

interface PracticeContextType {
  state: any;
  send: (event: any) => void;
  isLoading: boolean;
  error?: string;
  modal: { isOpen: boolean; content: 'patientDetails' | null };
  openModal: (content: 'patientDetails') => void;
  closeModal: () => void;
  activePatient: Patient | null;
  setActivePatient: (patient: Patient) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [state, send] = useActor(practiceMachine);

  const isLoading = state.context.isLoading;
  const error = state.context.error;
  const modal = state.context.modal;
  const activePatient = state.context.activePatient;

  // Debug log for modal state changes
  console.log('PracticeContext modal state:', modal);

  const openModal = (content: 'patientDetails') => {
    send({ type: 'OPEN_MODAL', content });
  };

  const closeModal = () => {
    send({ type: 'CLOSE_MODAL' });
  };

  const setActivePatient = (patient: Patient) => {
    send({ type: 'EDIT_PATIENT', data: patient });
  };

  const value: PracticeContextType = {
    state,
    send,
    isLoading,
    error,
    modal,
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
