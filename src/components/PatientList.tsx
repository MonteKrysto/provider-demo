import { Box, Text } from '@chakra-ui/react';
import { Patient } from '../types';
import { usePatient } from '../contexts';

interface PatientListProps {
  onSelect: (patient: Patient) => void;
}

export function PatientList({ onSelect }: PatientListProps) {
  const { patients } = usePatient();

  const handleSelect = (patient: Patient) => {
    onSelect(patient);
  };

  return (
    <Box>
      {patients.length > 0 ? (
        patients.map((patient) => (
          <Box
            key={patient.id}
            p={3}
            mb={2}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            onClick={() => handleSelect(patient)}
            cursor="pointer"
            _hover={{ bg: 'gray.50' }}
          >
            <Text fontSize="md" fontWeight="medium" color="gray.800">
              {patient.name}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Diagnosis: {patient.diagnosis.join(', ') || 'None'}
            </Text>
          </Box>
        ))
      ) : (
        <Text color="gray.500">No patients found.</Text>
      )}
    </Box>
  );
}
