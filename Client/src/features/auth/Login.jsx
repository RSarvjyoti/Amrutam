import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.email, form.password)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="container-page max-w-md mx-auto py-10">
      <Card className="shadow-lg rounded-xl bg-gradient-to-br from-white via-blue-50 to-teal-50">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">Login to manage your appointments</p>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
          <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold shadow-md hover:from-blue-600 hover:to-teal-500 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm mt-6 text-center">
          No account?{' '}
          <Link className="text-blue-600 font-semibold underline hover:text-teal-500 transition" to="/signup">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}