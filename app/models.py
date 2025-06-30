from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

@dataclass
class Doctor:
    id: int
    name: str

@dataclass
class Patient:
    id: int
    name: str
    phone: str

@dataclass
class Appointment:
    id: int
    doctor_id: int
    patient_id: int
    time: datetime
    status: str = "booked"  # statuses: booked, rejected
    notes: Optional[str] = None

@dataclass
class Availability:
    doctor_id: int
    time: datetime
