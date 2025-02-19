<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <div class="bg-white shadow-md rounded-lg p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Posztok</h2>
          </div>
  
          <div class="mb-4">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Keresés a Posztok között..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div v-if="filteredPosts.length === 0" class="text-center text-gray-500">
            Nem található poszt.
          </div>
  
          <div v-else class="space-y-4">
            <div
              v-for="post in filteredPosts"
              :key="post.id"
              class="p-4 bg-white rounded-lg shadow-md card"
            >
              <h3 class="text-xl font-bold text-gray-900">{{ post.title }}</h3>
              <h4 class="text-lg font-semibold text-gray-700">{{ post.subtitle }}</h4>
              <p class="text-gray-700">{{ post.shortText }}</p>
              <img v-if="post.image" :src="post.image" alt="Post Image" class="w-full h-auto mt-4 rounded-md" />
              <p class="text-gray-700 mt-4">{{ post.text }}</p>
              <p class="text-gray-500 mt-2">Kategória: {{ post.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import axios from 'axios'
  
  const searchQuery = ref('')
  const posts = ref([])
  
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
  
  fetchPosts()
  </script>