# Amrutam - AyurAppointments

A full-stack web application for managing Ayurvedic doctors, users, and appointments.  
Easily browse doctors, view their availability, and book appointments online.

---

## 🚀 Tech Stack

**Frontend:**  
- React (with Hooks & Context API)
- Tailwind CSS (utility-first styling)
- Vite (fast development/build tool)
- Axios (API requests)
- React Router (routing)

**Backend:**  
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Redis (rate limiting)
- JWT (authentication)

---

## 📁 Project Structure

### Server

```
Server/
├── src/
│   ├── controllers/      # Route handlers (auth, doctor, appointment)
│   ├── middleware/       # Express middlewares (auth, rate limit, async handler)
│   ├── models/           # Mongoose models (User, Doctor, Appointment, AvailabilityRule)
│   ├── routes/           # API route definitions
│   ├── utils/            # Utility functions (JWT, responses, validation)
│   ├── config/           # Configuration files (env, db, redis)
│   └── server.js         # Express app entry point
├── .env                  # Environment variables
├── package.json
└── README.md
```

### Client

```
Client/
├── public/                  # Static assets (images, icons, etc.)
├── src/
│   ├── api/                 # API service modules (appointments, auth, doctors)
│   ├── assets/              # Frontend assets (logos, images)
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── features/            # Feature-based modules
│   ├── lib/                 # Utility functions and libraries
│   ├── App.jsx              # Main App component
│   ├── index.css            # Global styles
│   ├── main.jsx             # App entry point
│   └── routes.jsx           # Route definitions
├── .env                     # Environment variables
├── package.json
└── README.md
```

---

## 🌟 Features

- **User Authentication:** Signup, login, JWT-based sessions.
- **Doctor Management:** Admins can add doctors, set availability.
- **Browse Doctors:** Filter by specialization, mode, city, and sort by soonest availability.
- **Book Appointments:** Users can book, view, and reschedule appointments.
- **Responsive UI:** Modern, mobile-friendly
- **Rate Limiting & Security:** Redis-backed rate limiting, secure JWT authentication.

---

## 🛠️ API Endpoints

### Auth

- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Login and get JWT tokens
- `POST /auth/refresh` — Refresh access token

### Doctors

- `GET /doctors` — List all doctors
- `GET /doctors/:id` — Get doctor details

### Appointments

- `POST /appointments` — Book an appointment
- `GET /appointments` — List user appointments

---

## 📝 How to Run

1. **Clone the repository**
2. **Install dependencies**  
   - `cd Server && npm install`
   - `cd Client && npm install`
3. **Set up environment variables**  
   - Copy `.env.example` to `.env` and fill in required values for both Server and Client.
4. **Start the backend**  
   - `npm start` (from Server folder)
5. **Start the frontend**  
   - `npm run dev` (from Client folder)
6. **Visit the app in your browser**  
   - Default: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://amrutam.vercel.app/](https://amrutam.vercel.app/)
- **Backend (Render):** [https://amrutam-bnja.onrender.com](https://amrutam-bnja.onrender.com)

---

## 📚 More Info

- **Error Handling:** All API errors return a `message` field and appropriate HTTP status codes.
- **Security:** JWT authentication, rate limiting, and input validation.
- **Extensible:** Easily add new features, modules, or UI components.

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
Please open issues for bugs or feature requests.

---

## Connect with me 
https://www.linkedin.com/in/sarvjyoti05/
