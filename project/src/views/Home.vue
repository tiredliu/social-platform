<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

if (userStore.isAuthenticated) {
  router.push('/feed')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <div>
        <h1 class="text-4xl font-bold text-vue-dark mb-4">欢迎来到 Vue 社交平台</h1>
        <p class="text-xl text-gray-600">与其他 Vue.js 爱好者建立联系</p>
      </div>
      <div class="space-y-4">
        <router-link to="/register" class="btn-primary block w-full">
          立即注册
        </router-link>
        <router-link to="/login" class="btn-secondary block w-full">
          登录
        </router-link>
      </div>
    </div>
  </div>
</template>