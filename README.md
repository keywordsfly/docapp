# docapp

This project is a small doctor appointment booking system. The backend is built with **Node.js/Express** and a simple **React** frontend interacts with it.

## Features

- Doctors register and provide available time slots.
- Patients register, view open slots and book appointments.
- Doctors can review and reject appointments if necessary.
- WhatsApp reminders and promotions are simulated with console output.

## Running locally

### Backend

Install dependencies and start the API server:

```bash
cd backend
npm install
npm start
```

The server listens on `http://localhost:3001`.

### Frontend

Open `frontend/index.html` in your browser. The page uses React (loaded from a CDN) to call the API server.

## Example workflow

1. Register a doctor using the form.
2. Add availability for that doctor (comma separated timestamps in `YYYY-MM-DDTHH:MM` format).
3. Register a patient and book an appointment from the available slots.
4. View appointments and optionally reject or send reminders/promotions.
