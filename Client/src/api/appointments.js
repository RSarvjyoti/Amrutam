import api from '../lib/axios.js'

export async function lockSlot(payload) {
  const { data } = await api.post('/appointments/lock', payload)
  return data
}

export async function confirmSlot(payload) {
  const { data } = await api.post('/appointments/confirm', payload)
  return data
}

export async function listAppointments(params = {}) {
  const { data } = await api.get('/appointments', { params })
  return data.items
}

export async function getAppointment(id) {
  const { data } = await api.get(`/appointments/${id}`)
  return data.item
}

export async function cancelAppointment(id) {
  const { data } = await api.post(`/appointments/${id}/cancel`)
  return data.appointment
}

export async function rescheduleAppointment(id, payload) {
  const { data } = await api.put(`/appointments/${id}/reschedule`, payload)
  return data
}