<template>
    <nav class="flex items-center justify-between p-4 bg-white shadow-md mb-6">
      <RouterLink to="/" class="text-xl font-bold text-purple-600">DearPast</RouterLink>
  
      <div class="flex items-center gap-4 text-sm">
        <RouterLink to="/memories" class="link">Meine Erinnerungen</RouterLink>
        <RouterLink to="/add" class="link">Neue Erinnerung</RouterLink>
        <RouterLink to="/random" class="link">Zufällig</RouterLink>
  
        <template v-if="user">
          <span class="text-gray-500">Hi, {{ user.email }}</span>
          <button @click="handleLogout" class="text-red-500 underline">Logout</button>
        </template>
  
        <template v-else>
          <RouterLink to="/login" class="link">Login</RouterLink>
          <RouterLink to="/register" class="link">Registrieren</RouterLink>
        </template>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { onAuthStateChanged, signOut } from 'firebase/auth'
  import { auth } from '@/firebase/config'
  import { useRouter } from 'vue-router'
  
  const user = ref(null)
  const router = useRouter()
  
  onMounted(() => {
    onAuthStateChanged(auth, currentUser => {
      user.value = currentUser
    })
  })
  
  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .link {
    @apply text-gray-700 hover:underline;
  }
  </style>
  