import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePractice } from './PracticeContext';
import { Appointment } from '../types/appointments';

interface AppointmentsContextType {
  appointments: Appointment[];
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (appointmentId: string | null) => void;
  scheduleAppointment: (appointment: Appointment) => void;
  rescheduleAppointment: (appointmentId: string, time: string) => void;
  cancelAppointment: (appointmentId: string) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { state, send } = usePractice();
  const [appointments, setAppointments] = useState(state.context.appointmentsRef.getSnapshot().context.appointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Subscribe to appointmentsMachine state changes
  useEffect(() => {
    const subscription = state.context.appointmentsRef.subscribe((newState) => {
      console.log('Appointments state updated:', newState.context.appointments);
      setAppointments(newState.context.appointments);
      // Clear selection if the selected appointment is no longer in the list
      if (selectedAppointmentId && !newState.context.appointments.some((appt) => appt.id === selectedAppointmentId)) {
        setSelectedAppointmentId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [state.context.appointmentsRef, selectedAppointmentId]);

  const scheduleAppointment = (appointment: Appointment) => {
    console.log('Sending SCHEDULE event with appointment:', appointment); // Debug log
    send({ type: 'SCHEDULE', appointment });
  };

  const rescheduleAppointment = (appointmentId: string, time: string) => {
    send({ type: 'RESCHEDULE', appointment: { id: appointmentId, time } });
    setSelectedAppointmentId(null); // Clear selection after rescheduling
  };

  const cancelAppointment = (appointmentId: string) => {
    send({ type: 'CANCEL', appointment: { id: appointmentId } });
    setSelectedAppointmentId(null); // Clear selection after canceling
  };

  const value: AppointmentsContextType = {
    appointments,
    selectedAppointmentId,
    setSelectedAppointmentId,
    scheduleAppointment,
    rescheduleAppointment,
    cancelAppointment,
  };

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}
