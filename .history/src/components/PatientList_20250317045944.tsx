import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void; // Triggers EDIT_PATIENT event
}

export function PatientList({ patients, onSelect }: PatientListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Diagnosis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <TableRow
                key={patient.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onSelect(patient)}
              >
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.diagnosis.join(', ') || 'No diagnosis'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-gray-500">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}