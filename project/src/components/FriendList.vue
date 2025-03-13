<script setup lang="ts">
import { useFriendStore } from '../stores/friend'

const friendStore = useFriendStore()

const handleRemoveFriend = (friendId: string) => {
  if (confirm('确定要删除这个好友吗？')) {
    friendStore.removeFriend(friendId)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">好友列表</h2>
    <div class="space-y-4">
      <div v-if="friendStore.friends.length === 0" class="text-gray-500 text-center py-4">
        还没有好友，去添加一些吧！
      </div>
      <div v-for="friend in friendStore.friends" :key="friend.id" class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-vue-dark flex items-center justify-center text-white">
            {{ friend.username[0].toUpperCase() }}
          </div>
          <div class="ml-3">
            <p class="font-medium text-gray-900">{{ friend.username }}</p>
            <p class="text-sm text-gray-500">{{ friend.email }}</p>
          </div>
        </div>
        <button
          @click="handleRemoveFriend(friend.id)"
          class="text-sm text-red-600 hover:text-red-800"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>