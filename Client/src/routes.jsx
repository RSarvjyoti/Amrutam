import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/Login.jsx'
import Signup from './features/auth/Signup.jsx'
import DoctorsList from './features/doctors/DoctorsList.jsx'
import DoctorAvailability from './features/doctors/DoctorAvailability.jsx'
import BookFlow from './features/appointments/BookFlow.jsx'
import MyAppointments from './features/appointments/MyAppointments.jsx'
import AppointmentDetail from './features/appointments/AppointmentDetail.jsx'
import AddDoctor from './features/doctors/AddDoctor.jsx'
import AddAvailability from './features/availability/AddAvailability.jsx'
import { useAuth } from './context/AuthContext.jsx'

function Private({ roles, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.some(r => user.roles?.includes(r))) return <Navigate to="/" replace />
  return children
}

export default function RoutesDef() {
  return (
    <Routes>
      <Route path="/" element={<DoctorsList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/doctors/:id" element={<DoctorAvailability />} />
      <Route path="/book" element={
        <Private>
          <BookFlow />
        </Private>
      } />

      <Route path="/appointments" element={
        <Private>
          <MyAppointments />
        </Private>
      } />
      <Route path="/appointments/:id" element={
        <Private>
          <AppointmentDetail />
        </Private>
      } />

      <Route path="/admin/doctors/new" element={
        <Private roles={['admin']}>
          <AddDoctor />
        </Private>
      } />
      <Route path="/doctor/availability" element={
        <Private roles={['doctor']}>
          <AddAvailability />
        </Private>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}