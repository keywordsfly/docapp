# docapp

This repository contains a minimal appointment booking system for doctors and patients.

## Features

- Doctors can register and mark available dates and times each month.
- Patients can register, view available slots, and book appointments.
- Doctors can view all booked appointments and reject suspicious ones.
- Doctors can send WhatsApp reminders or promotions to patients (simulated with console output).

## Usage

Install dependencies and run the CLI:

```bash
python -m app.cli <command> [options]
```

### Web server

Install Flask and run the API server:

```bash
pip install -r requirements.txt
python -m app.server
```

The server listens on `http://localhost:5000` and exposes JSON endpoints used by the frontend.

### Frontend

Open `frontend/index.html` in a browser. The page uses simple JavaScript `fetch` calls to interact with the API server.

### Deploying to GitHub

1. Create a repository on GitHub and push the contents of this project.
2. Enable GitHub Pages using the `frontend/` directory to serve the web interface.
3. Deploy the backend to your preferred hosting provider and update `frontend/app.js` if the API URL changes.

Example workflow:

1. Register a doctor:
   ```bash
   python -m app.cli register_doctor "Dr. Smith"
   ```
2. Add availability:
   ```bash
   python -m app.cli add_availability 1 2024-05-01T09:00 2024-05-01T10:00
   ```
3. Register a patient:
   ```bash
   python -m app.cli register_patient "Alice" "+15550001"
   ```
4. List available slots and book an appointment:
   ```bash
   python -m app.cli list_slots 1
   python -m app.cli book 1 1 2024-05-01T09:00
   ```
5. Doctor views appointments and sends a reminder:
   ```bash
   python -m app.cli view_appointments 1
   python -m app.cli remind 1
   ```
```
