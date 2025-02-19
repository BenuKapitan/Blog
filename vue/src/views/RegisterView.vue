<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Regisztráció
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">
                            Név
                        </label>
                        <input id="name" type="text" required v-model="name"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            :class="{ 'border-red-500': error }" />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input id="email" type="email" required v-model="email"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            :class="{ 'border-red-500': error }" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Jelszó
                        </label>
                        <input id="password" type="password" required v-model="password"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            :class="{ 'border-red-500': error }" />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center" role="alert">
                    {{ error }}
                </div>

                <div>
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :disabled="isLoading">
                        <span v-if="isLoading">Regisztráció...</span>
                        <span v-else>Regisztráció</span>
                    </button>
                </div>
            </form>

            <div class="text-sm text-center">
                <span class="text-gray-600">Már van fiókod?</span>
                <RouterLink to="/login" class="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                    Jelentkezz be itt!
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { RegisterCredentials } from '@/types/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
    try {
        error.value = ''
        isLoading.value = true

        const credentials: RegisterCredentials = {
            name: name.value,
            email: email.value,
            password: password.value
        }

        const result = await authStore.register(credentials)

        if (result.success) {
            router.push('/profile')
        } else {
            error.value = result.error
        }
    } catch (e) {
        error.value = 'Váratlan hiba történt. Kérjük, próbáld újra később.'
    } finally {
        isLoading.value = false
    }
}
</script>