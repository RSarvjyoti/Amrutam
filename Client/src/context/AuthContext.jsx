import { createContext, useContext, useEffect, useState } from 'react'
import * as Auth from '../api/auth.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const login = async (email, password) => {
    const { user, accessToken, refreshToken } = await Auth.login({ email, password })
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(user)
  }
  const signup = async (payload) => {
    const { user, accessToken, refreshToken } = await Auth.signup(payload)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(user)
  }
  const logout = () => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/'
  }
  useEffect(() => {}, [user])
  return <AuthCtx.Provider value={{ user, login, signup, logout }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)