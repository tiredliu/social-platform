<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const editing = ref(false)
const profile = ref({
  username: userStore.currentUser?.username || '',
  email: userStore.currentUser?.email || '',
  bio: '你好，我是一名 Vue.js 爱好者！'
})

const saveProfile = () => {
  // TODO: Implement API call to save profile
  editing.value = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="h-20 w-20 rounded-full bg-vue-dark flex items-center justify-center text-white text-2xl">
            {{ profile.username[0]?.toUpperCase() }}
          </div>
          <div class="ml-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ profile.username }}</h2>
            <p class="text-gray-600">{{ profile.email }}</p>
          </div>
        </div>
        <button
          @click="editing = !editing"
          class="btn-secondary"
        >
          {{ editing ? '取消' : '编辑资料' }}
        </button>
      </div>

      <div v-if="editing">
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              v-model="profile.username"
              type="text"
              class="input-field mt-1"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">个人简介</label>
            <textarea
              v-model="profile.bio"
              rows="3"
              class="input-field mt-1"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary">
              保存更改
            </button>
          </div>
        </form>
      </div>
      <div v-else>
        <p class="text-gray-800">{{ profile.bio }}</p>
      </div>
    </div>
  </div>
</template>