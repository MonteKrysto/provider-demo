// import { useState } from 'react';
// import { Box, Button, Flex, Text, Textarea, VStack } from '@chakra-ui/react';
// import { Note } from '../types/notes';
// import { Patient } from '../types/patient';

// interface NotesEditorProps {
//   note: Note | null;
//   notes: Record<string, Note[]>;
//   onSave: (content: string) => void;
//   onLock: () => void;
//   activePatient: Patient | null;
// }

// export function NotesEditor({ note, notes, onSave, onLock, activePatient }: NotesEditorProps) {
//   const [content, setContent] = useState(note?.content || '');

//   // Filter notes for the selected patient
//   const patientNotes = activePatient ? notes[activePatient.id] || [] : [];

//   console.log('NotesEditor notes:', notes);
//   console.log('NotesEditor activePatient:', activePatient);
//   console.log('NotesEditor patientNotes:', patientNotes);

//   return (
//     <Box>
//       {/* List of Existing Notes */}
//       {patientNotes.length > 0 ? (
//         <VStack spacing={3} align="stretch" mb={4}>
//           {patientNotes.map((patientNote) => (
//             <Box
//               key={patientNote.id}
//               p={3}
//               borderRadius="md"
//               bg={patientNote.status === 'locked' ? 'gray.100' : 'white'}
//               border="1px solid"
//               borderColor="gray.200"
//             >
//               <Text fontSize="sm" color="gray.600">
//                 {new Date(patientNote.timestamp).toLocaleString()} - {patientNote.status}
//               </Text>
//               <Text mt={1}>{patientNote.content}</Text>
//             </Box>
//           ))}
//         </VStack>
//       ) : (
//         <Text mb={4} color="gray.500">No notes found for this patient.</Text>
//       )}

//       {/* New Note Input */}
//       <Textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write clinical note..."
//         borderColor="gray.300"
//         focusBorderColor="blue.500"
//         borderRadius="md"
//         minH="120px"
//         mb={4}
//       />
//       <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
//         <Button
//           onClick={() => {
//             onSave(content);
//             setContent(''); // Clear the textarea after saving
//           }}
//           colorScheme="blue"
//           variant="outline"
//           w={{ base: 'full', sm: 'auto' }}
//         >
//           Save Draft
//         </Button>
//         <Button
//           onClick={() => {
//             onLock();
//             setContent(''); // Clear the textarea after locking
//           }}
//           colorScheme="blue"
//           w={{ base: 'full', sm: 'auto' }}
//         >
//           Lock Note
//         </Button>
//       </Flex>
//     </Box>
//   );
// }


import { useState } from 'react';
import { Box, Button, Flex, Text, Textarea, VStack } from '@chakra-ui/react';
import { Note } from '../types/notes';
import { Patient } from '../types/patient';

interface NotesEditorProps {
  note: Note | null;
  notes: Record<string, Note[]>;
  onSave: (content: string) => void;
  onLock: () => void;
  onLockExisting: (noteId: string) => void;
  onUpdate: (noteId: string, content: string) => void;
  activePatient: Patient | null;
}

export function NotesEditor({ note, notes, onSave, onLock, onLockExisting, onUpdate, activePatient }: NotesEditorProps) {
  const [content, setContent] = useState(note?.content || '');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Filter notes for the selected patient
  const patientNotes = activePatient ? notes[activePatient.id] || [] : [];

  console.log('NotesEditor notes:', notes);
  console.log('NotesEditor activePatient:', activePatient);
  console.log('NotesEditor patientNotes:', patientNotes);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setContent(note.content);
  };

  const handleSave = () => {
    if (selectedNote) {
      onUpdate(selectedNote.id, content);
    } else {
      onSave(content);
    }
    setContent('');
    setSelectedNote(null);
  };

  return (
    <Box>
      {/* List of Existing Notes */}
      {patientNotes.length > 0 ? (
        <VStack spacing={3} align="stretch" mb={4}>
          {patientNotes.map((patientNote) => (
            <Box
              key={patientNote.id}
              p={3}
              borderRadius="md"
              bg={patientNote.status === 'locked' ? 'gray.100' : 'white'}
              border="1px solid"
              borderColor="gray.200"
              onClick={() => handleSelectNote(patientNote)}
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(patientNote.timestamp).toLocaleString()} - {patientNote.status}
                  </Text>
                  <Text mt={1}>{patientNote.content}</Text>
                </Box>
                {patientNote.status === 'draft' && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting the note when clicking the button
                      onLockExisting(patientNote.id);
                    }}
                  >
                    Lock
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text mb={4} color="gray.500">No notes found for this patient.</Text>
      )}

      {/* New/Edit Note Input */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write clinical note..."
        borderColor="gray.300"
        focusBorderColor="blue.500"
        borderRadius="md"
        minH="120px"
        mb={4}
        isDisabled={selectedNote?.status === 'locked'}
      />
      <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
        <Button
          onClick={handleSave}
          colorScheme="blue"
          variant="outline"
          w={{ base: 'full', sm: 'auto' }}
          isDisabled={selectedNote?.status === 'locked'}
        >
          {selectedNote ? 'Update Note' : 'Save Draft'}
        </Button>
        {!selectedNote && (
          <Button
            onClick={() => {
              onLock();
              setContent('');
            }}
            colorScheme="blue"
            w={{ base: 'full', sm: 'auto' }}
          >
            Lock Note
          </Button>
        )}
      </Flex>
    </Box>
  );
}
