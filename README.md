# Amrutam API

A RESTful API for managing users, doctors, and appointments.

---

## Project Structure

```
Amrutam/
├── Server/
│   ├── src/
│   │   ├── controllers/      # Route handlers (auth, doctor, appointment)
│   │   ├── middleware/       # Express middlewares (auth, rate limit, async handler)
│   │   ├── models/           # Mongoose models (User, Doctor, Appointment, AvailabilityRule)
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Utility functions (JWT, responses, validation)
│   │   ├── config/           # Configuration files (env, db, redis)
│   │   └── server.js         # Express app entry point
├── README.md
```

---

## Models

### User

```js
{
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  roles: [String]
}
```

### Doctor

```js
{
  name: String,
  specialization: String,
  email: String,
  phone: String,
  availability: [AvailabilityRule._id],
  // ...other fields
}
```

### Appointment

```js
{
  user: User._id,
  doctor: Doctor._id,
  date: Date,
  slot: String,
  status: String
}
```

### AvailabilityRule

```js
{
  doctor: Doctor._id,
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
  // ...other fields
}
```

---

## API Endpoints

### Auth

#### 1. Signup

- **POST** `/auth/signup`
- **Payload:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "yourPassword",
    "roles": ["user"] // optional
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "roles": ["user"]
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
  ```

#### 2. Login

- **POST** `/auth/login`
- **Payload:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourPassword"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "roles": ["user"]
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
  ```

#### 3. Refresh Access Token

- **POST** `/auth/refresh`
- **Payload:**
  ```json
  {
    "refreshToken": "jwt-refresh-token"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "new-jwt-access-token"
  }
  ```

---

### Doctors

#### 1. List Doctors

- **GET** `/doctors`
- **Response:**
  ```json
  [
    {
      "id": "doctor_id",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "email": "drsmith@example.com",
      "phone": "9876543210",
      "availability": [/* ... */]
    }
    // ...
  ]
  ```

#### 2. Get Doctor Details

- **GET** `/doctors/:id`
- **Response:**
  ```json
  {
    "id": "doctor_id",
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "email": "drsmith@example.com",
    "phone": "9876543210",
    "availability": [/* ... */]
  }
  ```

---

### Appointments

#### 1. Book Appointment

- **POST** `/appointments`
- **Payload:**
  ```json
  {
    "doctor": "doctor_id",
    "date": "2025-08-15",
    "slot": "10:00-10:30"
  }
  ```
- **Response:**
  ```json
  {
    "id": "appointment_id",
    "user": "user_id",
    "doctor": "doctor_id",
    "date": "2025-08-15",
    "slot": "10:00-10:30",
    "status": "booked"
  }
  ```

#### 2. List User Appointments

- **GET** `/appointments`
- **Response:**
  ```json
  [
    {
      "id": "appointment_id",
      "doctor": "doctor_id",
      "date": "2025-08-15",
      "slot": "10:00-10:30",
      "status": "booked"
    }
    // ...
  ]
  ```

---

## Error Handling

- All error responses include a `message` field.
- Common status codes: `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden), `404` (Not Found), `409` (Conflict), `429` (Too Many Requests).

---

## Flow of Project

1. **User Registration/Login:**  
   Users sign up or log in to receive JWT tokens for authentication.

2. **Doctor Management:**  
   Users can view doctors and their availability.

3. **Appointment Booking:**  
   Authenticated users can book appointments with doctors for available slots.

4. **Rate Limiting & Security:**  
   API uses Redis-backed rate limiting and JWT-based authentication.

---

## Client Folder Structure

```
Client/
├── public/                  # Static assets (images, icons, etc.)
│   └── vite.svg
├── src/
│   ├── api/                 # API service modules (appointments, auth, doctors)
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   └── doctors.js
│   ├── assets/              # Frontend assets (logos, images)
│   │   └── react.svg
│   ├── components/          # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── Footer.jsx
│   │   ├── Input.jsx
│   │   ├── Navbar.jsx
│   │   └── Select.jsx
│   ├── context/             # React context providers
│   │   └── AuthContext.jsx
│   ├── features/            # Feature-based modules
│   │   ├── appointments/
│   │   │   ├── AppointmentDetail.jsx
│   │   │   ├── BookFlow.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── RescheduleDialog.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── availability/
│   │   │   └── AddAvailability.jsx
│   │   └── doctors/
│   │       ├── AddDoctor.jsx
│   │       ├── DoctorAvailability.jsx
│   │       └── DoctorsList.jsx
│   ├── lib/                 # Utility functions and libraries
│   │   ├── axios.js
│   │   └── utils.js
│   ├── App.jsx              # Main App component
│   ├── index.css            # Global styles
│   ├── main.jsx             # App entry point
│   └── routes.jsx           # Route definitions
├── .env                     # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

