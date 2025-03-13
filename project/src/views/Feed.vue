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

interface Reply {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
  likes: number
  liked: boolean
  replyTo?: string // 回复给谁
}

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
  likes: number
  liked: boolean
  replies: Reply[]
  showReplyBox: boolean
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
const newReplies = ref<{ [key: string]: { content: string; replyTo?: string } }>({})

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

const toggleCommentLike = (comment: Comment) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}

const toggleReplyLike = (reply: Reply) => {
  reply.liked = !reply.liked
  reply.likes += reply.liked ? 1 : -1
}

const toggleCommentBox = (post: Post) => {
  post.showCommentBox = !post.showCommentBox
}

const toggleReplyBox = (comment: Comment) => {
  comment.showReplyBox = !comment.showReplyBox
  if (comment.showReplyBox) {
    newReplies.value[comment.id] = { content: '' }
  }
}

const addComment = (post: Post) => {
  const commentContent = newComments.value[post.id]
  if (!commentContent?.trim()) return

  const comment: Comment = {
    id: Date.now().toString(),
    userId: '1',
    username: 'demo',
    content: commentContent,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    replies: [],
    showReplyBox: false
  }

  post.comments.push(comment)
  newComments.value[post.id] = ''
}

const addReply = (comment: Comment, replyToUsername?: string) => {
  const replyData = newReplies.value[comment.id]
  if (!replyData?.content.trim()) return

  const reply: Reply = {
    id: Date.now().toString(),
    userId: '1',
    username: 'demo',
    content: replyData.content,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    replyTo: replyToUsername
  }

  comment.replies.push(reply)
  newReplies.value[comment.id] = { content: '' }
  comment.showReplyBox = false
}

const friendPosts = computed(() => {
  const friendIds = friendStore.friends.map(f => f.id)
  return posts.value.filter(post => 
    post.userId === '1' || friendIds.includes(post.userId)
  )
})

const handleAddFriend = (userId: string) => {
  // 这里模拟发送好友请求
  console.log('发送好友请求给用户:', userId)
}
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
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
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
            <button
              v-if="post.userId !== '1'"
              @click="handleAddFriend(post.userId)"
              class="btn-primary px-4 py-2 text-sm transition-colors duration-200"
            >
              添加好友
            </button>
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
              class="btn-secondary px-4 py-2 flex items-center space-x-2 transition-colors duration-200"
              :class="{ 'bg-vue-green': post.liked }"
              @click="toggleLike(post)"
            >
              <span>{{ post.likes }}</span>
              <span>{{ post.liked ? '已点赞' : '点赞' }}</span>
            </button>
            <button 
              class="btn-secondary px-4 py-2 flex items-center space-x-2 transition-colors duration-200"
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
                class="btn-primary px-4 py-2 transition-colors duration-200"
                @click="addComment(post)"
              >
                发送
              </button>
            </div>

            <!-- 评论列表 -->
            <div class="space-y-4">
              <div 
                v-for="comment in post.comments" 
                :key="comment.id"
                class="bg-gray-50 p-4 rounded-lg space-y-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ comment.username }}</span>
                    <span class="text-sm text-gray-500">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <button 
                      class="text-sm flex items-center space-x-1 text-gray-500 hover:text-vue-green transition-colors duration-200"
                      :class="{ 'text-vue-green': comment.liked }"
                      @click="toggleCommentLike(comment)"
                    >
                      <span>{{ comment.likes }}</span>
                      <span>{{ comment.liked ? '已点赞' : '点赞' }}</span>
                    </button>
                    <button 
                      class="text-sm text-gray-500 hover:text-vue-green transition-colors duration-200"
                      @click="toggleReplyBox(comment)"
                    >
                      回复
                    </button>
                  </div>
                </div>
                <p class="text-gray-800">{{ comment.content }}</p>

                <!-- 回复框 -->
                <div v-if="comment.showReplyBox" class="flex space-x-2">
                  <input
                    v-model="newReplies[comment.id].content"
                    type="text"
                    class="input-field flex-1"
                    :placeholder="`回复 ${comment.username}...`"
                    @keyup.enter="addReply(comment, comment.username)"
                  >
                  <button 
                    class="btn-primary px-4 py-2 transition-colors duration-200"
                    @click="addReply(comment, comment.username)"
                  >
                    回复
                  </button>
                </div>

                <!-- 回复列表 -->
                <div v-if="comment.replies.length > 0" class="pl-4 space-y-2">
                  <div 
                    v-for="reply in comment.replies" 
                    :key="reply.id"
                    class="bg-white p-3 rounded-lg"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-900">{{ reply.username }}</span>
                        <span v-if="reply.replyTo" class="text-gray-500">
                          回复 {{ reply.replyTo }}
                        </span>
                        <span class="text-sm text-gray-500">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <button 
                        class="text-sm flex items-center space-x-1 text-gray-500 hover:text-vue-green transition-colors duration-200"
                        :class="{ 'text-vue-green': reply.liked }"
                        @click="toggleReplyLike(reply)"
                      >
                        <span>{{ reply.likes }}</span>
                        <span>{{ reply.liked ? '已点赞' : '点赞' }}</span>
                      </button>
                    </div>
                    <p class="mt-1 text-gray-800">{{ reply.content }}</p>
                  </div>
                </div>
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