import { Box, Heading, Text } from '@chakra-ui/react';
import { NotesEditor } from '../NotesEditor';
import { usePracticeDashboard } from './PracticeDashboardContext';

export function Notes() {
  const { activePatient } = usePracticeDashboard();
  console.log('activePatient in Notes:', activePatient);

  return (
    <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
      <Heading size="md" mb={4} color="gray.700">Notes</Heading>
      {activePatient ? (
        <NotesEditor activePatient={activePatient} />
      ) : (
        <Text color="gray.500">Please select a patient to view or add notes.</Text>
      )}
    </Box>
  );
}
