const api = 'http://localhost:3001';

function post(path, data) {
  return fetch(api + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json().catch(() => null));
}
function get(path) {
  return fetch(api + path).then(r => r.json());
}

function App() {
  const [doctorName, setDoctorName] = React.useState('');
  const [docResult, setDocResult] = React.useState(null);

  const [patName, setPatName] = React.useState('');
  const [patPhone, setPatPhone] = React.useState('');
  const [patResult, setPatResult] = React.useState(null);

  const [availDoc, setAvailDoc] = React.useState('');
  const [availTimes, setAvailTimes] = React.useState('');

  const [slotDoc, setSlotDoc] = React.useState('');
  const [slots, setSlots] = React.useState([]);

  const [bookDoc, setBookDoc] = React.useState('');
  const [bookPat, setBookPat] = React.useState('');
  const [bookTime, setBookTime] = React.useState('');
  const [bookResult, setBookResult] = React.useState(null);

  const [viewDoc, setViewDoc] = React.useState('');
  const [appointments, setAppointments] = React.useState([]);

  const [rejId, setRejId] = React.useState('');
  const [rejReason, setRejReason] = React.useState('');

  const [remId, setRemId] = React.useState('');

  const [promoId, setPromoId] = React.useState('');
  const [promoMsg, setPromoMsg] = React.useState('');

  const registerDoctor = () => {
    post('/doctors', { name: doctorName }).then(setDocResult);
  };
  const registerPatient = () => {
    post('/patients', { name: patName, phone: patPhone }).then(setPatResult);
  };
  const addAvailability = () => {
    post(`/doctors/${availDoc}/availability`, { times: availTimes.split(',').map(t => t.trim()) });
  };
  const listSlots = () => {
    get(`/doctors/${slotDoc}/slots`).then(setSlots);
  };
  const book = () => {
    post('/appointments', { doctor_id: bookDoc, patient_id: bookPat, time: bookTime }).then(setBookResult);
  };
  const viewAppointments = () => {
    get(`/doctors/${viewDoc}/appointments`).then(setAppointments);
  };
  const rejectAppt = () => {
    post(`/appointments/${rejId}/reject`, { reason: rejReason });
  };
  const remind = () => {
    post(`/appointments/${remId}/remind`, {});
  };
  const promo = () => {
    post(`/patients/${promoId}/promo`, { message: promoMsg });
  };

  return (
    <div>
      <h1>Doctor Appointment App</h1>

      <section>
        <h2>Register Doctor</h2>
        <input value={doctorName} onChange={e => setDoctorName(e.target.value)} placeholder="Name" />
        <button onClick={registerDoctor}>Register</button>
        <pre>{docResult && JSON.stringify(docResult, null, 2)}</pre>
      </section>

      <section>
        <h2>Register Patient</h2>
        <input value={patName} onChange={e => setPatName(e.target.value)} placeholder="Name" />
        <input value={patPhone} onChange={e => setPatPhone(e.target.value)} placeholder="Phone" />
        <button onClick={registerPatient}>Register</button>
        <pre>{patResult && JSON.stringify(patResult, null, 2)}</pre>
      </section>

      <section>
        <h2>Add Availability</h2>
        <input value={availDoc} onChange={e => setAvailDoc(e.target.value)} placeholder="Doctor ID" />
        <input value={availTimes} onChange={e => setAvailTimes(e.target.value)} placeholder="Times comma separated (YYYY-MM-DDTHH:MM)" size="60" />
        <button onClick={addAvailability}>Add</button>
      </section>

      <section>
        <h2>List Slots</h2>
        <input value={slotDoc} onChange={e => setSlotDoc(e.target.value)} placeholder="Doctor ID" />
        <button onClick={listSlots}>List</button>
        <pre>{JSON.stringify(slots, null, 2)}</pre>
      </section>

      <section>
        <h2>Book Appointment</h2>
        <input value={bookDoc} onChange={e => setBookDoc(e.target.value)} placeholder="Doctor ID" />
        <input value={bookPat} onChange={e => setBookPat(e.target.value)} placeholder="Patient ID" />
        <input value={bookTime} onChange={e => setBookTime(e.target.value)} placeholder="YYYY-MM-DDTHH:MM" />
        <button onClick={book}>Book</button>
        <pre>{bookResult && JSON.stringify(bookResult, null, 2)}</pre>
      </section>

      <section>
        <h2>View Appointments</h2>
        <input value={viewDoc} onChange={e => setViewDoc(e.target.value)} placeholder="Doctor ID" />
        <button onClick={viewAppointments}>View</button>
        <pre>{JSON.stringify(appointments, null, 2)}</pre>
      </section>

      <section>
        <h2>Reject Appointment</h2>
        <input value={rejId} onChange={e => setRejId(e.target.value)} placeholder="Appointment ID" />
        <input value={rejReason} onChange={e => setRejReason(e.target.value)} placeholder="Reason" />
        <button onClick={rejectAppt}>Reject</button>
      </section>

      <section>
        <h2>Send Reminder</h2>
        <input value={remId} onChange={e => setRemId(e.target.value)} placeholder="Appointment ID" />
        <button onClick={remind}>Send</button>
      </section>

      <section>
        <h2>Send Promotion</h2>
        <input value={promoId} onChange={e => setPromoId(e.target.value)} placeholder="Patient ID" />
        <input value={promoMsg} onChange={e => setPromoMsg(e.target.value)} placeholder="Message" />
        <button onClick={promo}>Send</button>
      </section>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
