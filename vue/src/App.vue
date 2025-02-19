<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigációs sáv -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center h-16 items-center space-x-4">
          <RouterLink 
            to="/" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-indigo-600 font-semibold': $route.path === '/' }"
          >
            Kezdőlap
          </RouterLink>

          <template v-if="!authStore.isAuthenticated">
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/login" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/login' }"
            >
              Bejelentkezés
            </RouterLink>

            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/register" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/register' }"
            >
              Regisztráció
            </RouterLink>
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/posts" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/posts' }"
            >
              Posztok
            </RouterLink>
          </template>

          <template v-else>
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/profile" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/profile' }"
            >
              Profil
            </RouterLink>
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/manage-posts" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/manage-posts' }"
            >
              Posztok kezelése
            </RouterLink>
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/posts" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/posts' }"
            >
              Posztok
            </RouterLink>
            <span class="text-gray-300">|</span>
            <RouterLink 
              to="/categories" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-indigo-600 font-semibold': $route.path === '/categories' }"
            >
              Kategóriák
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>

    <!-- Fő tartalom -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>