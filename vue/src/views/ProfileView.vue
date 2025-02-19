<!-- src/views/ProfileView.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md mx-auto space-y-8">
            <!-- Profil információk -->
            <div class="bg-white shadow-md rounded-lg p-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-extrabold text-gray-900">Profil</h2>
                </div>

                <div v-if="authStore.user" class="space-y-6">
                    <!-- Alap profil adatok -->
                    <div v-if="!isEditing" class="space-y-4">
                        <div class="flex flex-col space-y-1">
                            <span class="text-sm text-gray-500">Név</span>
                            <span class="text-lg font-medium text-gray-900">{{ authStore.user.name }}</span>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <span class="text-sm text-gray-500">Email</span>
                            <span class="text-lg font-medium text-gray-900">{{ authStore.user.email }}</span>
                        </div>

                        <div class="flex justify-center space-x-4 pt-4">
                            <button @click="startEditing"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Profil szerkesztése
                            </button>
                            <button @click="startPasswordChange"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Jelszó módosítása
                            </button>
                        </div>
                    </div>

                    <!-- Profil szerkesztés űrlap -->
                    <form v-if="isEditing && !isChangingPassword" @submit.prevent="handleProfileUpdate"
                        class="space-y-4">
                        <div>
                            <label for="edit-name" class="block text-sm font-medium text-gray-700">Név</label>
                            <input id="edit-name" v-model="editForm.name" type="text" required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label for="edit-email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input id="edit-email" v-model="editForm.email" type="email" required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div v-if="error" class="text-red-500 text-sm text-center" role="alert">
                            {{ error }}
                        </div>

                        <div class="flex justify-center space-x-4 pt-4">
                            <button type="submit"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                :disabled="isLoading">
                                {{ isLoading ? 'Mentés...' : 'Mentés' }}
                            </button>
                            <button type="button" @click="cancelEditing"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Mégse
                            </button>
                        </div>
                    </form>

                    <!-- Jelszó módosítás űrlap -->
                    <form v-if="isChangingPassword" @submit.prevent="handlePasswordChange" class="space-y-4">
                        <div>
                            <label for="current-password" class="block text-sm font-medium text-gray-700">Jelenlegi
                                jelszó</label>
                            <input id="current-password" v-model="passwordForm.currentPassword" type="password" required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label for="new-password" class="block text-sm font-medium text-gray-700">Új jelszó</label>
                            <input id="new-password" v-model="passwordForm.newPassword" type="password" required
                                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div v-if="error" class="text-red-500 text-sm text-center" role="alert">
                            {{ error }}
                        </div>

                        <div class="flex justify-center space-x-4 pt-4">
                            <button type="submit"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                :disabled="isLoading">
                                {{ isLoading ? 'Módosítás...' : 'Jelszó módosítása' }}
                            </button>
                            <button type="button" @click="cancelPasswordChange"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Kijelentkezés gomb -->
                <div class="flex justify-center pt-8">
                    <button @click="handleLogout"
                        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Kijelentkezés
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isEditing = ref(false)
const isChangingPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

// Profil szerkesztés form
const editForm = ref({
    name: authStore.user?.name || '',
    email: authStore.user?.email || ''
})

// Jelszó módosítás form
const passwordForm = ref({
    currentPassword: '',
    newPassword: ''
})

// Profil szerkesztés funkciók
const startEditing = () => {
    editForm.value = {
        name: authStore.user?.name || '',
        email: authStore.user?.email || ''
    }
    isEditing.value = true
    isChangingPassword.value = false
    error.value = ''
}

const cancelEditing = () => {
    isEditing.value = false
    error.value = ''
}

const handleProfileUpdate = async () => {
    try {
        error.value = ''
        isLoading.value = true

        const result = await authStore.updateProfile(editForm.value)

        if (result.success) {
            isEditing.value = false
        } else {
            error.value = result.error
        }
    } catch (e) {
        error.value = 'Váratlan hiba történt a profil frissítésekor'
    } finally {
        isLoading.value = false
    }
}

// Jelszó módosítás funkciók
const startPasswordChange = () => {
    passwordForm.value = {
        currentPassword: '',
        newPassword: ''
    }
    isChangingPassword.value = true
    isEditing.value = false
    error.value = ''
}

const cancelPasswordChange = () => {
    isChangingPassword.value = false
    error.value = ''
}

const handlePasswordChange = async () => {
    try {
        error.value = ''
        isLoading.value = true

        const result = await authStore.changePassword(passwordForm.value)

        if (result.success) {
            isChangingPassword.value = false
            passwordForm.value = {
                currentPassword: '',
                newPassword: ''
            }
        } else {
            error.value = result.error
        }
    } catch (e) {
        error.value = 'Váratlan hiba történt a jelszó módosításakor'
    } finally {
        isLoading.value = false
    }
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>