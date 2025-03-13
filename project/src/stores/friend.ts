import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Friend {
  id: string
  username: string
  email: string
  avatar?: string
}

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<Friend[]>([])
  const friendRequests = ref<Friend[]>([])

  function addFriend(friend: Friend) {
    friends.value.push(friend)
  }

  function removeFriend(friendId: string) {
    friends.value = friends.value.filter(f => f.id !== friendId)
  }

  function addFriendRequest(request: Friend) {
    friendRequests.value.push(request)
  }

  function removeFriendRequest(requestId: string) {
    friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
  }

  return {
    friends,
    friendRequests,
    addFriend,
    removeFriend,
    addFriendRequest,
    removeFriendRequest
  }
})