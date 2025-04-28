<template>
    <div class="max-w-md mx-auto p-4">
      <h2 class="text-xl font-semibold mb-4">Registrieren</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Passwort" class="input" />
        <button type="submit" class="btn">Registrieren</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { createUserWithEmailAndPassword } from 'firebase/auth'
  import { auth } from '@/firebase/config'
  import { useRouter } from 'vue-router'
  
  let email = ref('')
  let password = ref('')
  let router = useRouter()
  
  let handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      router.push('/memories')
    } catch (err) {
      console.error(err.message)
    }
  }
  </script>
  
  <style scoped>
  .input {
    @apply block w-full border p-2 mb-2 rounded;
  }
  .btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
  </style>
  