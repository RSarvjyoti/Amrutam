import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getAvailability } from '../../api/doctors.js'
import DateRangePicker from '../../components/DateRangePicker.jsx'
import Card from '../../components/Card.jsx'
import { toISO } from '../../lib/utils.js'

export default function DoctorAvailability() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async (range) => {
    setLoading(true)
    try {
      const from = range?.start || new Date()
      const to = range?.end || new Date(Date.now()+7*24*3600*1000)
      const data = await getAvailability(id, { from: toISO(from), to: toISO(to) })
      setSlots(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const goBook = (slot) => {
    nav(`/book?doctorId=${id}&start=${slot.start}&end=${slot.end}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-10 px-4">
      <DateRangePicker onChange={load} />
      <Card>
        <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Available Slots</h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[20vh]">
            <p className="text-lg text-blue-700 font-semibold">Loading...</p>
          </div>
        ) : (
          !slots.length ? (
            <div className="flex justify-center items-center min-h-[20vh]">
              <p className="text-gray-600 text-center">No slots in this range.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((s, idx) => (
                <button
                  key={idx}
                  onClick={()=>goBook(s)}
                  className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 text-left shadow hover:shadow-lg transition border border-blue-100"
                >
                  <p className="font-medium text-blue-700">{new Date(s.start).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">to {new Date(s.end).toLocaleTimeString()}</p>
                  <span className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Book Slot</span>
                </button>
              ))}
            </div>
          )
        )}
      </Card>
    </div>
  )
}