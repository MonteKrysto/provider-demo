import { useActor } from '@xstate/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { practiceMachine } from '../actors/practice';
import { PatientList } from './PatientList';
import { NotesEditor } from './NotesEditor';

export function PracticeDashboard() {
  const [state, send] = useActor(practiceMachine);
  const patientState = state.context.patientRef.getSnapshot();
  const notesState = state.context.notesRef.getSnapshot();

  return (
    <div className="p-4">
      <Card>
        <PatientList
          patients={patientState.context.patients}
          onSelect={(patient) => send({ type: 'EDIT_PATIENT', data: { id: patient.id } })}
        />
        <NotesEditor
          note={notesState.context.currentNote}
          onSave={(content) => send({ type: 'SAVE_DRAFT', content })}
          onLock={() => send('LOCK_NOTE')}
        />
        <Button
          onClick={() => send({ type: 'EDIT_PATIENT', data: { name: 'Updated' } })}
          disabled={!patientState.matches('idle')}
        >
          Update Patient
        </Button>
      </Card>
    </div>
  );
}
