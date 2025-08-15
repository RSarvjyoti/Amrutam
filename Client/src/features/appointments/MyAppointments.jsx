import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAppointments } from '../../api/appointments.js'
import Card from '../../components/Card.jsx'

export default function MyAppointments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try { setItems(await listAppointments({})) } finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">My Appointments</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <p className="text-lg text-blue-700 font-semibold">Loading…</p>
        </div>
      ) : (
        !items.length ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <Card>
              <p className="text-gray-600 text-center">No appointments yet.</p>
            </Card>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(a => (
              <Card key={a._id}>
                <p className="font-medium text-blue-700">{new Date(a.startAt).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mb-2">Status: <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{a.status}</span></p>
                <Link
                  to={`/appointments/${a._id}`}
                  className="w-full inline-block text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:from-blue-600 hover:to-teal-500 transition"
                >
                  View
                </Link>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}