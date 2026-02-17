/**
 * Composable für Firebase Error Handling
 * Übersetzt Firebase Error Codes in User-freundliche deutsche Nachrichten
 */
import { useToast } from './useToast'

export function useFirebaseError() {
  const { showError } = useToast()

  /**
   * Firebase Error Codes zu deutschen Nachrichten
   */
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      // Auth Errors
      'auth/invalid-email': 'Ungültige E-Mail-Adresse',
      'auth/user-disabled': 'Dieser Account wurde deaktiviert',
      'auth/user-not-found': 'Kein Account mit dieser E-Mail gefunden',
      'auth/wrong-password': 'Falsches Passwort',
      'auth/email-already-in-use': 'Diese E-Mail wird bereits verwendet',
      'auth/weak-password': 'Passwort muss mindestens 6 Zeichen haben',
      'auth/operation-not-allowed': 'Dieser Vorgang ist nicht erlaubt',
      'auth/invalid-credential': 'Ungültige Anmeldedaten',
      'auth/too-many-requests': 'Zu viele Versuche. Bitte warte kurz und versuche es erneut',
      'auth/network-request-failed': 'Netzwerkfehler. Prüfe deine Internetverbindung',

      // Firestore Errors
      'permission-denied': 'Keine Berechtigung für diese Aktion',
      'not-found': 'Ressource nicht gefunden',
      'already-exists': 'Eintrag existiert bereits',
      'resource-exhausted': 'Zu viele Anfragen. Bitte warte kurz',
      unauthenticated: 'Du musst eingeloggt sein',
      unavailable: 'Service vorübergehend nicht verfügbar',
    }

    return errorMessages[errorCode] || 'Ein unerwarteter Fehler ist aufgetreten'
  }

  /**
   * Zeigt Firebase Error als Toast
   */
  const handleFirebaseError = (error: any, customMessage?: string) => {
    console.error('Firebase Error:', error)

    let message = customMessage || getErrorMessage(error.code)

    // Fallback für unbekannte Errors
    if (!error.code && error.message) {
      message = error.message
    }

    showError(message)
  }

  return {
    handleFirebaseError,
    getErrorMessage,
  }
}
