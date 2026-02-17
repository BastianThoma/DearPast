/**
 * Composable für Toast-Notifications
 * Wiederverwendbar in allen Components
 */
import { useToast as useToastification } from 'vue-toastification'

export function useToast() {
  const toast = useToastification()

  /**
   * Zeigt Erfolgs-Nachricht
   */
  const showSuccess = (message: string) => {
    toast.success(message, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  /**
   * Zeigt Error-Nachricht
   */
  const showError = (message: string) => {
    toast.error(message, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  /**
   * Zeigt Info-Nachricht
   */
  const showInfo = (message: string) => {
    toast.info(message, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  /**
   * Zeigt Warning-Nachricht
   */
  const showWarning = (message: string) => {
    toast.warning(message, {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
