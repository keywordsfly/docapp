from datetime import datetime
from typing import List

from .models import Doctor, Patient, Appointment, Availability
from .storage import Storage

class PatientApp:
    def __init__(self, storage: Storage):
        self.storage = storage

    def register_patient(self, name: str, phone: str) -> Patient:
        data = self.storage.get_data()
        new_id = len(data["patients"]) + 1
        patient = Patient(id=new_id, name=name, phone=phone)
        data["patients"].append(patient.__dict__)
        self.storage.save_data(data)
        return patient

    def list_available_slots(self, doctor_id: int) -> List[Availability]:
        data = self.storage.get_data()
        booked_times = {a["time"] for a in data["appointments"] if a["doctor_id"] == doctor_id and a["status"] == "booked"}
        available = [Availability(**av) for av in data["availability"] if av["doctor_id"] == doctor_id and av["time"] not in booked_times]
        available.sort(key=lambda x: x.time)
        return available

    def book_appointment(self, doctor_id: int, patient_id: int, time: datetime) -> Appointment:
        data = self.storage.get_data()
        new_id = len(data["appointments"]) + 1
        appt = Appointment(id=new_id, doctor_id=doctor_id, patient_id=patient_id, time=time)
        data["appointments"].append(appt.__dict__)
        self.storage.save_data(data)
        return appt
