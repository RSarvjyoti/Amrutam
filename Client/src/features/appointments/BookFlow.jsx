import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import { lockSlot, confirmSlot } from '../../api/appointments.js'
import { useAuth } from '../../context/AuthContext.jsx'

const useQuery = () => new URLSearchParams(useLocation().search)

export default function BookFlow() {
  const q = useQuery()
  const doctorId = q.get('doctorId')
  const slotStart = q.get('start')
  const slotEnd = q.get('end')
  const nav = useNavigate()
  const { user } = useAuth()
  const [phase, setPhase] = useState('review') 
  const [lock, setLock] = useState(null)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const review = async () => {
    setError('')
    try {
      const data = await lockSlot({ doctorId, slotStart, slotEnd })
      setLock(data)
      setPhase('verify')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  const verify = async () => {
    setError('')
    try {
      const payload = { lockId: lock.lockId, doctorId, slotStart, slotEnd, mockOtp: otp }
      const data = await confirmSlot(payload)
      setPhase('done')
      setTimeout(()=>nav('/appointments'), 800)
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  if (!doctorId || !slotStart || !slotEnd) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Card>
        <p className="text-red-600 text-center">Missing booking details.</p>
      </Card>
    </div>
  )

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Book Appointment</h2>
        <div className="text-base text-gray-700 mb-4 text-center">
          You are booking as <b>{user?.name}</b>
        </div>

        {phase === 'review' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 mb-2">
              <p><span className="font-semibold text-gray-700">Start:</span> {new Date(slotStart).toLocaleString()}</p>
              <p><span className="font-semibold text-gray-700">End:</span> {new Date(slotEnd).toLocaleTimeString()}</p>
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:from-blue-600 hover:to-teal-500 transition"
              onClick={review}
            >
              Lock slot & Continue
            </button>
            <p className="text-xs text-gray-500 text-center">Lock holds for ~5 minutes. Complete verification to confirm.</p>
          </div>
        )}

        {phase === 'verify' && (
          <div className="space-y-3">
            <p className="text-sm text-center">Enter OTP sent to your phone/email. (For demo, use <b>1234</b>)</p>
            <input
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm"
              placeholder="Enter 1234"
              value={otp}
              onChange={e=>setOtp(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:from-blue-600 hover:to-teal-500 transition"
              onClick={verify}
            >
              Confirm Booking
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-2 text-center">
            <p className="text-green-700 font-medium text-lg">Appointment confirmed!</p>
            <p className="text-sm">Redirecting to your appointments…</p>
          </div>
        )}
      </Card>
    </div>
  )
}