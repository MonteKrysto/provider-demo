const express = require('express');
const cors = require('cors');
const { db } = require('./db');
const { patients, notes, invoices, appointments } = require('./schema');
const { eq } = require('drizzle-orm');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GET /api/data - Fetch all data
app.get('/api/data', async (req, res) => {
  try {
    const patientsData = await db.select().from(patients);
    const notesData = await db.select().from(notes);
    const invoicesData = await db.select().from(invoices);
    const appointmentsData = await db.select().from(appointments);

    // Transform notes into Record<string, Note[]>
    const notesByPatient = notesData.reduce((acc, note) => {
      acc[note.patientId] = acc[note.patientId] || [];
      acc[note.patientId].push(note);
      return acc;
    }, {});

    res.json({
      patients: patientsData,
      notes: notesByPatient,
      invoices: invoicesData,
      appointments: appointmentsData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST /api/update - Handle state machine events
app.post('/api/update', async (req, res) => {
  const { type, payload } = req.body;

  try {
    switch (type) {
      case 'CREATE_PATIENT':
        console.log('CREATE_PATIENT payload.patient:', payload.patient);
        const newPatient = {
          id: payload.patient.id,
          name: payload.patient.name,
          diagnosis: Array.isArray(payload.patient.diagnosis) ? payload.patient.diagnosis : payload.patient.diagnosis.split(',').map((d) => d.trim()),
          medications: Array.isArray(payload.patient.medications) ? payload.patient.medications : [],
        };
        await db.insert(patients).values(newPatient);
        // Debug: Retrieve the patient from the database to verify the data
        const insertedPatient = await db.select().from(patients).where(eq(patients.id, newPatient.id)).limit(1);
        console.log('CREATE_PATIENT insertedPatient from DB:', insertedPatient[0]);
        res.json({
          success: true,
          patient: {
            ...newPatient,
            diagnosis: Array.isArray(newPatient.diagnosis) ? newPatient.diagnosis : JSON.parse(newPatient.diagnosis),
            medications: Array.isArray(newPatient.medications) ? newPatient.medications : JSON.parse(newPatient.medications),
          },
        });
        break;

      case 'SAVE_DRAFT':
        if (!payload.content || payload.content.trim() === '') {
          res.status(400).json({ error: 'Note content cannot be empty' });
          return;
        }
        const newNote = {
          id: Date.now().toString(),
          patientId: payload.activePatient?.id || 'p1',
          content: payload.content,
          status: 'draft',
          timestamp: new Date(),
          version: 1,
        };
        await db.insert(notes).values(newNote);
        res.json({ success: true, note: newNote });
        break;

      case 'LOCK_NOTE':
        if (!payload.content || payload.content.trim() === '') {
          res.status(400).json({ error: 'Note content cannot be empty' });
          return;
        }
        const lockedNote = {
          id: Date.now().toString(),
          patientId: payload.activePatient?.id || 'p1',
          content: payload.content || 'Locked note',
          status: 'locked',
          timestamp: new Date(),
          version: 1,
        };
        await db.insert(notes).values(lockedNote);
        res.json({ success: true, note: lockedNote });
        break;

      case 'LOCK_EXISTING_NOTE':
        const noteId = payload.noteId;
        const existingNote = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
        if (!existingNote.length) {
          throw new Error('Note not found');
        }
        const updatedNote = {
          ...existingNote[0],
          status: 'locked',
        };
        await db
          .update(notes)
          .set({ status: 'locked' })
          .where(eq(notes.id, noteId));
        res.json({ success: true, note: updatedNote });
        break;

      case 'UPDATE_NOTE':
        const updateNoteId = payload.noteId;
        const updateNote = await db.select().from(notes).where(eq(notes.id, updateNoteId)).limit(1);
        if (!updateNote.length) {
          throw new Error('Note not found');
        }
        if (updateNote[0].status === 'locked') {
          throw new Error('Cannot update a locked note');
        }
        const updatedNoteContent = {
          ...updateNote[0],
          content: payload.content,
          version: updateNote[0].version + 1,
        };
        await db
          .update(notes)
          .set({ content: payload.content, version: updateNote[0].version + 1 })
          .where(eq(notes.id, updateNoteId));
        res.json({ success: true, note: updatedNoteContent });
        break;

      case 'GENERATE_INVOICE':
        const newInvoice = {
          id: Date.now().toString(),
          patientId: payload.patientId,
          amount: payload.amount || 100.0,
          status: 'pending',
        };
        await db.insert(invoices).values(newInvoice);
        res.json({ success: true, invoice: newInvoice });
        break;

      case 'PROCESS_PAYMENT':
        await db
          .update(invoices)
          .set({ status: 'paid' })
          .where(eq(invoices.id, payload.invoiceId));
        res.json({ success: true, invoiceId: payload.invoiceId });
        break;

      case 'SCHEDULE':
        const newAppointment = {
          id: payload.appointment.id,
          patientId: payload.appointment.patientId,
          time: payload.appointment.time,
          status: 'scheduled',
        };
        await db.insert(appointments).values(newAppointment);
        res.json({ success: true, appointment: newAppointment });
        break;

      case 'RESCHEDULE':
        await db
          .update(appointments)
          .set({ time: payload.appointment.time })
          .where(eq(appointments.id, payload.appointment.id));
        // Fetch the updated appointment to return it
        const updatedAppointmentReschedule = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, payload.appointment.id))
          .limit(1);
        const updatedAppointment = updatedAppointmentReschedule[0];
        res.json({ success: true, appointment: updatedAppointment });
        break;

      case 'CANCEL':
        await db
          .update(appointments)
          .set({ status: 'canceled' })
          .where(eq(appointments.id, payload.appointment.id));
        // Fetch the updated appointment to return it
        const updatedAppointmentCancel = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, payload.appointment.id))
          .limit(1);
        const canceledAppointment = updatedAppointmentCancel[0];
        res.json({ success: true, appointment: canceledAppointment });
        break;

      default:
        res.status(400).json({ error: 'Unknown event type' });
    }
  } catch (error) {
    console.error(`Error handling ${type}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
