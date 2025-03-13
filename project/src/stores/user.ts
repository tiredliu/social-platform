import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)

  function setUser(user: User) {
    currentUser.value = user
    isAuthenticated.value = true
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    currentUser,
    isAuthenticated,
    setUser,
    logout
  }
})