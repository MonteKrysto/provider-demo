// import { useActor } from '@xstate/react';
// import { Button } from '~/components/ui/button';
// import { Card } from '~/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
// import { practiceMachine } from '../actors/practice';
// import { PatientList } from './PatientList';
// import { NotesEditor } from './NotesEditor';

// export function PracticeDashboard() {
//   const [state, send] = useActor(practiceMachine);
//   const patientState = state.context.patientRef.getSnapshot();
//   const notesState = state.context.notesRef.getSnapshot();

//   return (
//     <div className="p-4">
//       <Card>
//         <PatientList
//           patients={patientState.context.patients}
//           onSelect={(patient) =>
//             send({ type: 'EDIT_PATIENT', data: { id: patient.id } } as const)
//           }
//         />
//         <NotesEditor
//           note={notesState.context.currentNote}
//           onSave={(content) => send({ type: 'SAVE_DRAFT', content })}
//           onLock={() => send({ type: 'LOCK_NOTE' })}
//         />
//         <Button
//           onClick={() => send({ type: 'OPEN_MODAL', content: 'patientDetails' })}
//           disabled={!patientState.matches('idle')}
//           className="mt-4"
//         >
//           View Patient Details
//         </Button>
//       </Card>

//       <Dialog
//         open={state.context.modal.isOpen}
//         onOpenChange={(open) => send({ type: open ? 'OPEN_MODAL' : 'CLOSE_MODAL' })}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Patient Details</DialogTitle>
//             <DialogDescription>
//               {state.context.activePatient
//                 ? `Name: ${state.context.activePatient.name}, Diagnosis: ${state.context.activePatient.diagnosis.join(', ')}`
//                 : 'No patient selected.'}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button onClick={() => send({ type: 'CLOSE_MODAL' })}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import { useActor } from '@xstate/react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { practiceMachine } from '../actors/practice';
import { PatientList } from './PatientList';
import { NotesEditor } from './NotesEditor';
import { BillingStatus } from './BillingStatus';
import { Calendar } from './Calendar';

export function PracticeDashboard() {
  const [state, send] = useActor(practiceMachine);
  const patientState = state.context.patientRef.getSnapshot();
  const notesState = state.context.notesRef.getSnapshot();

  // Placeholder data until billingMachine and appointmentsMachine are added
  const mockInvoices = [
    { id: '1', patientId: 'p1', amount: 150.0, status: 'pending' as const },
    { id: '2', patientId: 'p2', amount: 200.0, status: 'paid' as const },
  ];
  const mockAppointments = [
    { id: '1', patientId: 'p1', time: '2025-03-18T10:00:00Z', status: 'scheduled' as const },
    { id: '2', patientId: 'p2', time: '2025-03-19T14:00:00Z', status: 'completed' as const },
  ];

  return (
    <div className="p-4">
      <Card>
        <PatientList
          patients={patientState.context.patients}
          onSelect={(patient) =>
            send({ type: 'EDIT_PATIENT', data: { id: patient.id } } as const)
          }
        />
        <NotesEditor
          note={notesState.context.currentNote}
          onSave={(content) => send({ type: 'SAVE_DRAFT', content })}
          onLock={() => send({ type: 'LOCK_NOTE' })}
        />
        <BillingStatus invoices={mockInvoices} />
        <Calendar appointments={mockAppointments} />
        <Button
          onClick={() => send({ type: 'OPEN_MODAL', content: 'patientDetails' })}
          disabled={!patientState.matches('idle')}
          className="mt-4"
        >
          View Patient Details
        </Button>
      </Card>

      <Dialog
        open={state.context.modal.isOpen}
        onOpenChange={(open) => send({ type: open ? 'OPEN_MODAL' : 'CLOSE_MODAL' })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              {state.context.activePatient
                ? `Name: ${state.context.activePatient.name}, Diagnosis: ${state.context.activePatient.diagnosis.join(', ')}`
                : 'No patient selected.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => send({ type: 'CLOSE_MODAL' })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
