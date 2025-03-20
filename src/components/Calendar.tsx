import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { Appointment } from '../types/appointments';
import { Patient } from '../types/patient';

interface CalendarProps {
  appointments: Appointment[];
  activePatient: Patient | null;
  selectedAppointmentId: string | null;
  onSelectAppointment: (appointmentId: string) => void;
}

export function Calendar({ appointments, activePatient, selectedAppointmentId, onSelectAppointment }: CalendarProps) {
  // Filter appointments for the selected patient
  const patientAppointments = activePatient ? appointments.filter((appt) => appt.patientId === activePatient.id) : [];

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Time</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patientAppointments.length > 0 ? (
            patientAppointments.map((appt) => (
              <Tr
                key={appt.id}
                onClick={() => onSelectAppointment(appt.id)}
                bg={selectedAppointmentId === appt.id ? 'blue.50' : 'white'}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
              >
                <Td>{new Date(appt.time).toLocaleString()}</Td>
                <Td>
                  <Text
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="medium"
                    bg={
                      appt.status === 'scheduled'
                        ? 'blue.100'
                        : appt.status === 'canceled'
                        ? 'red.100'
                        : 'gray.100'
                    }
                    color={
                      appt.status === 'scheduled'
                        ? 'blue.800'
                        : appt.status === 'canceled'
                        ? 'red.800'
                        : 'gray.800'
                    }
                  >
                    {appt.status}
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center" color="gray.500">
                No appointments found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
