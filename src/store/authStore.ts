import { create } from 'zustand'

type User = {
  email: string
  password?: string
}

type AuthState = {
  user: User | null
  login: (email: string, password: string) => void
  register: (email: string, password: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: (email, password) => {
    const user = { email, password }
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  register: (email, password) => {
    const user = { email, password }
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null })
  },
}))