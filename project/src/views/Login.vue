<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  try {
    // TODO: Implement actual API call
    const mockUser = {
      id: '1',
      username: 'demo',
      email: email.value
    }
    userStore.setUser(mockUser)
    localStorage.setItem('token', 'mock-token')
    router.push('/feed')
  } catch (err) {
    error.value = '邮箱或密码错误'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">登录您的账号</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">电子邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="电子邮箱"
            >
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="密码"
            >
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">
            登录
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-2 text-center text-red-600">{{ error }}</p>
    </div>
  </div>
</template>