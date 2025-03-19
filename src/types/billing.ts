export interface Invoice {
  id: string;
  patientId: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'disputed';
}
