<template>
  <div class="max-w-md mx-auto p-6">
    <h2 class="text-xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <input v-model="email" @blur="validateEmailField" type="email"
          class="input bg-[#303030] text-gray-200 placeholder:text-gray-500"
          :class="{ 'border-red-500': hasError('email') && isTouched('email') }" placeholder="E-Mail" />
        <p v-if="hasError('email') && isTouched('email')" class="text-red-500 text-sm mt-1">
          {{ getError('email') }}
        </p>
      </div>

      <div>
        <input v-model="password" @blur="validatePasswordField" type="password"
          class="input bg-[#303030] text-gray-200 placeholder:text-gray-500"
          :class="{ 'border-red-500': hasError('password') && isTouched('password') }" placeholder="Passwort" />
        <p v-if="hasError('password') && isTouched('password')" class="text-red-500 text-sm mt-1">
          {{ getError('password') }}
        </p>
      </div>

      <button type="submit" class="btn w-full" :disabled="!isValid || isSubmitting"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid || isSubmitting }">
        {{ isSubmitting ? 'Wird eingeloggt...' : 'Einloggen' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useFirebaseError } from '@/composables/useFirebaseError'
import { useFormValidation, useFieldValidation } from '@/composables/useFormValidation'

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const { showSuccess } = useToast()
const { handleFirebaseError } = useFirebaseError()
const { validateEmail, validateRequired } = useFormValidation()
const { setError, clearError, hasError, getError, isTouched, setTouched, isValid } = useFieldValidation()

/**
 * Validiert E-Mail Field beim Blur
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
 * Validiert Passwort Field beim Blur
 */
const validatePasswordField = () => {
  setTouched('password')

  if (!validateRequired(password.value)) {
    setError('password', 'Passwort ist erforderlich')
    return false
  }

  clearError('password')
  return true
}

/**
 * Validiert gesamte Form vor Submit
 */
const validateForm = (): boolean => {
  const isEmailValid = validateEmailField()
  const isPasswordValid = validatePasswordField()
  return isEmailValid && isPasswordValid
}

const handleLogin = async () => {
  // Touch alle Fields für Error-Anzeige
  setTouched('email')
  setTouched('password')

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    showSuccess('Erfolgreich eingeloggt! 🎉')
    router.push('/memories')
  } catch (err) {
    handleFirebaseError(err, 'Login fehlgeschlagen')
  } finally {
    isSubmitting.value = false
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