<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFriendStore } from '../stores/friend'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import FriendList from '../components/FriendList.vue'
import FriendRequests from '../components/FriendRequests.vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
}

interface Post {
  id: string
  userId: string
  username: string
  content: string
  imageUrl?: string
  likes: number
  comments: Comment[]
  createdAt: string
  liked: boolean
  showCommentBox: boolean
}

const friendStore = useFriendStore()
const posts = ref<Post[]>([
  {
    id: '1',
    userId: '1',
    username: 'demo',
    content: '这是我的第一条动态！',
    likes: 5,
    comments: [],
    createdAt: '2024-01-01T12:00:00Z',
    liked: false,
    showCommentBox: false
  }
])

const newPost = ref('')
const selectedImage = ref<File | null>(null)
const previewImage = ref<string | null>(null)
const newComments = ref<{ [key: string]: string }>({})

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedImage.value = input.files[0]
    previewImage.value = URL.createObjectURL(input.files[0])
  }
}

const clearImage = () => {
  selectedImage.value = null
  previewImage.value = null
  const input = document.getElementById('image-upload') as HTMLInputElement
  if (input) input.value = ''
}

const formatTime = (time: string) => {
  const now = dayjs()
  const postTime = dayjs(time)
  
  if (now.diff(postTime, 'day') >= 7) {
    return postTime.format('YYYY年MM月DD日 HH:mm')
  }
  return postTime.fromNow()
}

const createPost = () => {
  if (!newPost.value.trim() && !selectedImage.value) return
  
  const post: Post = {
    id: Date.now().toString(),
    userId: '1',
    username: 'demo',
    content: newPost.value,
    imageUrl: previewImage.value || undefined,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    liked: false,
    showCommentBox: false
  }
  
  posts.value.unshift(post)
  newPost.value = ''
  clearImage()
}

const toggleLike = (post: Post) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}

const toggleCommentBox = (post: Post) => {
  post.showCommentBox = !post.showCommentBox
}

const addComment = (post: Post) => {
  const commentContent = newComments.value[post.id]
  if (!commentContent?.trim()) return

  const comment: Comment = {
    id: Date.now().toString(),
    userId: '1',
    username: 'demo',
    content: commentContent,
    createdAt: new Date().toISOString()
  }

  post.comments.push(comment)
  newComments.value[post.id] = ''
}

const friendPosts = computed(() => {
  const friendIds = friendStore.friends.map(f => f.id)
  return posts.value.filter(post => 
    post.userId === '1' || friendIds.includes(post.userId)
  )
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- 左侧边栏：好友请求 -->
    <div class="md:col-span-1">
      <FriendRequests />
    </div>

    <!-- 中间：动态流 -->
    <div class="md:col-span-1">
      <div class="card mb-8">
        <form @submit.prevent="createPost">
          <textarea
            v-model="newPost"
            rows="3"
            class="input-field"
            placeholder="分享你的想法..."
          ></textarea>
          
          <!-- 图片上传预览区域 -->
          <div v-if="previewImage" class="mt-4 relative">
            <img :src="previewImage" alt="Preview" class="max-h-64 rounded-lg">
            <button
              @click="clearImage"
              class="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
            >
              ×
            </button>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <button
              type="button"
              class="btn-secondary px-4 py-2 flex items-center space-x-2"
              @click="$refs.imageInput.click()"
            >
              <span>添加图片</span>
            </button>
            <input
              ref="imageInput"
              type="file"
              id="image-upload"
              accept="image/*"
              class="hidden"
              @change="handleImageSelect"
            >
            <button type="submit" class="btn-primary">
              发布
            </button>
          </div>
        </form>
      </div>

      <div class="space-y-6">
        <div v-for="post in friendPosts" :key="post.id" class="card">
          <div class="flex items-center mb-4">
            <div class="h-10 w-10 rounded-full bg-vue-dark flex items-center justify-center text-white">
              {{ post.username[0].toUpperCase() }}
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">{{ post.username }}</h3>
              <p class="text-sm text-gray-500">
                {{ formatTime(post.createdAt) }}
              </p>
            </div>
          </div>
          <p class="text-gray-800">{{ post.content }}</p>
          
          <!-- 动态图片 -->
          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            :alt="'Post image by ' + post.username"
            class="mt-4 rounded-lg max-h-96 w-full object-cover"
          >
          
          <div class="mt-4 flex items-center space-x-4">
            <button 
              class="btn-secondary px-4 py-2 flex items-center space-x-2"
              :class="{ 'bg-vue-green': post.liked }"
              @click="toggleLike(post)"
            >
              <span>{{ post.likes }}</span>
              <span>{{ post.liked ? '已点赞' : '点赞' }}</span>
            </button>
            <button 
              class="btn-secondary px-4 py-2 flex items-center space-x-2"
              @click="toggleCommentBox(post)"
            >
              <span>{{ post.comments.length }}</span>
              <span>评论</span>
            </button>
          </div>

          <!-- 评论区域 -->
          <div v-if="post.showCommentBox" class="mt-4 space-y-4">
            <div class="flex space-x-2">
              <input
                v-model="newComments[post.id]"
                type="text"
                class="input-field flex-1"
                placeholder="写下你的评论..."
                @keyup.enter="addComment(post)"
              >
              <button 
                class="btn-primary"
                @click="addComment(post)"
              >
                发送
              </button>
            </div>

            <!-- 评论列表 -->
            <div class="space-y-3">
              <div 
                v-for="comment in post.comments" 
                :key="comment.id"
                class="bg-gray-50 p-3 rounded-lg"
              >
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ comment.username }}</span>
                  <span class="text-sm text-gray-500">{{ formatTime(comment.createdAt) }}</span>
                </div>
                <p class="mt-1 text-gray-800">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧边栏：好友列表 -->
    <div class="md:col-span-1">
      <FriendList />
    </div>
  </div>
</template>