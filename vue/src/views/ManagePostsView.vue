<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <div class="bg-white shadow-md rounded-lg p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Manage Posts</h2>
          </div>
  
          <div class="mb-4">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search posts..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div v-if="filteredPosts.length === 0" class="text-center text-gray-500">
            No posts found.
          </div>
  
          <div v-else class="space-y-4">
            <div
              v-for="post in filteredPosts"
              :key="post.id"
              class="p-4 bg-white rounded-lg shadow-md"
            >
              <h3 class="text-xl font-bold text-gray-900">{{ post.title }}</h3>
              <h4 class="text-lg font-semibold text-gray-700">{{ post.subtitle }}</h4>
              <p class="text-gray-700">{{ post.shortText }}</p>
              <img v-if="post.image" :src="post.image" alt="Post Image" class="w-full h-auto mt-4 rounded-md" />
              <p class="text-gray-700 mt-4">{{ post.text }}</p>
              <p class="text-gray-500 mt-2">Category: {{ post.category }}</p>
              <div class="flex justify-end space-x-4 pt-4">
                <button @click="editPost(post)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Edit
                </button>
                <button @click="deletePost(post.id)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
  
          <div class="mt-8">
            <button @click="startCreating"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Create New Post
            </button>
          </div>
  
          <div v-if="isEditing || isCreating" class="mt-8">
            <h3 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Edit Post' : 'Create Post' }}</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                <input id="title" v-model="form.title" type="text" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle</label>
                <input id="subtitle" v-model="form.subtitle" type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label for="shortText" class="block text-sm font-medium text-gray-700">Short Text</label>
                <input id="shortText" v-model="form.shortText" type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label for="text" class="block text-sm font-medium text-gray-700">Text</label>
                <textarea id="text" v-model="form.text" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
              <div>
                <label for="image" class="block text-sm font-medium text-gray-700">Picture URL</label>
                <input id="image" v-model="form.image" type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <input id="category" v-model="form.category" type="text" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div v-if="error" class="text-red-500 text-sm text-center" role="alert">
                {{ error }}
              </div>
              <div class="flex justify-center space-x-4 pt-4">
                <button type="submit"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : 'Save' }}
                </button>
                <button type="button" @click="cancelEditing"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
  
  const searchQuery = ref('')
  const posts = ref([])
  const isEditing = ref(false)
  const isCreating = ref(false)
  const isLoading = ref(false)
  const error = ref('')
  const form = ref({
    id: null,
    title: '',
    subtitle: '',
    shortText: '',
    text: '',
    image: '',
    category: ''
  })
  
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts')
      posts.value = response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }
  
  const filteredPosts = computed(() => {
    return posts.value.filter(post =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  const startCreating = () => {
    form.value = {
      id: null,
      title: '',
      subtitle: '',
      shortText: '',
      text: '',
      image: '',
      category: ''
    }
    isCreating.value = true
    isEditing.value = false
    error.value = ''
  }
  
  const editPost = (post) => {
    form.value = { ...post }
    isEditing.value = true
    isCreating.value = false
    error.value = ''
  }
  
  const cancelEditing = () => {
    isEditing.value = false
    isCreating.value = false
    error.value = ''
  }
  
  const handleSubmit = async () => {
    try {
      error.value = ''
      isLoading.value = true
  
      console.log('Form data:', form.value) // Add this line to log form data
  
      if (isEditing.value) {
        await axios.put(`http://localhost:3000/posts/${form.value.id}`, form.value)
      } else {
        await axios.post('http://localhost:3000/posts', form.value)
      }
  
      fetchPosts()
      cancelEditing()
    } catch (e) {
      error.value = 'An error occurred while saving the post.'
    } finally {
      isLoading.value = false
    }
  }
  
  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`)
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }
  
  fetchPosts()
  </script>