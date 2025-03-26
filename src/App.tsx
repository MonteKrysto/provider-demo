import { PracticeDashboard } from './components/PracticeDashboard/PracticeDashboard';
import { PracticeProvider, PatientProvider, NotesProvider, BillingProvider, AppointmentsProvider } from './contexts';

function App() {
  return (
    <PracticeProvider>
      <PatientProvider>
        <NotesProvider>
          <BillingProvider>
            <AppointmentsProvider>
              <PracticeDashboard />
            </AppointmentsProvider>
          </BillingProvider>
        </NotesProvider>
      </PatientProvider>
    </PracticeProvider>
  );
}

export default App;
