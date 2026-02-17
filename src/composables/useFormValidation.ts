/**
 * Composable für Form-Validierung
 * Wiederverwendbar für alle Forms in der App
 */
import { ref, computed } from 'vue'

export function useFormValidation() {
  /**
   * Validiert E-Mail Format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validiert Passwort (min. 6 Zeichen)
   */
  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  /**
   * Validiert Username (min. 3 Zeichen, nur alphanumerisch)
   */
  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/
    return usernameRegex.test(username)
  }

  /**
   * Validiert dass ein String nicht leer ist (nach trim)
   */
  const validateRequired = (value: string): boolean => {
    return value.trim().length > 0
  }

  /**
   * Validiert minimale Länge
   */
  const validateMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength
  }

  /**
   * Validiert maximale Länge
   */
  const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength
  }

  return {
    validateEmail,
    validatePassword,
    validateUsername,
    validateRequired,
    validateMinLength,
    validateMaxLength,
  }
}

/**
 * Field-spezifisches Validation Management
 */
export function useFieldValidation() {
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})

  /**
   * Setzt ein Error für ein Field
   */
  const setError = (field: string, message: string) => {
    errors.value[field] = message
  }

  /**
   * Entfernt Error für ein Field
   */
  const clearError = (field: string) => {
    delete errors.value[field]
  }

  /**
   * Markiert ein Field als "touched"
   */
  const setTouched = (field: string) => {
    touched.value[field] = true
  }

  /**
   * Prüft ob ein Field einen Error hat
   */
  const hasError = (field: string): boolean => {
    return !!errors.value[field]
  }

  /**
   * Gibt Error-Message für ein Field zurück
   */
  const getError = (field: string): string => {
    return errors.value[field] || ''
  }

  /**
   * Prüft ob ein Field touched ist
   */
  const isTouched = (field: string): boolean => {
    return !!touched.value[field]
  }

  /**
   * Prüft ob Form valid ist (keine Errors)
   */
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  /**
   * Reset alle Errors und Touched States
   */
  const reset = () => {
    errors.value = {}
    touched.value = {}
  }

  return {
    errors,
    touched,
    setError,
    clearError,
    setTouched,
    hasError,
    getError,
    isTouched,
    isValid,
    reset,
  }
}
