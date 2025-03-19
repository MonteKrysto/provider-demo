export interface Appointment {
  id: string;
  patientId: string;
  time: string; // ISO date
  status: 'scheduled' | 'completed' | 'canceled';
}
