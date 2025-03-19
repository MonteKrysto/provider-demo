// import { useActor } from '@xstate/react';
// import { Button } from '~/components/ui/button';
// import { Card } from '~/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
// import { practiceMachine } from '../actors/practice';
// import { PatientList } from './PatientList';
// import { NotesEditor } from './NotesEditor';
// import { BillingStatus } from './BillingStatus';
// import { Calendar } from './Calendar';

// export function PracticeDashboard() {
//   const [state, send] = useActor(practiceMachine);
//   const patientState = state.context.patientRef.getSnapshot();
//   const notesState = state.context.notesRef.getSnapshot();
//   const billingState = state.context.billingRef.getSnapshot();
//   const appointmentsState = state.context.appointmentsRef.getSnapshot();

//   // Mock patient for testing
//   const mockPatient = { id: 'p1', name: 'Patient 1', diagnosis: [], medications: [] };

//   return (
//     <div className="p-4">
//       <Card className="p-4">
//         <h1 className="text-2xl font-bold mb-4">Practice Dashboard</h1>

//         {/* Patient List */}
//         <PatientList
//           patients={patientState.context.patients}
//           onSelect={(patient) => send({ type: 'EDIT_PATIENT', data: { id: patient.id } })}
//         />

//         {/* Notes Editor */}
//         <NotesEditor
//           note={notesState.context.currentNote}
//           notes={notesState.context.notes} // Pass full notes record
//           onSave={(content) => send({ type: 'SAVE_DRAFT', content, activePatient: mockPatient })}
//           onLock={() => send({ type: 'LOCK_NOTE', activePatient: mockPatient })}
//         />

//         {/* Billing Status */}
//         <BillingStatus invoices={billingState.context.invoices} />
//         <div className="flex gap-2 mt-2">
//           <Button onClick={() => send({ type: 'GENERATE_INVOICE', patientId: 'p1', amount: 150 })}>
//             Generate Invoice
//           </Button>
//           <Button
//             onClick={() =>
//               send({ type: 'PROCESS_PAYMENT', invoiceId: billingState.context.invoices[0]?.id || '' })
//             }
//             disabled={!billingState.context.invoices.length}
//           >
//             Process Payment
//           </Button>
//         </div>

//         {/* Calendar */}
//         <Calendar appointments={appointmentsState.context.appointments} />
//         <div className="flex gap-2 mt-2">
//           <Button
//             onClick={() =>
//               send({
//                 type: 'SCHEDULE',
//                 appointment: {
//                   patientId: 'p1',
//                   time: '2025-03-20T10:00:00Z',
//                   id: crypto.randomUUID(),
//                   status: 'scheduled',
//                 },
//               })
//             }
//           >
//             Schedule Appointment
//           </Button>
//           <Button
//             onClick={() =>
//               send({
//                 type: 'RESCHEDULE',
//                 appointment: {
//                   id: appointmentsState.context.appointments[0]?.id || '',
//                   time: '2025-03-20T11:00:00Z',
//                 },
//               })
//             }
//             disabled={!appointmentsState.context.appointments.length}
//           >
//             Reschedule Appointment
//           </Button>
//           <Button
//             onClick={() =>
//               send({
//                 type: 'CANCEL',
//                 appointment: { id: appointmentsState.context.appointments[0]?.id || '' },
//               })
//             }
//             disabled={!appointmentsState.context.appointments.length}
//           >
//             Cancel Appointment
//           </Button>
//         </div>

//         {/* Modal for Patient Details */}
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


// import { useActor } from '@xstate/react';
// import { Button } from '~/components/ui/button';
// import { Card } from '~/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
// import { practiceMachine } from '../actors/practice';
// import { PatientList } from './PatientList';
// import { NotesEditor } from './NotesEditor';
// import { BillingStatus } from './BillingStatus';
// import { Calendar } from './Calendar';

// export function PracticeDashboard() {
//   const [state, send] = useActor(practiceMachine);
//   const patientState = state.context.patientRef.getSnapshot();
//   const notesState = state.context.notesRef.getSnapshot();
//   const billingState = state.context.billingRef.getSnapshot();
//   const appointmentsState = state.context.appointmentsRef.getSnapshot();

