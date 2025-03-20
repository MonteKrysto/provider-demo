const { db } = require('./db');
const { patients, notes, invoices, appointments } = require('./schema');
const { v4: uuid } = require('uuid');

async function seed() {
  try {
    // Delete existing entries
    await db.delete(appointments);
    await db.delete(invoices);
    await db.delete(notes);
    await db.delete(patients);

    // create a new uuid for each patient
    const patient1Id = uuid();
    const patient2Id = uuid();
    const note1Id = uuid();
    const note2Id = uuid();
    const invoice1Id = uuid();
    const invoice2Id = uuid();
    const appointment1Id = uuid();
    const appointment2Id = uuid();

    // Insert patients
    await db.insert(patients).values([
      { id: patient1Id, name: 'Maya Lansky', diagnosis: JSON.stringify(['Anxiety']), medications: JSON.stringify([]) },
      { id: patient2Id, name: 'Milo Jenkins', diagnosis: JSON.stringify(['Depression']), medications: JSON.stringify([]) },
    ]);

    // Insert notes
    await db.insert(notes).values([
      {
        id: note1Id,
        patientId: patient1Id,
        content: 'Patient is experiencing increased anxiety.',
        status: 'draft',
        timestamp: new Date(), // Pass a Date object instead of a string
        version: 1,
      },
      {
        id: note2Id,
        patientId: patient1Id,
        content: 'Patient is feeling better.',
        status: 'draft',
        timestamp: new Date(), // Pass a Date object instead of a string
        version: 1,
      },
    ]);

    // Insert invoices
    await db.insert(invoices).values([
      {
        id: invoice1Id,
        patientId: patient1Id,
        amount: 150.0,
        status: 'pending',
      },
      {
        id: invoice2Id,
        patientId: patient1Id,
        amount: 150.0,
        status: 'pending',
      },
    ]);

    // Insert appointments
    await db.insert(appointments).values([
      {
        id: appointment1Id,
        patientId: patient1Id,
        time: '2025-03-20T10:00:00Z',
        status: 'scheduled',
      },
    ]);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
