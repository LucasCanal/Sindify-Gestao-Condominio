import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.data.token)
      set({ user: data.data.user, token: data.data.token, loading: false })
      return { ok: true }
    } catch (e) {
      set({ loading: false })
      return { ok: false, message: e.response?.data?.message || 'Erro ao fazer login' }
    }
  },

  register: async ({ name, email, password, phone, role, apartmentId }) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
        apartmentId,
      })
      localStorage.setItem('token', data.data.token)
      set({ user: data.data.user, token: data.data.token, loading: false })
      return { ok: true }
    } catch (e) {
      set({ loading: false })
      return { ok: false, message: e.response?.data?.message || 'Erro ao criar conta' }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
    window.location.href = '/login'
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.data.user })
    } catch (e) {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },
}))

export default useAuthStore