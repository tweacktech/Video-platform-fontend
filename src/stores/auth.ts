import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config'

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

interface AuthResponse {
  message: string
  data: {
    user: User
    token: string
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE_URL}/login`, 
          { email, password }
        )
        
        this.token = data.data.token
        this.user = data.data.user
        
        // Store token in localStorage
        localStorage.setItem('token', this.token)
        
        // Set default auth header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
      } catch (error) {
        console.error('Login failed:', error)
        throw error // Re-throw to handle in component
      }
    },

    async logout(): Promise<void> {
      try {
        // Optional: Call API to invalidate token
        await axios.post(`${API_BASE_URL}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (error) {
        console.warn('Logout API error:', error)
      } finally {
        // Clear local state regardless of API result
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    async checkAuth(): Promise<void> {
      if (this.token) {
        try {
          const { data } = await axios.get<User>(`${API_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
          this.user = data
        } catch (error) {
          this.logout() // Auto-logout if token is invalid
        }
      }
    }
  }
})