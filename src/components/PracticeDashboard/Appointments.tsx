import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Calendar } from '../Calendar';
import { useAppointments } from '../../contexts';
import { usePracticeDashboard } from './PracticeDashboardContext';

interface AppointmentsProps {
  canModifyAppointment: boolean;
}

export function Appointments({ canModifyAppointment }: AppointmentsProps) {
  const { activePatient } = usePracticeDashboard();
  const { selectedAppointmentId, scheduleAppointment, rescheduleAppointment, cancelAppointment } = useAppointments();

  return (
    <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
      <Heading size="md" mb={4} color="gray.700">Appointments</Heading>
      {activePatient ? (
        <>
          <Calendar activePatient={activePatient} />
          <Flex gap={3} mt={4} direction={{ base: 'column', sm: 'row' }}>
            <Button
              onClick={() =>
                activePatient &&
                scheduleAppointment({
                  patientId: activePatient.id,
                  time: '2025-03-20T10:00:00Z',
                  id: crypto.randomUUID(),
                  status: 'scheduled',
                })
              }
              colorScheme="blue"
              w={{ base: 'full', sm: 'auto' }}
            >
              Schedule Appointment
            </Button>
            <Button
              onClick={() => selectedAppointmentId && rescheduleAppointment(selectedAppointmentId, '2025-03-20T11:00:00Z')}
              isDisabled={!canModifyAppointment}
              colorScheme="blue"
              w={{ base: 'full', sm: 'auto' }}
            >
              Reschedule Appointment
            </Button>
            <Button
              onClick={() => selectedAppointmentId && cancelAppointment(selectedAppointmentId)}
              isDisabled={!canModifyAppointment}
              colorScheme="blue"
              w={{ base: 'full', sm: 'auto' }}
            >
              Cancel Appointment
            </Button>
          </Flex>
        </>
      ) : (
        <Text color="gray.500">Please select a patient to view appointments.</Text>
      )}
    </Box>
  );
}
