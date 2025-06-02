<template>
  <nav class="fixed z-10 top-0 w-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-md mb-6">
    <div class="flex items-center justify-between p-4">
      <RouterLink to="/" class="flex items-center">
        <img src="@/assets/img/DearPastLogoNew.png" alt="DearPast Logo" class="h-auto w-36" />
      </RouterLink>

      <!-- Hamburger Icon -->
      <button @click="isOpen = !isOpen" class="md:hidden text-gray-700 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-4 text-sm">

        <template v-if="user">
          <RouterLink to="/memories" class="link">Meine Erinnerungen</RouterLink>
          <RouterLink to="/add" class="link">Neue Erinnerung</RouterLink>
          <RouterLink to="/random" class="link">Zufällig</RouterLink>
          <span class="text-gray-300">Hi, {{ user.displayName }}</span>
          <button @click="handleLogout" class="text-red-500 hover:text-green-600">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="link">Login</RouterLink>
          <RouterLink to="/register" class="link">Registrieren</RouterLink>
        </template>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden flex flex-col items-start px-4 pb-4 gap-2 text-sm">
      <RouterLink to="/memories" class="link">Meine Erinnerungen</RouterLink>
      <RouterLink to="/add" class="link">Neue Erinnerung</RouterLink>
      <RouterLink to="/random" class="link">Zufällig</RouterLink>

      <template v-if="user">
        <span class="text-gray-300">Hi, {{ user.displayName }}</span>
        <button @click="handleLogout" class="text-red-500 hover:text-green-600">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="link">Login</RouterLink>
        <RouterLink to="/register" class="link">Registrieren</RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const user = computed(() => authStore.user)

const handleLogout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>

<style scoped lang="postcss">
.link {
  @apply text-gray-500 hover:text-purple-500;
}
</style>
