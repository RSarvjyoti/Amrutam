import { useState } from 'react'
import { createDoctor } from '../../api/doctors.js'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'

export default function AddDoctor() {
  const [form, setForm] = useState({
    name:'', specializations:'', modes:'online,in-person',
    profile:'', city:'', address:''
  })
  const [msg,setMsg]=useState(''); const [err,setErr]=useState('')

  const submit = async (e) => {
    e.preventDefault(); setMsg(''); setErr('')
    try {
      const payload = {
        name: form.name,
        specializations: form.specializations.split(',').map(s=>s.trim()).filter(Boolean),
        modes: form.modes.split(',').map(s=>s.trim()).filter(Boolean),
        profile: form.profile,
        location: { city: form.city, address: form.address }
      }
      const doc = await createDoctor(payload)
      setMsg(`Doctor created: ${doc.name}`)
      setForm({name:'',specializations:'',modes:'online',profile:'',city:'',address:''})
    } catch(e){ setErr(e.response?.data?.message || e.message) }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Add Doctor (Admin)</h2>
        <form onSubmit={submit} className="grid gap-4">
          <Input label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <Input label="Specializations (comma separated)" value={form.specializations} onChange={e=>setForm({...form,specializations:e.target.value})} />
          <Input label="Modes (comma separated)" value={form.modes} onChange={e=>setForm({...form,modes:e.target.value})} />
          <Input label="Profile" value={form.profile} onChange={e=>setForm({...form,profile:e.target.value})} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
            <Input label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          </div>
          {msg && <p className="text-green-700 text-sm text-center">{msg}</p>}
          {err && <p className="text-red-600 text-sm text-center">{err}</p>}
          <button className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow hover:from-blue-600 hover:to-teal-500 transition">
            Create
          </button>
        </form>
      </Card>
    </div>
  )
}