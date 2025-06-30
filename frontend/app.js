const api = 'http://localhost:5000';

function post(path, data) {
  return fetch(api + path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(r => r.json().catch(() => null));
}

function get(path) {
  return fetch(api + path).then(r => r.json());
}

function registerDoctor() {
  const name = document.getElementById('doc-name').value;
  post('/doctors', {name}).then(d => {
    document.getElementById('doc-result').textContent = JSON.stringify(d);
  });
}

function registerPatient() {
  const name = document.getElementById('pat-name').value;
  const phone = document.getElementById('pat-phone').value;
  post('/patients', {name, phone}).then(p => {
    document.getElementById('pat-result').textContent = JSON.stringify(p);
  });
}

function addAvailability() {
  const doc = document.getElementById('avail-doc').value;
  const times = document.getElementById('avail-times').value.split(',').map(t => t.trim());
  post(`/doctors/${doc}/availability`, {times});
}

function listSlots() {
  const doc = document.getElementById('slot-doc').value;
  get(`/doctors/${doc}/slots`).then(res => {
    document.getElementById('slot-result').textContent = JSON.stringify(res, null, 2);
  });
}

function book() {
  const doctor_id = document.getElementById('book-doc').value;
  const patient_id = document.getElementById('book-pat').value;
  const time = document.getElementById('book-time').value;
  post('/appointments', {doctor_id, patient_id, time}).then(appt => {
    document.getElementById('book-result').textContent = JSON.stringify(appt);
  });
}

function viewAppointments() {
  const doc = document.getElementById('view-doc').value;
  get(`/doctors/${doc}/appointments`).then(appts => {
    document.getElementById('view-result').textContent = JSON.stringify(appts, null, 2);
  });
}

function rejectAppt() {
  const id = document.getElementById('rej-id').value;
  const reason = document.getElementById('rej-reason').value;
  post(`/appointments/${id}/reject`, {reason});
}

function remind() {
  const id = document.getElementById('rem-id').value;
  post(`/appointments/${id}/remind`, {});
}

function promo() {
  const id = document.getElementById('promo-id').value;
  const message = document.getElementById('promo-msg').value;
  post(`/patients/${id}/promo`, {message});
}
