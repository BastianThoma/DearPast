<template>
  <div class="max-w-md mx-auto p-4">
    <h2 class="text-xl font-semibold mb-4">Registrieren</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" name="username" type="text" pattern="[a-zA-Z0-9]*" placeholder="Username" required
        class="input bg-[#303030]" autocomplete="off" />
      <input v-model="email" name="email" type="email" placeholder="Email" required class="input bg-[#303030]"
        autocomplete="email" />
      <input v-model="password" name="password" type="password" placeholder="Passwort" required
        class="input bg-[#303030]" autocomplete="new-password" />
      <button type="submit" class="btn">Registrieren</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFirebaseError } from '@/composables/useFirebaseError'

const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const { showSuccess } = useToast()
const { handleFirebaseError } = useFirebaseError()

const handleRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await updateProfile(userCredential.user, {
      displayName: username.value
    })

    await auth.currentUser.reload()

    authStore.setUser(auth.currentUser)

    showSuccess('Account erfolgreich erstellt! 🎉')
    router.push('/memories')
  } catch (err) {
    handleFirebaseError(err, 'Registrierung fehlgeschlagen')
  }
}
</script>

<style scoped lang="postcss">
.input {
  @apply block w-full border p-2 mb-2 rounded;
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