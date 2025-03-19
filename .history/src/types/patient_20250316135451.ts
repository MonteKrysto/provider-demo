export interface Patient {
  id: string;
  name: string;
  diagnosis: string[];
  medications: Medication[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}
