import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  // Token kezelés
  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // Token inicializálása
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
  }

  // Bejelentkezés
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/login', credentials)
      setToken(response.data.token)
      user.value = response.data.user
      return { success: true }
    } catch (error: any) {
      setToken(null)
      user.value = null
      return {
        success: false,
        error: error.response?.data?.message || 'Bejelentkezési hiba történt',
      }
    }
  }

  // Regisztráció
  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/register', credentials)
      setToken(response.data.token)
      user.value = response.data.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Regisztrációs hiba történt',
      }
    }
  }

  // Kijelentkezés
  const logout = () => {
    user.value = null
    setToken(null)
  }

  // Profil frissítése
  const updateProfile = async (updateData: { name: string; email: string }) => {
    try {
      if (!user.value?.id) throw new Error('Nincs bejelentkezett felhasználó')

      const response = await axios.put('http://localhost:3000/profile/update', {
        id: user.value.id,
        ...updateData,
      })

      user.value = response.data.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Hiba történt a profil frissítésekor',
      }
    }
  }

  // Jelszó változtatás
  const changePassword = async (passwords: { currentPassword: string; newPassword: string }) => {
    try {
      if (!user.value?.id) throw new Error('Nincs bejelentkezett felhasználó')

      const response = await axios.put('http://localhost:3000/profile/change-password', {
        id: user.value.id,
        ...passwords,
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Hiba történt a jelszó módosításakor',
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
    updateProfile,
    changePassword,
  }
})
