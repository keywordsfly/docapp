from datetime import datetime, timedelta
from typing import List

from .models import Doctor, Patient, Appointment, Availability
from .storage import Storage

class DoctorApp:
    def __init__(self, storage: Storage):
        self.storage = storage

    def register_doctor(self, name: str) -> Doctor:
        data = self.storage.get_data()
        new_id = len(data["doctors"]) + 1
        doctor = Doctor(id=new_id, name=name)
        data["doctors"].append(doctor.__dict__)
        self.storage.save_data(data)
        return doctor

    def schedule_availability(self, doctor_id: int, times: List[datetime]):
        data = self.storage.get_data()
        for t in times:
            data["availability"].append(Availability(doctor_id=doctor_id, time=t).__dict__)
        self.storage.save_data(data)

    def view_appointments(self, doctor_id: int) -> List[Appointment]:
        data = self.storage.get_data()
        return [Appointment(**a) for a in data["appointments"] if a["doctor_id"] == doctor_id]

    def reject_appointment(self, appointment_id: int, reason: str):
        data = self.storage.get_data()
        for a in data["appointments"]:
            if a["id"] == appointment_id:
                a["status"] = "rejected"
                a["notes"] = reason
                break
        self.storage.save_data(data)

    def send_whatsapp(self, patient: Patient, message: str):
        # Placeholder for WhatsApp integration
        print(f"Sending WhatsApp to {patient.phone}: {message}")

    def remind_appointment(self, appointment_id: int):
        data = self.storage.get_data()
        appt_data = next(a for a in data["appointments"] if a["id"] == appointment_id)
        patient_data = next(p for p in data["patients"] if p["id"] == appt_data["patient_id"])
        appointment = Appointment(**appt_data)
        patient = Patient(**patient_data)
        message = f"Reminder: you have an appointment on {appointment.time}."
        self.send_whatsapp(patient, message)

    def send_promotion(self, patient_id: int, promotion: str):
        data = self.storage.get_data()
        patient_data = next(p for p in data["patients"] if p["id"] == patient_id)
        patient = Patient(**patient_data)
        self.send_whatsapp(patient, promotion)
