from flask import Flask, request, jsonify
from datetime import datetime

from .storage import Storage
from .doctor import DoctorApp
from .patient import PatientApp

app = Flask(__name__)
storage = Storage()
doctor_app = DoctorApp(storage)
patient_app = PatientApp(storage)

@app.post('/doctors')
def register_doctor():
    name = request.json.get('name')
    doctor = doctor_app.register_doctor(name)
    return jsonify(doctor.__dict__), 201

@app.post('/doctors/<int:doctor_id>/availability')
def add_availability(doctor_id):
    times = [datetime.fromisoformat(t) for t in request.json.get('times', [])]
    doctor_app.schedule_availability(doctor_id, times)
    return '', 204

@app.get('/doctors/<int:doctor_id>/appointments')
def view_appointments(doctor_id):
    appts = doctor_app.view_appointments(doctor_id)
    return jsonify([a.__dict__ for a in appts])

@app.post('/appointments/<int:appointment_id>/reject')
def reject(appointment_id):
    reason = request.json.get('reason', '')
    doctor_app.reject_appointment(appointment_id, reason)
    return '', 204

@app.post('/appointments/<int:appointment_id>/remind')
def remind(appointment_id):
    doctor_app.remind_appointment(appointment_id)
    return '', 204

@app.post('/patients')
def register_patient():
    name = request.json.get('name')
    phone = request.json.get('phone')
    patient = patient_app.register_patient(name, phone)
    return jsonify(patient.__dict__), 201

@app.get('/doctors/<int:doctor_id>/slots')
def list_slots(doctor_id):
    slots = patient_app.list_available_slots(doctor_id)
    return jsonify([{'time': s.time.isoformat()} for s in slots])

@app.post('/appointments')
def book():
    doctor_id = request.json.get('doctor_id')
    patient_id = request.json.get('patient_id')
    time = datetime.fromisoformat(request.json.get('time'))
    appt = patient_app.book_appointment(doctor_id, patient_id, time)
    return jsonify(appt.__dict__), 201

@app.post('/patients/<int:patient_id>/promo')
def promo(patient_id):
    message = request.json.get('message')
    doctor_app.send_promotion(patient_id, message)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
