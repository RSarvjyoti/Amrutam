import api from '../lib/axios.js'

export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}