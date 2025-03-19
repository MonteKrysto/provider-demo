const express = require('express');
const cors = require('cors');
const app = express();
const port = 6000;

app.use(express.json());
app.use(cors());

const db = {
  patients: [
    { id: 'p1', name: 'Patient 1', diagnosis: ['Anxiety'], medications: [] },
    { id: 'p2', name: 'Patient 2', diagnosis: ['Depression'], medications: [] },
  ],
  notes: { 'p1': [], 'p2': [] },
  invoices: [],
  appointments: [],
};

app.get('/api/data', (req, res) => {
  res.json(db);
});

app.post('/api/update', (req, res) => {
  const { type, payload } = req.body;
  console.log(`Received update: ${type}`, payload);

  switch (type) {
    case 'SAVE_DRAFT':
      const patientId = payload.activePatient?.id || 'p1';
      const newNote = {
        id: Date.now().toString(),
        patientId,
        content: payload.content,
        status: 'draft',
        timestamp: new Date().toISOString(),
        version: 1,
      };
      db.notes[patientId] = db.notes[patientId] || [];
      db.notes[patientId].push(newNote);
      res.json({ success: true, note: newNote });
      break;

    case 'LOCK_NOTE':
      const lockPatientId = payload.activePatient?.id || 'p1';
      if (db.notes[lockPatientId]) {
        db.notes[lockPatientId] = db.notes[lockPatientId].map((n) =>
          n.id === db.notes[lockPatientId][db.notes[lockPatientId].length - 1]?.id
            ? { ...n, status: 'locked' }
            : n
        );
      }
      res.json({ success: true });
      break;

    case 'GENERATE_INVOICE':
      const newInvoice = {
        id: Date.now().toString(),
        patientId: payload.patientId,
        amount: payload.amount || 100.0,
        status: 'pending',
      };
      db.invoices.push(newInvoice);
      res.json({ success: true, invoice: newInvoice });
      break;

    case 'PROCESS_PAYMENT':
      const invoice = db.invoices.find((i) => i.id === payload.invoiceId);
      if (invoice) {
        setTimeout(() => {
          invoice.status = Math.random() > 0.2 ? 'paid' : 'disputed';
          res.json({ success: true, invoice });
        }, 1000);
      } else {
        res.status(404).json({ success: false });
      }
      break;

    case 'SCHEDULE':
      const newAppointment = {
        id: Date.now().toString(),
        ...payload.appointment,
        status: 'scheduled',
      };
      db.appointments.push(newAppointment);
      res.json({ success: true, appointment: newAppointment });
      break;

    case 'RESCHEDULE':
      const appt = db.appointments.find((a) => a.id === payload.appointment.id);
      if (appt) {
        appt.time = payload.appointment.time;
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false });
      }
      break;

    case 'CANCEL':
      const cancelAppt = db.appointments.find((a) => a.id === payload.appointment.id);
      if (cancelAppt) {
        setTimeout(() => {
          cancelAppt.status = Math.random() > 0.1 ? 'canceled' : 'scheduled';
          res.json({ success: true });
        }, 1000);
      } else {
        res.status(404).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
