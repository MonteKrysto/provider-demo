import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { Patient } from '../types/patient';
import { useAppointments } from '../contexts';

interface CalendarProps {
  activePatient: Patient;
}

export function Calendar({ activePatient }: CalendarProps) {
  const { appointments, selectedAppointmentId, setSelectedAppointmentId } = useAppointments();

  // Filter appointments for the selected patient
  const patientAppointments = activePatient ? appointments.filter((appt) => appt.patientId === activePatient.id) : [];

  console.log('Calendar appointments:', appointments);
  console.log('Calendar patientAppointments:', patientAppointments);

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
                onClick={() => setSelectedAppointmentId(appt.id)}
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
