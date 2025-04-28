<template>
    <div class="max-w-md mx-auto p-6">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="email" type="email" class="input" placeholder="E-Mail" />
        <input v-model="password" type="password" class="input" placeholder="Passwort" />
        <button type="submit" class="btn">Einloggen</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { signInWithEmailAndPassword } from 'firebase/auth'
  import { auth } from '@/firebase/config'
  import { useRouter } from 'vue-router'
  
  let email = ref('')
  let password = ref('')
  let router = useRouter()
  
  let handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      router.push('/memories')
    } catch (err) {
      alert('Login fehlgeschlagen 😢\n' + err.message)
    }
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full border rounded p-2;
  }
  .btn {
    @apply bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700;
  }
  </style>
  