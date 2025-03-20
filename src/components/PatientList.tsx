// import { Table } from '@chakra-ui/react';
// import type { Patient } from '../types';

// interface PatientListProps {
//   patients: Patient[];
//   onSelect: (patient: Patient) => void; // Triggers EDIT_PATIENT event
// }

// export function PatientList({ patients, onSelect }: PatientListProps) {
//   return (
//     <div className="overflow-x-auto">
//       <Table>
//         <thead>
//           <tr>
//             <th className="w-[200px]">Name</th>
//             <th>Diagnosis</th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.length > 0 ? (
//             patients.map((patient) => (
//               <tr
//                 key={patient.id}
//                 className="cursor-pointer hover:bg-gray-100"
//                 onClick={() => onSelect(patient)}
//               >
//                 <td className="font-medium">{patient.name}</td>
//                 <td>{patient.diagnosis.join(', ') || 'No diagnosis'}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={2} className="text-center text-gray-500">
//                 No patients found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );
// }


import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Patient } from '../types/patient';

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

export function PatientList({ patients, onSelect }: PatientListProps) {
  console.log('PatientList patients:', patients);

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Diagnosis</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Tr
                key={patient.id}
                onClick={() => onSelect(patient)}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              >
                <Td>{patient.name}</Td>
                <Td>{patient.diagnosis?.join(', ') || 'No diagnosis'}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center" color="gray.500">
                No patients found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
