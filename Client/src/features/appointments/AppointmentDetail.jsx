import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAppointment, cancelAppointment } from '../../api/appointments.js'
import Card from '../../components/Card.jsx'

export default function AppointmentDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { setItem(await getAppointment(id)) } catch(e){ setError(e.response?.data?.message || e.message) } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  const cancel = async () => {
    try { await cancelAppointment(id); nav('/appointments') } catch(e){ setError(e.response?.data?.message || e.message) }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <p className="text-lg text-blue-700 font-semibold">Loading…</p>
    </div>
  )
  if (!item) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Card>
        <p className="text-red-600 text-center">{error || 'Not found'}</p>
      </Card>
    </div>
  )

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Appointment Details</h2>
        <div className="space-y-2 text-base">
          <p><span className="font-semibold text-gray-700">Start:</span> {new Date(item.startAt).toLocaleString()}</p>
          <p><span className="font-semibold text-gray-700">End:</span> {new Date(item.endAt).toLocaleTimeString()}</p>
          <p><span className="font-semibold text-gray-700">Status:</span> <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{item.status}</span></p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={cancel}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow hover:from-red-500 hover:to-red-700 transition"
          >
            Cancel Appointment
          </button>
        </div>
      </Card>
    </div>
  )
}