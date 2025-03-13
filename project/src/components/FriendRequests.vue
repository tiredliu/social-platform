<script setup lang="ts">
import { useFriendStore } from '../stores/friend'

const friendStore = useFriendStore()

const handleAcceptRequest = (friend: any) => {
  friendStore.addFriend(friend)
  friendStore.removeFriendRequest(friend.id)
}

const handleRejectRequest = (friendId: string) => {
  friendStore.removeFriendRequest(friendId)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">好友请求</h2>
    <div class="space-y-4">
      <div v-if="friendStore.friendRequests.length === 0" class="text-gray-500 text-center py-4">
        暂无好友请求
      </div>
      <div v-for="request in friendStore.friendRequests" :key="request.id" 
           class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-vue-dark flex items-center justify-center text-white">
            {{ request.username[0].toUpperCase() }}
          </div>
          <div class="ml-3">
            <p class="font-medium text-gray-900">{{ request.username }}</p>
            <p class="text-sm text-gray-500">{{ request.email }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <button
            @click="handleAcceptRequest(request)"
            class="btn-primary px-4 py-2 text-sm flex items-center transition-colors duration-200"
          >
            接受请求
          </button>
          <button
            @click="handleRejectRequest(request.id)"
            class="btn-secondary bg-gray-500 hover:bg-gray-600 px-4 py-2 text-sm flex items-center transition-colors duration-200"
          >
            拒绝请求
          </button>
        </div>
      </div>
    </div>
  </div>
</template>