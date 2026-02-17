<template>
  <div class="max-w-md mx-auto p-4">
    <h2 class="text-xl font-semibold mb-4">Registrieren</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <input v-model="username" @blur="validateUsernameField" name="username" type="text"
          placeholder="Username (min. 3 Zeichen)" class="input bg-[#303030]"
          :class="{ 'border-red-500': hasError('username') && isTouched('username') }" autocomplete="off" />
        <p v-if="hasError('username') && isTouched('username')" class="text-red-500 text-sm mt-1">
          {{ getError('username') }}
        </p>
      </div>

      <div>
        <input v-model="email" @blur="validateEmailField" name="email" type="email" placeholder="Email"
          class="input bg-[#303030]" :class="{ 'border-red-500': hasError('email') && isTouched('email') }"
          autocomplete="email" />
        <p v-if="hasError('email') && isTouched('email')" class="text-red-500 text-sm mt-1">
          {{ getError('email') }}
        </p>
      </div>

      <div>
        <input v-model="password" @blur="validatePasswordField" name="password" type="password"
          placeholder="Passwort (min. 6 Zeichen)" class="input bg-[#303030]"
          :class="{ 'border-red-500': hasError('password') && isTouched('password') }" autocomplete="new-password" />
        <p v-if="hasError('password') && isTouched('password')" class="text-red-500 text-sm mt-1">
          {{ getError('password') }}
        </p>
      </div>

      <button type="submit" class="btn w-full" :disabled="!isValid || isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid || isSubmitting }">
        {{ isSubmitting ? 'Wird registriert...' : 'Registrieren' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFirebaseError } from '@/composables/useFirebaseError'
import { useFormValidation, useFieldValidation } from '@/composables/useFormValidation'

const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const { showSuccess } = useToast()
const { handleFirebaseError } = useFirebaseError()
const { validateEmail, validatePassword, validateUsername, validateRequired } = useFormValidation()
const { setError, clearError, hasError, getError, isTouched, setTouched, isValid } = useFieldValidation()

/**
 * Validiert Username Field
 */
const validateUsernameField = () => {
  setTouched('username')

  if (!validateRequired(username.value)) {
    setError('username', 'Username ist erforderlich')
    return false
  }

  if (!validateUsername(username.value)) {
    setError('username', 'Username muss mindestens 3 Zeichen lang sein (nur Buchstaben & Zahlen)')
    return false
  }

  clearError('username')
  return true
}

/**
 * Validiert E-Mail Field
 */
const validateEmailField = () => {
  setTouched('email')

  if (!validateRequired(email.value)) {
    setError('email', 'E-Mail ist erforderlich')
    return false
  }

  if (!validateEmail(email.value)) {
    setError('email', 'Ungültige E-Mail-Adresse')
    return false
  }

  clearError('email')
  return true
}

/**
 * Validiert Passwort Field
 */
const validatePasswordField = () => {
  setTouched('password')

  if (!validateRequired(password.value)) {
    setError('password', 'Passwort ist erforderlich')
    return false
  }

  if (!validatePassword(password.value)) {
    setError('password', 'Passwort muss mindestens 6 Zeichen haben')
    return false
  }

  clearError('password')
  return true
}

/**
 * Validiert gesamte Form
 */
const validateForm = (): boolean => {
  const isUsernameValid = validateUsernameField()
  const isEmailValid = validateEmailField()
  const isPasswordValid = validatePasswordField()
  return isUsernameValid && isEmailValid && isPasswordValid
}

const handleRegister = async () => {
  // Touch alle Fields
  setTouched('username')
  setTouched('email')
  setTouched('password')

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await updateProfile(userCredential.user, {
      displayName: username.value
    })

    if (auth.currentUser) {
      await auth.currentUser.reload()
      authStore.setUser(auth.currentUser)
    }

    showSuccess('Account erfolgreich erstellt! 🎉')
    router.push('/memories')
  } catch (err) {
    handleFirebaseError(err, 'Registrierung fehlgeschlagen')
  } finally {
    isSubmitting.value = false
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