<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex items-center">
            <img src="/vite.svg" alt="Logo" class="h-8 w-8">
            <span class="ml-2 text-xl font-semibold text-vue-dark">Vue 社交</span>
          </router-link>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/feed" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              动态
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center">
          <div v-if="userStore.isAuthenticated" class="flex items-center space-x-4">
            <router-link to="/profile" class="text-sm font-medium text-gray-700 hover:text-vue-green">
              个人资料
            </router-link>
            <button @click="handleLogout" class="text-sm font-medium text-gray-700 hover:text-vue-green">
              退出登录
            </button>
          </div>
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="text-sm font-medium text-gray-700 hover:text-vue-green">
              登录
            </router-link>
            <router-link to="/register" class="btn-primary">
              注册
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>