const express = require('express');
const cors = require('cors');
const path = require('path');
const { load, save } = require('./storage');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

function getData() { return load(); }
function setData(data) { save(data); }

app.post('/doctors', (req, res) => {
  const data = getData();
  const id = data.doctors.length + 1;
  const doctor = { id, name: req.body.name };
  data.doctors.push(doctor);
  setData(data);
  res.status(201).json(doctor);
});

app.post('/doctors/:doctorId/availability', (req, res) => {
  const data = getData();
  const doctor_id = parseInt(req.params.doctorId);
  const times = req.body.times || [];
  times.forEach(t => data.availability.push({ doctor_id, time: t }));
  setData(data);
  res.sendStatus(204);
});

app.get('/doctors/:doctorId/appointments', (req, res) => {
  const data = getData();
  const doctor_id = parseInt(req.params.doctorId);
  const appts = data.appointments.filter(a => a.doctor_id === doctor_id);
  res.json(appts);
});

app.post('/appointments/:id/reject', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const appt = data.appointments.find(a => a.id === id);
  if (appt) {
    appt.status = 'rejected';
    appt.notes = req.body.reason || '';
    setData(data);
  }
  res.sendStatus(204);
});

app.post('/appointments/:id/remind', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const appt = data.appointments.find(a => a.id === id);
  if (appt) {
    const patient = data.patients.find(p => p.id === appt.patient_id);
    if (patient) {
      console.log(`WhatsApp to ${patient.phone}: Reminder of appointment on ${appt.time}`);
    }
  }
  res.sendStatus(204);
});

app.post('/patients', (req, res) => {
  const data = getData();
  const id = data.patients.length + 1;
  const patient = { id, name: req.body.name, phone: req.body.phone };
  data.patients.push(patient);
  setData(data);
  res.status(201).json(patient);
});

app.get('/doctors/:doctorId/slots', (req, res) => {
  const data = getData();
  const doctor_id = parseInt(req.params.doctorId);
  const booked = new Set(data.appointments.filter(a => a.doctor_id === doctor_id && a.status === 'booked').map(a => a.time));
  const slots = data.availability.filter(av => av.doctor_id === doctor_id && !booked.has(av.time));
  slots.sort((a,b)=> new Date(a.time) - new Date(b.time));
  res.json(slots);
});

app.post('/appointments', (req, res) => {
  const data = getData();
  const id = data.appointments.length + 1;
  const { doctor_id, patient_id, time } = req.body;
  const appt = { id, doctor_id, patient_id, time, status: 'booked' };
  data.appointments.push(appt);
  setData(data);
  res.status(201).json(appt);
});

app.post('/patients/:id/promo', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const patient = data.patients.find(p => p.id === id);
  if (patient) {
    console.log(`WhatsApp to ${patient.phone}: ${req.body.message}`);
  }
  res.sendStatus(204);
});

app.listen(3001, () => {
  console.log('API running at http://localhost:3001');
});
