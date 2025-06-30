import argparse
from datetime import datetime
from typing import List

from .doctor import DoctorApp
from .patient import PatientApp
from .storage import Storage

storage = Storage()

def parse_args():
    parser = argparse.ArgumentParser(description="Doctor Appointment System")
    subparsers = parser.add_subparsers(dest="command")

    doc_parser = subparsers.add_parser("register_doctor")
    doc_parser.add_argument("name")

    avail_parser = subparsers.add_parser("add_availability")
    avail_parser.add_argument("doctor_id", type=int)
    avail_parser.add_argument("times", nargs="+", help="YYYY-MM-DDTHH:MM")

    pat_parser = subparsers.add_parser("register_patient")
    pat_parser.add_argument("name")
    pat_parser.add_argument("phone")

    list_parser = subparsers.add_parser("list_slots")
    list_parser.add_argument("doctor_id", type=int)

    book_parser = subparsers.add_parser("book")
    book_parser.add_argument("doctor_id", type=int)
    book_parser.add_argument("patient_id", type=int)
    book_parser.add_argument("time")

    view_parser = subparsers.add_parser("view_appointments")
    view_parser.add_argument("doctor_id", type=int)

    reject_parser = subparsers.add_parser("reject")
    reject_parser.add_argument("appointment_id", type=int)
    reject_parser.add_argument("reason")

    remind_parser = subparsers.add_parser("remind")
    remind_parser.add_argument("appointment_id", type=int)

    promo_parser = subparsers.add_parser("promo")
    promo_parser.add_argument("patient_id", type=int)
    promo_parser.add_argument("message")

    return parser.parse_args()


def main():
    args = parse_args()
    dapp = DoctorApp(storage)
    papp = PatientApp(storage)

    if args.command == "register_doctor":
        doctor = dapp.register_doctor(args.name)
        print(f"Registered doctor {doctor.id}: {doctor.name}")
    elif args.command == "add_availability":
        times = [datetime.fromisoformat(t) for t in args.times]
        dapp.schedule_availability(args.doctor_id, times)
        print("Availability added")
    elif args.command == "register_patient":
        patient = papp.register_patient(args.name, args.phone)
        print(f"Registered patient {patient.id}: {patient.name}")
    elif args.command == "list_slots":
        slots = papp.list_available_slots(args.doctor_id)
        for s in slots:
            print(s.time.isoformat())
    elif args.command == "book":
        time = datetime.fromisoformat(args.time)
        appt = papp.book_appointment(args.doctor_id, args.patient_id, time)
        print(f"Booked appointment {appt.id} on {appt.time}")
    elif args.command == "view_appointments":
        appts = dapp.view_appointments(args.doctor_id)
        for a in appts:
            print(a)
    elif args.command == "reject":
        dapp.reject_appointment(args.appointment_id, args.reason)
        print("Appointment rejected")
    elif args.command == "remind":
        dapp.remind_appointment(args.appointment_id)
    elif args.command == "promo":
        dapp.send_promotion(args.patient_id, args.message)
    else:
        print("No command specified")

if __name__ == "__main__":
    main()