//   const mockPatient = patientState.context.patients[0] || { id: 'p1', name: 'Patient 1', diagnosis: [], medications: [] };
//   console.log('state', state);
//   if (state.context.isLoading) {
//     return <div>Loading...</div>; // Simple loading indicator
//   }

//   return (
//     <div className="p-4">
//       <Card className="p-4">
//         <h1 className="text-2xl font-bold mb-4">Practice Dashboard</h1>

//         <PatientList
//           patients={patientState.context.patients}
//           onSelect={(patient) => send({ type: 'EDIT_PATIENT', data: { id: patient.id } })}
//         />
//         <Button
//           onClick={() =>
//             send({
//               type: 'EDIT_PATIENT',
//               data: { id: 'p3', name: 'New Patient', diagnosis: ['New Diagnosis'] },
//             })
//           }
//           className="mt-2"
//         >
//           Add New Patient
//         </Button>

//         <NotesEditor
//           note={notesState.context.currentNote}
//           notes={notesState.context.notes}
//           onSave={(content) => send({ type: 'SAVE_DRAFT', content, activePatient: mockPatient })}
//           onLock={() => send({ type: 'LOCK_NOTE', activePatient: mockPatient })}
//         />

//         <BillingStatus invoices={billingState.context.invoices} />
//         <div className="flex gap-2 mt-2">
//           <Button onClick={() => send({ type: 'GENERATE_INVOICE', patientId: mockPatient.id, amount: 150 })}>
//             Generate Invoice
//           </Button>
//           <Button
//             onClick={() => send({ type: 'PROCESS_PAYMENT', invoiceId: billingState.context.invoices[0]?.id || '' })}
//             disabled={!billingState.context.invoices.length}
//           >
//             Process Payment
//           </Button>
//         </div>

//         <Calendar appointments={appointmentsState.context.appointments} />
//         <div className="flex gap-2 mt-2">
//           <Button
//             onClick={() =>
//               send({
//                 type: 'SCHEDULE',
//                 appointment: {
//                   patientId: mockPatient.id,
//                   time: '2025-03-20T10:00:00Z',
//                   id: crypto.randomUUID(),
//                   status: 'scheduled',
//                 },
//               })
//             }
//           >
//             Schedule Appointment
//           </Button>
//           <Button
//             onClick={() =>
//               send({
//                 type: 'RESCHEDULE',
//                 appointment: {
//                   id: appointmentsState.context.appointments[0]?.id || '',
//                   time: '2025-03-20T11:00:00Z',
//                 },
//               })
//             }
//             disabled={!appointmentsState.context.appointments.length}
//           >
//             Reschedule Appointment
//           </Button>
//           <Button
//             onClick={() =>
//               send({
//                 type: 'CANCEL',
//                 appointment: { id: appointmentsState.context.appointments[0]?.id || '' },
//               })
//             }
//             disabled={!appointmentsState.context.appointments.length}
//           >
//             Cancel Appointment
//           </Button>
//         </div>

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
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { practiceMachine } from '../actors/practice';
import { PatientList } from './PatientList';
import { NotesEditor } from './NotesEditor';
import { BillingStatus } from './BillingStatus';
import { Calendar } from './Calendar';

