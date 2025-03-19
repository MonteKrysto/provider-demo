import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Appointment } from '../types/appointments';

interface CalendarProps {
  appointments: Appointment[];
}

export function Calendar({ appointments }: CalendarProps) {
  console.log('Calendar appointments:', appointments);

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">Appointments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Patient ID</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patientId}</TableCell>
                <TableCell>{new Date(appointment.time).toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No appointments scheduled.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}