import { useState } from 'react'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import { addAvailabilityRule } from '../../api/doctors.js'

export default function AddAvailability() {
  const [form, setForm] = useState({
    doctorId: '', type: 'recurring', startDate: '', endDate: '',
    daysOfWeek: '1,2,3,4,5', startTime: '09:00', endTime: '17:00',
    slotDurationMinutes: 30, maxPerSlot: 1
  })
  const [msg,setMsg]=useState(''); const [err,setErr]=useState('')

  const submit = async (e) => {
    e.preventDefault(); setMsg(''); setErr('')
    try {
      const payload = {
        type: form.type,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        daysOfWeek: form.type==='recurring' ? form.daysOfWeek.split(',').map(n=>parseInt(n.trim())).filter(n=>!isNaN(n)) : undefined,
        startTime: form.startTime, endTime: form.endTime,
        slotDurationMinutes: Number(form.slotDurationMinutes),
        maxPerSlot: Number(form.maxPerSlot)
      }
      const rule = await addAvailabilityRule(form.doctorId, payload)
      setMsg(`Rule saved (${rule.type})`)
    } catch(e){ setErr(e.response?.data?.message || e.message) }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Add Availability (Doctor)</h2>
        <form onSubmit={submit} className="grid gap-4">
          <Input label="Your Doctor ID" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} required />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-blue-700">Type</span>
            <select className="px-4 py-2 rounded-lg border border-blue-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition bg-white text-gray-800 shadow-sm" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="recurring">recurring</option>
              <option value="one-off">one-off</option>
            </select>
          </label>
          {form.type==='one-off' && (
            <Input label="Date (YYYY-MM-DD)" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
          )}
          {form.type==='recurring' && (
            <Input label="Days of week (0-6, comma separated)" value={form.daysOfWeek} onChange={e=>setForm({...form,daysOfWeek:e.target.value})} />
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Start Time (HH:MM)" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} />
            <Input label="End Time (HH:MM)" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Slot Duration (min)" type="number" value={form.slotDurationMinutes} onChange={e=>setForm({...form,slotDurationMinutes:e.target.value})} />
            <Input label="Max per slot" type="number" value={form.maxPerSlot} onChange={e=>setForm({...form,maxPerSlot:e.target.value})} />
          </div>
          {msg && <p className="text-green-700 text-sm text-center">{msg}</p>}
          {err && <p className="text-red-600 text-sm text-center">{err}</p>}
          <button className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:from-blue-600 hover:to-teal-500 transition">
            Save Rule
          </button>
        </form>
      </Card>
    </div>
  )
}