export interface Note {
  id: string;
  patientId: string;
  content: string;
  status: 'draft' | 'locked';
  timestamp: string;
  version: number;
}
