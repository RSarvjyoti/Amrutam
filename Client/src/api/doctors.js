import api from '../lib/axios.js'

export async function listDoctors(params = {}) {
  const { data } = await api.get('/doctors', { params })
  return data.doctors
}

export async function getAvailability(doctorId, { from, to }) {
  const { data } = await api.get(`/doctors/${doctorId}/availability`, { params: { from, to } })
  return data.slots
}

export async function createDoctor(payload) {
  const { data } = await api.post('/doctors', payload)
  return data.doctor
}

export async function addAvailabilityRule(doctorId, payload) {
  const { data } = await api.post(`/doctors/${doctorId}/availability`, payload)
  return data.rule
}