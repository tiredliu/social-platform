import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Friend {
  id: string
  username: string
  email: string
  avatar?: string
}

// 从 localStorage 加载初始数据
const loadInitialData = () => {
  const savedFriends = localStorage.getItem('friends')
  const savedRequests = localStorage.getItem('friendRequests')
  
  // 测试数据
  const defaultFriends: Friend[] = [
    {
      id: '2',
      username: '张三',
      email: 'zhangsan@example.com'
    },
    {
      id: '3',
      username: '李四',
      email: 'lisi@example.com'
    }
  ]

  const defaultRequests: Friend[] = [
    {
      id: '4',
      username: '王五',
      email: 'wangwu@example.com'
    },
    {
      id: '5',
      username: '赵六',
      email: 'zhaoliu@example.com'
    }
  ]

  return {
    friends: savedFriends ? JSON.parse(savedFriends) : defaultFriends,
    requests: savedRequests ? JSON.parse(savedRequests) : defaultRequests
  }
}

export const useFriendStore = defineStore('friend', () => {
  const initialData = loadInitialData()
  const friends = ref<Friend[]>(initialData.friends)
  const friendRequests = ref<Friend[]>(initialData.requests)

  // 监听变化并保存到 localStorage
  watch(
    friends,
    (newFriends) => {
      localStorage.setItem('friends', JSON.stringify(newFriends))
    },
    { deep: true }
  )

  watch(
    friendRequests,
    (newRequests) => {
      localStorage.setItem('friendRequests', JSON.stringify(newRequests))
    },
    { deep: true }
  )

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