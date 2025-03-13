<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  try {
    // TODO: Implement actual API call
    router.push('/login')
  } catch (err) {
    error.value = '注册失败'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">创建新账号</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="input-field"
              placeholder="用户名"
            >
          </div>
          <div class="mt-4">
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
          <div class="mt-4">
            <label for="confirm-password" class="sr-only">确认密码</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="确认密码"
            >
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">
            创建账号
          </button>
        </div>
      </form>
      <p v-if="error" class="mt-2 text-center text-red-600">{{ error }}</p>
    </div>
  </div>
</template>