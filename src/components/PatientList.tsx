import { Box, Text } from '@chakra-ui/react';
import { Patient } from '../types';
import { usePatient, usePractice } from '../contexts';

interface PatientListProps {
  onSelect: (patient: Patient) => void;
}

export function PatientList({ onSelect }: PatientListProps) {
  const { patients } = usePatient();
  const { activePatient, setActivePatient } = usePractice();

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
            bg={activePatient?.id === patient.id ? 'blue.50' : 'white'}
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


// import { Box, Flex, Text } from '@chakra-ui/react';
// import { Patient } from '../types/patient';
// import { usePracticeDashboard } from './PracticeDashboard/PracticeDashboardContext';

// interface PatientListProps {
//   patients: Patient[];
// }

// export function PatientList({ patients }: PatientListProps) {
//   const { activePatient, setActivePatient } = usePracticeDashboard();

//   return (
//     <Box>
//       {patients.length > 0 ? (
//         patients.map((patient) => (
//         <Flex
//           key={patient.id}
//           p={3}
//           borderRadius="md"
//           bg={activePatient?.id === patient.id ? 'blue.50' : 'white'} // Highlight if selected
//           border="1px solid"
//           borderColor={activePatient?.id === patient.id ? 'blue.200' : 'gray.200'} // Highlight border if selected
//           mb={2}
//           align="center"
//           justify="space-between"
//           onClick={() => setActivePatient(patient)}
//           cursor="pointer"
//           _hover={{ bg: activePatient?.id === patient.id ? 'blue.50' : 'gray.50' }} // Maintain highlight on hover
//         >
//           <Box>
//             <Text fontWeight="medium">{patient.name}</Text>
//             <Text fontSize="sm" color="gray.600">
//               {Array.isArray(patient.diagnosis) ? patient.diagnosis.join(', ') : patient.diagnosis || 'No diagnosis'}
//             </Text>
//           </Box>
//           <Text fontSize="sm" color="gray.500">
//             ID: {patient.id}
//           </Text>
//         </Flex>
//       ))}
//     </Box>
//   );
// }
