import { memo, useState, useMemo } from 'react';
import { Box, Button, Flex, Text, Textarea, VStack } from '@chakra-ui/react';
import { Note } from '../types/notes';
import { Patient } from '../types/patient';
import { useNotes } from '../contexts';

interface NotesEditorProps {
  activePatient: Patient;
}

function NotesEditorComponent({ activePatient }: NotesEditorProps) {
  const { currentNote, notes, saveDraft, lockNote, lockExistingNote, updateNote } = useNotes();
  const [content, setContent] = useState(currentNote?.content || '');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Filter notes for the selected patient
  const patientNotes = useMemo(() => {
    return activePatient ? notes[activePatient.id] || [] : [];
  }, [activePatient, notes]);

  console.log('NotesEditor notes:', notes);
  console.log('NotesEditor activePatient:', activePatient);
  console.log('NotesEditor patientNotes:', patientNotes);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setContent(note.content);
  };

  const handleSave = () => {
    if (selectedNote) {
      updateNote(selectedNote.id, content, activePatient);
    } else {
      saveDraft(content, activePatient);
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
                      lockExistingNote(patientNote.id, activePatient);
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
              lockNote(activePatient);
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

export const NotesEditor = memo(NotesEditorComponent);