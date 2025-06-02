<template>
  <div class="max-w-md mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input v-model="email" type="email" class="input bg-[#303030] text-gray-200 placeholder:text-gray-500"
        placeholder="E-Mail" />
      <input v-model="password" type="password" class="input bg-[#303030] text-gray-200 placeholder:text-gray-500"
        placeholder="Passwort" />
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

<style scoped lang="postcss">
.input {
  @apply w-full border rounded p-2;
}

.btn {
  @apply px-4 py-2 border rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-md text-purple-500 hover:text-purple-700 hover:from-gray-900 hover:to-gray-800;
}
</style>

<style lang="css">
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #303030 inset !important;
  -webkit-text-fill-color: #e5e7eb !important;
  /* text-gray-200 */
  transition: background-color 5000s ease-in-out 0s;
}
</style>