import { create } from 'zustand'

export type User = {
  email: string
  password?: string
  name?: string
  avatar?: string
  bio?: string
  createdAt?: string
}

type AuthState = {
  user: User | null
  login: (email: string, password: string) => void
  register: (email: string, password: string) => void
  logout: () => void
  updateProfile: (patch: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: (email, password) => {
    const user: User = { 
      email, 
      password,
      name: email.split('@')[0],
      avatar: '/photo_5258477947289540861_y%20(1).jpg',
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  register: (email, password) => {
    const user: User = { 
      email, 
      password,
      name: email.split('@')[0],
      avatar: '/photo_5258477947289540861_y%20(1).jpg',
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null })
  },

  updateProfile: (patch) => {
    set((state) => {
      if (!state.user) return state
      const user = { ...state.user, ...patch }
      localStorage.setItem('user', JSON.stringify(user))
      return { user }
    })
  },
}))