export function PracticeDashboard() {
  const [state, send] = useActor(practiceMachine);
  const patientState = state.context.patientRef.getSnapshot();
  const notesState = state.context.notesRef.getSnapshot();
  const billingState = state.context.billingRef.getSnapshot();
  const appointmentsState = state.context.appointmentsRef.getSnapshot();

  const mockPatient = patientState.context.patients[0] || { id: 'p1', name: 'Patient 1', diagnosis: [], medications: [] };

  // Form state for adding a new patient
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  const handleAddPatient = () => {
    if (newPatientName.trim()) {
      const newPatient = {
        id: crypto.randomUUID(),
        name: newPatientName,
        diagnosis: newPatientDiagnosis.split(',').map((d) => d.trim()).filter(Boolean),
        medications: [],
      };
      send({ type: 'CREATE_PATIENT', patient: newPatient });
      setNewPatientName('');
      setNewPatientDiagnosis('');
      setIsAddPatientModalOpen(false);
    }
  };

  if (state.context.isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-600">Loading...</div>;
  }

  if (state.context.error) {
    return (
      <div className="p-4 min-h-screen bg-gray-100">
        <Card className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-700">Error</h1>
          <p className="text-red-600 mb-4">{state.context.error}</p>
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto"> {/* Constrain width with side margins */}
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">Practice Dashboard</h1>

          {/* Patient List Section */}
          <section className="mb-8 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Patients</h2>
            <PatientList
              patients={patientState.context.patients}
              onSelect={(patient) => send({ type: 'EDIT_PATIENT', data: { id: patient.id } })}
            />
            <Dialog open={isAddPatientModalOpen} onOpenChange={setIsAddPatientModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Add New Patient</DialogTitle>
                  <DialogDescription className="text-gray-600">Enter the details for the new patient.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Input
                      id="patient-name"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="Enter patient name"
                      className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="patient-diagnosis" className="block text-sm font-medium text-gray-700">
                      Diagnosis (comma-separated)
                    </label>
                    <Input
                      id="patient-diagnosis"
                      value={newPatientDiagnosis}
                      onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                      placeholder="e.g., Anxiety, Depression"
                      className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsAddPatientModalOpen(false)} variant="outline" className="mr-2 text-gray-600">
                    Cancel
                  </Button>
                  <Button onClick={handleAddPatient} disabled={!newPatientName.trim()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    Add Patient
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          {/* Notes Section */}
          <section className="mb-8 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Notes</h2>
            <NotesEditor
              note={notesState.context.currentNote}
              notes={notesState.context.notes}
              onSave={(content) => send({ type: 'SAVE_DRAFT', content, activePatient: mockPatient })}
              onLock={() => send({ type: 'LOCK_NOTE', activePatient: mockPatient })}
            />
          </section>

          {/* Billing Status Section */}
          <section className="mb-8 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Billing Status</h2>
            <BillingStatus invoices={billingState.context.invoices} />
            <div className="flex gap-3 mt-4 flex-col sm:flex-row">
              <Button
                onClick={() => send({ type: 'GENERATE_INVOICE', patientId: mockPatient.id, amount: 150 })}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                Generate Invoice
              </Button>
              <Button
                onClick={() => send({ type: 'PROCESS_PAYMENT', invoiceId: billingState.context.invoices[0]?.id || '' })}
                disabled={!billingState.context.invoices.length}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:text-gray-600"
              >
                Process Payment
              </Button>
            </div>
          </section>

          {/* Calendar Section */}
          <section className="mb-8 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Appointments</h2>
            <Calendar appointments={appointmentsState.context.appointments} />
            <div className="flex gap-3 mt-4 flex-col sm:flex-row">
              <Button
                onClick={() =>
                  send({
                    type: 'SCHEDULE',
                    appointment: {
                      patientId: mockPatient.id,
                      time: '2025-03-20T10:00:00Z',
                      id: crypto.randomUUID(),
                      status: 'scheduled',
                    },
                  })
                }
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                Schedule Appointment
              </Button>
              <Button
                onClick={() =>
                  send({
                    type: 'RESCHEDULE',
                    appointment: {
                      id: appointmentsState.context.appointments[0]?.id || '',
                      time: '2025-03-20T11:00:00Z',
                    },
                  })
                }
                disabled={!appointmentsState.context.appointments.length}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:text-gray-600"
              >
                Reschedule Appointment
              </Button>
              <Button
                onClick={() =>
                  send({
                    type: 'CANCEL',
                    appointment: { id: appointmentsState.context.appointments[0]?.id || '' },
                  })
                }
                disabled={!appointmentsState.context.appointments.length}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:text-gray-600"
              >
                Cancel Appointment
              </Button>
            </div>
          </section>

          <Button
            onClick={() => send({ type: 'OPEN_MODAL', content: 'patientDetails' })}
            disabled={!patientState.matches('idle')}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Patient Details
          </Button>
        </Card>
      </div>

      <Dialog
        open={state.context.modal.isOpen}
        onOpenChange={(open) => send({ type: open ? 'OPEN_MODAL' : 'CLOSE_MODAL' })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Patient Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              {state.context.activePatient
                ? `Name: ${state.context.activePatient.name}, Diagnosis: ${state.context.activePatient.diagnosis.join(', ')}`
                : 'No patient selected.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => send({ type: 'CLOSE_MODAL' })} variant="outline" className="text-gray-600">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
