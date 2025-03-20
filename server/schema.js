const { pgTable, text, json, decimal, timestamp, integer } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// Patients Table
const patients = pgTable('patients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  diagnosis: json('diagnosis').default('[]'),
  medications: json('medications').default('[]'),
});

// Notes Table
const notes = pgTable('notes', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  status: text('status').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  version: integer('version').notNull(),
});

// Invoices Table
const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
});

// Appointments Table
const appointments = pgTable('appointments', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  time: text('time').notNull(),
  status: text('status').notNull(),
});

// Define Relations
const patientsRelations = relations(patients, ({ many }) => ({
  notes: many(notes),
  invoices: many(invoices),
  appointments: many(appointments),
}));

const notesRelations = relations(notes, ({ one }) => ({
  patient: one(patients, {
    fields: [notes.patientId],
    references: [patients.id],
  }),
}));

const invoicesRelations = relations(invoices, ({ one }) => ({
  patient: one(patients, {
    fields: [invoices.patientId],
    references: [patients.id],
  }),
}));

const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
}));

module.exports = {
  patients,
  notes,
  invoices,
  appointments,
  patientsRelations,
  notesRelations,
  invoicesRelations,
  appointmentsRelations,
};
