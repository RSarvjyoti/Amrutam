import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDoctors } from '../../api/doctors.js'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Select from '../../components/Select.jsx'
import Badge from '../../components/Badge.jsx'

export default function DoctorsList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ specialization:'', mode:'', city:'', sort:'soonest' })

  const fetchList = async () => {
    setLoading(true)
    try { setItems(await listDoctors(filters)) } finally { setLoading(false) }
  }

  useEffect(() => { fetchList() }, []) 
  const onApply = () => fetchList()

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight">Find Ayurvedic Doctors</h1>
        <p className="text-gray-600 text-base">Browse and book appointments with trusted specialists.</p>
      </div>
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur rounded-xl shadow-md mb-8 p-4">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <Input label="Specialization" placeholder="Panchakarma / Diet / ..." value={filters.specialization} onChange={e=>setFilters({...filters, specialization:e.target.value})} />
          <Select label="Mode" value={filters.mode} onChange={e=>setFilters({...filters, mode:e.target.value})}>
            <option value="">Any</option>
            <option>online</option>
            <option>in-person</option>
          </Select>
          <Input label="City" value={filters.city} onChange={e=>setFilters({...filters, city:e.target.value})} />
          <Select label="Sort" value={filters.sort} onChange={e=>setFilters({...filters, sort:e.target.value})}>
            <option value="soonest">Soonest</option>
          </Select>
          <button
            type="button"
            onClick={onApply}
            className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:scale-105 hover:from-blue-600 hover:to-teal-500 transition"
          >
            Apply
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        !items.length ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <Card>
              <p className="text-gray-600 text-center">No doctors found for your filters.</p>
            </Card>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(d => (
              <Card key={d._id} className="flex flex-col justify-between h-full p-6 hover:shadow-xl transition-shadow duration-200">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-teal-300 text-white grid place-items-center font-bold text-xl shadow">
                      {d.name?.split(' ').map(x=>x[0]).slice(0,2).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-700">{d.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(d.specializations||[]).slice(0,3).map(s => <Badge key={s}>{s}</Badge>)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {d.location?.city && <p>📍 <span className="font-semibold">{d.location.city}</span></p>}
                    {d.modes?.length>0 && (
                      <div className="flex gap-2 flex-wrap">
                        {d.modes.map(m => (
                          <span key={m} className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/doctors/${d._id}`}
                    className="w-full px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:scale-105 hover:from-blue-600 hover:to-teal-500 transition text-center block"
                  >
                    See availability
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}