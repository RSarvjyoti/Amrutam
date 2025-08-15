import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navLinkBase =
    "px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition font-semibold tracking-wide"
  const navLinkPrimary =
    "px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 transition font-bold shadow-md tracking-wide"

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-teal-50 sticky top-0 z-50 border-b border-blue-200 font-sans">
      <div className="flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 text-white grid place-items-center font-extrabold text-xl shadow-lg">AA</div>
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">AyurAppointments</span>
        </Link>
        <nav className="flex items-center gap-3">
          <NavLink to="/" className={navLinkBase}>Doctors</NavLink>
          {user && (
            <NavLink to="/appointments" className={navLinkBase}>
              My Appointments
            </NavLink>
          )}
          {user?.roles?.includes('admin') && (
            <NavLink to="/admin/doctors/new" className={navLinkBase}>
              Add Doctor
            </NavLink>
          )}
          {user?.roles?.includes('doctor') && (
            <NavLink to="/doctor/availability" className={navLinkBase}>
              Add Availability
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" className={navLinkBase}>Login</NavLink>
              <NavLink to="/signup" className={navLinkPrimary}>Sign up</NavLink>
            </>
          ) : (
            <button onClick={logout} className={navLinkPrimary}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  )
}